import Image from "next/image";
import Link from "next/link";

export type TopBrand = {
  name: string;
  slug: string;
  count: number;
  logoPath: string | null;
};

const TONES = [
  { bg: "bg-red", text: "text-white", outline: true },
  { bg: "bg-gold", text: "text-gold-ink", outline: false },
  { bg: "bg-red-deep", text: "text-white", outline: true },
  { bg: "bg-paper ring-1 ring-ink/15", text: "text-ink", outline: false },
];

const OUTLINE =
  "[text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000]";

export default function TopBrands({ brands }: { brands: TopBrand[] }) {
  if (brands.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
      {brands.map((brand, i) => {
        const tone = TONES[i % TONES.length];
        return (
          <Link
            key={brand.slug}
            href={`/shop?q=${encodeURIComponent(brand.name)}`}
            aria-label={`Shop ${brand.name}`}
            className={`group relative flex flex-col aspect-[4/5] rounded-brand overflow-hidden border border-ink/10 transition-shadow hover:shadow-brand-hover ${tone.bg}`}
          >
            <span className="absolute top-3 left-3 z-10 rounded-full bg-paper/90 ring-1 ring-ink/10 text-ink/70 text-[11px] font-semibold px-2 py-0.5">
              {brand.count} {brand.count === 1 ? "item" : "items"}
            </span>

            <div className="relative flex-[3]">
              {brand.logoPath ? (
                <Image
                  src={brand.logoPath}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-contain p-8 sm:p-10 transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <span
                    className={`font-display font-bold text-xl text-center ${tone.text}`}
                  >
                    {brand.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center px-3">
              <span
                className={`font-display font-extrabold text-xl sm:text-2xl uppercase tracking-wide text-center leading-tight ${
                  tone.text
                } ${tone.outline ? OUTLINE : ""}`}
              >
                {brand.name}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
