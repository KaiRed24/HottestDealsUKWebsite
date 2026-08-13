import fs from "node:fs";
import path from "node:path";

export function publicFileExists(filename: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", filename));
}

export function hasLogo(): boolean {
  return publicFileExists("logo.png");
}

// A stable value that only changes when the underlying file changes, used to
// cache-bust the logo URL so re-uploading a file with the same name (e.g.
// logo.png) always shows the new version instead of a stale cached copy.
export function getLogoVersion(): number | null {
  const filePath = path.join(process.cwd(), "public", "logo.png");
  if (!fs.existsSync(filePath)) return null;
  return Math.floor(fs.statSync(filePath).mtimeMs);
}

// Any image dropped into public/hero/ is picked up automatically, in
// filename order — no code change needed to add, remove, or reorder banners.
export function getHeroBanners(): string[] {
  const dir = path.join(process.cwd(), "public", "hero");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .map((f) => `/hero/${f}`);
}
