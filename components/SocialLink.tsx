import Image from "next/image";
import { SOCIAL_LINKS, type SocialPlatform } from "@/lib/social";

export default function SocialLink({
  platform,
  iconPath,
  tone = "on-cream",
  showFollowPrefix = false,
  className = "",
}: {
  platform: SocialPlatform;
  iconPath: string | null;
  tone?: "on-cream" | "on-ink";
  showFollowPrefix?: boolean;
  className?: string;
}) {
  const { name, href, label } = SOCIAL_LINKS[platform];

  const toneClasses =
    tone === "on-ink"
      ? "text-cream ring-1 ring-cream/25 hover:bg-cream/10"
      : "text-ink ring-1 ring-ink/15 hover:bg-ink/5";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 min-h-11 text-sm font-semibold transition-colors ${toneClasses} ${className}`}
    >
      {/* iconPath is null until public/tiktok.* or public/whatnot.* is added — falls back to a text-only pill rather than approximating the trademark */}
      {iconPath ? (
        <Image src={iconPath} alt="" width={18} height={18} aria-hidden />
      ) : null}
      <span>{showFollowPrefix ? `Follow on ${name}` : name}</span>
    </a>
  );
}
