import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import ShopBrowser from "@/app/shop/ShopBrowser";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse American candy, sodas, Asian treats and European chocolate. Filter by category, region and price.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    region?: string;
    price?: string;
    sort?: string;
    q?: string;
  }>;
}) {
  const { category, region, price, sort, q } = await searchParams;
  const products = await getProducts();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
        Shop all products
      </h1>
      <p className="mt-1 text-ink/60">
        {products.length} imported treats, ready to ship.
      </p>

      <div className="mt-6">
        <ShopBrowser
          products={products}
          initialCategory={category ?? "all"}
          initialRegion={region ?? "all"}
          initialPrice={price ?? "all"}
          initialSort={sort ?? "best-selling"}
          initialSearch={q ?? ""}
        />
      </div>
    </div>
  );
}
