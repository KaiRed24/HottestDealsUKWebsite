"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";

export default function ProductImageFrame({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-square bg-surface">
      {!loaded && src && (
        <div className="absolute inset-0 animate-pulse bg-paper" aria-hidden />
      )}
      <ProductImage
        src={src}
        alt={alt}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-contain p-[12%]"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
