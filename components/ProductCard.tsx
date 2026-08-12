import Image from "next/image";
import Link from "next/link";
import StockBadge from "@/components/StockBadge";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock_quantity === 0;

  return (
    <Link
      href={`/product/${product.sku}`}
      className={`group flex flex-col h-full rounded-brand border border-ink/10 bg-paper overflow-hidden transition-shadow hover:shadow-brand-hover ${
        soldOut ? "opacity-60" : ""
      }`}
    >
      <div className="relative aspect-square bg-cream p-5">
        <Image
          src={product.image_url as string}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain"
        />
        {soldOut || product.stock_quantity <= 5 ? (
          <div className="absolute top-3 left-3">
            <StockBadge stock={product.stock_quantity} />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-display font-semibold text-[15px] leading-snug text-ink min-h-[3.9em] line-clamp-3">
          {product.name}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="font-display font-bold text-red text-lg">
            £{product.price.toFixed(2)}
          </span>
          <span
            className={`text-xs font-semibold rounded-full px-3 py-1.5 ${
              soldOut
                ? "bg-ink/8 text-ink/40"
                : "bg-red text-white group-hover:bg-red-deep transition-colors"
            }`}
          >
            {soldOut ? "Sold out" : "View"}
          </span>
        </div>
      </div>
    </Link>
  );
}
