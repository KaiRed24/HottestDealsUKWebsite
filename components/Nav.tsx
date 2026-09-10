"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import SocialLink from "@/components/SocialLink";
import { useCart } from "@/components/CartProvider";

const categoryLinks = [
  { href: "/", label: "Home" },
  { href: "/shop?sort=newest", label: "New Arrivals" },
  { href: "/shop?sort=best-selling", label: "Best Sellers" },
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=snacks", label: "Crisps & Snacks" },
  { href: "/shop?category=drinks", label: "Drinks" },
  { href: "/shop?category=candy", label: "Candy" },
  { href: "/shop?category=chocolate", label: "Chocolate" },
];

function useIsActive() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (href: string) => {
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    if (!query) return !searchParams.toString();
    return new URLSearchParams(query).toString() === searchParams.toString();
  };
}

function BasketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 8h12l-1.2 10.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function BasketLink({ className = "" }: { className?: string }) {
  const { count } = useCart();
  return (
    <Link
      href="/basket"
      aria-label={`Basket, ${count} ${count === 1 ? "item" : "items"}`}
      className={`relative flex items-center justify-center w-11 h-11 rounded-full text-white hover:bg-white/10 transition-colors duration-150 ${className}`}
    >
      <BasketIcon />
      {count > 0 && (
        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-blue-deep text-[11px] font-medium flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Nav({
  hasLogo,
  logoVersion,
  tiktokIconPath,
  whatnotIconPath,
  userEmail,
}: {
  hasLogo: boolean;
  logoVersion: number | null;
  tiktokIconPath: string | null;
  whatnotIconPath: string | null;
  userEmail: string | null;
}) {
  const [open, setOpen] = useState(false);
  const isActive = useIsActive();

  return (
    <header className="sticky top-0 z-50 bg-blue-deep">
      <div className="flex items-center justify-between h-24 pl-2 pr-3 sm:pl-3 sm:pr-4">
        <Logo hasLogo={hasLogo} logoVersion={logoVersion} className="h-20 sm:h-24" />

        <div className="hidden lg:flex items-center gap-3">
          <SocialLink platform="tiktok" iconPath={tiktokIconPath} tone="solid-white" />
          <SocialLink platform="whatnot" iconPath={whatnotIconPath} tone="solid-white" />

          <span className="w-px h-6 bg-white/20 mx-1" aria-hidden />

          <Link
            href={userEmail ? "/account" : "/account/login"}
            className="px-3 py-2 rounded-[var(--radius)] text-sm text-white/80 hover:text-white transition-colors"
          >
            {userEmail ? "My account" : "Log in"}
          </Link>
          <BasketLink />
        </div>

        <div className="lg:hidden flex items-center gap-1">
          <BasketLink />

          <button
            type="button"
            className="lg:hidden flex flex-col items-center justify-center gap-1.5 w-11 h-11 -mr-2"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-transform motion-reduce:transition-none ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-opacity motion-reduce:transition-none ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-transform motion-reduce:transition-none ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <nav
          aria-label="Categories"
          className="hidden lg:flex items-center gap-6 pb-3 flex-wrap"
        >
          {categoryLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm pb-1 border-b-2 transition-colors ${
                  active
                    ? "border-white text-white font-medium"
                    : "border-transparent text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/15 bg-blue-deep">
          <Link
            href={userEmail ? "/account" : "/account/login"}
            onClick={() => setOpen(false)}
            className="block px-4 py-4 border-b border-white/15 font-medium text-white"
          >
            {userEmail ? "My account" : "Log in / Create account"}
          </Link>

          <nav aria-label="Categories" className="flex flex-col px-4 py-2">
            {categoryLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`py-3 border-b border-white/15 text-sm ${
                    active ? "text-white font-medium" : "text-white/70"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex gap-3 px-4 py-4">
            <SocialLink
              platform="tiktok"
              iconPath={tiktokIconPath}
              tone="solid-white"
              className="flex-1"
            />
            <SocialLink
              platform="whatnot"
              iconPath={whatnotIconPath}
              tone="solid-white"
              className="flex-1"
            />
          </div>
        </div>
      )}
    </header>
  );
}
