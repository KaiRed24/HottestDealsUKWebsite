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
      ? "text-white border border-white/30 hover:bg-white/10"
      : "text-navy border border-grey-line hover:border-navy";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius)] px-4 py-3 min-h-11 text-sm font-medium transition-colors duration-150 ease-out ${toneClasses} ${className}`}
    >
      {/* iconPath is null until public/tiktok.* or public/whatnot.* is added — falls back to a text-only pill rather than approximating the trademark */}
      {iconPath ? (
        <Image src={iconPath} alt="" width={18} height={18} aria-hidden />
      ) : null}
      <span>{showFollowPrefix ? `Follow on ${name}` : name}</span>
    </a>
  );
}
