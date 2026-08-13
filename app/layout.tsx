import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import ChatWidget from "@/components/ChatWidget";
import { hasLogo, getLogoVersion } from "@/lib/assets";
import { getSocialIconPaths } from "@/lib/social-availability";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <AnnouncementBar />
          <Nav
            hasLogo={logoAvailable}
            logoVersion={logoVersion}
            tiktokIconPath={socialIcons.tiktok}
            whatnotIconPath={socialIcons.whatnot}
            userEmail={user?.email ?? null}
          />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer
            hasLogo={logoAvailable}
            tiktokIconPath={socialIcons.tiktok}
            whatnotIconPath={socialIcons.whatnot}
          />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
