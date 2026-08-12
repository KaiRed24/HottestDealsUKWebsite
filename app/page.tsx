import Link from "next/link";
import { getProducts, getFeatured } from "@/lib/products";
import { computeTopBrands } from "@/lib/brands";
import { getHeroBanners, getFeaturedImages } from "@/lib/assets";
import { getSocialIconPaths } from "@/lib/social-availability";
import { getBrandLogoPath } from "@/lib/brands-availability";
import ProductCard from "@/components/ProductCard";
import TopBrands from "@/components/TopBrands";
import SocialLink from "@/components/SocialLink";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import HeroSlideshow from "@/components/HeroSlideshow";

export const revalidate = 60;

const categoryTiles = [
  { value: "candy", label: "Candy", tone: "bg-red text-cream" },
  { value: "chocolate", label: "Chocolate", tone: "bg-red-deep text-cream" },
  { value: "drinks", label: "Drinks", tone: "bg-gold text-gold-ink" },
  { value: "snacks", label: "Crisps & Snacks", tone: "bg-paper text-ink ring-1 ring-ink/15" },
  { value: "bundles", label: "Bundles", tone: "bg-paper text-ink ring-1 ring-ink/15" },
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
  const featuredImages = getFeaturedImages();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-red overflow-hidden">
        <HeroSlideshow images={heroBanners} />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:py-24 text-center flex flex-col items-center">
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-tight text-white max-w-3xl [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000,0_2px_16px_rgba(0,0,0,0.35)]">
            Imported candy, sodas &amp; sweets you can&apos;t find on the high
            street.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/90 max-w-2xl [text-shadow:-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000]">
            American candy, Asian treats and European chocolate — shipped
            fast across the UK.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-white text-red font-semibold px-8 py-3.5 min-h-11 hover:bg-gold hover:text-gold-ink transition-colors"
            >
              Shop now
            </Link>
            <a
              href="https://www.tiktok.com/@hottestdealsuk"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white text-red font-semibold px-8 py-3.5 min-h-11 hover:bg-gold hover:text-gold-ink transition-colors"
            >
              Follow @hottestdealsuk
            </a>
          </div>
          <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-white/70 [text-shadow:-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000]">
            Fast UK delivery &nbsp;·&nbsp; 36,000+ TikTok followers &nbsp;·&nbsp; Genuine imported stock
          </p>
        </div>
      </section>

      {/* Top brands */}
      {topBrands.length > 0 && (
        <section className="w-full px-4 sm:px-6 py-14">
          <div className="mx-auto max-w-6xl flex items-end justify-between mb-5">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              Shop top brands
            </h2>
            <Link href="/shop" className="font-semibold text-red hover:underline">
              Shop all
            </Link>
          </div>
          <TopBrands brands={topBrands} />
        </section>
      )}

      {/* Featured showcase */}
      <FeaturedShowcase products={featured} images={featuredImages} />

      {/* Shop by category */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-5">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categoryTiles.map((tile) => (
            <Link
              key={tile.value}
              href={`/shop?category=${tile.value}`}
              className={`${tile.tone} rounded-brand min-h-24 p-5 flex items-end font-display font-bold text-lg transition-opacity hover:opacity-90`}
            >
              {tile.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Bundles & mystery boxes */}
      {bundles.length > 0 && (
        <section className="bg-gold/15">
          <div className="mx-auto w-full max-w-6xl px-4 py-14">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  Bundles &amp; mystery boxes
                </h2>
                <p className="mt-1 text-ink/60">
                  More for less — our biggest value picks.
                </p>
              </div>
              <Link
                href="/shop?category=bundles"
                className="font-semibold text-red hover:underline"
              >
                Shop all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {bundles.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Follow us */}
      <section className="bg-gold">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gold-ink">
            36,000+ people follow us for restocks and drops
          </h2>
          <p className="mt-2 text-gold-ink/80">
            TikTok for unboxings and new arrivals. Whatnot for live auctions
            and drops.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <SocialLink platform="tiktok" iconPath={socialIcons.tiktok} showFollowPrefix />
            <SocialLink platform="whatnot" iconPath={socialIcons.whatnot} showFollowPrefix />
          </div>
        </div>
      </section>
    </div>
  );
}
