"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Play, ShieldCheck, Film } from "lucide-react";
import Link from "next/link";

export default function CinematicScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track vertical scroll progress within the 350vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Typography transformations (fade out as scroll begins)
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.35], [1, 0.5, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
  
  // 3D Dashboard/Cinema Screen transformations
  const screenScale = useTransform(scrollYProgress, [0, 0.3, 0.75], [0.82, 1, 1.15]);
  const screenOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.9], [0.4, 1, 0.9]);
  const screenRotateX = useTransform(scrollYProgress, [0, 0.3], [12, 0]);
  const screenY = useTransform(scrollYProgress, [0, 0.3, 0.8], [80, 0, -40]);
  
  // Floating badges animations around the screen
  const badge1Y = useTransform(scrollYProgress, [0.15, 0.45], [40, 0]);
  const badge1Opacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  
  const badge2Y = useTransform(scrollYProgress, [0.25, 0.55], [40, 0]);
  const badge2Opacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);

  // Final Callout banner that slides up near the end of the scroll container
  const featureY = useTransform(scrollYProgress, [0.65, 0.85, 1], [100, 0, -20]);
  const featureOpacity = useTransform(scrollYProgress, [0.65, 0.82, 1], [0, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[350vh] bg-[#0a0a0a] font-sans">
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[1200px]">
        
        {/* Background Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_80%)] pointer-events-none z-10" />

        {/* 1. Stage 1: Initial Hero Typography */}
        <motion.div 
          style={{ opacity: textOpacity, scale: textScale, y: textY }}
          className="absolute z-30 flex flex-col items-center text-center px-4 max-w-5xl pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F5C518]/20 to-amber-500/10 border border-[#F5C518]/40 text-[#F5C518] text-xs md:text-sm font-extrabold uppercase tracking-widest mb-6 shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Introducing MoviezWiki V2.0</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-6 leading-[0.95] drop-shadow-2xl">
            BEYOND <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] via-amber-300 to-yellow-500">
              STREAMING.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-neutral-300 max-w-2xl font-light leading-relaxed mb-8 drop-shadow-md">
            Scroll down to immerse yourself in an AI-assisted entertainment ecosystem built for true cinephiles.
          </p>

          <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold uppercase tracking-widest animate-bounce mt-4">
            <span>Scroll to explore</span>
            <span>↓</span>
          </div>
        </motion.div>

        {/* 2. Stage 2: 3D Parallax Screen Showcase */}
        <motion.div 
          style={{ 
            scale: screenScale, 
            opacity: screenOpacity, 
            rotateX: screenRotateX, 
            y: screenY,
            transformStyle: "preserve-3d" 
          }}
          className="absolute z-20 w-full max-w-6xl px-4 md:px-8 flex items-center justify-center"
        >
          <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900/90 border-2 border-neutral-700/80 shadow-[0_0_120px_rgba(245,197,24,0.15),0_20px_60px_rgba(0,0,0,0.9)] transition-all duration-700">
            {/* Glossy Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.1] z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />

            {/* High-res Cinema/Interface Visual */}
            <img 
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop" 
              alt="MoviezWiki Cinematic Interface" 
              className="w-full h-full object-cover filter contrast-110 brightness-95 scale-105"
            />

            {/* Simulated Floating App Overlay Elements */}
            <div className="absolute bottom-6 left-6 right-6 z-30 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pointer-events-auto">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#F5C518] text-black font-extrabold text-[10px] uppercase tracking-wider">
                    Featured Masterpiece
                  </span>
                  <span className="text-white text-xs font-bold">4K Ultra HD • Atmos</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
                  Global Cinema Archives
                </h3>
                <p className="text-xs md:text-sm text-neutral-300 max-w-xl line-clamp-2">
                  Experience instantaneous trailer playback, deep net-worth valuations of leading worldwide talent, and personalized watchlist synchronization.
                </p>
              </div>

              <Link 
                href="/" 
                className="shrink-0 bg-[#F5C518] hover:bg-yellow-400 text-black font-black text-xs md:text-sm py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(245,197,24,0.4)] flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Launch Interactive Hub</span>
              </Link>
            </div>
          </div>

          {/* Floating UI Badge 1 (Left Wing) */}
          <motion.div 
            style={{ y: badge1Y, opacity: badge1Opacity }}
            className="hidden lg:flex absolute -left-4 top-1/4 z-40 bg-neutral-900/90 border border-neutral-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl items-center gap-3.5 max-w-[240px]"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">AI Powered</div>
              <div className="text-xs font-black text-white">Spoiler-Free Summaries in <span className="text-[#F5C518]">200ms</span></div>
            </div>
          </motion.div>

          {/* Floating UI Badge 2 (Right Wing) */}
          <motion.div 
            style={{ y: badge2Y, opacity: badge2Opacity }}
            className="hidden lg:flex absolute -right-4 bottom-1/3 z-40 bg-neutral-900/90 border border-neutral-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl items-center gap-3.5 max-w-[240px]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-[#F5C518]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Global Coverage</div>
              <div className="text-xs font-black text-white">50+ Country Top 10 Regional Rankings</div>
            </div>
          </motion.div>
        </motion.div>

        {/* 3. Stage 3: Feature Highlight that transitions into the next section */}
        <motion.div 
          style={{ y: featureY, opacity: featureOpacity }}
          className="absolute z-40 bottom-12 flex flex-col items-center text-center w-full px-6 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-neutral-900/95 via-black/95 to-neutral-900/95 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl border border-neutral-800/80 max-w-3xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col md:flex-row items-center gap-6 text-left pointer-events-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#F5C518]/20 border border-[#F5C518]/40 flex items-center justify-center shrink-0 text-[#F5C518] shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5C518]">Next-Gen Intelligence</span>
              <h3 className="text-xl md:text-2xl font-black text-white">No More Spoilers. No More Clutter.</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                We harnessed Google's Gemini AI to analyze millions of movie plotlines. Read insightful thematic evaluations without ever risking ruining the ending.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}