"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import CategoryChips from "@/components/CategoryChips";
import FilterSheet from "@/app/shop/FilterSheet";
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

  const [sheet, setSheet] = useState<"filters" | "sort" | null>(null);

  const activeFilters = [
    { key: "category", value: category, options: categoryOptions },
    { key: "region", value: region, options: regionOptions },
    { key: "price", value: priceBucket, options: priceOptions },
  ]
    .filter((f) => f.value !== "all")
    .map((f) => ({
      key: f.key as "category" | "region" | "price",
      label: f.options.find((o) => o.value === f.value)?.label ?? f.value,
    }));

  function applyFilters(next: { category: string; region: string; price: string }) {
    setCategory(next.category);
    setRegion(next.region);
    setPriceBucket(next.price);
    syncUrl(next);
  }

  function removeFilter(key: "category" | "region" | "price") {
    if (key === "category") setCategory("all");
    if (key === "region") setRegion("all");
    if (key === "price") setPriceBucket("all");
    syncUrl({ [key]: "all" });
  }

  const sortLabel = sortOptions.find((o) => o.value === sort)?.label ?? "Best selling";

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
        className="w-full rounded-[var(--radius)] border border-grey-line bg-white px-4 py-3 min-h-11 text-base sm:text-sm text-text focus:outline-none focus:border-navy"
      />

      {/* Mobile: one sticky Filters / Sort bar + a bottom sheet, instead of
          three rows of chips squashed across a phone screen. */}
      <div className="md:hidden sticky top-24 z-30 -mx-6 px-6 py-2 bg-blue-pale/95 backdrop-blur-sm border-b border-ink/10">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSheet("filters")}
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-11 rounded-[var(--radius)] border border-ink/20 bg-white text-sm font-semibold text-ink"
          >
            <FilterIcon />
            Filters
            {activeFilters.length > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-navy text-white text-xs flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSheet("sort")}
            className="flex-1 inline-flex items-center justify-center gap-2 min-h-11 rounded-[var(--radius)] border border-ink/20 bg-white text-sm font-semibold text-ink"
          >
            <SortIcon />
            <span className="truncate">Sort: {sortLabel}</span>
          </button>
        </div>
        {activeFilters.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="Active filters">
            {activeFilters.map((f) => (
              <li key={f.key}>
                <button
                  type="button"
                  onClick={() => removeFilter(f.key)}
                  aria-label={`Remove filter ${f.label}`}
                  className="inline-flex items-center gap-1.5 min-h-9 rounded-full bg-navy pl-3 pr-2 text-sm font-medium text-white"
                >
                  {f.label}
                  <span aria-hidden className="text-base leading-none">×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <FilterSheet
        open={sheet === "filters"}
        mode="filters"
        onClose={() => setSheet(null)}
        groups={[
          { key: "category", title: "Category", options: categoryOptions },
          { key: "region", title: "Region", options: regionOptions },
          { key: "price", title: "Price", options: priceOptions },
        ]}
        values={{ category, region, price: priceBucket }}
        onApply={(v) => {
          applyFilters({ category: v.category, region: v.region, price: v.price });
          setSheet(null);
        }}
      />
      <FilterSheet
        open={sheet === "sort"}
        mode="sort"
        onClose={() => setSheet(null)}
        groups={[{ key: "sort", title: "Sort by", options: sortOptions }]}
        values={{ sort }}
        onApply={(v) => {
          setSort(v.sort);
          syncUrl({ sort: v.sort });
          setSheet(null);
        }}
      />

      <div className="hidden md:flex flex-col gap-4">
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

      </div>

      <div className="flex items-center justify-between gap-3 md:pt-1">
        <p className="text-sm text-muted">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
        <label className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-muted">Sort</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              syncUrl({ sort: e.target.value });
            }}
            className="rounded-[var(--radius)] border border-grey-line bg-white px-3 py-2 min-h-11 text-text font-medium focus:outline-none focus:border-navy"
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
          <p className="text-h3 font-semibold text-text">
            Nothing matches yet
          </p>
          <p className="mt-2 text-muted">
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

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
      <path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" />
    </svg>
  );
}
