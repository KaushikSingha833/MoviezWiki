"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CinematicScroll from "@/components/CinematicScroll";
import { 
  Sparkles, Globe2, Bookmark, MonitorPlay, Zap, ShieldCheck, 
  Film, Trophy, Star, ChevronRight, CheckCircle, Cpu, Layers, Play, Award 
} from "lucide-react";

// Data for Interactive AI Demo Section
const AI_MOVIES_DEMO = [
  {
    id: "inception",
    title: "Inception",
    year: "2010",
    director: "Christopher Nolan",
    genres: ["Sci-Fi", "Action", "Thriller"],
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    aiSummary: "A highly skilled thief who steals valuable secrets from deep within the subconscious during the dream state is offered a chance to regain his old life as payment for a seemingly impossible task: planting an idea into a target's subconscious rather than stealing one.",
    vibe: "Mind-Bending & Layered",
    cinematographyScore: 99,
    audienceScore: 97,
    keywords: ["Dream Heist", "Subconscious Architecture", "Totem", "Zero-Gravity Hallway"]
  },
  {
    id: "darkknight",
    title: "The Dark Knight",
    year: "2008",
    director: "Christopher Nolan",
    genres: ["Action", "Crime", "Drama"],
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    aiSummary: "With the help of allies in the police department and district attorney's office, Gotham City's legendary vigilante systematically dismantles remaining organized crime syndicates. However, a chaotic mastermind known only as the Joker emerges to throw the metropolis into anarchy.",
    vibe: "Relentless & Gripping",
    cinematographyScore: 98,
    audienceScore: 99,
    keywords: ["Moral Dilemmas", "Chaos vs Order", "High-Stakes Interrogation", "IMAX Spectacle"]
  },
  {
    id: "interstellar",
    title: "Interstellar",
    year: "2014",
    director: "Christopher Nolan",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    aiSummary: "Facing extinction on a resource-depleted Earth, a dedicated former NASA pilot leads an exploratory team through a newly discovered wormhole in search of a habitable future for humanity. Time dilation and cosmic isolation test the unbreakable bonds between a parent and child.",
    vibe: "Awe-Inspiring & Emotional",
    cinematographyScore: 100,
    audienceScore: 96,
    keywords: ["Event Horizon", "Time Dilation", "Organ Symphony", "Cosmic Survival"]
  },
  {
    id: "spirited",
    title: "Spirited Away",
    year: "2001",
    director: "Hayao Miyazaki",
    genres: ["Animation", "Family", "Fantasy"],
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop",
    aiSummary: "While moving to a new suburb, a ten-year-old girl and her parents stumble into a seemingly abandoned amusement park that operates as a supernatural resort for spirits and gods. To save her family, she must navigate an extraordinary bathhouse run by a formidable witch.",
    vibe: "Enchanting & Whimsical",
    cinematographyScore: 98,
    audienceScore: 98,
    keywords: ["Studio Ghibli", "Supernatural Bathhouse", "Coming of Age", "Hand-Drawn Masterwork"]
  }
];

// Data for Global Cinema & Wealth Hub Demo
const REGION_DEMO = [
  {
    id: "IN",
    country: "India (Bollywood & South)",
    flag: "🇮🇳",
    highlight: "Home to the world's highest volume of film production, blending epic musicals, mythological thrillers, and global box office phenomenon.",
    topCeleb: "Shah Rukh Khan",
    celebNetWorth: "$730 Million",
    recentHits: ["Jawan", "Kalki 2898 AD", "RRR", "Pathaan"],
    description: "Explore regional industries including Hindi, Telugu, Tamil, and Malayalam cinema with deep actor net worth indices and box office records."
  },
  {
    id: "KR",
    country: "South Korea (K-Cinema)",
    flag: "🇰🇷",
    highlight: "A powerhouse of suspense, psychological thrillers, and award-winning dramas that dominate worldwide streaming charts.",
    topCeleb: "Bong Joon-ho / Song Kang-ho",
    celebNetWorth: "$40+ Million Combined Impact",
    recentHits: ["Parasite", "Squid Game Legacy", "Oldboy", "Decision to Leave"],
    description: "Discover K-Drama ratings and Palme d'Or winners. Track contemporary Korean film royalty and industry valuations."
  },
  {
    id: "US",
    country: "United States (Hollywood)",
    flag: "🇺🇸",
    highlight: "The gold standard for IMAX visual effects, superhero franchises, and prestige blockbuster filmmaking.",
    topCeleb: "Tom Cruise / Zendaya",
    celebNetWorth: "$600+ Million Box Office Kings",
    recentHits: ["Dune: Part Two", "Oppenheimer", "Spider-Verse", "Top Gun: Maverick"],
    description: "Unrivaled real-time updates on Hollywood box office grosses, studio mergers, and theatrical release calendars."
  },
  {
    id: "GB",
    country: "United Kingdom (British Film)",
    flag: "🇬🇧",
    highlight: "Renowned for elite stagecraft, historical epics, espionage thrillers, and world-renowned dramatic acting conservatories.",
    topCeleb: "Daniel Craig / Florence Pugh",
    celebNetWorth: "$160 Million Icon Index",
    recentHits: ["No Time to Die", "Oppenheimer UK Core", "Banshees of Inisherin"],
    description: "Analyze BAFTA favorites and prestigious British production studio highlights with customized sorting."
  }
];

