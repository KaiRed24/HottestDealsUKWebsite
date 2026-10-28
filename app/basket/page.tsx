"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import ProductImage from "@/components/ProductImage";

const CHECKOUT_TIMEOUT_MS = 20000;

type CheckoutStatus = "idle" | "loading" | "unavailable" | "error";

export default function BasketPage() {
  const { items, subtotal, removeItem, setQuantity, clear } = useCart();
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [unavailable, setUnavailable] = useState<string[]>([]);

  // Coming back from Shopify with the browser's back button restores this
  // page from the bfcache with its old "loading" state — reset it so the
  // button is never stuck on "Starting checkout…".
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setStatus("idle");
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  async function handleCheckout() {
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ sku: item.sku, quantity: item.quantity })),
        }),
        signal: AbortSignal.timeout(CHECKOUT_TIMEOUT_MS),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 409) {
        setUnavailable(data?.unavailable ?? []);
        setStatus("unavailable");
        return;
      }

      // Only ever follow the absolute Shopify URL the API returned — never a
      // relative path, which would land on a 404 on this site.
      if (!res.ok || typeof data?.checkoutUrl !== "string" || !data.checkoutUrl.startsWith("https://")) {
        setStatus("error");
        return;
      }

      clear();
      window.location.assign(data.checkoutUrl);
    } catch {
      setStatus("error");
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
        <h1 className="text-h2 font-semibold tracking-[-0.02em] text-text">Your basket</h1>
        <p className="mt-3 text-muted">Your basket is empty.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 pt-10 sm:py-16">
      <h1 className="text-h2 font-semibold tracking-[-0.02em] text-text">Your basket</h1>

      <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
        {items.map((item) => (
          <div
            key={item.sku}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[var(--radius)] border border-grey-line bg-white p-4 md:flex-nowrap"
          >
            <div className="relative w-20 h-20 shrink-0 bg-white border border-grey-line rounded-[var(--radius)] overflow-hidden">
              <ProductImage
                src={item.image_url}
                alt=""
                sizes="80px"
                className="object-contain p-1.5"
                compact
              />
            </div>

            <div className="flex-1 min-w-[140px] md:min-w-0">
              <p className="font-medium text-text leading-snug line-clamp-2">
                {item.name}
              </p>
              <p className="mt-1 font-semibold text-navy">£{item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between gap-2 w-full md:w-auto md:justify-start md:gap-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(item.sku, item.quantity - 1)}
                  aria-label={`Decrease quantity of ${item.name}`}
                  className="w-11 h-11 md:w-9 md:h-9 rounded-[var(--radius)] border border-grey-line flex items-center justify-center hover:border-navy transition-colors duration-150"
                >
                  −
                </button>
                <span className="w-6 text-center font-medium tabular-nums">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.sku, item.quantity + 1)}
                  aria-label={`Increase quantity of ${item.name}`}
                  className="w-11 h-11 md:w-9 md:h-9 rounded-[var(--radius)] border border-grey-line flex items-center justify-center hover:border-navy transition-colors duration-150"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.sku)}
                aria-label={`Remove ${item.name} from basket`}
                className="min-h-11 px-2 -mr-2 text-sm text-muted hover:text-blue transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2 text-sm text-ink">
        <p className="flex items-center gap-2">
          <TruckIcon />
          Fast, tracked UK delivery on every order.
        </p>
        <p className="flex items-center gap-2">
          <TagIcon />
          <span>
            Use code <span className="font-semibold">10OFF</span> at checkout for 10% off.
          </span>
        </p>
      </div>

      {/* Mobile: sticks to the bottom of the screen while the basket is in
          view, so checkout is always one tap away (sticky, not fixed, so it
          never covers the footer). sm:+ it's a regular summary card. */}
      <div className="sticky bottom-0 z-40 -mx-4 mt-6 border-t border-grey-line bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(7,26,51,0.08)] sm:static sm:z-auto sm:mx-0 sm:rounded-[var(--radius)] sm:border sm:p-6 sm:shadow-none">
        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg font-semibold text-text">Subtotal</span>
          <span className="text-lg font-semibold text-navy tabular-nums">
            £{subtotal.toFixed(2)}
          </span>
        </div>

        {status === "error" ? (
          <div role="alert" className="mt-3 rounded-[var(--radius-sm)] bg-blue-pale/60 p-3 text-center">
            <p className="text-sm text-ink">
              We couldn&apos;t start checkout. Your basket is safe — please try again.
            </p>
            <button type="button" onClick={handleCheckout} className="btn-primary mt-3 w-full">
              Try again
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCheckout}
            disabled={status === "loading"}
            className="btn-primary mt-3 sm:mt-5 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Starting checkout…" : "Checkout securely"}
          </button>
        )}

        {status === "unavailable" && (
          <p role="alert" className="mt-3 text-sm text-ink text-center">
            {unavailable.join(", ")} {unavailable.length === 1 ? "isn't" : "aren't"} available
            for on-site checkout yet — buy via TikTok or eBay from the product page instead.
          </p>
        )}
      </div>
    </div>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-blue" aria-hidden>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-blue" aria-hidden>
      <path d="M3 12V4h8l10 10-8 8L3 12Z" />
      <circle cx="7.5" cy="8.5" r="1.5" />
    </svg>
  );
}
