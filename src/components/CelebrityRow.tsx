"use client";

import { useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import ActorModal from "./ActorModal";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
};

export default function CelebrityRow({ celebrities, title = "A-List Celebrities" }: { celebrities: any[], title?: string }) {
  const [selectedActorId, setSelectedActorId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!celebrities || celebrities.length === 0) return null;

  return (
    <section className="relative w-full content-auto group/carousel">
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#F5C518] to-amber-600 shadow-[0_0_12px_rgba(245,197,24,0.6)]" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            {title}
          </h2>
        </div>
        <span className="text-xs font-bold text-[#F5C518] uppercase tracking-wider bg-[#F5C518]/10 px-3.5 py-1 rounded-full border border-[#F5C518]/30 flex items-center gap-1.5 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Trending Weekly
        </span>
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

      <motion.div 
        ref={carouselRef}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "100px" }}
        className="flex space-x-4 md:space-x-5 overflow-x-auto pb-6 md:pb-8 scrollbar-hide snap-x px-2 smooth-scroll-x"
      >
        {celebrities.slice(0, 12).map((person: any, idx: number) => (
          <motion.div 
            key={person.id} 
            variants={item}
            onClick={() => setSelectedActorId(person.id)}
            className="relative flex-shrink-0 snap-start w-36 sm:w-44 lg:w-48 aspect-[3/4] rounded-3xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#F5C518]/70 shadow-2xl transition-all duration-300 hover:scale-[1.03] bg-gradient-to-b from-neutral-900 via-neutral-950 to-black"
          >
            <img 
              src={person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : 'https://via.placeholder.com/300x450'} 
              alt={person.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
              decoding="async"
            />
            
            {/* VIP Starlight Top Pill */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-bold text-amber-300 shadow-md">
              <span className="text-[#F5C518]">★</span>
              <span>#{idx + 1} ICON</span>
            </div>

            {/* Cinematic Gradient Fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:from-black/95 transition-all duration-300" />
            
            <div className="absolute bottom-0 left-0 w-full p-3.5 md:p-4 transform translate-y-0.5 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white font-black text-sm md:text-base truncate drop-shadow-md group-hover:text-[#F5C518] transition-colors">
                {person.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-neutral-400 font-medium">
                  {person.known_for_department || "Star"}
                </span>
                {person.popularity && (
                  <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                    🔥 {Math.round(person.popularity)} pts
                  </span>
                )}
              </div>
              <div className="w-8 h-0.5 bg-[#F5C518] mt-2 group-hover:w-full transition-all duration-500 ease-out rounded-full" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {selectedActorId && (
        <ActorModal personId={selectedActorId} onClose={() => setSelectedActorId(null)} />
      )}
    </section>
  );
}
