import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    // Configuring localPatterns switches local images from "allow everything"
    // to an explicit allowlist, so this must cover every local asset path
    // (not just the logo) — kept open (no `search` restriction) so
    // /logo.png?v=<timestamp> cache-busting keeps working too.
    localPatterns: [{ pathname: "/**" }],
    remotePatterns: [
      { protocol: "https", hostname: "**.tiktokcdn-eu.com" },
      { protocol: "https", hostname: "**.tiktokcdn.com" },
      ...(supabaseUrl
        ? [new URL(`${supabaseUrl}/storage/v1/object/public/product-images/**`)]
        : []),
    ],
  },
};

export default nextConfig;