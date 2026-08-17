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
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-h2 sm:text-display font-semibold tracking-[-0.02em] text-text">
        Get in touch
      </h1>
      <p className="mt-4 text-muted">
        Got a question about an order, a product, or just want to say hi?
        We&apos;re easiest to reach here:
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:hottestdealsukwebsite@gmail.com"
          className="rounded-[var(--radius)] border border-grey-line bg-white p-6 hover:border-navy transition-colors duration-150"
        >
          <p className="text-lg font-semibold text-text">Email</p>
          <p className="mt-1 font-medium text-blue">hottestdealsukwebsite@gmail.com</p>
        </a>

        <div className="rounded-[var(--radius)] border border-grey-line bg-white p-6 flex flex-col gap-3">
          <p className="text-lg font-semibold text-text">Social</p>
          <div className="flex flex-wrap gap-2">
            <SocialLink platform="tiktok" iconPath={tiktokIconPath} />
            <SocialLink platform="whatnot" iconPath={whatnotIconPath} />
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted">
        We also sell through eBay — check individual product pages for
        direct links.
      </p>
    </div>
  );
}
