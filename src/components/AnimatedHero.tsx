"use client";

import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AnimatedHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-neutral-800">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#121212]/80 to-[#121212] z-10" />
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070" 
          alt="Cinematic Background" 
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Animated Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C518]/10 text-[#F5C518] text-sm font-bold tracking-wide mb-6 border border-[#F5C518]/20">
            <Sparkles className="w-4 h-4" />
            V2.0 is Live
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-2xl"
        >
          Your Ultimate <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-yellow-300">
            Cinematic Universe
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-neutral-300 max-w-2xl mb-10 leading-relaxed"
        >
          Discover trending blockbusters, get instant AI-generated summaries, and track the wealthiest celebrities across the globe. Built for true cinephiles.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="flex items-center justify-center gap-2 bg-[#F5C518] text-black font-bold py-4 px-8 rounded-full hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(245,197,24,0.3)]">
            <Play className="w-5 h-5 fill-black" />
            Start Exploring
          </button>
          <Link href="/country" className="flex items-center justify-center gap-2 bg-neutral-800/50 backdrop-blur-md text-white border border-neutral-700 font-bold py-4 px-8 rounded-full hover:bg-neutral-700 hover:text-[#F5C518] transition-all duration-300">
            Browse By Country
          </Link>
        </motion.div>
      </div>
    </section>
  );
}