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
  tone?: "on-cream" | "on-ink" | "solid-blue" | "solid-navy" | "solid-white";
  showFollowPrefix?: boolean;
  className?: string;
}) {
  const { name, href, label } = SOCIAL_LINKS[platform];

  const toneClasses = {
    "on-cream": "text-navy border border-grey-line hover:border-navy",
    "on-ink": "text-white border border-white/30 hover:bg-white/10",
    "solid-blue": "text-white bg-blue border border-blue hover:bg-[var(--blue-ink)]",
    "solid-navy": "text-white bg-navy border border-navy hover:bg-ink",
    "solid-white": "text-navy bg-white border border-white hover:bg-blue-tint",
  }[tone];

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
