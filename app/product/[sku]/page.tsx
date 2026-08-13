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
    <div className="mx-auto w-full max-w-4xl px-6 py-16 grid gap-10 sm:grid-cols-2 sm:items-start">
      <div className="relative aspect-square rounded-[var(--radius)] overflow-hidden border border-grey-line bg-blue-tint p-6">
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
        <h1 className="text-h3 sm:text-h2 font-semibold tracking-[-0.02em] text-text">
          {product.name}
        </h1>
        <p className="mt-2 text-2xl font-semibold text-navy">
          £{product.price.toFixed(2)}
        </p>

        <div className="mt-3">
          <StockBadge stock={product.stock_quantity} />
        </div>

        {product.description && (
          <p className="mt-4 text-muted leading-relaxed">
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
                className="btn-primary flex-1"
              >
                Buy on TikTok
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="btn-primary flex-1 opacity-50 cursor-not-allowed"
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
                className="btn-secondary flex-1"
              >
                Buy on eBay
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="btn-secondary flex-1 opacity-50 cursor-not-allowed"
              >
                Buy on eBay
              </button>
            ))}
        </div>

        {!inStock && (
          <p className="mt-4 text-sm text-muted">
            Sold out — follow us on TikTok to know when it&apos;s back.
          </p>
        )}
        {inStock && !hasEbay && !hasTiktok && (
          <p className="mt-4 text-sm text-muted">
            Coming soon to our shop channels.
          </p>
        )}
      </div>
    </div>
  );
}
