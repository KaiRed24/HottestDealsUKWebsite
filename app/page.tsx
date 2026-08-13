import Link from "next/link";
import { getProducts, getFeatured } from "@/lib/products";
import { computeTopBrands } from "@/lib/brands";
import { getHeroBanners } from "@/lib/assets";
import { getSocialIconPaths } from "@/lib/social-availability";
import { getBrandLogoPath } from "@/lib/brands-availability";
import ProductCard from "@/components/ProductCard";
import TopBrands from "@/components/TopBrands";
import SocialLink from "@/components/SocialLink";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import HeroSlideshow from "@/components/HeroSlideshow";
import Reveal from "@/components/Reveal";

export const revalidate = 60;

const categoryTiles = [
  { value: "candy", label: "Candy" },
  { value: "chocolate", label: "Chocolate" },
  { value: "drinks", label: "Drinks" },
  { value: "snacks", label: "Crisps & Snacks" },
  { value: "bundles", label: "Bundles" },
];

export default async function Home() {
  const [allProducts, bundles, featured] = await Promise.all([
    getProducts(),
    getProducts({ category: "bundles" }),
    getFeatured(),
  ]);

  const topBrands = computeTopBrands(allProducts).map((brand) => ({
    ...brand,
    logoPath: getBrandLogoPath(brand.slug),
  }));
  const socialIcons = getSocialIconPaths();
  const heroBanners = getHeroBanners();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroSlideshow images={heroBanners} />
        {/* Navy overlay gradient — darkens the photo so clean white type
            never needs a stroke or shadow to stay readable. */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/55 to-navy/20 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-24 sm:py-32 flex flex-col items-start">
          <h1 className="text-display font-semibold leading-[1.1] tracking-[-0.03em] text-white max-w-2xl">
            Imported candy, sodas &amp; sweets you can&apos;t find on the high
            street.
          </h1>
          <p className="mt-6 text-body leading-relaxed text-white/85 max-w-xl">
            American candy, Asian treats and European chocolate — shipped
            fast across the UK.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/shop" className="btn-primary bg-white text-navy hover:bg-blue-tint px-8">
              Shop now
            </Link>
            <a
              href="https://www.tiktok.com/@hottestdealsuk"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary border-white text-white bg-transparent hover:bg-white/10 px-8"
            >
              Follow @hottestdealsuk
            </a>
          </div>
          <p className="mt-12 text-small text-white/60">
            Fast UK delivery &nbsp;·&nbsp; 36,000+ TikTok followers &nbsp;·&nbsp; Genuine imported stock
          </p>
        </div>
      </section>

      {/* Top brands */}
      {topBrands.length > 0 && (
        <section className="w-full px-6 py-24 sm:py-32 border-b border-grey-line">
          <Reveal className="mx-auto max-w-[1280px] flex items-end justify-between mb-10">
            <h2 className="text-h2 font-semibold tracking-[-0.02em] text-text">
              Shop top brands
            </h2>
            <Link href="/shop" className="text-sm text-blue hover:text-navy transition-colors">
              Shop all
            </Link>
          </Reveal>
          <Reveal className="mx-auto max-w-[1280px]">
            <TopBrands brands={topBrands} />
          </Reveal>
        </section>
      )}

      {/* Featured showcase */}
      <FeaturedShowcase products={featured} />

      {/* Shop by category */}
      <section className="mx-auto w-full max-w-[1280px] px-6 py-24 sm:py-32 border-b border-grey-line">
        <Reveal>
          <h2 className="text-h2 font-semibold tracking-[-0.02em] text-text mb-10">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryTiles.map((tile) => (
              <Link
                key={tile.value}
                href={`/shop?category=${tile.value}`}
                className="rounded-[var(--radius)] border border-grey-line bg-white min-h-28 p-5 flex items-end font-medium text-text transition-all duration-200 ease-out hover:border-navy hover:-translate-y-0.5"
              >
                {tile.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Bundles & mystery boxes */}
      {bundles.length > 0 && (
        <section className="bg-blue-tint">
          <div className="mx-auto w-full max-w-[1280px] px-6 py-24 sm:py-32">
            <Reveal className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-h2 font-semibold tracking-[-0.02em] text-text">
                  Bundles &amp; mystery boxes
                </h2>
                <p className="mt-2 text-muted">
                  More for less — our biggest value picks.
                </p>
              </div>
              <Link
                href="/shop?category=bundles"
                className="text-sm text-blue hover:text-navy transition-colors shrink-0"
              >
                Shop all
              </Link>
            </Reveal>
            <Reveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {bundles.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Follow us */}
      <section className="bg-navy">
        <Reveal className="mx-auto w-full max-w-[1280px] px-6 py-24 sm:py-32 text-center">
          <h2 className="text-h2 font-semibold tracking-[-0.02em] text-white">
            36,000+ people follow us for restocks and drops
          </h2>
          <p className="mt-3 text-white/70">
            TikTok for unboxings and new arrivals. Whatnot for live auctions
            and drops.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <SocialLink
              platform="tiktok"
              iconPath={socialIcons.tiktok}
              showFollowPrefix
              tone="on-ink"
            />
            <SocialLink
              platform="whatnot"
              iconPath={socialIcons.whatnot}
              showFollowPrefix
              tone="on-ink"
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
