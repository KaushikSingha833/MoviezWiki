"use client";

import { useRef } from "react";
import { useRecentlyWatched } from "@/hooks/useRecentlyWatched";
import ContinueWatchingCard from "./ContinueWatchingCard";
import { Clock, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function RecentlyWatchedRow() {
  const { recentlyWatched, isLoaded, removeWatchedMedia, clearAllWatched, isLoggedIn } = useRecentlyWatched();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isLoaded || !isLoggedIn || recentlyWatched.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full z-10 group/carousel">
      <div className="flex flex-row items-start md:items-end justify-between mb-6 gap-4">
        <div className="flex items-start md:items-center gap-3">
          <div className="w-1.5 h-8 bg-[#F5C518] rounded-full shadow-[0_0_15px_rgba(245,197,24,0.6)] shrink-0 mt-1 md:mt-0" />
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            Continue Watching <Clock className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 inline-block align-baseline ml-1" />
          </h2>
        </div>
        
        <button
          onClick={clearAllWatched}
          className="text-xs font-bold text-neutral-500 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-800 border border-transparent hover:border-neutral-700 shrink-0 whitespace-nowrap mt-1 md:mt-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <button 
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="hidden md:flex absolute left-2 md:left-3 top-[58%] -translate-y-1/2 z-40 bg-black/85 hover:bg-[#F5C518] text-white hover:text-black w-11 h-11 md:w-12 md:h-12 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.85)] border border-white/20 hover:border-transparent hover:scale-110 active:scale-95 backdrop-blur-md cursor-pointer pointer-events-auto"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button 
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="hidden md:flex absolute right-2 md:right-3 top-[58%] -translate-y-1/2 z-40 bg-black/85 hover:bg-[#F5C518] text-white hover:text-black w-11 h-11 md:w-12 md:h-12 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.85)] border border-white/20 hover:border-transparent hover:scale-110 active:scale-95 backdrop-blur-md cursor-pointer pointer-events-auto"
      >
        <ChevronRight className="w-6 h-6 stroke-[2.5]" />
      </button>

      <div 
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pt-4 -mt-4 pb-8 custom-scrollbar snap-x snap-mandatory smooth-scroll-x"
      >
        {recentlyWatched.map((media, index) => (
          <div key={`${media.type}-${media.id}`} className="snap-start shrink-0">
            <ContinueWatchingCard 
              media={media} 
              index={index}
              onRemove={removeWatchedMedia} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}
