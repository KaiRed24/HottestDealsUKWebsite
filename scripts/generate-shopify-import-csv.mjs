// Generates a Shopify product-import CSV for every Supabase product that
// doesn't already have a confirmed Shopify match, so they can be bulk-created
// via Shopify Admin -> Products -> Import (no API write-scope needed).
// Each row's Variant SKU is set to the real Supabase SKU, so a later exact
// SKU match will link them with certainty instead of guessing.
// Run with:
//   node --env-file=.env.local scripts/generate-shopify-import-csv.mjs

const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY } = process.env;

// SKUs already confirmed safe-matched to an existing Shopify variant —
// skip these, they don't need a new product.
const ALREADY_MATCHED = new Set([
  "HD-0015", "HD-0264", "HD-0285", "HD-0074", "HD-0280", "HD-0278", "HD-0281",
  "HD-0117", "HD-0121", "HD-0007", "HD-0012", "HD-0144", "HD-0149", "HD-0165",
  "HD-0189", "HD-0247", "HD-0042",
]);

function csvField(value) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toHandle(sku) {
  return sku.toLowerCase();
}

function resolveImageUrl(p) {
  if (p.image_url) return p.image_url;
  return `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${p.sku}.jpg`;
}

async function main() {
  const res = await fetch(
    `${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=sku,name,category,region,price,image_url,is_active&limit=5000`,
    {
      headers: {
        apikey: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Supabase request failed: ${res.status} ${await res.text()}`);
  const products = await res.json();

  const toCreate = products.filter((p) => p.is_active && !ALREADY_MATCHED.has(p.sku));

  const header = [
    "Handle", "Title", "Vendor", "Type", "Tags", "Published",
    "Option1 Name", "Option1 Value",
    "Variant SKU", "Variant Price",
    "Variant Inventory Policy", "Variant Fulfillment Service",
    "Variant Requires Shipping", "Variant Taxable",
    "Image Src", "Status",
  ];

  const rows = [header.join(",")];

  for (const p of toCreate) {
    rows.push(
      [
        toHandle(p.sku),
        p.name,
        "Hottest Deals UK",
        p.category ?? "",
        p.region ?? "",
        "TRUE",
        "Title",
        "Default Title",
        p.sku,
        p.price,
        "deny",
        "manual",
        "TRUE",
        "TRUE",
        resolveImageUrl(p),
        "active",
      ]
        .map(csvField)
        .join(",")
    );
  }

  console.error(`${toCreate.length} products to import (of ${products.length} total, ${ALREADY_MATCHED.size} already matched).`);
  console.log(rows.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
