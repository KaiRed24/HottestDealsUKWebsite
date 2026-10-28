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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
      {brands.map((brand) => (
        <Link
          key={brand.slug}
          href={`/shop?q=${encodeURIComponent(brand.name)}`}
          aria-label={`Shop ${brand.name}`}
          data-anim="card"
          className="group flex flex-col items-center rounded-[var(--radius)] bg-white p-4 sm:p-5 shadow-[var(--shadow-card)] transition-all duration-200 ease-out hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5"
        >
          {/* Fixed-size logo box: every tile is the same height and each
              logo is scaled to fit and centred in the same padded area. */}
          <div className="relative w-full h-20 sm:h-28">
            {brand.logoPath ? (
              <Image
                src={brand.logoPath}
                alt=""
                fill
                sizes="(max-width: 640px) 45vw, 25vw"
                className="object-contain p-2"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center px-2">
                <span className="font-display font-semibold text-lg text-center text-ink leading-tight">
                  {brand.name}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 w-full border-t border-grey-line flex flex-col items-center text-center">
            <span className="text-sm font-semibold text-ink truncate max-w-full">{brand.name}</span>
            <span className="text-sm text-muted">
              {brand.count} {brand.count === 1 ? "item" : "items"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
