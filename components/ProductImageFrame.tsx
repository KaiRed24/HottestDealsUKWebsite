"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImageFrame({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-square bg-surface">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-paper" aria-hidden />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-contain p-[12%]"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
