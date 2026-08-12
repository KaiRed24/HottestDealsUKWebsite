import type { Metadata } from "next";
import { getSocialIconPath } from "@/lib/social-availability";
import SocialLink from "@/components/SocialLink";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Hottest Deals UK by email, TikTok or Whatnot.",
};

export default function ContactPage() {
  const tiktokIconPath = getSocialIconPath("tiktok");
  const whatnotIconPath = getSocialIconPath("whatnot");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
        Get in touch
      </h1>
      <p className="mt-4 text-ink/80">
        Got a question about an order, a product, or just want to say hi?
        We&apos;re easiest to reach here:
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:hello@hottestdealsuk.co.uk"
          className="rounded-brand border border-ink/10 bg-paper p-6 hover:bg-red hover:text-cream hover:border-red transition-colors"
        >
          <p className="font-display text-lg font-semibold">Email</p>
          <p className="mt-1 font-bold">hello@hottestdealsuk.co.uk</p>
        </a>

        <div className="rounded-brand border border-ink/10 bg-paper p-6 flex flex-col gap-3">
          <p className="font-display text-lg font-semibold">Social</p>
          <div className="flex flex-wrap gap-2">
            <SocialLink platform="tiktok" iconPath={tiktokIconPath} />
            <SocialLink platform="whatnot" iconPath={whatnotIconPath} />
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-ink/60">
        We also sell through eBay — check individual product pages for
        direct links.
      </p>
    </div>
  );
}