export default function WelcomeLandingPage() {
  const [selectedMovie, setSelectedMovie] = useState(AI_MOVIES_DEMO[0]);
  const [selectedRegion, setSelectedRegion] = useState(REGION_DEMO[0]);

  return (
    <div className="bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-[#F5C518] selection:text-black min-h-screen">
      
      {/* =======================================================================
          FLOATING GLASSMORPHISM LANDING HEADER
      ======================================================================= */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 bg-[#121212]/80 border border-neutral-800/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl flex items-center justify-between transition-all duration-300 hover:border-neutral-700">
        <Link href="/" className="inline-flex items-center gap-2 text-xl md:text-2xl font-black text-[#F5C518] tracking-wider hover:opacity-90 transition-opacity">
          <span>🎬</span> <span className="hidden sm:inline">MoviezWiki</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-neutral-300 uppercase tracking-widest">
          <a href="#ai-demo" className="hover:text-[#F5C518] transition-colors">AI Engine</a>
          <a href="#global-cinema" className="hover:text-[#F5C518] transition-colors">Global Charts</a>
          <a href="#features" className="hover:text-[#F5C518] transition-colors">Architecture</a>
          <a href="#stats" className="hover:text-[#F5C518] transition-colors">Scale</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="text-xs font-bold text-neutral-300 hover:text-white px-3.5 py-2 transition-colors hidden sm:inline-block"
          >
            Log In
          </Link>
          <Link 
            href="/" 
            className="bg-gradient-to-r from-[#F5C518] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(245,197,24,0.3)] transition-all transform hover:scale-105"
          >
            Launch App ➔
          </Link>
        </div>
      </header>

      {/* =======================================================================
          SECTION 1: SCROLL-DRIVEN 3D PARALLAX HERO
      ======================================================================= */}
      <CinematicScroll />

      {/* =======================================================================
          SECTION 2: INTERACTIVE GEMINI AI SHOWCASE (#ai-demo)
      ======================================================================= */}
      <section id="ai-demo" className="relative py-28 px-6 bg-[#0c0c0c] border-t border-neutral-800/80 overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Interactive AI Demonstration</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Spoiler-Free Intelligence. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Powered by Google Gemini.
              </span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Why risk spoiling a climax just to know what a film is about? Click below to experience how MoviezWiki synthesizes plot outlines, emotional tones, and critic ratings in real-time.
            </p>
          </motion.div>

          {/* Interactive Movie Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {AI_MOVIES_DEMO.map((movie) => {
              const isActive = selectedMovie.id === movie.id;
              return (
                <button
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-300 border ${
                    isActive 
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.5)] scale-105" 
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <Film className="w-4 h-4 text-[#F5C518]" />
                  <span>{movie.title}</span>
                  <span className="text-[10px] opacity-70">({movie.year})</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Card Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMovie.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-[#16161a] to-[#111114] rounded-3xl p-6 sm:p-10 border border-neutral-700/80 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Poster Graphic */}
              <div className="lg:col-span-4 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-neutral-800 shadow-xl group">
                <img 
                  src={selectedMovie.poster} 
                  alt={selectedMovie.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#F5C518]">Director</span>
                    <div className="text-white text-sm font-bold">{selectedMovie.director}</div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#F5C518] text-black flex items-center justify-center font-black text-xs shadow">
                    4K
                  </div>
                </div>
              </div>

              {/* Right Content & AI Breakdown */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl sm:text-3xl font-black text-white">{selectedMovie.title}</h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {selectedMovie.year}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedMovie.genres.map((genre, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-900 text-[#F5C518] border border-[#F5C518]/30 shadow-inner">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] mr-1.5"></span>
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-neutral-900/90 px-4 py-2 rounded-xl border border-neutral-800 text-center">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">Cinematography</div>
                      <div className="text-xl font-black text-emerald-400">{selectedMovie.cinematographyScore}%</div>
                    </div>
                    <div className="bg-neutral-900/90 px-4 py-2 rounded-xl border border-neutral-800 text-center">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">Audience Acclaim</div>
                      <div className="text-xl font-black text-[#F5C518]">{selectedMovie.audienceScore}%</div>
                    </div>
                  </div>
                </div>

                {/* AI Generated Synopsis Box */}
                <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                      Gemini AI Spoiler-Free Analysis
                    </span>
                    <span className="text-[10px] font-bold bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">
                      Safe to Read ✓
                    </span>
                  </div>
                  <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed font-normal">
                    "{selectedMovie.aiSummary}"
                  </p>
                </div>

                {/* Tone Keywords & CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Thematic Highlights</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.keywords.map((kw, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-neutral-900 text-neutral-300 font-medium border border-neutral-800">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/search?q=${encodeURIComponent(selectedMovie.title)}`}
                    className="shrink-0 inline-flex items-center gap-2 bg-[#F5C518] hover:bg-yellow-400 text-black font-black text-xs py-3 px-6 rounded-xl transition-all shadow-md"
                  >
                    <span>Analyze in App</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* =======================================================================
          SECTION 3: GLOBAL CINEMA & WEALTH EXPLORER (#global-cinema)
      ======================================================================= */}
      <section id="global-cinema" className="py-28 px-6 bg-[#0e0e11] relative border-t border-neutral-800/80">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
              <Globe2 className="w-4 h-4" />
              <span>World Cinema & Industry Analytics</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Why Settle for Just Hollywood?
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              MoviezWiki expands your horizons by indexing regional Top 10 rankings and deep financial evaluations of the wealthiest stars across international film capitals.
            </p>
          </motion.div>

          {/* Country Selector Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {REGION_DEMO.map((region) => {
              const isSelected = selectedRegion.id === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className={`p-5 rounded-2xl text-left border transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-br from-emerald-900/40 to-[#181820] border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.25)] scale-[1.02]"
                      : "bg-[#16161e]/60 border-neutral-800 hover:border-neutral-700 hover:bg-[#1b1b26]"
                  }`}
                >
                  <div className="text-3xl mb-3">{region.flag}</div>
                  <h4 className="text-white font-black text-sm mb-1">{region.country}</h4>
                  <div className="text-[11px] font-bold text-emerald-400">Active Index</div>
                </button>
              );
            })}
          </div>

          {/* Regional Detail Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRegion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="bg-[#14141c] rounded-3xl p-8 sm:p-10 border border-neutral-800 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            >
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-black">
                  <span>{selectedRegion.flag}</span>
                  <span>{selectedRegion.country} Regional Spotlight</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  {selectedRegion.highlight}
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {selectedRegion.description}
                </p>
                <div className="pt-2">
                  <Link
                    href="/country"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  >
                    <span>Explore Regional Catalog</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl p-6 border border-neutral-800/80 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-wider font-extrabold text-neutral-400 mb-1">Featured Regional Icon</div>
                  <div className="text-xl font-black text-[#F5C518] flex items-center justify-between">
                    <span>{selectedRegion.topCeleb}</span>
                    <span className="text-sm px-2.5 py-1 rounded bg-neutral-900 text-emerald-400 border border-emerald-500/30">
                      {selectedRegion.celebNetWorth}
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-800/80 pt-5">
                  <div className="text-xs uppercase tracking-wider font-extrabold text-neutral-400 mb-3">Trending Blockbuster Classics</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedRegion.recentHits.map((hit, idx) => (
                      <div key={idx} className="bg-neutral-900/90 px-3.5 py-2.5 rounded-lg border border-neutral-800 flex items-center gap-2 text-xs font-bold text-white">
                        <Star className="w-3.5 h-3.5 text-[#F5C518] shrink-0 fill-amber-400" />
                        <span className="truncate">{hit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* =======================================================================
          SECTION 4: ARCHITECTURAL PILLARS & FEATURES (#features)
      ======================================================================= */}
      <section id="features" className="py-28 px-6 bg-[#0a0a0a] relative border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20 text-xs font-bold uppercase tracking-wider mb-4">
              <Cpu className="w-4 h-4" />
              <span>Core Platform Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Engineered Without Compromise.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Every interface element, API integration, and cloud synchronizer in MoviezWiki is crafted to provide a buttery-smooth 60fps cinematic experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <MonitorPlay className="w-7 h-7 text-[#F5C518]" />,
                title: "Zero-Latency Trailer Engine",
                desc: "Stream official YouTube 4K & HD movie trailers in an immersive modal without navigating away from your discovery feed.",
                badge: "YouTube v3 API"
              },
              {
                icon: <Sparkles className="w-7 h-7 text-indigo-400" />,
                title: "Gemini 1.5 Pro Integration",
                desc: "Harness deep LLM analysis to strip away spoilers and reveal director intentions, tone evaluations, and character arcs instantly.",
                badge: "Google Cloud"
              },
              {
                icon: <Bookmark className="w-7 h-7 text-rose-400" />,
                title: "Cloud Watchlist Sync",
                desc: "Never lose track of a must-watch film. Create an account to securely sync your personal collection in real-time across devices.",
                badge: "Firebase Auth"
              },
              {
                icon: <Globe2 className="w-7 h-7 text-emerald-400" />,
                title: "Global Industry Cataloging",
                desc: "Break free from domestic boundaries. Discover trending sensations from Mumbai, Seoul, London, Paris, and Hollywood simultaneously.",
                badge: "50+ Regions"
              },
              {
                icon: <Award className="w-7 h-7 text-amber-400" />,
                title: "Celebrity Wealth Analytics",
                desc: "Explore detailed biographical breakdown profiles and estimated net-worth indices of film icons around the globe.",
                badge: "Economic Data"
              },
              {
                icon: <Layers className="w-7 h-7 text-cyan-400" />,
                title: "Bespoke Glassmorphism UI",
                desc: "Designed with harmonious dark palettes, HSL tailored gradients, and ergonomic typography to eliminate eye strain in theater settings.",
                badge: "Tailwind & CS"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-[#121215] border border-neutral-800/80 hover:border-neutral-600 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#F5C518] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center gap-1.5 text-xs font-bold text-neutral-500 group-hover:text-white transition-colors">
                  <span>Included in Free Plan</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================================
          SECTION 5: LIVE METRICS & SCALE (#stats)
      ======================================================================= */}
      <section id="stats" className="py-24 px-6 bg-[#0d0d10] border-t border-neutral-800/80 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { num: "1,000,000+", label: "Indexed Movie & TV Records", sub: "Real-time TMDB sync" },
              { num: "200 ms", label: "AI Summary Generation Time", sub: "Powered by Gemini Pro" },
              { num: "50+", label: "Countries & Regional Charts", sub: "Global Box Office tracking" },
              { num: "100%", label: "Free & Unlimited Access", sub: "For registered members" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md shadow-lg"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-amber-500 mb-2">
                  {stat.num}
                </div>
                <div className="text-sm font-bold text-white mb-1">{stat.label}</div>
                <div className="text-[11px] text-neutral-500 uppercase tracking-widest">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================================
          SECTION 6: FINAL HIGH-IMPACT CALL TO ACTION
      ======================================================================= */}
      <section className="relative py-32 px-6 text-center bg-black border-t border-neutral-900 z-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#F5C518]/60 to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#F5C518]/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/30 text-xs font-extrabold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-[#F5C518]" />
            <span>Ready to transform your watchlists?</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
            YOUR WATCHLIST, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] via-amber-300 to-yellow-500">
              SUPERCHARGED.
            </span>
          </h2>

          <p className="text-neutral-400 text-base sm:text-xl max-w-2xl mx-auto font-light">
            Join thousands of cinephiles exploring global blockbusters, streaming trailers in zero latency, and unlocking instant AI evaluations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link 
              href="/" 
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#F5C518] to-amber-400 text-black font-black text-base sm:text-lg py-4 px-10 rounded-2xl hover:brightness-110 transition-all duration-300 overflow-hidden shadow-[0_0_40px_rgba(245,197,24,0.35)] transform hover:-translate-y-0.5"
            >
              {/* Animated Glare Effect */}
              <div className="absolute inset-0 bg-white/30 translate-x-[-100%] skew-x-[-15deg] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
              
              <Play className="w-5 h-5 fill-black" />
              <span>Enter MoviezWiki Hub</span>
            </Link>

            <Link 
              href="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-[#F5C518] font-bold text-base sm:text-lg py-4 px-10 rounded-2xl transition-all duration-300 shadow-xl"
            >
              <span>Create Free Account ➔</span>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[#F5C518]" /> No Credit Card Required</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[#F5C518]" /> Instant AI Summary Access</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[#F5C518]" /> Cross-Device Cloud Syncing</span>
          </div>
        </div>
      </section>

      {/* Footer minimal signature */}
      <footer className="py-8 text-center text-xs text-neutral-600 bg-black border-t border-neutral-900/60">
        <p>© {new Date().getFullYear()} MoviezWiki V2.0. All Rights Reserved. Crafted for Cinephiles worldwide.</p>
      </footer>
    </div>
  );
}