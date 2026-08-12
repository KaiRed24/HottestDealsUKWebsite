import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import StockBadge from "@/components/StockBadge";
import AddToBasketButton from "@/components/AddToBasketButton";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}): Promise<Metadata> {
  const { sku } = await params;
  const product = await getProduct(sku);
  if (!product) return {};

  const description =
    product.description ??
    `${product.name} — imported and hard to find. Buy now at Hottest Deals UK.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = await getProduct(sku);
  if (!product) notFound();

  const inStock = product.stock_quantity > 0;
  const hasEbay = Boolean(product.ebay_url);
  const hasTiktok = Boolean(product.tiktok_url);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 grid gap-8 sm:grid-cols-2 sm:items-start">
      <div className="relative aspect-square rounded-brand overflow-hidden border border-ink/10 bg-cream p-6">
        <Image
          src={product.image_url as string}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-contain p-6"
          priority
        />
      </div>

      <div>
        <h1 className="font-display text-3xl font-bold text-ink">
          {product.name}
        </h1>
        <p className="mt-2 font-display text-2xl font-bold text-red">
          £{product.price.toFixed(2)}
        </p>

        <div className="mt-3">
          <StockBadge stock={product.stock_quantity} />
        </div>

        {product.description && (
          <p className="mt-4 text-ink/80 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-6">
          <AddToBasketButton product={product} className="w-full sm:w-auto" />
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          {hasTiktok &&
            (inStock ? (
              <a
                href={product.tiktok_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center rounded-full bg-red text-cream font-semibold py-3.5 min-h-11 hover:bg-red-deep transition-colors"
              >
                Buy on TikTok
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="flex-1 text-center rounded-full bg-ink/10 text-ink/40 font-semibold py-3.5 min-h-11 cursor-not-allowed"
              >
                Buy on TikTok
              </button>
            ))}

          {hasEbay &&
            (inStock ? (
              <a
                href={product.ebay_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center rounded-full ring-1 ring-ink text-ink font-semibold py-3.5 min-h-11 hover:bg-ink/5 transition-colors"
              >
                Buy on eBay
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="flex-1 text-center rounded-full ring-1 ring-ink/15 text-ink/40 font-semibold py-3.5 min-h-11 cursor-not-allowed"
              >
                Buy on eBay
              </button>
            ))}
        </div>

        {!inStock && (
          <p className="mt-4 text-sm text-ink/60">
            Sold out — follow us on TikTok to know when it&apos;s back.
          </p>
        )}
        {inStock && !hasEbay && !hasTiktok && (
          <p className="mt-4 text-sm text-ink/60">
            Coming soon to our shop channels.
          </p>
        )}
      </div>
    </div>
  );
}
