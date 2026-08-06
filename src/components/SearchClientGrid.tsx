"use client";

import { motion, Variants } from "framer-motion";
import { Ghost, SearchX } from "lucide-react";
import MovieCard from "./MovieCard";
import Link from "next/link";

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

export default function SearchClientGrid({ results, query }: { results: any[], query: string }) {
  if (results.length > 0) {
    return (
      <motion.div 
        variants={gridContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-12 pb-24"
      >
        {results.map((item: any) => (
          <motion.div key={item.id} variants={cardItem} className="flex-shrink-0">
            <MovieCard movie={item} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Animated Empty Data-State
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center text-center py-28 px-4 bg-[#121215]/80 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden max-w-4xl mx-auto"
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
        The database returned zero exact matches for <span className="text-rose-400 font-bold">"{query}"</span>. Ensure spelling is correct or modify your search parameters.
      </p>
      
      <Link href="/" className="relative z-10">
        <button className="group flex items-center gap-3 bg-white text-black font-black py-4 px-10 rounded-full hover:bg-neutral-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          Clear Query & Return Home
        </button>
      </Link>
    </motion.div>
  );
}
