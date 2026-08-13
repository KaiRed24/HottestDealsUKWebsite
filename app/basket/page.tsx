"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function BasketPage() {
  const { items, subtotal, removeItem, setQuantity } = useCart();

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
            className="flex items-center gap-4 rounded-[var(--radius)] border border-grey-line bg-white p-4"
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

            <div className="flex-1 min-w-0">
              <p className="font-medium text-text leading-snug line-clamp-2">
                {item.name}
              </p>
              <p className="mt-1 font-semibold text-navy">£{item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(item.sku, item.quantity - 1)}
                aria-label={`Decrease quantity of ${item.name}`}
                className="w-9 h-9 rounded-[var(--radius)] border border-grey-line flex items-center justify-center hover:border-navy transition-colors duration-150"
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
                className="w-9 h-9 rounded-[var(--radius)] border border-grey-line flex items-center justify-center hover:border-navy transition-colors duration-150"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.sku)}
              aria-label={`Remove ${item.name} from basket`}
              className="ml-2 text-sm text-muted hover:text-blue transition-colors"
            >
              Remove
            </button>
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
          disabled
          className="btn-primary mt-5 w-full opacity-50 cursor-not-allowed"
        >
          Checkout — coming soon
        </button>
        <p className="mt-3 text-sm text-muted text-center">
          On-site checkout isn&apos;t live yet. In the meantime, order via TikTok
          Shop, eBay or Whatnot from each product&apos;s page.
        </p>
      </div>
    </div>
  );
}
