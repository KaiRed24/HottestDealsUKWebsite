import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping policy for Hottest Deals UK.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
        Shipping policy
      </h1>
      <div className="mt-6 rounded-brand border border-ink/10 bg-paper p-6 text-ink/80 leading-relaxed">
        <p>
          This page is a placeholder. Our full shipping policy hasn&apos;t
          been written yet — we&apos;d rather leave this honest than invent
          delivery times or costs that aren&apos;t true.
        </p>
        <p className="mt-3">
          Every order today is placed and shipped through eBay, TikTok Shop
          or Whatnot, so each platform&apos;s own shipping information
          applies at checkout. Questions? Email{" "}
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
