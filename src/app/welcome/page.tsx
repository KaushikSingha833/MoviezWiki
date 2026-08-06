"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView, useMotionTemplate, useMotionValue } from "framer-motion";
import CinematicScroll from "@/components/CinematicScroll";
import { 
  Sparkles, Globe2, Bookmark, MonitorPlay, Zap, ShieldCheck, 
  Film, Trophy, Star, ChevronRight, CheckCircle, Cpu, Layers, Play, Award 
} from "lucide-react";

// =======================================================================
// DATA CONSTANTS (Preserved)
// =======================================================================
const AI_MOVIES_DEMO = [
  {
    id: "inception", title: "Inception", year: "2010", director: "Christopher Nolan",
    genres: ["Sci-Fi", "Action", "Thriller"],
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    aiSummary: "A highly skilled thief who steals valuable secrets from deep within the subconscious during the dream state is offered a chance to regain his old life as payment for a seemingly impossible task: planting an idea into a target's subconscious rather than stealing one.",
    vibe: "Mind-Bending & Layered", cinematographyScore: 99, audienceScore: 97,
    keywords: ["Dream Heist", "Subconscious Architecture", "Totem", "Zero-Gravity Hallway"]
  },
  {
    id: "darkknight", title: "The Dark Knight", year: "2008", director: "Christopher Nolan",
    genres: ["Action", "Crime", "Drama"],
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    aiSummary: "With the help of allies in the police department and district attorney's office, Gotham City's legendary vigilante systematically dismantles remaining organized crime syndicates. However, a chaotic mastermind known only as the Joker emerges to throw the metropolis into anarchy.",
    vibe: "Relentless & Gripping", cinematographyScore: 98, audienceScore: 99,
    keywords: ["Moral Dilemmas", "Chaos vs Order", "High-Stakes Interrogation", "IMAX Spectacle"]
  },
  {
    id: "interstellar", title: "Interstellar", year: "2014", director: "Christopher Nolan",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    aiSummary: "Facing extinction on a resource-depleted Earth, a dedicated former NASA pilot leads an exploratory team through a newly discovered wormhole in search of a habitable future for humanity. Time dilation and cosmic isolation test the unbreakable bonds between a parent and child.",
    vibe: "Awe-Inspiring & Emotional", cinematographyScore: 100, audienceScore: 96,
    keywords: ["Event Horizon", "Time Dilation", "Organ Symphony", "Cosmic Survival"]
  },
  {
    id: "spirited", title: "Spirited Away", year: "2001", director: "Hayao Miyazaki",
    genres: ["Animation", "Family", "Fantasy"],
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop",
    aiSummary: "While moving to a new suburb, a ten-year-old girl and her parents stumble into a seemingly abandoned amusement park that operates as a supernatural resort for spirits and gods. To save her family, she must navigate an extraordinary bathhouse run by a formidable witch.",
    vibe: "Enchanting & Whimsical", cinematographyScore: 98, audienceScore: 98,
    keywords: ["Studio Ghibli", "Supernatural Bathhouse", "Coming of Age", "Hand-Drawn Masterwork"]
  }
];

