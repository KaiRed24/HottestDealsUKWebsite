import Link from "next/link";
import { getProducts, getFeatured } from "@/lib/products";
import { computeTopBrands } from "@/lib/brands";
import { getHeroBanners, getCategoryCarouselImage } from "@/lib/assets";
import { getSocialIconPaths } from "@/lib/social-availability";
import { getBrandLogoPath } from "@/lib/brands-availability";
import ProductCard from "@/components/ProductCard";
import TopBrands from "@/components/TopBrands";
import SocialLink from "@/components/SocialLink";
import CategoryCarousel from "@/components/CategoryCarousel";
import HeroSlideshow from "@/components/HeroSlideshow";
import ScrollStage from "@/components/motion/ScrollStage";

export const revalidate = 60;

// The Featured Picks carousel — only shown once its image is uploaded to
// public/category-carousel/<value>.jpg, so a half-configured slide never
// goes live with a broken image.
const featuredCategorySlides = [
  { value: "candy", label: "Candy" },
  { value: "chocolate", label: "Chocolate" },
  { value: "drinks", label: "Drinks" },
  { value: "snacks", label: "Crisps & Snacks" },
];

export default async function Home() {
  const [allProducts, bundles] = await Promise.all([
    getProducts(),
    getProducts({ category: "bundles" }),
  ]);

  const topBrands = computeTopBrands(allProducts).map((brand) => ({
    ...brand,
    logoPath: getBrandLogoPath(brand.slug),
  }));
  const socialIcons = getSocialIconPaths();
  const heroBanners = getHeroBanners();
  const categorySlides = featuredCategorySlides
    .map((c) => ({ ...c, image: getCategoryCarouselImage(c.value) }))
    .filter((c): c is { value: string; label: string; image: string } => c.image !== null);

  return (
    <div className="flex flex-col">
      {/* Hero — visible on first paint, so its copy stages in on mount
          (playOnMount) rather than waiting for scroll; the background gets
          its own slower parallax scale while the text exits faster as the
          user scrolls into Top Brands (animateContainer off — this section
          is full-bleed and must never itself scale/gap at the edges). */}
      <section className="relative overflow-hidden bg-navy">
        <ScrollStage
          variant="hero"
          animateContainer={false}
          entrance={false}
          playOnMount
        >
          {/* Mobile: the source banners are landscape (~3:2–16:9) and don't
              suit being cropped to fill a tall, text-driven box, so below
              md the image gets its own contained band above the copy
              instead of sitting full-bleed behind it. md: restores the
              original full-bleed overlay exactly. */}
          <div data-anim="bg-parallax" className="relative md:absolute md:inset-0">
            <HeroSlideshow images={heroBanners} />
          </div>
          {/* Navy overlay gradient — darkens the photo so clean white type
              never needs a stroke or shadow to stay readable. Only needed
              once the image sits full-bleed behind the text, at md:+. */}
          <div className="hidden md:block md:absolute md:inset-0 bg-gradient-to-r from-navy/85 via-navy/55 to-navy/20 pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-[1280px] px-6 pt-8 pb-12 sm:py-32 flex flex-col items-start">
            <h1
              data-anim="heading"
              className="text-h1 md:text-display font-semibold leading-[1.1] tracking-[-0.03em] text-white max-w-2xl"
            >
              Imported candy, sodas &amp; sweets you can&apos;t find on the high
              street.
            </h1>
            <p data-anim="subtitle" className="mt-2 md:mt-6 text-body leading-relaxed text-white/85 max-w-xl">
              American candy, Asian treats and European chocolate — shipped
              fast across the UK.
            </p>
            <div data-anim="cta" className="mt-4 md:mt-10 flex flex-col sm:flex-row gap-3">
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
            <p data-anim="meta" className="mt-6 md:mt-12 text-small text-white/60">
              Fast UK delivery &nbsp;·&nbsp; 36,000+ TikTok followers &nbsp;·&nbsp; Genuine imported stock
            </p>
          </div>
        </ScrollStage>
      </section>

      {/* Top brands — Hero → Top Brands reads as a morph/fade, the softest
          of the transitions since it follows straight on from the hero. */}
      {topBrands.length > 0 && (
        <section className="w-full bg-blue-pale px-6 py-24 sm:py-32">
          <ScrollStage variant="morph" className="mx-auto max-w-[1280px]">
            <div className="flex items-end justify-between mb-10">
              <h2 data-anim="heading" className="text-h2 font-semibold tracking-[-0.02em] text-text">
                Shop top brands
              </h2>
              <Link
                href="/shop"
                data-anim="cta"
                className="text-sm text-blue hover:text-navy transition-colors"
              >
                Shop all
              </Link>
            </div>
            <TopBrands brands={topBrands} />
          </ScrollStage>
        </section>
      )}

      {/* Featured picks — full-bleed category carousel, matching the Hero's
          treatment. Waiting on real photos, see chat for upload status.
          Top Brands → here is a push: the whole panel arrives from below. */}
      <ScrollStage variant="push">
        <CategoryCarousel slides={categorySlides} />
      </ScrollStage>

      {/* Bundles & mystery boxes — deep, alternating from Top Brands (pale)
          above and Follow Us (pale) below, so the footer (mandatorily
          deep) still alternates correctly against its neighbour. Carousel
          → here is a fade+scale, calmer than the push before it. */}
      {bundles.length > 0 && (
        <section className="bg-blue-deep">
          <ScrollStage variant="fade-scale" className="mx-auto w-full max-w-[1280px] px-6 py-24 sm:py-32">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 data-anim="heading" className="text-h2 font-semibold tracking-[-0.02em] text-white">
                  Bundles &amp; mystery boxes
                </h2>
                <p data-anim="subtitle" className="mt-2 text-white/70">
                  More for less — our biggest value picks.
                </p>
              </div>
              <Link
                href="/shop?category=bundles"
                data-anim="cta"
                className="text-sm text-white hover:text-white/80 transition-colors shrink-0"
              >
                Shop all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {bundles.slice(0, 8).map((product) => (
                <div key={product.id} data-anim="card" className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </ScrollStage>
        </section>
      )}

      {/* Follow us — pale, so it alternates correctly into the (mandatorily
          deep) footer below. Bundles → here is a slide+stagger, the most
          pronounced transition, since it's the page's closing beat before
          the footer. */}
      <section className="bg-blue-pale">
        <ScrollStage
          variant="slide-stagger"
          className="mx-auto w-full max-w-[1280px] px-6 py-24 sm:py-32 text-center"
        >
          <h2 data-anim="heading" className="text-h2 font-semibold tracking-[-0.02em] text-ink">
            36,000+ people follow us for restocks and drops
          </h2>
          <p data-anim="subtitle" className="mt-3 text-muted">
            TikTok for unboxings and new arrivals. Whatnot for live auctions
            and drops.
          </p>
          <div data-anim="cta" className="mt-9 flex flex-wrap justify-center gap-3">
            <SocialLink
              platform="tiktok"
              iconPath={socialIcons.tiktok}
              showFollowPrefix
              tone="solid-blue"
            />
            <SocialLink
              platform="whatnot"
              iconPath={socialIcons.whatnot}
              showFollowPrefix
              tone="solid-blue"
            />
          </div>
        </ScrollStage>
      </section>
    </div>
  );
}
