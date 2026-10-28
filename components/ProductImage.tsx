"use client";

import Image from "next/image";
import { useState } from "react";

// Shown when a product has no photo or its photo fails to load, so a broken
// image never renders as a blank grey box.
export function ProductPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-blue-pale"
      aria-hidden
    >
      <Image
        src="/logo.png"
        alt=""
        width={160}
        height={160}
        className={`h-auto opacity-80 ${compact ? "w-3/4" : "w-2/5"}`}
      />
      {!compact && (
        <span className="text-sm font-medium text-ink/70">Photo coming soon</span>
      )}
    </div>
  );
}

export default function ProductImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  compact = false,
  onLoad,
}: {
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  compact?: boolean;
  onLoad?: () => void;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) return <ProductPlaceholder compact={compact} />;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onLoad={onLoad}
      onError={() => {
        setFailedSrc(src);
        onLoad?.();
      }}
    />
  );
}
