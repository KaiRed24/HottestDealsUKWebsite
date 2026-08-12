// Best-effort brand extraction from product names, for the homepage "Top
// Brands" strip only. There is no `brand` column on `products` yet — once
// one exists and is populated (see lib/products.ts), swap this out for the
// real column. This never writes anything back to the database; it only
// reads real product names already in the catalogue.
const KNOWN_BRANDS: { name: string; slug: string }[] = [
  { name: "Cinnamon Toast Crunch", slug: "cinnamon-toast-crunch" },
  { name: "Lucky Charms", slug: "lucky-charms" },
  { name: "Froot Loops", slug: "froot-loops" },
  { name: "Cap'n Crunch", slug: "capn-crunch" },
  { name: "Golden Grahams", slug: "golden-grahams" },
  { name: "Chips Ahoy", slug: "chips-ahoy" },
  { name: "Van Holten's", slug: "van-holtens" },
  { name: "Taco Bell", slug: "taco-bell" },
  { name: "Pepperidge Farm", slug: "pepperidge-farm" },
  { name: "Pop Tarts", slug: "pop-tarts" },
  { name: "Pop-Tarts", slug: "pop-tarts" },
  { name: "Jolly Rancher", slug: "jolly-rancher" },
  { name: "Red Bull", slug: "red-bull" },
  { name: "Hi-C", slug: "hi-c" },
  { name: "Hershey's", slug: "hersheys" },
  { name: "Hersheys", slug: "hersheys" },
  { name: "Reese's", slug: "reeses" },
  { name: "Reeses", slug: "reeses" },
  { name: "Pringles", slug: "pringles" },
  { name: "Skittles", slug: "skittles" },
  { name: "Haribo", slug: "haribo" },
  { name: "Kinder", slug: "kinder" },
  { name: "Monster", slug: "monster" },
  { name: "Fanta", slug: "fanta" },
  { name: "Cheetos", slug: "cheetos" },
  { name: "Ruffles", slug: "ruffles" },
  { name: "Lay's", slug: "lays" },
  { name: "Lays", slug: "lays" },
  { name: "Peeps", slug: "peeps" },
  { name: "Warheads", slug: "warheads" },
  { name: "Sunkist", slug: "sunkist" },
  { name: "Wyler's", slug: "wylers" },
  { name: "Icee", slug: "icee" },
  { name: "Krave", slug: "krave" },
  { name: "Goldfish", slug: "goldfish" },
  { name: "M&M", slug: "mm" },
];

export function inferBrand(name: string): { name: string; slug: string } | null {
  const lower = name.toLowerCase();
  for (const brand of KNOWN_BRANDS) {
    if (lower.includes(brand.name.toLowerCase())) return brand;
  }
  return null;
}

export function computeTopBrands<T extends { name: string }>(
  products: T[],
  limit = 10
): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, { name: string; slug: string; count: number }>();
  for (const product of products) {
    const brand = inferBrand(product.name);
    if (!brand) continue;
    const existing = counts.get(brand.slug);
    if (existing) existing.count += 1;
    else counts.set(brand.slug, { ...brand, count: 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}
