"use client";

import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { Ghost, SearchX, Filter } from "lucide-react";
import MovieCard from "./MovieCard";
import Link from "next/link";
import { GENRE_MAP } from "@/lib/genres";

const gridContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

export default function SearchClientGrid({ results, query, initialGenres = [] }: { results: any[], query: string, initialGenres?: number[] }) {
  const [selectedGenres, setSelectedGenres] = useState<number[]>(initialGenres);
  
  // Create a unique array of genres that actually exist in the current search results
  // This prevents showing filters for genres that aren't even present!
  const availableGenres = useMemo(() => {
    const ids = new Set<number>();
    results.forEach(item => {
      if (Array.isArray(item.genre_ids)) {
        item.genre_ids.forEach((id: number) => ids.add(id));
      }
    });
    return Array.from(ids)
      .filter(id => GENRE_MAP[id])
      .map(id => ({ id, name: GENRE_MAP[id] }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [results]);

  const toggleGenre = (id: number) => {
    if (selectedGenres.includes(id)) {
      setSelectedGenres(selectedGenres.filter(g => g !== id));
    } else {
      setSelectedGenres([...selectedGenres, id]);
    }
  };

  const filteredResults = useMemo(() => {
    if (selectedGenres.length === 0) return results;
    return results.filter(item => {
      if (!Array.isArray(item.genre_ids)) return false;
      // Intersection filter: item must have EVERY selected genre (e.g., Action + Horror)
      return selectedGenres.every(gId => item.genre_ids.includes(gId));
    });
  }, [results, selectedGenres]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Dynamic Multi-Genre Filter System */}
      {availableGenres.length > 0 && (
        <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-4 md:p-6 shadow-xl mb-4">
          <div className="flex items-center gap-3 mb-4 text-white">
            <Filter className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-black tracking-tight">Refine by Genre Intersection</h3>
            {selectedGenres.length > 0 && (
              <span className="text-xs bg-[#F5C518] text-black font-bold px-2 py-0.5 rounded-full ml-auto">
                {selectedGenres.length} Active
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3">
            {availableGenres.map(g => {
              const isActive = selectedGenres.includes(g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => toggleGenre(g.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    isActive 
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] scale-105" 
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white"
                  }`}
                >
                  {g.name}
                  {isActive && <span className="ml-2 bg-black/30 rounded-full px-1.5 py-0.5">✕</span>}
                </button>
              );
            })}
          </div>
          
          {selectedGenres.length > 0 && (
             <button 
               onClick={() => setSelectedGenres([])}
               className="mt-4 text-[#F5C518] text-xs font-bold hover:underline"
             >
               Clear all filters
             </button>
          )}
        </div>
      )}

      {filteredResults.length > 0 ? (
        <motion.div 
          variants={gridContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-12 pb-24"
        >
          {filteredResults.map((item: any, idx: number) => (
            <motion.div key={`${item.id}-${idx}`} variants={cardItem} className="flex-shrink-0">
              <MovieCard movie={item} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center py-28 px-4 bg-[#121215]/80 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden max-w-4xl mx-auto w-full"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]" />
          </div>

          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 mb-8"
          >
            <Ghost className="w-24 h-24 text-neutral-800 drop-shadow-2xl" />
            <div className="absolute -bottom-2 -right-2 p-2 bg-black rounded-full border border-neutral-800 shadow-xl">
              <SearchX className="w-6 h-6 text-rose-500" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 relative z-10 tracking-tight">
            Data Not Found
          </h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-lg relative z-10">
            The database returned zero exact matches for those specific genres or parameters. Try adjusting your filters.
          </p>
          
          <button 
            onClick={() => setSelectedGenres([])} 
            className="group flex items-center gap-3 bg-white text-black font-black py-4 px-10 rounded-full hover:bg-neutral-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] relative z-10"
          >
            Clear Active Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
