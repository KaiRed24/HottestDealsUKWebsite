import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Hottest Deals UK.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-ink/60">Last updated: 28 July 2026</p>

      <div className="mt-6 space-y-6 text-ink/80 leading-relaxed">
        <section>
          <h2 className="font-display text-xl text-ink mb-2">Who we are</h2>
          <p>
            Hottest Deals UK is a UK-based importer and retailer of American
            candy, sodas and international confectionery. This website is
            informational — we don&apos;t process payments or accounts here.
            Purchases are completed through our eBay store, TikTok Shop, or
            live on Whatnot.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">
            What we collect
          </h2>
          <p>
            This site doesn&apos;t have a checkout, contact form, or user
            accounts, so we don&apos;t directly collect personal data
            through it. If you email us, we&apos;ll hold your email address
            and message only for as long as needed to respond to you.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">
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
          <h2 className="font-display text-xl text-ink mb-2">Your rights</h2>
          <p>
            Under UK GDPR, you have the right to access, correct, or request
            deletion of any personal data we hold about you. To make a
            request, email{" "}
            <a
              href="mailto:hello@hottestdealsuk.co.uk"
              className="font-bold text-red hover:underline"
            >
              hello@hottestdealsuk.co.uk
            </a>
            . If you&apos;re unhappy with how we&apos;ve handled your data,
            you can complain to the UK Information Commissioner&apos;s
            Office (ICO) at ico.org.uk.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">Changes</h2>
          <p>
            We may update this policy as the site grows. Any changes will be
            posted on this page.
          </p>
        </section>
      </div>
    </div>
  );
}
