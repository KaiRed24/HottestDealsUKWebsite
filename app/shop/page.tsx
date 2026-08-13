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
    <div className="mx-auto w-full max-w-[1280px] px-6 py-16">
      <h1 className="text-h2 sm:text-display font-semibold tracking-[-0.02em] text-text">
        Shop all products
      </h1>
      <p className="mt-2 text-muted">
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
