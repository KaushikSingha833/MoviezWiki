"use client";

import { useRef } from "react";
import MovieCard from "./MovieCard";

export default function MovieCarousel({ title, movies }: { title: string, movies: any[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative group/carousel mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center border-l-4 border-[#F5C518] pl-3 relative z-20">
        {title}
      </h2>
      
      <button 
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-[55%] -translate-y-1/2 -translate-x-1/2 z-30 bg-black/80 hover:bg-[#F5C518] hover:text-black text-white p-3 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all shadow-2xl border border-neutral-700 hover:border-transparent"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button 
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-[55%] -translate-y-1/2 translate-x-1/2 z-30 bg-black/80 hover:bg-[#F5C518] hover:text-black text-white p-3 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all shadow-2xl border border-neutral-700 hover:border-transparent"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div 
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto pt-20 pb-16 -mt-12 scrollbar-hide snap-x px-2"
      >
        {movies.map((movie: any) => (
          <div key={movie.id} className="w-40 md:w-48 lg:w-56 flex-shrink-0 snap-start">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}