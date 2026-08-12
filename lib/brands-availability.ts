import { publicFileExists } from "@/lib/assets";

const EXTENSIONS = ["svg", "png", "jpg", "jpeg"];

// Looks for public/brands/<slug>.(svg|png|jpg|jpeg) — drop a real brand logo
// file in with that name and it's picked up automatically. Never fabricate
// or approximate a brand's mark; text-only fallback is used until one exists.
export function getBrandLogoPath(slug: string): string | null {
  for (const ext of EXTENSIONS) {
    if (publicFileExists(`brands/${slug}.${ext}`)) return `/brands/${slug}.${ext}`;
  }
  return null;
}
