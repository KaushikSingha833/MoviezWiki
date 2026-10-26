"use client";

import { useRef } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getExploreHref(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("anime")) return "/search?genres=16";
  if (t.includes("korean") || t.includes("k-drama")) return "/search?region=KR";
  if (t.includes("tv series") || t.includes("binge")) return "/search?q=TV+Series";
  if (t.includes("reality")) return "/search?q=Reality";
  if (t.includes("kids") || t.includes("family") || t.includes("cartoon")) return "/search?genres=10751";
  if (t.includes("now playing")) return "/search?q=Now+Playing";
  if (t.includes("top rated") || t.includes("fan favorites")) return "/search?q=Top+Rated";
  if (t.includes("upcoming")) return "/search?q=Upcoming";
  
  const cleaned = title.replace(/[^\w\s]/gi, '').trim();
  return `/search?q=${encodeURIComponent(cleaned || "Popular")}`;
}

export default function MovieCarousel({ title, movies }: { title: string, movies: any[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative group/carousel mb-8 md:mb-12 content-auto">
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#F5C518] to-amber-600 shadow-[0_0_12px_rgba(245,197,24,0.6)]" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            {title}
          </h2>
        </div>
        <Link 
          href={getExploreHref(title)}
          className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-[#F5C518] group-hover/carousel:text-[#F5C518] transition-colors cursor-pointer select-none bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-full border border-white/5 hover:border-[#F5C518]/30 backdrop-blur-md"
        >
          <span>Explore All</span>
          <ChevronRight className="w-3.5 h-3.5 transform group-hover/carousel:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      
      <button 
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="hidden md:flex absolute left-2 md:left-3 top-[55%] -translate-y-1/2 z-40 bg-black/85 hover:bg-[#F5C518] text-white hover:text-black w-11 h-11 md:w-12 md:h-12 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.85)] border border-white/20 hover:border-transparent hover:scale-110 active:scale-95 backdrop-blur-md cursor-pointer pointer-events-auto"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button 
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="hidden md:flex absolute right-2 md:right-3 top-[55%] -translate-y-1/2 z-40 bg-black/85 hover:bg-[#F5C518] text-white hover:text-black w-11 h-11 md:w-12 md:h-12 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.85)] border border-white/20 hover:border-transparent hover:scale-110 active:scale-95 backdrop-blur-md cursor-pointer pointer-events-auto"
      >
        <ChevronRight className="w-6 h-6 stroke-[2.5]" />
      </button>

      <div 
        ref={carouselRef}
        className="flex space-x-3 sm:space-x-4 overflow-x-auto py-2 md:pt-20 md:pb-16 md:-mt-12 scrollbar-hide snap-x px-2 smooth-scroll-x"
      >
        {movies.map((movie: any, idx: number) => (
          <div key={movie.id} className="w-36 sm:w-44 md:w-48 lg:w-56 flex-shrink-0 snap-start">
            <MovieCard movie={movie} index={idx} />
          </div>
        ))}
      </div>
    </section>
  );
}