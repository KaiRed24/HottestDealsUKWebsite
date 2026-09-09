import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { hasLogo, getLogoVersion } from "@/lib/assets";
import { getSocialIconPaths } from "@/lib/social-availability";
import { createClient } from "@/lib/supabase/server";

const clashDisplay = localFont({
  variable: "--font-clash",
  src: [
    { path: "./fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
});

const switzer = localFont({
  variable: "--font-switzer",
  src: [
    { path: "./fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
  ],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hottestdealsuk.co.uk"),
  title: {
    default: "Hottest Deals UK | Imported Candy, Sodas & Sweets",
    template: "%s | Hottest Deals UK",
  },
  description:
    "The home of imported confectionery & drinks. American candy, sodas, Asian treats and European chocolate. Use code 10OFF for 10% off.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoAvailable = hasLogo();
  const logoVersion = getLogoVersion();
  const socialIcons = getSocialIconPaths();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${switzer.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <Nav
            hasLogo={logoAvailable}
            logoVersion={logoVersion}
            tiktokIconPath={socialIcons.tiktok}
            whatnotIconPath={socialIcons.whatnot}
            userEmail={user?.email ?? null}
          />
          <AnnouncementBar />
          {/* bg-blue-pale here only ever shows through on pages whose
              content doesn't already provide its own full-bleed section
              background (shop, product, account, static pages) — the
              homepage's sections cover this edge-to-edge with no gaps. */}
          <main className="flex-1 flex flex-col bg-blue-pale">{children}</main>
          <Footer
            hasLogo={logoAvailable}
            tiktokIconPath={socialIcons.tiktok}
            whatnotIconPath={socialIcons.whatnot}
          />
        </CartProvider>
      </body>
    </html>
  );
}
