import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";

const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2025-10";

type BasketLine = { sku: string; quantity: number };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const lines: BasketLine[] = Array.isArray(body?.items) ? body.items : [];

  if (lines.length === 0) {
    return NextResponse.json({ error: "Basket is empty." }, { status: 400 });
  }

  const resolved = await Promise.all(
    lines.map(async (line) => ({
      sku: line.sku,
      quantity: Math.max(1, Math.floor(Number(line.quantity) || 0)),
      product: await getProduct(line.sku),
    }))
  );

  const unavailable = resolved
    .filter((r) => !r.product?.shopify_variant_id)
    .map((r) => r.sku);

  if (unavailable.length > 0) {
    return NextResponse.json(
      { error: "Some items in your basket aren't available for on-site checkout yet.", unavailable },
      { status: 409 }
    );
  }

  const query = `
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }`;

  const variables = {
    lines: resolved.map((r) => ({
      merchandiseId: r.product!.shopify_variant_id,
      quantity: r.quantity,
    })),
  };

  const shopifyRes = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Shopify-Storefront-Private-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const data = await shopifyRes.json().catch(() => null);
  const userErrors = data?.data?.cartCreate?.userErrors;
  const checkoutUrl = data?.data?.cartCreate?.cart?.checkoutUrl;

  if (!shopifyRes.ok || userErrors?.length || !checkoutUrl) {
    console.error("Shopify cartCreate error:", userErrors ?? data);
    return NextResponse.json({ error: "Couldn't start checkout — please try again." }, { status: 502 });
  }

  return NextResponse.json({ checkoutUrl });
}
