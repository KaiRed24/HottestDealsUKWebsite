"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

type CheckoutStatus = "idle" | "loading" | "unavailable" | "error";

export default function BasketPage() {
  const { items, subtotal, removeItem, setQuantity, clear } = useCart();
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [unavailable, setUnavailable] = useState<string[]>([]);

  async function handleCheckout() {
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ sku: item.sku, quantity: item.quantity })),
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 409) {
        setUnavailable(data?.unavailable ?? []);
        setStatus("unavailable");
        return;
      }

      if (!res.ok || !data?.checkoutUrl) {
        setStatus("error");
        return;
      }

      clear();
      window.location.href = data.checkoutUrl;
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
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-h2 font-semibold tracking-[-0.02em] text-text">Your basket</h1>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.sku}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[var(--radius)] border border-grey-line bg-white p-4 md:flex-nowrap"
          >
            <div className="relative w-20 h-20 shrink-0 bg-blue-tint rounded-[var(--radius)] overflow-hidden">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              )}
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
                className="text-sm text-muted hover:text-blue transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[var(--radius)] border border-grey-line bg-white p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-text">Subtotal</span>
          <span className="text-lg font-semibold text-navy">
            £{subtotal.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={status === "loading"}
          className="btn-primary mt-5 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Starting checkout…" : "Checkout"}
        </button>

        {status === "unavailable" && (
          <p className="mt-3 text-sm text-blue text-center">
            {unavailable.join(", ")} {unavailable.length === 1 ? "isn't" : "aren't"} available
            for on-site checkout yet — buy via TikTok or eBay from the product page instead.
          </p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-blue text-center">
            Something went wrong starting checkout — please try again.
          </p>
        )}
      </div>
    </div>
  );
}
