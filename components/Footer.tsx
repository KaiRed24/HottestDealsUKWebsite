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
    <footer className="bg-blue-deep">
      <div className="mx-auto max-w-[1280px] px-6 py-20 grid gap-10 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="text-xl font-semibold tracking-[-0.02em] text-white">
            Hottest Deals UK
          </p>
          <p className="mt-3 text-sm text-white/70 max-w-sm leading-relaxed">
            The home of imported confectionery &amp; drinks. American candy,
            sodas, Asian treats and European chocolate — straight to your
            door.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <SocialLink platform="tiktok" iconPath={tiktokIconPath} tone="on-ink" />
            <SocialLink platform="whatnot" iconPath={whatnotIconPath} tone="on-ink" />
          </div>
        </div>

        <div>
          <p className="font-medium text-white mb-3 text-sm">Shop</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                Shop all
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-medium text-white mb-3 text-sm">Policies</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of service
              </Link>
            </li>
            <li>
              <Link href="/refunds" className="hover:text-white transition-colors">
                Refund policy
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-white transition-colors">
                Shipping policy
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-[1280px] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Hottest Deals UK. All rights reserved.</p>
          {/* TODO: add real company registration number once available — never invent one */}
          <p>Company number: to be added</p>
        </div>
      </div>
    </footer>
  );
}
