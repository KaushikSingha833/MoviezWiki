"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const ANIMATED_WORDS = ["CINEMATIC", "DYNAMIC", "IMMERSIVE", "BEAUTIFUL"];

export default function CinematicScroll() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ANIMATED_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-[#070709] overflow-hidden flex flex-col items-center justify-center pt-24 pb-12 sm:pt-32">
      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[clamp(5rem,20vw,25rem)] font-black text-white/[0.02] tracking-tighter leading-none whitespace-nowrap">
          MOVIEZWIKI
        </h1>
      </div>

      {/* Main Application Window */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-[95%] max-w-7xl relative z-10 flex flex-col rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 mx-auto"
      >
        
        {/* Dark Top Navigation Bar Empty per user request, keeping structural layout */}
        <div className="bg-black/90 backdrop-blur-xl px-1 sm:px-6 py-4 flex items-center justify-between z-20 sticky top-0 border-b border-white/10 relative h-12">
          
          {/* Logo / Title area inside Window */}
          <div className="flex-1">
             <div className="bg-[#1a1a1a] inline-block px-5 py-2.5 rounded-t-2xl rounded-br-2xl absolute -bottom-[1px] left-0 border-r border-t border-white/5">
                <span className="text-[#F5C518] font-black text-sm tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F5C518]" />
                  Neural Synthesis
                </span>
             </div>
          </div>
        </div>

        {/* Yellow/Black Theme Inner Panel Body */}
        <div className="bg-[#0f0f12] w-full relative overflow-hidden pt-12 pb-6 px-6 sm:px-12 md:px-20 min-h-[650px] flex flex-col">
          
          {/* Massive Display Title with Auto Typography */}
          <div className="max-w-3xl relative z-10 space-y-2 mt-4 sm:mt-10 h-40 sm:h-56">
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black text-white leading-[1] tracking-tighter uppercase drop-shadow-md">
              CREATION OF <br />
              <div className="h-[1.1em] overflow-hidden relative">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={wordIndex}
                    initial={{ y: 80, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -80, opacity: 0, rotateX: 90 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] via-amber-400 to-amber-600"
                    style={{ transformOrigin: "bottom" }}
                  >
                    {ANIMATED_WORDS[wordIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
              MASTERPIECES
            </h2>
          </div>

          {/* Floating Layout Area */}
          <div className="mt-8 sm:mt-12 w-full relative z-10 flex flex-col md:flex-row gap-6 items-end justify-between">
            
            {/* Bottom Left Large Poster */}
            <motion.div 
              initial={{ opacity: 0, x: -30, rotate: -5 }} animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="w-full md:w-[45%] h-64 sm:h-96 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative border border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop" 
                alt="Cyberpunk Aesthetic" 
                className="w-full h-full object-cover object-center" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </motion.div>

            {/* Middle Badge - Spinning */}
            <div className="absolute top-[-40px] md:top-[-100px] left-[50%] md:left-[55%] -translate-x-1/2 flex items-center justify-center pointer-events-none drop-shadow-2xl z-20">
              <motion.div 
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-[#F5C518]/30 flex items-center justify-center relative bg-black/80 backdrop-blur-md shadow-[0_0_30px_rgba(245,197,24,0.15)]"
              >
                {/* Curved Text SVG Implementation */}
                <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                  <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                  <text className="text-[10px] sm:text-[9.5px] font-black tracking-[0.25em] fill-[#F5C518] uppercase">
                    <textPath href="#circlePath" startOffset="0%">
                      LET'S EXPLORE MORE • LET'S EXPLORE MORE •
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 m-auto w-12 h-12 bg-[#F5C518] rounded-full flex items-center justify-center shadow-lg pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
              </motion.div>
            </div>

            {/* Right Side Stack: Portrait Card + Info Card */}
            <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-6 justify-end items-end">
              
              {/* Portrait Image Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="hidden lg:block w-[40%] h-[400px] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] absolute top-[-300px] right-12 border border-white/10 z-10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop" 
                  alt="Fantasy Architecture" 
                  className="w-full h-full object-cover object-center" 
                />
              </motion.div>

              {/* Bottom Right Info Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="w-full md:w-[80%] bg-[#1a1a1a] rounded-[1.5rem] p-6 sm:p-8 flex flex-col z-20 border border-white/5 shadow-2xl"
              >
                <h3 className="text-sm font-black text-white mb-3">Architecting Semantic Characters</h3>
                <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                  Experience our advanced AI matrix executing deep analysis on vast cinematic universes. Explore dynamic themes without risking any spoilers.
                </p>
                <div className="flex items-center justify-end mt-auto pt-2">
                   <Link 
                     href="/register" 
                     className="group flex items-center justify-between border border-white/10 bg-black rounded-full pl-6 pr-2 py-1.5 gap-4 hover:border-[#F5C518]/50 transition-colors shadow-inner"
                   >
                     <span className="text-xs font-black text-white group-hover:text-[#F5C518] transition-colors">Start Free Trial</span>
                     <div className="w-8 h-8 rounded-full bg-[#F5C518] flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                       <ArrowRight className="w-4 h-4 text-black" />
                     </div>
                   </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}