"use client";

import { useState, useRef, useEffect } from "react";
import { Film } from "lucide-react";

interface MWPosterImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  title?: string;
}

export default function MWPosterImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  loading = "lazy",
  title,
}: MWPosterImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If cached by browser, immediately mark as loaded without flashing
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const isValidSrc = src && !src.includes("via.placeholder.com") && !hasError;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#0c0c10] select-none ${containerClassName}`}>
      {/* 1. SIMPLE NETFLIX-STYLE LOADING (No background bubbles, pure clean spinner) */}
      {!isLoaded && isValidSrc && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900 transition-opacity duration-300">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Clean circular spinner like Netflix (in MoviezWiki Gold) */}
            <div className="w-8 h-8 rounded-full border-2 border-neutral-800 border-t-[#F5C518] animate-spin" />
            <span className="absolute text-[10px] font-black text-[#F5C518] tracking-tighter">
              MW
            </span>
          </div>
        </div>
      )}

      {/* 2. THE POSTER IMAGE */}
      {isValidSrc ? (
        <img
          ref={imgRef}
          src={src!}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      ) : (
        /* 3. CLEAN FALLBACK */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-neutral-900 text-center">
          <Film className="w-8 h-8 text-neutral-600 mb-2" />
          <span className="text-xs font-bold text-neutral-400 line-clamp-2 px-2">
            {title || alt}
          </span>
        </div>
      )}
    </div>
  );
}
