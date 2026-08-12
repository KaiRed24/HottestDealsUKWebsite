"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function BasketPage() {
  const { items, subtotal, removeItem, setQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Your basket</h1>
        <p className="mt-3 text-ink/70">Your basket is empty.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-red text-white font-semibold px-6 py-3.5 min-h-11 hover:bg-red-deep transition-colors"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Your basket</h1>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.sku}
            className="flex items-center gap-4 rounded-brand border border-ink/10 bg-paper p-4"
          >
            <div className="relative w-20 h-20 shrink-0 bg-cream rounded-brand overflow-hidden">
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

            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-ink leading-snug line-clamp-2">
                {item.name}
              </p>
              <p className="mt-1 font-bold text-red">£{item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(item.sku, item.quantity - 1)}
                aria-label={`Decrease quantity of ${item.name}`}
                className="w-9 h-9 rounded-full ring-1 ring-ink/15 flex items-center justify-center hover:bg-ink/5"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold tabular-nums">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(item.sku, item.quantity + 1)}
                aria-label={`Increase quantity of ${item.name}`}
                className="w-9 h-9 rounded-full ring-1 ring-ink/15 flex items-center justify-center hover:bg-ink/5"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.sku)}
              aria-label={`Remove ${item.name} from basket`}
              className="ml-2 text-sm font-semibold text-ink/50 hover:text-red transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-brand border border-ink/10 bg-paper p-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-ink">Subtotal</span>
          <span className="font-display text-lg font-bold text-red">
            £{subtotal.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          disabled
          className="mt-5 w-full rounded-full bg-ink/15 text-ink/50 font-semibold px-6 py-3.5 min-h-11 cursor-not-allowed"
        >
          Checkout — coming soon
        </button>
        <p className="mt-3 text-sm text-ink/50 text-center">
          On-site checkout isn&apos;t live yet. In the meantime, order via TikTok
          Shop, eBay or Whatnot from each product&apos;s page.
        </p>
      </div>
    </div>
  );
}
