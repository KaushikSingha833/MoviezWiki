"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import HeroButtons from "./HeroButtons";
import { getGenreNames } from "@/lib/genres";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function AnimatedHero({ movies }: { movies: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % movies.length);
    }, 8000); // 8 seconds per slide
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[activeIndex];

  return (
    <section className="relative h-[75vh] md:h-[90vh] flex items-center justify-start text-left overflow-hidden border-b border-neutral-900 bg-black">
      
      {/* Background Images Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={`${BACKDROP_BASE_URL}${currentMovie.backdrop_path}`}
            alt={currentMovie.title || currentMovie.name}
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>
      </AnimatePresence>

      {/* Aesthetic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent z-10" />

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col items-start space-y-5 px-4 sm:px-8 md:px-16 max-w-4xl mt-12 md:mt-24 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full space-y-4"
          >
            {/* Top Trending Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212]/80 backdrop-blur-md border border-[#F5C518]/30 shadow-lg">
              <Sparkles className="w-4 h-4 text-[#F5C518]" />
              <span className="text-xs font-black uppercase tracking-widest text-white">
                #{activeIndex + 1} Trending Worldwide
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl leading-[0.9]">
              {currentMovie.title || currentMovie.name}
            </h1>

            {/* Genres */}
            {currentMovie.genre_ids && (
              <div className="flex flex-wrap gap-2 pt-2">
                {getGenreNames(currentMovie.genre_ids).map((genre, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs md:text-sm font-bold text-neutral-300 border border-neutral-700 bg-neutral-900/50 rounded flex items-center px-2 py-0.5"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-2xl line-clamp-3 leading-relaxed drop-shadow-md">
              {currentMovie.overview}
            </p>

            {/* Buttons */}
            <div className="pt-4">
              <HeroButtons movie={currentMovie} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Carousel Controls */}
      <div className="absolute z-20 bottom-8 right-4 sm:right-8 md:right-16 flex gap-3">
        <button 
          onClick={() => setActiveIndex(prev => prev === 0 ? movies.length - 1 : prev - 1)}
          className="w-12 h-12 rounded-full border border-neutral-700 bg-black/50 hover:bg-[#F5C518] hover:text-black hover:border-transparent text-white transition-all flex items-center justify-center backdrop-blur-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveIndex(prev => (prev + 1) % movies.length)}
          className="w-12 h-12 rounded-full border border-neutral-700 bg-black/50 hover:bg-[#F5C518] hover:text-black hover:border-transparent text-white transition-all flex items-center justify-center backdrop-blur-md"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center opacity-50 animate-bounce">
        <div className="w-0.5 h-12 bg-gradient-to-b from-transparent via-[#F5C518] to-transparent rounded-full" />
      </div>

    </section>
  );
}