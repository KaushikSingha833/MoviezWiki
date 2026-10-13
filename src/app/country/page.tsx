"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Globe, 
  MapPin, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Calendar, 
  Film, 
  Award, 
  Users, 
  ArrowUpRight, 
  SlidersHorizontal 
} from "lucide-react";
import { getMoviesByCountry, getPersonDetails, getMediaCredits } from "@/actions/movieActions";
import MovieCard from "@/components/MovieCard";
import ActorModal from "@/components/ActorModal";

interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  industry: string;
  tagline: string;
  topGenres: string[];
  languages: string;
  accentColor: string;
}

const COUNTRIES: CountryInfo[] = [
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    industry: "Bollywood & Regional Cinema",
    tagline: "Epic mythologies, high-octane mass action, and record-shattering musical spectacles.",
    topGenres: ["Action", "Drama", "Romance", "Musical"],
    languages: "Hindi, Telugu, Tamil, Malayalam, Kannada",
    accentColor: "#F5C518"
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    industry: "Hollywood & Global Blockbusters",
    tagline: "Groundbreaking visual effects, superhero franchises, and prestige auteur filmmaking.",
    topGenres: ["Sci-Fi", "Action", "Adventure", "Thriller"],
    languages: "English",
    accentColor: "#3B82F6"
  },
  {
    code: "KR",
    name: "South Korea",
    flag: "🇰🇷",
    industry: "K-Cinema & Chungmuro",
    tagline: "Masterful suspense, psychological thrills, and Palme d'Or winning storytelling.",
    topGenres: ["Mystery", "Thriller", "Drama", "Crime"],
    languages: "Korean",
    accentColor: "#A855F7"
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    industry: "Anime & J-Cinema",
    tagline: "Visionary anime epics, samurai lore, delicate dramas, and kaiju blockbusters.",
    topGenres: ["Animation", "Fantasy", "Action", "Drama"],
    languages: "Japanese",
    accentColor: "#EC4899"
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    industry: "British Cinema & BAFTA Spotlight",
    tagline: "Elite stagecraft, espionage thrillers, historical sagas, and biting wit.",
    topGenres: ["Drama", "History", "Comedy", "Crime"],
    languages: "English",
    accentColor: "#06B6D4"
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    industry: "French Cinema & Cannes Auteur",
    tagline: "The birthplace of cinema, poetic realism, intimate romances, and bold art.",
    topGenres: ["Drama", "Romance", "Comedy"],
    languages: "French",
    accentColor: "#6366F1"
  },
  {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
    industry: "Spanish Cinema & Latin Thrillers",
    tagline: "High-octane heists, psychological mystery, and passionate dark comedies.",
    topGenres: ["Thriller", "Horror", "Drama"],
    languages: "Spanish",
    accentColor: "#EF4444"
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    industry: "German Cinema & Berlin Spotlight",
    tagline: "Deep historical epics, expressionist noir, and stark psychological realism.",
    topGenres: ["Drama", "War", "Sci-Fi", "History"],
    languages: "German",
    accentColor: "#EAB308"
  },
  {
    code: "IT",
    name: "Italy",
    flag: "🇮🇹",
    industry: "Italian Cinema & Neo-Realism",
    tagline: "Sensual cinematography, operatic emotions, and legendary crime sagas.",
    topGenres: ["Drama", "Comedy", "Crime"],
    languages: "Italian",
    accentColor: "#10B981"
  },
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    industry: "Chinese Cinema & Wuxia Epics",
    tagline: "Monumental historical battles, martial arts mastery, and modern sci-fi epics.",
    topGenres: ["Action", "Fantasy", "History"],
    languages: "Mandarin, Cantonese",
    accentColor: "#F43F5E"
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    industry: "Australian Cinema & Outback Sagas",
    tagline: "Rugged outback survival, high-octane post-apocalyptic lore, and breakout star power.",
    topGenres: ["Adventure", "Action", "Thriller"],
    languages: "English",
    accentColor: "#F97316"
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    industry: "Canadian Cinema & TIFF Showcase",
    tagline: "TIFF showcase cinema, body horror masterworks, and bilingual indie gems.",
    topGenres: ["Horror", "Sci-Fi", "Drama"],
    languages: "English, French",
    accentColor: "#E11D48"
  }
];

const SORT_OPTIONS = [
  { id: "popularity.desc", label: "Trending Now", icon: TrendingUp },
  { id: "vote_average.desc", label: "Highest Rated", icon: Star },
  { id: "primary_release_date.desc", label: "Latest Releases", icon: Calendar }
];

const gridContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15 } }
};

