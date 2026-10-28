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

const trustBadges = [
  { icon: "truck", label: "Fast UK delivery" },
  { icon: "users", label: "36,000+ TikTok followers" },
  { icon: "check", label: "Genuine imported stock" },
] as const;

function TrustIcon({ name }: { name: (typeof trustBadges)[number]["icon"] }) {
  const paths = {
    truck: (
      <>
        <path d="M3 6h11v10H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.5" />
        <circle cx="17" cy="17.5" r="1.5" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
      </>
    ),
    check: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
      {paths[name]}
    </svg>
  );
}

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
          <div className="relative z-10 mx-auto max-w-[1280px] px-6 pt-4 pb-10 sm:py-32 flex flex-col items-start">
            {/* Trust badges: first thing under the banner on phones so they
                sit above the fold (not behind the browser's bottom bar);
                back below the CTAs from md:. */}
            <ul
              data-anim="meta"
              aria-label="Why shop with us"
              className="order-first md:order-last mb-5 md:mb-0 md:mt-12 flex flex-wrap gap-2"
            >
              {trustBadges.map((badge) => (
                <li
                  key={badge.label}
                  className="flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 px-3 py-1.5 text-sm font-medium text-white"
                >
                  <TrustIcon name={badge.icon} />
                  {badge.label}
                </li>
              ))}
            </ul>
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
          </div>
        </ScrollStage>
      </section>

      {/* Top brands — Hero → Top Brands reads as a morph/fade, the softest
          of the transitions since it follows straight on from the hero. */}
      {topBrands.length > 0 && (
        <section className="w-full bg-blue-pale px-6 py-14 sm:py-32">
          <ScrollStage variant="morph" className="mx-auto max-w-[1280px]">
            <div className="flex items-end justify-between gap-4 mb-6 sm:mb-10">
              <h2 data-anim="heading" className="text-h2 font-semibold tracking-[-0.02em] text-ink">
                Shop top brands
              </h2>
              <Link
                href="/shop"
                data-anim="cta"
                className="shrink-0 inline-flex items-center h-11 text-sm font-semibold text-ink underline decoration-2 underline-offset-4 decoration-ink/30 hover:decoration-ink transition-colors"
              >
                Shop all →
              </Link>
            </div>
            <TopBrands brands={topBrands} />
          </ScrollStage>
        </section>
      )}

      {/* Featured picks — full-bleed category carousel, matching the Hero's
          treatment. animateContainer off for the same reason as the Hero:
          scaling a full-bleed panel opens gaps at the screen edges. */}
      <ScrollStage variant="push" animateContainer={false}>
        <CategoryCarousel slides={categorySlides} />
      </ScrollStage>

      {/* Bundles & mystery boxes — deep, alternating from Top Brands (pale)
          above and Follow Us (pale) below, so the footer (mandatorily
          deep) still alternates correctly against its neighbour. Carousel
          → here is a fade+scale, calmer than the push before it. */}
      {bundles.length > 0 && (
        <section className="bg-blue-deep">
          <ScrollStage variant="fade-scale" className="mx-auto w-full max-w-[1280px] px-6 py-14 sm:py-32">
            <div className="flex items-end justify-between gap-4 mb-6 sm:mb-10">
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
                className="shrink-0 inline-flex items-center h-11 text-sm font-semibold text-white underline decoration-2 underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
              >
                Shop all →
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
          className="mx-auto w-full max-w-[1280px] px-6 py-14 sm:py-32 text-center"
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
