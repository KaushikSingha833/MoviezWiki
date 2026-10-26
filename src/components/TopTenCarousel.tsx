"use client";

import { useRef } from "react";
import TopTenCard from "./TopTenCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TopTenCarousel({ items, title, type }: { items: any[], title: string, type: 'movie' | 'tv' }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="mb-8 md:mb-12 relative group/carousel content-auto">
      <h2 className="text-2xl font-bold mb-4 md:mb-8 flex items-center border-l-4 border-[#F5C518] pl-3 mx-4 md:mx-8 relative z-20">
        {title}
      </h2>
      
      <button 
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="hidden md:flex absolute left-2 md:left-4 top-[60%] -translate-y-1/2 z-40 bg-black/85 hover:bg-[#F5C518] text-white hover:text-black w-11 h-11 md:w-12 md:h-12 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.85)] border border-white/20 hover:border-transparent hover:scale-110 active:scale-95 backdrop-blur-md cursor-pointer pointer-events-auto"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button 
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="hidden md:flex absolute right-2 md:right-4 top-[60%] -translate-y-1/2 z-40 bg-black/85 hover:bg-[#F5C518] text-white hover:text-black w-11 h-11 md:w-12 md:h-12 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.85)] border border-white/20 hover:border-transparent hover:scale-110 active:scale-95 backdrop-blur-md cursor-pointer pointer-events-auto"
      >
        <ChevronRight className="w-6 h-6 stroke-[2.5]" />
      </button>

      <div 
        ref={carouselRef}
        className="flex space-x-4 md:space-x-8 overflow-x-auto py-2 md:pt-20 md:pb-16 md:-mt-12 scrollbar-hide snap-x pl-4 md:pl-8 smooth-scroll-x"
      >
        {items.slice(0, 10).map((item, index) => (
          <TopTenCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}