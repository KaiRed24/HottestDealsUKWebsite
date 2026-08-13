import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund policy for Hottest Deals UK.",
};

export default function RefundsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-h2 sm:text-display font-semibold tracking-[-0.02em] text-text">
        Refund policy
      </h1>
      <div className="mt-6 rounded-[var(--radius)] border border-grey-line bg-white p-6 text-muted leading-relaxed">
        <p>
          This page is a placeholder. Our full refund policy hasn&apos;t
          been written yet — we&apos;d rather leave this honest than invent
          return windows or conditions that aren&apos;t true.
        </p>
        <p className="mt-3">
          Every order today is placed through eBay, TikTok Shop or Whatnot,
          so each platform&apos;s own refund/return process applies. If
          something&apos;s wrong with your order, email{" "}
          <a
            href="mailto:hello@hottestdealsuk.co.uk"
            className="font-medium text-blue hover:text-navy transition-colors"
          >
            hello@hottestdealsuk.co.uk
          </a>{" "}
          and we&apos;ll sort it.
        </p>
      </div>
    </div>
  );
}
