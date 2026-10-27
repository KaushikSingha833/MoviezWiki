"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function CinematicSplashIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState<"initial" | "expand" | "reveal" | "finish">("initial");

  useEffect(() => {
    // Check if user already saw the intro in this session or if forced via query param
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const forceIntro = searchParams.get("intro") === "1";
      const hasSeen = sessionStorage.getItem("mw_splash_intro_played");

      if (hasSeen && !forceIntro) {
        return;
      }
    } catch {
      // Storage fallback
    }

    setIsVisible(true);

    // Timeline Sequence:
    // 0ms - 800ms: Initial monogram 'MW' emerges in deep obsidian black with golden aura
    // 800ms - 2100ms: 'M' glides left & 'W' glides right simultaneously; 'oviez' and 'iki' wipe open with laser slice effect
    // 2100ms - 2900ms: Full MoviezWiki logo shimmers with golden lens sweep & cinematic tagline
    // 2900ms - 3400ms: Smooth cinematic zoom & dissolve into the website
    const timer1 = setTimeout(() => setStage("expand"), 800);
    const timer2 = setTimeout(() => setStage("reveal"), 1900);
    const timer3 = setTimeout(() => handleComplete(), 3300);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        handleComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleComplete = () => {
    try {
      sessionStorage.setItem("mw_splash_intro_played", "true");
    } catch {
      // Storage fallback
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cinematic-splash"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.08,
            filter: "blur(12px)",
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[99999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
          onClick={handleComplete}
        >
          {/* Subtle Ambient Radial Golden Nebula in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ 
                scale: stage === "reveal" ? 1.5 : stage === "expand" ? 1.2 : 0.9, 
                opacity: stage === "reveal" ? 0.35 : 0.2 
              }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="w-[28rem] sm:w-[48rem] h-[28rem] sm:h-[48rem] rounded-full bg-gradient-to-tr from-[#F5C518]/30 via-amber-500/15 to-transparent blur-[140px]"
            />
          </div>

          {/* Floating Golden Stardust Particles (Embers) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: `${(i * 7) % 100}vw`, 
                  y: `${60 + ((i * 13) % 40)}vh`, 
                  opacity: 0,
                  scale: (i % 3) * 0.4 + 0.6
                }}
                animate={{ 
                  y: `${10 + ((i * 9) % 30)}vh`, 
                  opacity: [0, 0.6, 0],
                  scale: [0.6, 1.2, 0.4]
                }}
                transition={{ 
                  duration: 3 + (i % 3) * 0.8, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: (i * 0.15) 
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-[#F5C518] shadow-[0_0_8px_#F5C518] blur-[0.5px]"
              />
            ))}
          </div>

          {/* Top Right Skip Button */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.75, y: 0 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all tracking-wider shadow-lg"
          >
            <span>Skip Intro</span>
            <span className="text-[10px] text-[#F5C518]">✕</span>
          </motion.button>

          {/* Central Logo Container */}
          <div className="relative flex flex-col items-center justify-center px-4">
            
            {/* Monogram to Full Title Expanding Container */}
            <div className="relative flex items-center justify-center overflow-visible">
              
              {/* LEFT HALF: 'M' moving left, wiping open 'oviez' */}
              <motion.div
                initial={{ x: 45 }}
                animate={{ 
                  x: stage === "expand" || stage === "reveal" ? -10 : 45 
                }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline"
              >
                {/* Initial 'M' - Royal 3D Gold */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.6, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-[#F5C518] to-yellow-600 drop-shadow-[0_12px_28px_rgba(245,197,24,0.45)] whitespace-nowrap select-none"
                >
                  M
                </motion.span>

                {/* Inner letters 'oviez' revealed with wipe container */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ 
                    width: stage === "expand" || stage === "reveal" ? "auto" : 0,
                    opacity: stage === "expand" || stage === "reveal" ? 1 : 0 
                  }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  className="overflow-hidden flex items-baseline relative"
                >
                  <span className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white pl-0.5 sm:pl-1 drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)] whitespace-nowrap select-none">
                    oviez
                  </span>

                  {/* Vertical Golden Laser Wipe Slit tracking expansion */}
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ 
                      opacity: stage === "reveal" ? 0 : 1 
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#F5C518] to-transparent shadow-[0_0_12px_#F5C518]"
                  />
                </motion.div>
              </motion.div>

              {/* RIGHT HALF: 'W' moving right, wiping open 'iki' */}
              <motion.div
                initial={{ x: -45 }}
                animate={{ 
                  x: stage === "expand" || stage === "reveal" ? 15 : -45 
                }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline ml-1 sm:ml-2"
              >
                {/* Initial 'W' - Royal 3D Gold */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.6, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-[#F5C518] to-yellow-600 drop-shadow-[0_12px_28px_rgba(245,197,24,0.45)] whitespace-nowrap select-none"
                >
                  W
                </motion.span>

                {/* Inner letters 'iki' revealed with wipe container */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ 
                    width: stage === "expand" || stage === "reveal" ? "auto" : 0,
                    opacity: stage === "expand" || stage === "reveal" ? 1 : 0 
                  }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="overflow-hidden flex items-baseline relative"
                >
                  <span className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white pl-0.5 sm:pl-1 drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)] whitespace-nowrap select-none">
                    iki
                  </span>

                  {/* Vertical Golden Laser Wipe Slit tracking expansion */}
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ 
                      opacity: stage === "reveal" ? 0 : 1 
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#F5C518] to-transparent shadow-[0_0_12px_#F5C518]"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Horizontal Golden Laser Wipe Beam Sweeping Underneath */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: stage === "expand" ? 1 : stage === "reveal" ? 1.3 : 0,
                opacity: stage === "expand" || stage === "reveal" ? [0, 1, 0.85] : 0 
              }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
              className="w-56 sm:w-96 h-[2px] bg-gradient-to-r from-transparent via-[#F5C518] to-transparent mt-3 sm:mt-4 shadow-[0_0_18px_#F5C518]"
            />

            {/* Prestige Tagline & Badging */}
            <motion.div
              initial={{ opacity: 0, y: 16, letterSpacing: "0.25em" }}
              animate={{ 
                opacity: stage === "reveal" ? 1 : 0, 
                y: stage === "reveal" ? 0 : 16,
                letterSpacing: stage === "reveal" ? "0.4em" : "0.25em"
              }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="mt-4 sm:mt-5 flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase text-neutral-400 pl-1 select-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5C518] animate-pulse" />
              <span className="text-neutral-300">Cinematic Universe</span>
              <span className="w-1 h-1 rounded-full bg-[#F5C518]" />
              <span className="text-[#F5C518] font-bold">AI Intelligence</span>
            </motion.div>
          </div>

          {/* Bottom Prompt / Key Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ delay: 2.1, duration: 0.6 }}
            className="absolute bottom-8 text-[11px] font-medium text-neutral-500 tracking-wider flex items-center gap-2"
          >
            <span>Click or press ESC to enter</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
