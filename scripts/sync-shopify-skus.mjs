// One-off maintenance script: matches Supabase product names against Shopify's
// Admin API catalog by name-similarity + price agreement, and prints:
//   1. SQL to backfill shopify_variant_id for high-confidence matches
//   2. A review list for medium-confidence matches (needs a human eyeball)
//   3. Supabase SKUs with no plausible Shopify match at all
// Run with:
//   node --env-file=.env.local scripts/sync-shopify-skus.mjs

const {
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_ADMIN_CLIENT_ID,
  SHOPIFY_ADMIN_CLIENT_SECRET,
  SHOPIFY_ADMIN_API_VERSION = "2025-10",
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
} = process.env;

for (const [name, value] of Object.entries({
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_ADMIN_CLIENT_ID,
  SHOPIFY_ADMIN_CLIENT_SECRET,
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
})) {
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
}

const STOPWORDS = new Set([
  "the", "a", "an", "of", "in", "on", "for", "with", "and", "or", "per",
  "select", "option", "brand", "new", "exclusive", "range", "buy", "now",
  "full", "box", "pack", "single", "bundle", "beverage", "snack", "drink",
]);

function tokenize(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[|()\-–,.'"!]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1 && !STOPWORDS.has(t))
  );
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const t of a) if (b.has(t)) intersection++;
  const union = a.size + b.size - intersection;
  return intersection / union;
}

function priceCloseEnough(a, b) {
  if (a == null || b == null) return false;
  if (a === 0 || b === 0) return a === b;
  return Math.abs(a - b) / Math.max(a, b) <= 0.1; // within 10%
}

async function getAdminAccessToken() {
  const res = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: SHOPIFY_ADMIN_CLIENT_ID,
      client_secret: SHOPIFY_ADMIN_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`Admin token exchange failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function fetchAllShopifyVariants(accessToken) {
  const query = `
    query Products($cursor: String) {
      products(first: 50, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            title
            variants(first: 50) {
              edges { node { id sku title price } }
            }
          }
        }
      }
    }`;

  const variants = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const res = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "X-Shopify-Access-Token": accessToken },
        body: JSON.stringify({ query, variables: { cursor } }),
      }
    );
    if (!res.ok) throw new Error(`Admin GraphQL request failed: ${res.status} ${await res.text()}`);
    const { data, errors } = await res.json();
    if (errors?.length) throw new Error(`Admin GraphQL errors: ${JSON.stringify(errors)}`);

    for (const productEdge of data.products.edges) {
      const productTitle = productEdge.node.title;
      for (const variantEdge of productEdge.node.variants.edges) {
        const v = variantEdge.node;
        const searchText =
          v.title && v.title !== "Default Title" ? `${productTitle} ${v.title}` : productTitle;
        variants.push({
          gid: v.id,
          sku: v.sku?.trim() || null,
          price: v.price != null ? Number(v.price) : null,
          searchText,
          tokens: tokenize(searchText),
        });
      }
    }

    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return variants;
}

async function fetchAllSupabaseProducts() {
  const res = await fetch(
    `${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=sku,name,price&limit=5000`,
    {
      headers: {
        apikey: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Supabase request failed: ${res.status} ${await res.text()}`);
  return res.json();
}

function escapeSql(value) {
  return value.replace(/'/g, "''");
}

async function main() {
  console.error("Exchanging Admin API credentials for an access token...");
  const accessToken = await getAdminAccessToken();

  console.error("Fetching all Shopify product variants (paginated)...");
  const shopifyVariants = await fetchAllShopifyVariants(accessToken);
  console.error(`Found ${shopifyVariants.length} Shopify variants.`);

  console.error("Fetching all Supabase products...");
  const supabaseProducts = await fetchAllSupabaseProducts();
  console.error(`Found ${supabaseProducts.length} Supabase products.\n`);

  const shopifyBySku = new Map(shopifyVariants.filter((v) => v.sku).map((v) => [v.sku, v]));

  const exactSkuMatches = [];
  const highConfidence = [];
  const needsReview = [];
  const noMatch = [];

  for (const product of supabaseProducts) {
    const exact = shopifyBySku.get(product.sku);
    if (exact) {
      exactSkuMatches.push({ product, match: exact });
      continue;
    }

    const tokens = tokenize(product.name);
    let best = null;
    let bestScore = 0;

    for (const variant of shopifyVariants) {
      const score = jaccard(tokens, variant.tokens);
      if (score > bestScore) {
        bestScore = score;
        best = variant;
      }
    }

    if (!best || bestScore < 0.25) {
      noMatch.push(product);
      continue;
    }

    const priceOk = priceCloseEnough(product.price, best.price);

    if (bestScore >= 0.5 && priceOk) {
      highConfidence.push({ product, match: best, score: bestScore });
    } else {
      needsReview.push({ product, match: best, score: bestScore, priceOk });
    }
  }

  console.log(`-- SUMMARY: ${exactSkuMatches.length} exact SKU matches, ${highConfidence.length} high-confidence name matches, ${needsReview.length} need manual review, ${noMatch.length} have no plausible Shopify match.\n`);

  console.log("-- ============================================================");
  console.log("-- 0. EXACT SKU MATCH — guaranteed correct, Shopify SKU literally equals the site SKU");
  console.log("-- ============================================================\n");
  for (const { product, match } of exactSkuMatches) {
    console.log(
      `update products set shopify_variant_id = '${escapeSql(match.gid)}' where sku = '${escapeSql(product.sku)}';`
    );
  }

  console.log("\n-- ============================================================");
  console.log("-- 1. HIGH CONFIDENCE — run this block in the Supabase SQL editor");
  console.log("--    (still worth a quick skim before running, not a guarantee)");
  console.log("-- ============================================================\n");
  for (const { product, match, score } of highConfidence) {
    console.log(
      `-- ${(score * 100).toFixed(0)}% match: "${product.name}" (£${product.price}) -> "${match.searchText}" (£${match.price})`
    );
    console.log(
      `update products set shopify_variant_id = '${escapeSql(match.gid)}' where sku = '${escapeSql(product.sku)}';\n`
    );
  }

  console.log("-- ============================================================");
  console.log("-- 2. NEEDS MANUAL REVIEW — plausible but not confident enough to auto-apply");
  console.log("-- ============================================================\n");
  for (const { product, match, score, priceOk } of needsReview) {
    console.log(
      `-- ${(score * 100).toFixed(0)}% name match, price ${priceOk ? "OK" : "MISMATCH"}: "${product.name}" (£${product.price}, sku ${product.sku}) -> "${match.searchText}" (£${match.price})`
    );
  }

  console.log("\n-- ============================================================");
  console.log("-- 3. NO SHOPIFY MATCH FOUND — not currently sellable on-site");
  console.log("-- ============================================================\n");
  for (const product of noMatch) {
    console.log(`-- ${product.sku}: ${product.name} (£${product.price})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