const REGION_DEMO = [
  {
    id: "IN", country: "India (Bollywood & South)", flag: "🇮🇳", themeColor: "emerald",
    highlight: "Home to the world's highest volume of film production, blending epic musicals, mythological thrillers, and global box office phenomenon.",
    topCeleb: "Shah Rukh Khan", celebNetWorth: "$730 Million",
    recentHits: ["Jawan", "Kalki 2898 AD", "RRR", "Pathaan"],
    description: "Explore regional industries including Hindi, Telugu, Tamil, and Malayalam cinema with deep actor net worth indices and box office records."
  },
  {
    id: "KR", country: "South Korea (K-Cinema)", flag: "🇰🇷", themeColor: "indigo",
    highlight: "A powerhouse of suspense, psychological thrillers, and award-winning dramas that dominate worldwide streaming charts.",
    topCeleb: "Bong Joon-ho / Song Kang-ho", celebNetWorth: "$40+ Million Combined Impact",
    recentHits: ["Parasite", "Squid Game Legacy", "Oldboy", "Decision to Leave"],
    description: "Discover K-Drama ratings and Palme d'Or winners. Track contemporary Korean film royalty and industry valuations."
  },
  {
    id: "US", country: "United States (Hollywood)", flag: "🇺🇸", themeColor: "rose",
    highlight: "The gold standard for IMAX visual effects, superhero franchises, and prestige blockbuster filmmaking.",
    topCeleb: "Tom Cruise / Zendaya", celebNetWorth: "$600+ Million Box Office Kings",
    recentHits: ["Dune: Part Two", "Oppenheimer", "Spider-Verse", "Top Gun: Maverick"],
    description: "Unrivaled real-time updates on Hollywood box office grosses, studio mergers, and theatrical release calendars."
  },
  {
    id: "GB", country: "United Kingdom (British)", flag: "🇬🇧", themeColor: "sky",
    highlight: "Renowned for elite stagecraft, historical epics, espionage thrillers, and world-renowned dramatic acting conservatories.",
    topCeleb: "Daniel Craig / Florence Pugh", celebNetWorth: "$160 Million Icon Index",
    recentHits: ["No Time to Die", "Oppenheimer UK Core", "Banshees of Inisherin"],
    description: "Analyze BAFTA favorites and prestigious British production studio highlights with customized sorting."
  }
];

