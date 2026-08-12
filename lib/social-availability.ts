import { publicFileExists } from "@/lib/assets";
import { SOCIAL_LINKS, type SocialPlatform } from "@/lib/social";

const EXTENSIONS = ["svg", "png", "jpg", "jpeg"];

export function getSocialIconPath(platform: SocialPlatform): string | null {
  for (const ext of EXTENSIONS) {
    if (publicFileExists(`${platform}.${ext}`)) return `/${platform}.${ext}`;
  }
  return null;
}

export function getSocialIconPaths(): Record<SocialPlatform, string | null> {
  const result = {} as Record<SocialPlatform, string | null>;
  for (const platform of Object.keys(SOCIAL_LINKS) as SocialPlatform[]) {
    result[platform] = getSocialIconPath(platform);
  }
  return result;
}
