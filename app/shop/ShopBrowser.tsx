"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import CategoryChips from "@/components/CategoryChips";
import type { Product } from "@/lib/products";

const categoryOptions = [
  { value: "all", label: "All" },
  { value: "candy", label: "Candy" },
  { value: "chocolate", label: "Chocolate" },
  { value: "drinks", label: "Drinks" },
  { value: "snacks", label: "Crisps & Snacks" },
  { value: "bundles", label: "Bundles" },
];

const regionOptions = [
  { value: "all", label: "All regions" },
  { value: "usa", label: "USA" },
  { value: "asia", label: "Asia" },
  { value: "europe", label: "Europe" },
];

const priceOptions = [
  { value: "all", label: "Any price" },
  { value: "under5", label: "Under £5" },
  { value: "5to10", label: "£5–£10" },
  { value: "over10", label: "£10+" },
];

const sortOptions = [
  { value: "best-selling", label: "Best selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "az", label: "A–Z" },
];

function inPriceBucket(price: number, bucket: string) {
  if (bucket === "under5") return price < 5;
  if (bucket === "5to10") return price >= 5 && price <= 10;
  if (bucket === "over10") return price > 10;
  return true;
}

export default function ShopBrowser({
  products,
  initialCategory = "all",
  initialRegion = "all",
  initialPrice = "all",
  initialSort = "best-selling",
  initialSearch = "",
}: {
  products: Product[];
  initialCategory?: string;
  initialRegion?: string;
  initialPrice?: string;
  initialSort?: string;
  initialSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(initialCategory);
  const [region, setRegion] = useState(initialRegion);
  const [priceBucket, setPriceBucket] = useState(initialPrice);
  const [sort, setSort] = useState(initialSort);
  const [search, setSearch] = useState(initialSearch);

  // initial* props change whenever the URL changes via client-side navigation
  // (e.g. clicking a nav category link) without remounting this component —
  // keep local state in sync so those links actually take effect.
  useEffect(() => setCategory(initialCategory), [initialCategory]);
  useEffect(() => setRegion(initialRegion), [initialRegion]);
  useEffect(() => setPriceBucket(initialPrice), [initialPrice]);
  useEffect(() => setSort(initialSort), [initialSort]);
  useEffect(() => setSearch(initialSearch), [initialSearch]);

  const syncUrl = useCallback(
    (next: {
      category?: string;
      region?: string;
      price?: string;
      sort?: string;
      search?: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      const values = {
        category: next.category ?? category,
        region: next.region ?? region,
        price: next.price ?? priceBucket,
        sort: next.sort ?? sort,
        search: next.search ?? search,
      };

      if (values.category === "all") params.delete("category");
      else params.set("category", values.category);

      if (values.region === "all") params.delete("region");
      else params.set("region", values.region);

      if (values.price === "all") params.delete("price");
      else params.set("price", values.price);

      if (values.sort === "best-selling") params.delete("sort");
      else params.set("sort", values.sort);

      if (!values.search) params.delete("q");
      else params.set("q", values.search);

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [category, region, priceBucket, sort, search, searchParams, pathname, router]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (region !== "all" && product.region !== region) return false;
      if (!inPriceBucket(product.price, priceBucket)) return false;
      if (query && !product.name.toLowerCase().includes(query)) return false;
      return true;
    });

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "newest")
      sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    // "best-selling" — no sales_30d column yet, keep the featured-first / A–Z
    // ordering the products already arrive in from getProducts().

    return sorted;
  }, [products, category, region, priceBucket, search, sort]);

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          syncUrl({ search: e.target.value });
        }}
        placeholder="Search for candy, soda, chocolate..."
        aria-label="Search products"
        className="w-full rounded-full border border-ink/15 bg-paper px-4 py-3 text-sm focus:outline-none focus:border-red"
      />

      <CategoryChips
        options={categoryOptions}
        selected={category}
        onChange={(v) => {
          setCategory(v);
          syncUrl({ category: v });
        }}
      />
      <CategoryChips
        options={regionOptions}
        selected={region}
        onChange={(v) => {
          setRegion(v);
          syncUrl({ region: v });
        }}
      />
      <CategoryChips
        options={priceOptions}
        selected={priceBucket}
        onChange={(v) => {
          setPriceBucket(v);
          syncUrl({ price: v });
        }}
      />

      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-sm text-ink/60">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-ink/60">Sort</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              syncUrl({ sort: e.target.value });
            }}
            className="rounded-full border border-ink/15 bg-paper px-3 py-2 font-semibold focus:outline-none focus:border-red"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            Nothing matches yet
          </p>
          <p className="mt-2 text-ink/60">
            Try a different category, or clear the search and start again.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
