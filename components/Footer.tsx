import Link from "next/link";
import SocialLink from "@/components/SocialLink";

export default function Footer({
  tiktokIconPath,
  whatnotIconPath,
}: {
  hasLogo: boolean;
  tiktokIconPath: string | null;
  whatnotIconPath: string | null;
}) {
  return (
    <footer className="mt-16 bg-paper border-t border-ink/10">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-display text-2xl font-bold text-red">
            Hottest Deals UK
          </p>
          <p className="mt-2 text-sm text-ink/70 max-w-sm">
            The home of imported confectionery &amp; drinks. American candy,
            sodas, Asian treats and European chocolate — straight to your
            door.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <SocialLink platform="tiktok" iconPath={tiktokIconPath} />
            <SocialLink platform="whatnot" iconPath={whatnotIconPath} />
          </div>
        </div>

        <div>
          <p className="font-semibold text-red mb-3 text-sm uppercase tracking-wide">
            Shop
          </p>
          <ul className="space-y-2 text-sm text-ink/70">
            <li>
              <Link href="/shop" className="hover:text-ink">
                Shop all
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-ink">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ink">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-red mb-3 text-sm uppercase tracking-wide">
            Policies
          </p>
          <ul className="space-y-2 text-sm text-ink/70">
            <li>
              <Link href="/terms" className="hover:text-ink">
                Terms of service
              </Link>
            </li>
            <li>
              <Link href="/refunds" className="hover:text-ink">
                Refund policy
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-ink">
                Shipping policy
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-ink">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/40">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink/50">
          <p>© {new Date().getFullYear()} Hottest Deals UK. All rights reserved.</p>
          {/* TODO: add real company registration number once available — never invent one */}
          <p>Company number: to be added</p>
        </div>
      </div>
    </footer>
  );
}
