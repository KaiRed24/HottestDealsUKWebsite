import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Hottest Deals UK.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-h2 sm:text-display font-semibold tracking-[-0.02em] text-text">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: 9 September 2026</p>

      <div className="mt-6 space-y-6 text-muted leading-relaxed">
        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">Who we are</h2>
          <p>
            Hottest Deals UK is a UK-based importer and retailer of American
            candy, sodas and international confectionery. For items
            available on-site, checkout and payment are handled directly
            through Shopify. Everything else is purchased through our eBay
            store, TikTok Shop, or live on Whatnot.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            What we collect
          </h2>
          <p>
            This site doesn&apos;t have a contact form, so we don&apos;t
            collect personal data through browsing alone. If you email us,
            we&apos;ll hold your email address and message only for as long
            as needed to respond to you. Checking out on-site is covered
            separately below.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Checkout via Shopify
          </h2>
          <p>
            When you check out on-site, you&apos;re taken to a secure
            checkout hosted by Shopify. Shopify collects and processes what
            it needs to complete the order — your email address, delivery
            address and payment details — under its own privacy policy. We
            only see the order information needed to fulfil and ship your
            purchase; we never see or store your payment details.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">
            Purchases via eBay, TikTok or Whatnot
          </h2>
          <p>
            When you buy through eBay, TikTok Shop or Whatnot, that platform
            processes your order and any personal data involved (name,
            delivery address, payment details) under its own privacy policy.
            We only see the order information needed to fulfil and ship
            your purchase.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">Your rights</h2>
          <p>
            Under UK GDPR, you have the right to access, correct, or request
            deletion of any personal data we hold about you. To make a
            request, email{" "}
            <a
              href="mailto:hottestdealsukwebsite@gmail.com"
              className="font-medium text-blue hover:text-navy transition-colors"
            >
              hottestdealsukwebsite@gmail.com
            </a>
            . If you&apos;re unhappy with how we&apos;ve handled your data,
            you can complain to the UK Information Commissioner&apos;s
            Office (ICO) at ico.org.uk.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text mb-2">Changes</h2>
          <p>
            We may update this policy as the site grows. Any changes will be
            posted on this page.
          </p>
        </section>
      </div>
    </div>
  );
}
