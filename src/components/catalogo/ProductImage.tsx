import { useEffect, useState } from "react";
import { ProductArtworkFallback } from "./ProductArtworkFallback";

interface ProductImageProps {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  loading?: "eager" | "lazy";
}

export function ProductImage({ src, alt, width, height, loading = "eager" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return <ProductArtworkFallback label={`Imagen pendiente de ${alt}`} />;
  }

  return <img src={src} alt={alt} width={width} height={height} loading={loading} decoding="async" onError={() => setFailed(true)} />;
}
