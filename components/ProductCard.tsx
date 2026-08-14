import Link from "next/link";
import StockBadge from "@/components/StockBadge";
import ProductImageFrame from "@/components/ProductImageFrame";
import AddToBasketButton from "@/components/AddToBasketButton";
import type { Product } from "@/lib/products";

// Interim origin label derived from the existing region field, pending the
// Section 7 schema addition + backfill of real per-country origin data.
const ORIGIN_LABEL: Record<NonNullable<Product["region"]>, string> = {
  usa: "USA",
  asia: "ASIA",
  europe: "EUROPE",
};

export default function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock_quantity === 0;
  const origin = product.region ? ORIGIN_LABEL[product.region] : null;

  return (
    <div
      className={`group flex flex-col h-full rounded-[var(--radius-lg)] bg-surface overflow-hidden shadow-[var(--shadow-card)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)] ${
        soldOut ? "opacity-60" : ""
      }`}
    >
      <Link href={`/product/${product.sku}`} className="contents">
        <div className="relative overflow-hidden">
          <ProductImageFrame src={product.image_url as string} alt={product.name} />
          {soldOut || product.stock_quantity <= 5 ? (
            <div className="absolute top-3 left-3">
              <StockBadge stock={product.stock_quantity} />
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-4 pb-0">
          {origin && <span className="origin-stamp w-fit">{origin}</span>}
          <p className="mt-2 text-[0.9375rem] font-medium leading-snug text-text min-h-[2.6em] line-clamp-2">
            {product.name}
          </p>
        </div>
      </Link>

      <div className="mt-auto p-4 pt-3 flex items-center justify-between gap-2">
        <span
          className="font-display font-bold text-ink"
          style={{ fontSize: "var(--text-price)", fontVariantNumeric: "tabular-nums" }}
        >
          £{product.price.toFixed(2)}
        </span>
        <AddToBasketButton
          product={product}
          className="!px-4 !py-2 !min-h-9 text-sm shrink-0"
        />
      </div>
    </div>
  );
}