export default function CountryPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("IN");
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
  const [movies, setMovies] = useState<any[]>([]);
  const [maleActorData, setMaleActorData] = useState<any>(null);
  const [femaleActorData, setFemaleActorData] = useState<any>(null);
  const [selectedActorId, setSelectedActorId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const activeCountry = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0];

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const countryMovies = await getMoviesByCountry(selectedCountry, sortBy);
        if (isCancelled) return;
        setMovies(countryMovies);

        if (countryMovies.length > 0) {
          // Dynamic star radar: extract top actors from the top 4 films
          const topMovies = countryMovies.slice(0, 4);
          const castsArrays = await Promise.all(topMovies.map((m: any) => getMediaCredits(m.id, "movie")));
          if (isCancelled) return;
          const allCast: any[] = castsArrays.flat();
          
          // Deduplicate actors
          const uniqueCast = Array.from(new Map(allCast.map(c => [c.id, c])).values());
          
          // Rank by TMDB popularity
          const males = uniqueCast.filter(c => c.gender === 2).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          const females = uniqueCast.filter(c => c.gender === 1).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          
          const [maleResp, femaleResp] = await Promise.all([
            males[0] ? getPersonDetails(males[0].id) : null,
            females[0] ? getPersonDetails(females[0].id) : null
          ]);
          
          if (isCancelled) return;
          setMaleActorData(maleResp || males[0] || null);
          setFemaleActorData(femaleResp || females[0] || null);
        } else {
          setMaleActorData(null);
          setFemaleActorData(null);
        }
      } catch (err) {
        console.error("Failed to load country data:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [selectedCountry, sortBy]);

  return (
    <div className="min-h-screen bg-[#07070a] text-white font-sans overflow-x-hidden pb-28 relative selection:bg-[#F5C518]/30 selection:text-white">
      
      {/* Ambient Radial Lights */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-[100%] blur-[140px] pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: activeCountry.accentColor }}
      />
      <div className="absolute top-96 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Hero Header Area */}
      <header className="relative w-full pt-28 pb-10 px-4 md:px-8 border-b border-white/[0.06] backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          
          {/* Top Radar Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5 backdrop-blur-xl shadow-inner">
            <Globe className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="text-[11px] font-black tracking-widest uppercase text-neutral-300">
              International Film Atlas
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-[11px] font-bold text-[#F5C518]">
              {COUNTRIES.length} Curated Territories
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
            Explore Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] via-yellow-400 to-amber-500">Cinema</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed mb-8">
            Filter the planet's premier film industries by origin. Track top superstars, regional languages, and authentic box office masterworks.
          </p>

          {/* Territory Selector - All Countries Visible Without Scrollbar Clipping */}
          <div className="w-full max-w-5xl">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1">
              {COUNTRIES.map(country => {
                const isSelected = selectedCountry === country.code;
                return (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country.code)}
                    className={`
                      flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-black transition-all duration-200 border cursor-pointer
                      ${isSelected 
                        ? "bg-gradient-to-r from-white to-neutral-200 text-black border-transparent shadow-[0_0_25px_rgba(255,255,255,0.3)] scale-105 ring-2 ring-white/50" 
                        : "bg-[#101015]/90 text-neutral-400 border-white/[0.08] hover:border-neutral-500 hover:text-white hover:bg-neutral-900"
                      }
                    `}
                  >
                    <span className="text-base leading-none">{country.flag}</span>
                    <span>{country.name}</span>
                    {country.code === "IN" && !isSelected && (
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-[#F5C518] font-black border border-amber-500/20">
                        Default
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 space-y-16">
        
        {/* Territory Intelligence Showcase Bento */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111116] to-[#0c0c10] border border-white/[0.08] p-6 md:p-8 shadow-2xl">
          <div 
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
            style={{ backgroundColor: activeCountry.accentColor }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Territory Identity */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-black/60 border border-white/[0.08] flex items-center justify-center text-4xl shadow-inner shrink-0 ring-1 ring-white/10">
                {activeCountry.flag}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                    Active Territory
                  </span>
                  <span 
                    className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border shadow-sm"
                    style={{ 
                      color: activeCountry.accentColor, 
                      backgroundColor: `${activeCountry.accentColor}15`,
                      borderColor: `${activeCountry.accentColor}30`
                    }}
                  >
                    {activeCountry.industry}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {activeCountry.name}
                </h2>
                <p className="text-neutral-400 text-xs md:text-sm mt-1 max-w-xl leading-relaxed">
                  {activeCountry.tagline}
                </p>
              </div>
            </div>

            {/* Quick Territory Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] backdrop-blur-md">
                <span className="text-[10px] font-extrabold uppercase text-neutral-400 block mb-0.5">
                  Spoken Tracks
                </span>
                <span className="text-xs font-bold text-white line-clamp-1" title={activeCountry.languages}>
                  {activeCountry.languages}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] backdrop-blur-md">
                <span className="text-[10px] font-extrabold uppercase text-neutral-400 block mb-0.5">
                  Dominant Genres
                </span>
                <span className="text-xs font-bold text-emerald-400 line-clamp-1">
                  {activeCountry.topGenres.slice(0, 2).join(", ")}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] backdrop-blur-md col-span-2 sm:col-span-1">
                <span className="text-[10px] font-extrabold uppercase text-neutral-400 block mb-0.5">
                  Live Catalog
                </span>
                <span className="text-xs font-bold text-[#F5C518]">
                  20 Premier Titles
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Regional Icon Radar (Leading Superstar Actor & Actress) */}
        {(maleActorData || femaleActorData) && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-7 bg-gradient-to-b from-[#F5C518] to-yellow-500 rounded-full" />
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Regional Icon Spotlight</span>
                  <span className="text-xs font-bold text-neutral-400 hidden sm:inline">
                    ({activeCountry.name})
                  </span>
                </h2>
              </div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Live Popularity Radar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              
              {/* Leading Actor Card */}
              {maleActorData && (
                <motion.div 
                  key={`${selectedCountry}-male`}
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.35 }}
                  onClick={() => setSelectedActorId(maleActorData.id)}
                  className="group relative bg-gradient-to-b from-[#121217] to-[#0c0c10] rounded-3xl overflow-hidden border border-white/[0.08] hover:border-emerald-500/40 p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                >
                  <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 blur-[60px] group-hover:bg-emerald-500/20 transition-all rounded-full pointer-events-none" />
                  
                  {/* Portrait with Glowing Halo */}
                  <div className="relative shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-neutral-700 group-hover:border-emerald-400 transition-colors shadow-xl bg-neutral-900 ring-2 ring-emerald-500/20">
                    <img 
                      src={maleActorData.profile_path ? `https://image.tmdb.org/t/p/w500${maleActorData.profile_path}` : "https://via.placeholder.com/300"} 
                      alt={maleActorData.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  
                  {/* Actor Details */}
                  <div className="flex flex-col text-center sm:text-left w-full z-10">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        Top Leading Actor
                      </span>
                      <span className="text-[10px] text-neutral-400 font-bold">
                        {activeCountry.name}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors mb-2">
                      {maleActorData.name}
                    </h3>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                      <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-800/40">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Popularity Index: {Math.round(maleActorData.popularity || 0)}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 group-hover:text-white font-semibold flex items-center gap-1 transition-colors">
                        <span>Filmography</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Leading Actress Card */}
              {femaleActorData && (
                <motion.div 
                  key={`${selectedCountry}-female`}
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.35, delay: 0.05 }}
                  onClick={() => setSelectedActorId(femaleActorData.id)}
                  className="group relative bg-gradient-to-b from-[#121217] to-[#0c0c10] rounded-3xl overflow-hidden border border-white/[0.08] hover:border-rose-500/40 p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]"
                >
                  <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 blur-[60px] group-hover:bg-rose-500/20 transition-all rounded-full pointer-events-none" />
                  
                  {/* Portrait with Glowing Halo */}
                  <div className="relative shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-neutral-700 group-hover:border-rose-400 transition-colors shadow-xl bg-neutral-900 ring-2 ring-rose-500/20">
                    <img 
                      src={femaleActorData.profile_path ? `https://image.tmdb.org/t/p/w500${femaleActorData.profile_path}` : "https://via.placeholder.com/300"} 
                      alt={femaleActorData.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  
                  {/* Actress Details */}
                  <div className="flex flex-col text-center sm:text-left w-full z-10">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="text-[10px] text-rose-400 font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                        Top Leading Actress
                      </span>
                      <span className="text-[10px] text-neutral-400 font-bold">
                        {activeCountry.name}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-rose-300 transition-colors mb-2">
                      {femaleActorData.name}
                    </h3>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                      <div className="inline-flex items-center gap-1.5 text-rose-400 font-bold bg-rose-950/40 px-3 py-1 rounded-xl border border-rose-800/40">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Popularity Index: {Math.round(femaleActorData.popularity || 0)}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 group-hover:text-white font-semibold flex items-center gap-1 transition-colors">
                        <span>Filmography</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </section>
        )}

        {/* Global Cinema Catalog with Sorter */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 bg-[#F5C518] rounded-full" />
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Premier Regional Catalog
                </h2>
                <p className="text-xs text-neutral-400">
                  {movies.length > 0 ? `Showing ${movies.length} curated masterworks from ${activeCountry.name}` : `Curating ${activeCountry.name} catalog...`}
                </p>
              </div>
            </div>

            {/* Sorter Selector Pill */}
            <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/[0.08] rounded-2xl shrink-0 backdrop-blur-md">
              {SORT_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                const isActive = sortBy === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? "bg-[#F5C518] text-black shadow-sm" 
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {loading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3 animate-pulse">
                  <div className="w-full aspect-[2/3] bg-neutral-900/80 rounded-2xl border border-neutral-800" />
                  <div className="h-4 bg-neutral-800/80 rounded-md w-3/4" />
                  <div className="h-3 bg-neutral-900 rounded-md w-1/2" />
                </div>
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-24 text-neutral-400 bg-[#121217]/50 rounded-3xl border border-white/[0.06] backdrop-blur-md">
              <Globe className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-xl font-black text-white mb-2">No regional titles mapped.</p>
              <p className="text-xs text-neutral-500">We couldn't retrieve films for this territory right now.</p>
            </div>
          ) : (
            <motion.div 
              variants={gridContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-10"
            >
              {movies.map((movie) => (
                <motion.div key={movie.id} variants={cardItem} className="flex-shrink-0">
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>

      {/* Embedded Actor Modal */}
      {selectedActorId && (
        <ActorModal personId={selectedActorId} onClose={() => setSelectedActorId(null)} />
      )}
    </div>
  );
}