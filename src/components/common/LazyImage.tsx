import React, { useState, useEffect } from 'react';
import { Car, ImageOff } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackSrc = '/images/hero_la_transport_1790686468335.jpg',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Reset state when src prop changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-neutral-900/60 ${containerClassName}`}>
      {/* Shimmer skeleton placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 bg-neutral-800/80 animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-neutral-500">
            <Car className="w-8 h-8 opacity-40 animate-bounce" />
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">Memuat Unit...</span>
          </div>
        </div>
      )}

      {/* Error state if image fails completely */}
      {hasError ? (
        <div className="absolute inset-0 z-0 bg-neutral-900 flex flex-col items-center justify-center p-4 text-center text-neutral-400">
          <ImageOff className="w-8 h-8 text-[#D4AF37]/60 mb-2" />
          <span className="text-xs font-semibold text-neutral-300">Gambar Tidak Tersedia</span>
          <span className="text-[10px] text-neutral-500 mt-0.5">{alt}</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
};