// =======================================================================
// HELPER COMPONENTS
// =======================================================================
function AnimatedCounter({ from, to, duration = 2.5, prefix = "", suffix = "" }: { from: number, to: number, duration?: number, prefix?: string, suffix?: string }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        const easeProgress = 1 - Math.pow(1 - progress, 5); // Decelerating easeOutQuint
        setCount(Math.floor(easeProgress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{prefix}{count.toLocaleString('en-US')}{suffix}</span>;
}

function HoverSpotlightCard({ children, index }: { children: React.ReactNode, index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      onMouseMove={onMouseMove}
      className="relative p-8 rounded-3xl bg-[#121215] border border-neutral-800/80 hover:border-neutral-600 transition-all duration-500 flex flex-col justify-between group shadow-xl hover:-translate-y-1.5 overflow-hidden cursor-crosshair"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(245, 197, 24, 0.15),
              transparent 80%
            )
          `
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
}

// =======================================================================
// MAIN COMPONENT
// =======================================================================
export default function WelcomeLandingPage() {
  const [selectedMovie, setSelectedMovie] = useState(AI_MOVIES_DEMO[0]);
  const [selectedRegion, setSelectedRegion] = useState(REGION_DEMO[0]);

  return (
    <div className="bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-[#F5C518] selection:text-black min-h-screen">
      
      {/* =======================================================================
          FLOATING GLASSMORPHISM LANDING HEADER
      ======================================================================= */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-6xl z-50 bg-[#121212]/75 border border-neutral-800/60 backdrop-blur-2xl rounded-full px-3 sm:px-6 py-2.5 sm:py-3 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center justify-between transition-all duration-300 hover:border-neutral-600/80">
        <Link href="/" className="inline-flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl md:text-2xl font-black text-[#F5C518] tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 drop-shadow-md">
          <span>🎬</span> <span className="hidden sm:inline">MoviezWiki</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest shrink-0">
          <a href="#ai-demo" className="hover:text-[#F5C518] transition-colors relative group">
            AI Engine
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F5C518] transition-all group-hover:w-full"></span>
          </a>
          <a href="#global-cinema" className="hover:text-[#F5C518] transition-colors relative group">
            Global Charts
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F5C518] transition-all group-hover:w-full"></span>
          </a>
          <a href="#features" className="hover:text-[#F5C518] transition-colors relative group">
            Architecture
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F5C518] transition-all group-hover:w-full"></span>
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link 
            href="/login" 
            className="text-[10px] sm:text-[11px] font-bold text-neutral-300 hover:text-white px-2 sm:px-3.5 py-2 transition-colors hidden sm:inline-block tracking-wider uppercase"
          >
            Log In
          </Link>
          <Link 
            href="/" 
            className="group relative bg-gradient-to-r from-[#F5C518] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black text-[10px] sm:text-xs px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-[0_0_15px_rgba(245,197,24,0.3)] transition-all overflow-hidden flex items-center justify-center whitespace-nowrap"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-white/20 translate-x-[-150%] skew-x-[-15deg] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
            <span className="relative z-10 flex items-center gap-1.5">Launch App <ChevronRight className="w-3.5 h-3.5" /></span>
          </Link>
        </div>
      </header>

      {/* =======================================================================
          SECTION 1: SCROLL-DRIVEN 3D PARALLAX HERO
      ======================================================================= */}
      <CinematicScroll />

      {/* =======================================================================
          SECTION 2: PRO-LEVEL INTERACTIVE AI SHOWCASE (#ai-demo)
      ======================================================================= */}
      <section id="ai-demo" className="relative py-28 px-4 sm:px-6 bg-[#09090b] overflow-hidden border-t border-neutral-800/50">
        <div className="absolute top-1/4 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[160px] pointer-events-none mix-blend-screen" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest shadow-inner">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Interactive AI Demonstration</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
              Spoiler-Free Intelligence. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
                Powered by Advanced AI.
              </span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed px-4 font-medium">
              Hover & select a film below to see how our engine parses plot outlines, emotional undertones, and ratings instantly without ruining act III.
            </p>
          </motion.div>

          {/* Interactive Movie Tabs */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16 px-2">
            {AI_MOVIES_DEMO.map((movie) => {
              const isActive = selectedMovie.id === movie.id;
              return (
                <button
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className={`group relative flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-black text-[11px] sm:text-xs transition-all duration-500 focus:outline-none overflow-hidden ${
                    isActive 
                      ? "text-white scale-105 shadow-[0_15px_40px_rgba(99,102,241,0.4)] border-transparent" 
                      : "bg-[#121215] text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700"
                  }`}
                >
                  {/* Dynamic Active Background with gradient sweep */}
                  {isActive && (
                    <motion.div layoutId="activeTab" className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
                  )}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_2s_infinite]" />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    <Film className={`w-4 h-4 ${isActive ? 'text-[#F5C518]' : 'text-neutral-500 group-hover:text-[#F5C518] transition-colors'}`} />
                    <span className="tracking-wide uppercase">{movie.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Master 3D / Glass Card Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMovie.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative rounded-[2.5rem] bg-[#121215]/80 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 border border-neutral-700/50 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
            >
              {/* Subtle mesh background inside card */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px]" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[80px]" />
              </div>

              {/* 3D Poster Graphic */}
              <motion.div 
                whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="lg:col-span-5 relative h-72 sm:h-[400px] w-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group cursor-pointer perspective-[1000px] z-10"
              >
                <img 
                  src={selectedMovie.poster} 
                  alt={selectedMovie.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                
                <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#F5C518] drop-shadow-md">Directed By</span>
                    <div className="text-white text-lg font-black drop-shadow-lg">{selectedMovie.director}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white flex items-center justify-center font-black text-sm shadow-xl">
                    4K
                  </div>
                </div>
              </motion.div>

              {/* Advanced Breakdowns */}
              <div className="lg:col-span-7 space-y-8 relative z-10">
                <div className="flex flex-col sm:flex-row gap-6 justify-between border-b border-neutral-700/50 pb-6">
                  <div className="space-y-3">
                    <div className="flex items-end gap-3">
                      <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{selectedMovie.title}</h3>
                      <span className="text-xs sm:text-sm font-black px-3 py-1 rounded bg-neutral-800 text-neutral-300 border border-neutral-600 shadow-inner mb-1">
                        {selectedMovie.year}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.genres.map((genre, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-transparent text-[#F5C518] border border-[#F5C518]/30">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 shrink-0">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-neutral-700/50 text-center flex-1 shadow-inner">
                      <div className="text-[9px] uppercase tracking-widest font-black text-neutral-500 mb-1">Cinematography</div>
                      <div className="text-2xl font-black text-emerald-400">{selectedMovie.cinematographyScore}%</div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-neutral-700/50 text-center flex-1 shadow-inner">
                      <div className="text-[9px] uppercase tracking-widest font-black text-neutral-500 mb-1">Acclaim</div>
                      <div className="text-2xl font-black text-[#F5C518]">{selectedMovie.audienceScore}%</div>
                    </div>
                  </div>
                </div>

                {/* Deep Glassmorphic AI Box */}
                <div className="relative rounded-[1.5rem] p-[1px] overflow-hidden group">
                  {/* Glowing Animated Border Sweep */}
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#4f46e5,#ec4899,#4f46e5)] animate-spin-slow opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-black/90 backdrop-blur-2xl rounded-[1.5rem] p-6 lg:p-8 h-full w-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-[#F5C518] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#F5C518]" />
                        Neural AI Analysis
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded text-emerald-400">
                        Zero Spoilers ✓
                      </span>
                    </div>
                    <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-medium">
                      "{selectedMovie.aiSummary}"
                    </p>
                  </div>
                </div>

                {/* Thematic Elements & Action */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-2">
                  <div className="space-y-2.5 w-full sm:w-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">Thematic Undertones</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.keywords.map((kw, idx) => (
                        <span key={idx} className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 font-bold whitespace-nowrap">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/search?q=${encodeURIComponent(selectedMovie.title)}`}
                    className="group shrink-0 relative w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] text-black font-black text-xs py-3.5 px-6 rounded-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/30 translate-x-[-150%] skew-x-[-15deg] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
                    <span>Explore in App</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* =======================================================================
          SECTION 3: BENTO-BOX GLOBAL CINEMA (#global-cinema)
      ======================================================================= */}
      <section id="global-cinema" className="py-28 px-4 sm:px-6 bg-[#0a0a0c] relative border-t border-neutral-900 overflow-hidden">
        {/* Dynamic morphing ambient glow based on selection */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              backgroundColor: 
                selectedRegion.id === 'IN' ? 'rgba(16,185,129,0.06)' : 
                selectedRegion.id === 'KR' ? 'rgba(79,70,229,0.06)' : 
                selectedRegion.id === 'US' ? 'rgba(244,63,94,0.06)' : 
                'rgba(14,165,233,0.06)' 
            }}
            transition={{ duration: 1 }}
            className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] blur-[160px] rounded-full mix-blend-screen" 
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest shadow-inner">
              <Globe2 className="w-4 h-4" />
              <span>International Hubs</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
              Beyond Hollywood.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-medium max-w-xl mx-auto">
              Dive into the massive economic and cultural impacts of regional cinema. Track Top 10 lists and wealth distributions in the largest film industries globally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Side: Country Selector Column */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {REGION_DEMO.map((region, idx) => {
                const isSelected = selectedRegion.id === region.id;
                
                // Determine glow color maps
                const colorMap: Record<string, string> = {
                  'emerald': 'group-hover:border-emerald-500/50',
                  'indigo': 'group-hover:border-indigo-500/50',
                  'rose': 'group-hover:border-rose-500/50',
                  'sky': 'group-hover:border-sky-500/50'
                };
                const activeBorderMap: Record<string, string> = {
                  'emerald': 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]',
                  'indigo': 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(79,70,229,0.15)]',
                  'rose': 'border-rose-500 bg-rose-500/10 shadow-[0_0_30px_rgba(244,63,94,0.15)]',
                  'sky': 'border-sky-500 bg-sky-500/10 shadow-[0_0_30px_rgba(14,165,233,0.15)]'
                };

                return (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className={`group w-full text-left p-5 xl:p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                      isSelected 
                        ? activeBorderMap[region.themeColor]
                        : `border-neutral-800 bg-[#121215] ${colorMap[region.themeColor]} hover:scale-[1.02]`
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl lg:text-4xl filter drop-shadow-lg">{region.flag}</div>
                      <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-wide">{region.country}</h4>
                        <div className="text-[10px] font-bold text-neutral-500 mt-0.5">Explore Market ➔</div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Right Side: Pro Bento Box Viewer */}
            <div className="lg:col-span-8 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRegion.id}
                  initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full"
                >
                  {/* Main Bento Highlight */}
                  <div className="md:col-span-2 bg-[#121215] border border-neutral-800 rounded-3xl p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden group hover:border-neutral-700 transition-colors shadow-2xl">
                    <div className="relative z-10 space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                        <span>{selectedRegion.flag}</span>
                        <span>Regional Market Overview</span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-black text-white leading-[1.1] tracking-tight max-w-xl">
                        {selectedRegion.highlight}
                      </h3>
                      <p className="text-sm font-medium text-neutral-400 max-w-lg leading-relaxed">
                        {selectedRegion.description}
                      </p>
                      <div>
                        <Link
                          href="/country"
                          className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 font-black text-xs py-3 px-6 rounded-xl transition-all outline-none"
                        >
                          <span>Explore Analytics</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Sub Bento 1: Wealth Index */}
                  <div className="bg-[#121215] border border-neutral-800 rounded-3xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-colors shadow-xl">
                    <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
                       <Award className="w-4 h-4 text-amber-500" /> Crown Jewel Index
                    </div>
                    <div className="space-y-2">
                      <div className="text-xl font-black text-[#F5C518] line-clamp-1">{selectedRegion.topCeleb}</div>
                      <div className="inline-block px-3 py-1.5 rounded-lg bg-[#F5C518]/10 text-[#F5C518] text-xs font-black uppercase tracking-wider border border-[#F5C518]/20">
                        {selectedRegion.celebNetWorth} Valuation
                      </div>
                    </div>
                  </div>

                  {/* Sub Bento 2: Massive Hits */}
                  <div className="bg-[#121215] border border-neutral-800 rounded-3xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-colors shadow-xl flex flex-col justify-between">
                    <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                       <Star className="w-4 h-4 text-rose-500" /> Historical Box Office Smashes
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedRegion.recentHits.map((hit, idx) => (
                        <div key={idx} className="bg-black/50 border border-neutral-800/80 rounded block px-3 py-2 text-xs font-bold text-white truncate hover:border-neutral-600 transition-colors text-center shadow-inner">
                          {hit}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================================
          SECTION 4: ARCHITECTURAL PILLARS & FEATURES (#features)
      ======================================================================= */}
      <section id="features" className="py-32 px-4 sm:px-6 bg-[#0a0a0a] relative border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20 text-[10px] font-black uppercase tracking-widest">
              <Cpu className="w-4 h-4" />
              <span>Core Platform Engineering</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
              Architected Without <br className="hidden sm:block" /> Compromise.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
              Every interface element, API execution, and fluid layout rule in MoviezWiki is crafted to provide a buttery-smooth 60fps cinematic experience. Hover over the pillars below.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <MonitorPlay className="w-6 h-6 sm:w-7 sm:h-7 text-[#F5C518]" />,
                title: "Zero-Latency UI",
                desc: "Stream official YouTube 4K & HD movie trailers in an immersive modal exactly where you stand, zero page reloads.",
                badge: "Next.js 15"
              },
              {
                icon: <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />,
                title: "Advanced AI Engine",
                desc: "Harness deep LLM analysis to parse tonality, themes, and arcs via an intelligent edge API without a single spoiler.",
                badge: "Google Cloud"
              },
              {
                icon: <Bookmark className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />,
                title: "Cloud Firebase Sync",
                desc: "Never lose track of a must-watch film. Instantly authenticate and synchronize your cinematic library securely across all platforms.",
                badge: "Auth + Firestore"
              },
              {
                icon: <Globe2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />,
                title: "Massive Traversal",
                desc: "Break boundaries. Query our massive TMDB backend wrapper to traverse hits from Paris to Mumbai instantly.",
                badge: "TMDB API v3"
              },
              {
                icon: <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />,
                title: "Financial Analytics",
                desc: "Analyze comprehensive metrics, cast hierarchies, and estimated high-net-worth data pipelines for thousands of film icons.",
                badge: "Data Models"
              },
              {
                icon: <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />,
                title: "Glassmorphic OS",
                desc: "Wrapped in harmonious bespoke styling, dynamic blur gradients, and structural Tailwind grids avoiding generic aesthetics.",
                badge: "Framer Motion"
              }
            ].map((item, index) => (
              <HoverSpotlightCard key={index} index={index}>
                <div className="relative group/content pointer-events-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center transition-all bg-gradient-to-br shadow-inner group-hover/content:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                      {item.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded bg-black/50 text-neutral-400 border border-neutral-800 backdrop-blur-md">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-neutral-800/60 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 pointer-events-auto">
                  <span>Standard Execution</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </HoverSpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================================
          SECTION 5: LIVE METRICS & SCALE (#stats)
          With Animated Counters
      ======================================================================= */}
      <section id="stats" className="py-32 px-4 sm:px-6 bg-[#08080a] border-t border-neutral-900 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { from: 10000, to: 100000, suffix: "+", label: "Indexed Records", sub: "Live TMDB Sync" },
              { from: 0, to: 200, suffix: "ms", label: "Analysis Generation", sub: "Powered by Advanced AI" },
              { from: 0, to: 50, suffix: "+", label: "Regional Architectures", sub: "Global Chart Indices" },
              { from: 0, to: 100, suffix: "%", label: "Free Ecosystem", sub: "No Paywalls. Ever." }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 sm:p-10 lg:p-4 xl:p-10 rounded-3xl bg-[#121215]/80 border border-white/5 shadow-2xl backdrop-blur-xl group hover:border-[#F5C518]/20 transition-colors"
              >
                <div className="text-4xl sm:text-5xl lg:text-3xl xl:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mb-3 drop-shadow-sm flex justify-center group-hover:from-[#F5C518] group-hover:to-amber-600 transition-all duration-500 whitespace-nowrap tracking-tighter">
                  <AnimatedCounter from={stat.from} to={stat.to} duration={2.5} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-black text-white mb-1.5 uppercase tracking-wide">{stat.label}</div>
                <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================================
          SECTION 6: FINAL MAGNETIC PULSE CALL TO ACTION
      ======================================================================= */}
      <section className="relative py-40 px-4 sm:px-6 text-center bg-black border-t border-white/5 z-40 overflow-hidden">
        {/* Sleek radial beam at center top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#F5C518]/50 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-radial-gradient from-[#F5C518]/10 via-amber-600/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/30 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
              <Trophy className="w-4 h-4 text-[#F5C518]" />
              <span>Ready for the premiere?</span>
            </div>

            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black text-white tracking-tighter leading-[0.95]">
              YOUR WATCHLIST, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#F5C518] via-amber-400 to-yellow-600 drop-shadow-xl">
                SUPERCHARGED.
              </span>
            </h2>

            <p className="text-neutral-400 text-sm sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Join thousands of cinephiles exploring global box-offices, streaming crisp trailers seamlessly, and generating AI deep-dives at lightspeed.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6">
              
              {/* Pro Concentric Pulse Button */}
              <div className="relative group w-full sm:w-auto">
                {/* Expanding outer pulse ring */}
                <div className="absolute inset-0 rounded-2xl bg-[#F5C518]/40 animate-ping opacity-75 duration-1000 group-hover:bg-[#F5C518]/60" />
                <div className="absolute -inset-1 rounded-[18px] bg-gradient-to-r from-[#F5C518] to-amber-500 opacity-30 blur-lg group-hover:opacity-70 transition duration-500" />
                
                <Link 
                  href="/" 
                  className="relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bgGradient bg-gradient-to-r from-[#F5C518] to-amber-400 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs sm:text-base py-4 sm:py-5 px-10 rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(245,197,24,0.3)] transform hover:scale-[1.02] border border-white/20"
                >
                  <Play className="w-5 h-5 fill-black" />
                  <span className="tracking-wide uppercase">Enter Application</span>
                </Link>
              </div>

              <Link 
                href="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#121215] hover:bg-white/10 text-white font-black text-xs sm:text-base tracking-wide uppercase py-4 sm:py-5 px-10 rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/30 backdrop-blur-md shadow-xl"
              >
                <span>Create Free Profile</span>
              </Link>
            </div>
          </motion.div>

          <div className="pt-12 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-10 text-[10px] sm:text-[11px] text-neutral-500 font-black uppercase tracking-widest w-full">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> No Credit Card</span>
            <span className="hidden sm:inline text-neutral-800">•</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Instant Access</span>
            <span className="hidden sm:inline text-neutral-800">•</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Global Sync</span>
          </div>
        </div>
      </section>

      {/* Footer minimal signature */}
      <footer className="py-8 text-center text-[10px] font-bold text-neutral-600 bg-black border-t border-white/5 uppercase tracking-widest">
        <p>© {new Date().getFullYear()} MoviezWiki Architecture. Crafted for enthusiasts.</p>
      </footer>
    </div>
  );
}