import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Hottest Deals UK imports American candy, sodas and international confectionery straight to the UK.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
        About Hottest Deals UK
      </h1>

      <div className="mt-6 space-y-5 text-ink/80 leading-relaxed">
        <p>
          We&apos;re Hottest Deals UK — the home of imported confectionery
          &amp; drinks. We hunt down the American candy, Asian treats and
          European chocolate you can&apos;t pick up at your local shop and
          get it to your door, fast.
        </p>
        <p>
          It started as a side hustle sourcing hard-to-find snacks for
          friends. Now we run a dedicated UK warehouse stocking hundreds of
          imported lines, from viral TikTok candy drops to classic American
          sodas.
        </p>
        <p>
          We built our following the honest way — posting real unboxings and
          restocks on TikTok, where{" "}
          <a
            href="https://www.tiktok.com/@hottestdealsuk"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-red hover:underline"
          >
            @hottestdealsuk
          </a>{" "}
          has grown to over 36,000 followers. We also sell live on Whatnot,
          and now here on our own website.
        </p>
        <p>
          No corporate filler, no gatekeeping — just the sweets you&apos;ve
          seen online, shipped from the UK.
        </p>
      </div>
    </div>
  );
}
