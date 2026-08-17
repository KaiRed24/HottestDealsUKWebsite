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
      <p className="mt-2 text-sm text-muted">Last updated: 17 August 2026</p>

      <div className="mt-8 space-y-8 text-muted leading-relaxed">
        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">Our approach</h2>
          <p>
            We import a lot of the stock we sell — American candy, Asian
            treats, European chocolate — in small, limited batches, and once
            it&apos;s gone, it&apos;s often gone for good. Because of that, we
            don&apos;t offer refunds or exchanges simply for a change of
            mind. What we do promise is that every order arrives complete
            and in the condition it should be — and if it doesn&apos;t,
            we&apos;ll put it right.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            When you&apos;re covered
          </h2>
          <p>We&apos;ll offer a replacement or a refund if:</p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>
              <strong className="text-text">Your item arrives faulty or damaged</strong> —
              for example, packaging that&apos;s split or crushed in
              transit, or a product that isn&apos;t in a sellable, edible
              condition.
            </li>
            <li>
              <strong className="text-text">Something&apos;s missing from your order</strong> —
              you&apos;re short an item you paid for, or the wrong product
              turned up instead.
            </li>
          </ul>
          <p className="mt-3">
            In either case, get in touch within 48 hours of delivery with
            your order number and a photo of the item (and the packaging,
            if it&apos;s a damage claim) — this is the quickest way for us
            to sort a replacement or refund without back-and-forth.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            What isn&apos;t covered
          </h2>
          <p>
            Because of the nature of imported, limited-run confectionery, we
            can&apos;t accept returns or offer refunds for change of mind,
            for products bought in error, or once an item has been opened —
            unless it falls under the faulty or missing cases above.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Ordering through eBay, TikTok Shop or Whatnot
          </h2>
          <p>
            Right now, every order is placed and paid for through one of
            our sales channels — eBay, TikTok Shop or Whatnot — rather than
            checkout on this site. Alongside the policy above, each
            platform has its own buyer protection and dispute process,
            which still applies to your order and gives you an extra layer
            of cover.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">Get in touch</h2>
          <p>
            If anything about your order isn&apos;t right, email{" "}
            <a
              href="mailto:hottestdealsukwebsite@gmail.com"
              className="font-medium text-blue hover:text-navy transition-colors"
            >
              hottestdealsukwebsite@gmail.com
            </a>{" "}
            with your order number and we&apos;ll get it sorted as quickly
            as we can.
          </p>
        </section>
      </div>
    </div>
  );
}
