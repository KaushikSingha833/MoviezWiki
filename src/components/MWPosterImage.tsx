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
      {/* 1. PROFESSIONAL "MW" CINEMATIC LOADING ANIMATION (Visible while image is loading) */}
      {!isLoaded && isValidSrc && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-[#131318] via-[#0b0b0e] to-[#060608] overflow-hidden transition-opacity duration-500">
          
          {/* Subtle Ambient Golden Core Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#F5C518]/25 via-amber-500/10 to-transparent blur-2xl animate-mw-glow" />
          </div>

          {/* Sweeping Shimmer Beam */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-mw-shimmer" />
          </div>

          {/* Central Orbital MW Monogram */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Multi-layered Orbital Rings */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
              
              {/* Outer Subtle Orbit Track */}
              <div className="absolute inset-0 rounded-full border border-white/10" />

              {/* Fast Orbiting Golden Comet Ring */}
              <div 
                className="absolute inset-0 rounded-full border border-transparent border-t-[#F5C518] border-r-[#F5C518]/70 animate-spin shadow-[0_0_12px_rgba(245,197,24,0.4)]"
                style={{ animationDuration: "1.2s" }}
              />

              {/* Counter-rotating Inner Secondary Ring */}
              <div 
                className="absolute inset-1.5 rounded-full border border-transparent border-b-amber-300/40 border-l-amber-300/20 animate-spin"
                style={{ animationDuration: "2s", animationDirection: "reverse" }}
              />

              {/* Iconic "MW" Monogram */}
              <div className="relative flex items-center justify-center font-black tracking-tighter">
                <span className="text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-[#F5C518] to-yellow-600 drop-shadow-[0_2px_8px_rgba(245,197,24,0.6)] animate-pulse">
                  MW
                </span>
              </div>
            </div>

            {/* Micro Prestige Label */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="w-1 h-1 rounded-full bg-[#F5C518]/70 animate-ping" />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400">
                LOADING
              </span>
              <span className="w-1 h-1 rounded-full bg-[#F5C518]/70 animate-ping" style={{ animationDelay: "0.3s" }} />
            </div>
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
          className={`w-full h-full object-cover transition-all duration-500 ease-out ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
          } ${className}`}
        />
      ) : (
        /* 3. LUXURY FALLBACK (When no poster exists or image fails to load) */
        <div className="absolute inset-0 flex flex-col items-center justify-between p-4 bg-gradient-to-b from-[#181820] via-[#101015] to-[#070709] border border-white/5">
          <div className="flex items-center justify-between w-full opacity-60">
            <span className="text-[9px] font-black tracking-widest text-[#F5C518] uppercase">MoviezWiki</span>
            <Film className="w-3.5 h-3.5 text-neutral-500" />
          </div>

          <div className="flex flex-col items-center justify-center my-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F5C518]/10 border border-[#F5C518]/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(245,197,24,0.15)]">
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-[#F5C518] to-yellow-600">
                MW
              </span>
            </div>
            <span className="text-xs font-bold text-neutral-300 line-clamp-2 px-2">
              {title || alt}
            </span>
          </div>

          <div className="w-full flex items-center justify-center">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#F5C518]/40 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}
