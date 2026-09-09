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
      <p className="mt-2 text-sm text-muted">Last updated: 9 September 2026</p>

      <div className="mt-8 space-y-8 text-muted leading-relaxed">
        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">Who we are</h2>
          <p>
            Hottest Deals UK is a UK-based importer and retailer of American,
            Asian and European candy, sodas and snacks. By browsing or using
            this website, you&apos;re agreeing to the terms below — please
            take a moment to read them.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Using this website
          </h2>
          <p>
            You can browse our range here and, for items marked available
            on-site, check out and pay directly through our secure Shopify
            checkout. Other items are sold through our eBay store, TikTok
            Shop or live on Whatnot — product pages link to wherever an item
            can be bought. Please don&apos;t misuse the site — for example by
            attempting to scrape, disrupt or gain unauthorised access to it.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Our products
          </h2>
          <p>
            We import a lot of what we sell in small, limited batches, so
            packaging, flavours and exact contents can occasionally differ
            slightly from what&apos;s pictured — imported product lines
            change their packaging more often than UK ones. Stock levels and
            availability shown here are a best effort and aren&apos;t
            guaranteed until an order is confirmed on the platform you buy
            through.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Placing an order
          </h2>
          <p>
            For items available on-site, checkout and payment are handled
            directly through Shopify, which confirms pricing and stock at
            the point of purchase and applies its own terms and buyer
            protections alongside ours. Everything else is placed and paid
            for through one of our other sales channels — eBay, TikTok Shop
            or Whatnot — each of which likewise handles payment and applies
            its own terms. If anything here ever conflicts with the terms of
            the platform you bought through, that platform&apos;s terms take
            priority for that order.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Age &amp; suitability
          </h2>
          <p>
            Some of our drinks (like energy drinks) contain caffeine and
            aren&apos;t intended for young children, and many of our products
            are high in sugar. Please use your judgement, and check
            packaging for full ingredients and allergen information before
            buying for someone else.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Shipping, refunds &amp; returns
          </h2>
          <p>
            Delivery timeframes are covered in our{" "}
            <a
              href="/shipping"
              className="font-medium text-blue hover:text-navy transition-colors"
            >
              shipping policy
            </a>
            , and what to do if something arrives faulty, damaged or missing
            is covered in our{" "}
            <a
              href="/refunds"
              className="font-medium text-blue hover:text-navy transition-colors"
            >
              refund policy
            </a>
            . Nothing in these terms affects your statutory rights as a
            consumer under UK law.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Brand names &amp; trademarks
          </h2>
          <p>
            Product names, logos and trademarks shown on this site belong to
            their respective manufacturers and owners. Hottest Deals UK is an
            independent importer and retailer — we&apos;re not affiliated
            with, sponsored by, or endorsed by those brands unless we say so
            explicitly.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Liability
          </h2>
          <p>
            We work to keep the information on this site accurate and up to
            date, but we can&apos;t guarantee it&apos;s always error-free —
            for example, an image or description may occasionally lag behind
            a packaging update from the manufacturer. To the fullest extent
            permitted by law, we&apos;re not liable for losses arising from
            reliance on this website&apos;s content, beyond what&apos;s
            required by your statutory rights and the platform you ordered
            through.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Changes to these terms
          </h2>
          <p>
            We may update these terms as the business grows. Any changes
            will be posted on this page with an updated date above.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Governing law
          </h2>
          <p>
            These terms are governed by the laws of England and Wales.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">Get in touch</h2>
          <p>
            Questions about these terms? Email{" "}
            <a
              href="mailto:hottestdealsukwebsite@gmail.com"
              className="font-medium text-blue hover:text-navy transition-colors"
            >
              hottestdealsukwebsite@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
