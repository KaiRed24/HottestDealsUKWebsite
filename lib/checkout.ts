// Shopify's hosted checkout lives on its own subdomain. The storefront
// domains (apex + www) point at Vercel, so a checkout link on either of
// them would 404 here — see normaliseCheckoutUrl below.
export const CHECKOUT_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN || "checkout.hottestdealsuk.com";

const STOREFRONT_HOSTS = new Set(["hottestdealsuk.com", "www.hottestdealsuk.com"]);

// Shopify builds cart.checkoutUrl from the store's primary domain. If that
// is ever switched back to the storefront domain, swap just the host and
// keep the path + query (the cart token lives in both).
export function normaliseCheckoutUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (STOREFRONT_HOSTS.has(url.hostname)) url.hostname = CHECKOUT_DOMAIN;
  return url.toString();
}

// Shopify-owned paths that should never be served by this app.
export function isShopifyCheckoutPath(pathname: string): boolean {
  return /^\/(cart|checkouts)\//.test(pathname);
}
