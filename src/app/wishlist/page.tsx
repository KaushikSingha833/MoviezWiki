"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Heart, Lock, Sparkles, FolderHeart, ArrowRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { useWishlist } from "@/context/WishlistContext";

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

export default function WishlistPage() {
  const { wishlist, user } = useWishlist();

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden">
      
      {/* Premium Dashboard Header */}
      <header className="relative w-full pt-32 pb-16 px-6 lg:px-12 border-b border-neutral-900 overflow-hidden">
        {/* Aesthetic Background Accents */}
        <div className="absolute top-0 left-[20%] w-96 h-96 bg-[#F5C518]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-[10%] w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
              <FolderHeart className="w-4 h-4 text-[#F5C518]" />
              <span className="text-xs font-bold tracking-widest uppercase text-neutral-300">
                Personal Collection
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-2">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-yellow-500">Wishlist</span>
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-medium max-w-xl">
              Your curated cinematic library. Titles you save across the ecosystem synchronize here automatically.
            </p>
          </div>
          
          {user && wishlist.length > 0 && (
            <div className="flex flex-col items-start md:items-end p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-sm min-w-[200px]">
              <span className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">
                Total Saved
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{wishlist.length}</span>
                <span className="text-sm font-bold text-[#F5C518]">TITLES</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-12 md:py-20 min-h-[60vh]">
        
        {!user ? (
          
          /* Logged Out / Lock Screen State */
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center py-24 px-4 bg-gradient-to-b from-neutral-900/50 to-black rounded-[3rem] border border-neutral-800/80 shadow-2xl relative overflow-hidden"
          >
            {/* Lock Modal Aura */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-[#F5C518]/10 rounded-full blur-[80px] animate-pulse" />
            </div>

            <div className="w-20 h-20 bg-black border border-neutral-800 rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10">
              <Lock className="w-8 h-8 text-[#F5C518]" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
              Authentication Required
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-md relative z-10">
              Your cinematic library is encrypted. Connect your account to sync your watchlist across the globe.
            </p>
            
            <Link href="/login" className="relative z-10">
              <button className="group flex items-center gap-3 bg-white text-black font-black py-4 px-10 rounded-full hover:bg-neutral-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                Secure Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

        ) : wishlist.length > 0 ? (
          
          /* Grid View State */
          <motion.div 
            variants={gridContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-12 pb-24"
          >
            {wishlist.map((movie: any) => (
              <motion.div key={movie.id} variants={cardItem} className="flex-shrink-0">
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </motion.div>

        ) : (
          
          /* Empty Zero-State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center py-28 px-4 bg-[#121215]/80 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden"
          >
            {/* Floating Particles/Aura */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 bg-rose-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div 
              animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 mb-8"
            >
              <Heart className="w-24 h-24 text-neutral-800 drop-shadow-2xl" />
              <div className="absolute top-0 right-0 p-2 bg-black rounded-full border border-neutral-800">
                <Sparkles className="w-5 h-5 text-rose-500" />
              </div>
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 relative z-10 tracking-tight">
              An Empty Canvas
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-lg relative z-10">
              You haven't saved any masterpieces yet. Explore the global ecosystem and hit the heart icon to start building your library.
            </p>
            
            <Link href="/" className="relative z-10">
              <button className="group flex items-center gap-3 bg-[#F5C518] text-black font-black py-4 px-10 rounded-full hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(245,197,24,0.2)]">
                Explore Top Movies
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

        )}
      </main>
    </div>
  );
}