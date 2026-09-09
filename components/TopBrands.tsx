import Image from "next/image";
import Link from "next/link";

export type TopBrand = {
  name: string;
  slug: string;
  count: number;
  logoPath: string | null;
};

export default function TopBrands({ brands }: { brands: TopBrand[] }) {
  if (brands.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
      {brands.map((brand) => (
        <Link
          key={brand.slug}
          href={`/shop?q=${encodeURIComponent(brand.name)}`}
          aria-label={`Shop ${brand.name}`}
          data-anim="card"
          className="group flex flex-col aspect-[4/5] rounded-[var(--radius)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 ease-out hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5"
        >
          <div className="relative flex-1">
            {brand.logoPath ? (
              <Image
                src={brand.logoPath}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-contain p-4"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <span className="font-medium text-lg text-center text-text">
                  {brand.name}
                </span>
              </div>
            )}
          </div>

          <div className="pt-3 flex flex-col items-center text-center">
            <span className="text-sm font-medium text-text">{brand.name}</span>
            <span className="mt-1 text-xs text-muted">
              {brand.count} {brand.count === 1 ? "item" : "items"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
