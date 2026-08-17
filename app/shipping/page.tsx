import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping policy for Hottest Deals UK.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-h2 sm:text-display font-semibold tracking-[-0.02em] text-text">
        Shipping policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: 17 August 2026</p>

      <div className="mt-8 space-y-8 text-muted leading-relaxed">
        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Delivery times
          </h2>
          <p>
            Orders are shipped from our UK base and arrive within{" "}
            <strong className="text-text">3–5 working days</strong> of being
            placed. We pack every order carefully to make sure your treats
            turn up in the same condition they left us in, whatever&apos;s
            inside the box.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Processing your order
          </h2>
          <p>
            Orders are picked and packed by hand, usually within a day or
            two of purchase, before they&apos;re handed to our courier. The
            3–5 working day estimate covers the full journey from the
            moment you order to the moment it lands on your doorstep.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Ordering through eBay, TikTok Shop or Whatnot
          </h2>
          <p>
            Every order today is placed and shipped through one of our
            sales channels — eBay, TikTok Shop or Whatnot — rather than
            checkout on this site. Delivery estimates and tracking are
            provided through whichever platform you order from, alongside
            the timeframe above.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Delays and questions
          </h2>
          <p>
            Courier delays do happen from time to time, especially around
            busy periods, and we&apos;ll always do what we can to help if
            your order is taking longer than expected. If it&apos;s been
            longer than 5 working days and you haven&apos;t heard anything,
            email{" "}
            <a
              href="mailto:hottestdealsukwebsite@gmail.com"
              className="font-medium text-blue hover:text-navy transition-colors"
            >
              hottestdealsukwebsite@gmail.com
            </a>{" "}
            with your order number and we&apos;ll chase it up for you.
          </p>
        </section>
      </div>
    </div>
  );
}
