import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Hottest Deals UK.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
        Terms of service
      </h1>
      <div className="mt-6 rounded-brand border border-ink/10 bg-paper p-6 text-ink/80 leading-relaxed">
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
            className="font-bold text-red hover:underline"
          >
            hello@hottestdealsuk.co.uk
          </a>
          .
        </p>
      </div>
    </div>
  );
}
