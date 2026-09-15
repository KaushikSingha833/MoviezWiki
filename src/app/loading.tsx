"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = [
  "Connecting to global servers...",
  "Loading cinematic data...",
  "Rendering high-res posters...",
  "Finalizing premium UI..."
];

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Simulate ultra-fast, realistic percentage loading
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 99) {
          clearInterval(timer);
          return 99; // Hangs at 99% until the page actually loads
        }
        // Random bursts of speed for realism
        const increment = Math.random() * 15 + 2;
        return Math.min(oldProgress + increment, 99);
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  // Cycle phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Deep Background Glows */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#F5C518]/10 rounded-full blur-[150px] pointer-events-none" 
      />

      <div className="relative z-10 w-full max-w-md px-8 flex flex-col items-center">
        
        {/* Giant Percentage Counter */}
        <div className="relative flex justify-center items-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[6rem] md:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-300 to-neutral-800 tracking-tighter leading-none flex items-baseline drop-shadow-2xl"
          >
            {Math.floor(progress)}
            <span className="text-3xl md:text-5xl text-[#F5C518] ml-2">%</span>
          </motion.div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden mb-6 relative shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-white/5">
          {/* Active Fill */}
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F5C518] to-yellow-300 rounded-full shadow-[0_0_15px_rgba(245,197,24,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
          {/* Animated Glow on the leading edge */}
          <motion.div 
            className="absolute top-0 h-full w-10 bg-white blur-sm opacity-60"
            initial={{ left: "0%" }}
            animate={{ left: `calc(${progress}% - 2.5rem)` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>

        {/* Dynamic Status Text */}
        <div className="h-6 relative w-full overflow-hidden flex justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-bold text-neutral-400 tracking-widest uppercase absolute"
            >
              {phrases[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
