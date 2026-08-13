import Image from "next/image";
import Link from "next/link";

export default function Logo({
  hasLogo,
  logoVersion,
  className = "h-14 sm:h-16",
}: {
  hasLogo: boolean;
  logoVersion?: number | null;
  className?: string;
}) {
  return (
    <Link href="/" aria-label="Hottest Deals UK — home" className="shrink-0">
      {hasLogo ? (
        <Image
          src={logoVersion ? `/logo.png?v=${logoVersion}` : "/logo.png"}
          alt="Hottest Deals UK"
          width={1536}
          height={1024}
          priority
          className={`w-auto ${className}`}
        />
      ) : (
        <span
          className={`font-semibold text-navy tracking-[-0.02em] leading-none ${className} flex items-center`}
          style={{ fontSize: "1.5rem" }}
        >
          Hottest Deals UK
        </span>
      )}
    </Link>
  );
}
