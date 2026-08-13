import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Hottest Deals UK.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-h2 sm:text-display font-semibold tracking-[-0.02em] text-text">
        Terms of service
      </h1>
      <div className="mt-6 rounded-[var(--radius)] border border-grey-line bg-white p-6 text-muted leading-relaxed">
        <p>
          This page is a placeholder. Our full terms of service haven&apos;t
          been written yet — we&apos;d rather leave this honest than invent
          legal terms that don&apos;t reflect how we actually trade.
        </p>
        <p className="mt-3">
          In the meantime, all purchases are completed on eBay, TikTok Shop
          or Whatnot, so each platform&apos;s own terms apply to your order.
          Questions? Email{" "}
          <a
            href="mailto:hello@hottestdealsuk.co.uk"
            className="font-medium text-blue hover:text-navy transition-colors"
          >
            hello@hottestdealsuk.co.uk
          </a>
          .
        </p>
      </div>
    </div>
  );
}
