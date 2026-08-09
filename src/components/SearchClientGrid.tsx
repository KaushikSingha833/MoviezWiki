"use client";

import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { Ghost, SearchX, Filter } from "lucide-react";
import MovieCard from "./MovieCard";
import PersonCard from "./PersonCard";
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
  const [selectedFilters, setSelectedFilters] = useState<(number | string)[]>(initialGenres);
  
  // Synthesize both media genres and person professions into a unified filter pill system
  const availableFilters = useMemo(() => {
    const genreIds = new Set<number>();
    const professions = new Set<string>();
    
    results.forEach(item => {
      if (item.media_type === 'person' && item.known_for_department) {
        professions.add(item.known_for_department);
      } else if (Array.isArray(item.genre_ids)) {
        item.genre_ids.forEach((id: number) => genreIds.add(id));
      }
    });

    const parsedGenres = Array.from(genreIds)
      .filter(id => GENRE_MAP[id])
      .map(id => ({ id, name: GENRE_MAP[id], type: 'genre' }))
      .sort((a, b) => a.name.localeCompare(b.name));
      
    const parsedProfessions = Array.from(professions)
      .map(dept => ({ id: dept, name: dept, type: 'profession' }))
      .sort((a,b) => a.name.localeCompare(b.name));

    return [...parsedProfessions, ...parsedGenres];
  }, [results]);

  const toggleFilter = (id: number | string) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter(f => f !== id));
    } else {
      setSelectedFilters([...selectedFilters, id]);
    }
  };

  const filteredResults = useMemo(() => {
    if (selectedFilters.length === 0) return results;
    
    const selectedGenres = selectedFilters.filter(f => typeof f === 'number') as number[];
    const selectedProfessions = selectedFilters.filter(f => typeof f === 'string') as string[];
    
    return results.filter(item => {
      if (item.media_type === 'person') {
        // Person check
        if (selectedProfessions.length === 0) return false; // If only movie genres selected, hide people
        return selectedProfessions.includes(item.known_for_department);
      } else {
        // Media check
        if (selectedGenres.length === 0) return false; // If only professions selected, hide movies
        if (!Array.isArray(item.genre_ids)) return false;
        return selectedGenres.every(gId => item.genre_ids.includes(gId));
      }
    });
  }, [results, selectedFilters]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Dynamic Multi-Facet Filter System */}
      {availableFilters.length > 0 && (
        <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-4 md:p-6 shadow-xl mb-4">
          <div className="flex items-center gap-3 mb-4 text-white">
            <Filter className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-black tracking-tight">Refine by Genre or Profession</h3>
            {selectedFilters.length > 0 && (
              <span className="text-xs bg-[#F5C518] text-black font-bold px-2 py-0.5 rounded-full ml-auto">
                {selectedFilters.length} Active
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3">
            {availableFilters.map(f => {
              const isActive = selectedFilters.includes(f.id);
              const isProf = typeof f.id === 'string';
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    isActive 
                      ? isProf 
                        ? "bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)] scale-105" 
                        : "bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] scale-105" 
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white"
                  }`}
                >
                  {f.name}
                  {isActive && <span className="ml-2 bg-black/30 rounded-full px-1.5 py-0.5">✕</span>}
                </button>
              );
            })}
          </div>
          
          {selectedFilters.length > 0 && (
             <button 
               onClick={() => setSelectedFilters([])}
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
              {item.media_type === 'person' ? (
                <PersonCard person={item} />
              ) : (
                <MovieCard movie={item} />
              )}
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
            onClick={() => setSelectedFilters([])} 
            className="group flex items-center gap-3 bg-white text-black font-black py-4 px-10 rounded-full hover:bg-neutral-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] relative z-10"
          >
            Clear Active Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
