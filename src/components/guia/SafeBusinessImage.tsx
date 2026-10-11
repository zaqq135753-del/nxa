import React, { useState, useEffect } from 'react';
import { asset } from '../../lib/asset';

// Fotos locais de Caraíva empacotadas para fallback resiliente instantâneo
const LOCAL_CARAIVA_PHOTOS = [
  asset('assets/caraiva-photos/caraiva-09-640.webp'),
  asset('assets/caraiva-photos/caraiva-02-640.webp'),
  asset('assets/caraiva-photos/caraiva-03-640.webp'),
  asset('assets/caraiva-photos/caraiva-05-640.webp'),
  asset('assets/caraiva-photos/caraiva-07-640.webp'),
  asset('assets/caraiva-photos/caraiva-11-640.webp'),
  asset('assets/caraiva-photos/caraiva-12-640.webp'),
];

export function getCategoryFallbackPhoto(category?: string, seedStr?: string): string {
  const c = (category || '').toLowerCase();
  if (c.includes('hospedagem') || c.includes('pousada')) {
    return asset('assets/caraiva-photos/caraiva-09-640.webp');
  }
  if (c.includes('restaurante') || c.includes('cafe') || c.includes('gastronomia') || c.includes('bar')) {
    return asset('assets/caraiva-photos/caraiva-05-640.webp');
  }
  if (c.includes('praia') || c.includes('passeio') || c.includes('natureza')) {
    return asset('assets/caraiva-photos/caraiva-02-640.webp');
  }
  if (seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % LOCAL_CARAIVA_PHOTOS.length;
    return LOCAL_CARAIVA_PHOTOS[idx];
  }
  return asset('assets/caraiva-photos/caraiva-09-640.webp');
}

export interface SafeBusinessImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  category?: string;
  fallbackSeed?: string;
}

export const SafeBusinessImage: React.FC<SafeBusinessImageProps> = ({
  src,
  category,
  fallbackSeed,
  alt = '',
  className = '',
  style,
  ...rest
}) => {
  const fallback = getCategoryFallbackPhoto(category, fallbackSeed || alt);
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallback);
  const [hasFailed, setHasFailed] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(src || fallback);
    setHasFailed(false);
  }, [src, fallback]);

  const handleError = () => {
    if (!hasFailed && currentSrc !== fallback) {
      setHasFailed(true);
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading="lazy"
      decoding="async"
      crossOrigin="anonymous"
      {...rest}
    />
  );
};
