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
    <footer className="mt-16 bg-white border-t border-grey-line">
      <div className="mx-auto max-w-[1280px] px-6 py-20 grid gap-10 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="text-xl font-semibold tracking-[-0.02em] text-navy">
            Hottest Deals UK
          </p>
          <p className="mt-3 text-sm text-muted max-w-sm leading-relaxed">
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
          <p className="font-medium text-text mb-3 text-sm">Shop</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <Link href="/shop" className="hover:text-navy transition-colors">
                Shop all
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-navy transition-colors">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-navy transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-medium text-text mb-3 text-sm">Policies</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <Link href="/terms" className="hover:text-navy transition-colors">
                Terms of service
              </Link>
            </li>
            <li>
              <Link href="/refunds" className="hover:text-navy transition-colors">
                Refund policy
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-navy transition-colors">
                Shipping policy
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-navy transition-colors">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-grey-line">
        <div className="mx-auto max-w-[1280px] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>© {new Date().getFullYear()} Hottest Deals UK. All rights reserved.</p>
          {/* TODO: add real company registration number once available — never invent one */}
          <p>Company number: to be added</p>
        </div>
      </div>
    </footer>
  );
}
