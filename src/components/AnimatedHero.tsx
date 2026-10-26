"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, Star, ShieldCheck, Flame } from "lucide-react";
import HeroButtons from "./HeroButtons";
import { getGenreNames } from "@/lib/genres";

const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";
const THUMB_BASE_URL = "https://image.tmdb.org/t/p/w185";

export default function AnimatedHero({ movies, badgeText = "Trending Worldwide" }: { movies: any[], badgeText?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Preload upcoming backdrops so transitions are instant
  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    const nextIndex = (activeIndex + 1) % movies.length;
    const nextMovie = movies[nextIndex];
    if (nextMovie?.backdrop_path) {
      const img = new Image();
      img.src = `${BACKDROP_BASE_URL}${nextMovie.backdrop_path}`;
    }
  }, [activeIndex, movies]);

  useEffect(() => {
    if (!movies || movies.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % movies.length);
    }, 8000); // 8 seconds per slide
    return () => clearInterval(interval);
  }, [movies, isPaused]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[activeIndex];
  const rating = currentMovie.vote_average ? currentMovie.vote_average.toFixed(1) : "8.2";
  const releaseYear = (currentMovie.release_date || currentMovie.first_air_date)?.slice(0, 4) || "2026";
  const isSeries = currentMovie.name && !currentMovie.title;

  return (
    <section className="relative min-h-[82vh] md:min-h-[92vh] flex items-center justify-start text-left overflow-hidden bg-[#050505]">
      
      {/* Background Images Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0 transform-gpu"
          style={{ willChange: "opacity" }}
        >
          <img 
            src={`${BACKDROP_BASE_URL}${currentMovie.backdrop_path}`}
            alt={currentMovie.title || currentMovie.name}
            className="w-full h-full object-cover opacity-60 md:opacity-65 pointer-events-none select-none object-center"
            decoding="async"
            fetchPriority={activeIndex === 0 ? "high" : "auto"}
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Vignettes & Apple TV+ Style Deep Mask Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 via-40% to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 via-50% to-transparent z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(245,197,24,0.12),_transparent_60%)] z-10 pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col items-start px-4 sm:px-8 md:px-16 max-w-4xl pt-24 pb-28 md:py-28 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full space-y-4 md:space-y-5"
          >
            {/* Top Trending Badge & Rating Strip */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#F5C518]/20 to-amber-500/10 backdrop-blur-xl border border-[#F5C518]/40 shadow-[0_0_15px_rgba(245,197,24,0.2)]">
                <Flame className="w-3.5 h-3.5 text-[#F5C518] fill-[#F5C518]" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#F5C518]">
                  #{activeIndex + 1} {badgeText}
                </span>
              </div>

              {/* Rating Pill */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-sm">
                <Star className="w-3.5 h-3.5 text-[#F5C518] fill-[#F5C518]" />
                <span>{rating}</span>
                <span className="text-white/40 text-[10px]">/ 10</span>
              </div>

              {/* Release Year & Quality Tags */}
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider text-neutral-300 border border-white/15 bg-white/5 backdrop-blur-sm uppercase">
                {releaseYear}
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-black tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm">
                4K UHD
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider text-neutral-400 border border-white/10 bg-white/5 backdrop-blur-sm uppercase">
                {isSeries ? "Original Series" : "Cinema Release"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] leading-[1.08] line-clamp-2 md:line-clamp-3 max-w-3xl">
              {currentMovie.title || currentMovie.name}
            </h1>

            {/* Genres */}
            {currentMovie.genre_ids && (
              <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1">
                {getGenreNames(currentMovie.genre_ids).slice(0, 4).map((genre, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs font-semibold text-neutral-300 border border-white/10 bg-black/40 backdrop-blur-md rounded-full px-3 py-1 flex items-center shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] mr-2 opacity-80" />
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-sm sm:text-base md:text-lg text-neutral-300/90 max-w-2xl line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow-md font-normal">
              {currentMovie.overview}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 md:pt-4">
              <HeroButtons movie={currentMovie} onInteractionChange={(interacting) => setIsPaused(interacting)} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Glass Thumbnail Switcher Dock (Desktop & Tablet) */}
      <div className="absolute z-30 bottom-8 right-6 lg:right-16 hidden md:flex items-center gap-2.5 bg-black/50 backdrop-blur-2xl p-2 rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        {movies.map((m, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={m.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative group w-14 lg:w-16 h-20 rounded-xl overflow-hidden transition-all duration-300 border text-left cursor-pointer ${
                isActive 
                  ? 'border-[#F5C518] shadow-[0_0_20px_rgba(245,197,24,0.45)] scale-105' 
                  : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
              }`}
              title={m.title || m.name}
            >
              <img 
                src={`${THUMB_BASE_URL}${m.poster_path}`} 
                alt={m.title || m.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-1 left-1.5">
                <span className="text-[10px] font-black text-white drop-shadow">0{idx + 1}</span>
              </div>
              
              {/* Active Timer Progress Line */}
              {isActive && !isPaused && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
                  <div 
                    key={`progress-${activeIndex}`}
                    className="h-full bg-[#F5C518] rounded-full animate-hero-progress"
                  />
                </div>
              )}
            </button>
          );
        })}

        {/* Quick Stepper Chevrons */}
        <div className="flex flex-col gap-1 pl-1 border-l border-white/10">
          <button 
            onClick={() => setActiveIndex(prev => prev === 0 ? movies.length - 1 : prev - 1)}
            aria-label="Previous Slide"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#F5C518] hover:text-black text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setActiveIndex(prev => (prev + 1) % movies.length)}
            aria-label="Next Slide"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#F5C518] hover:text-black text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Stepper Controls */}
      <div className="absolute z-30 flex items-center gap-2 bottom-4 right-4 md:hidden bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        <span className="text-xs font-black text-[#F5C518]">#{activeIndex + 1}</span>
        <span className="text-xs text-white/40">/ {movies.length}</span>
        <button 
          onClick={() => setActiveIndex(prev => prev === 0 ? movies.length - 1 : prev - 1)}
          className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center active:bg-[#F5C518] active:text-black"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setActiveIndex(prev => (prev + 1) % movies.length)}
          className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center active:bg-[#F5C518] active:text-black"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
}