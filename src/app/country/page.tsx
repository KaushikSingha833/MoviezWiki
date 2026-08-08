"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Globe, Wallet, Sparkles, MapPin } from "lucide-react";
import { getMoviesByCountry, getPersonDetails } from "@/actions/movieActions";
import MovieCard from "@/components/MovieCard";
import ActorModal from "@/components/ActorModal";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "KR", name: "South Korea" },
  { code: "GB", name: "United Kingdom" },
  { code: "JP", name: "Japan" },
  { code: "FR", name: "France" },
  { code: "CN", name: "China" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" }
];

const gridContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function CountryPage() {
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [movies, setMovies] = useState<any[]>([]);
  const [maleActorData, setMaleActorData] = useState<any>(null);
  const [femaleActorData, setFemaleActorData] = useState<any>(null);
  const [selectedActorId, setSelectedActorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const countryMovies = await getMoviesByCountry(selectedCountry);
      setMovies(countryMovies);
      
      if (countryMovies.length > 0) {
        // Extract dynamically the most popular actors inside this region's top movies
        const topMovies = countryMovies.slice(0, 4);
        const { getMediaCredits } = await import("@/actions/movieActions");
        
        const castsArrays = await Promise.all(topMovies.map((m: any) => getMediaCredits(m.id, "movie")));
        const allCast: any[] = castsArrays.flat();
        
        // Deduplicate people
        const uniqueCast = Array.from(new Map(allCast.map(c => [c.id, c])).values());
        
        // Rank by TMDB internal popularity metric
        const males = uniqueCast.filter(c => c.gender === 2).sort((a, b) => b.popularity - a.popularity);
        const females = uniqueCast.filter(c => c.gender === 1).sort((a, b) => b.popularity - a.popularity);
        
        const [maleDataResp, femaleDataResp] = await Promise.all([
          males[0] ? getPersonDetails(males[0].id) : null,
          females[0] ? getPersonDetails(females[0].id) : null
        ]);
        
        setMaleActorData(maleDataResp || males[0] || null);
        setFemaleActorData(femaleDataResp || females[0] || null);
      } else {
        setMaleActorData(null);
        setFemaleActorData(null);
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedCountry]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden pb-20">
      
      {/* Premium Dashboard Header */}
      <header className="relative w-full pt-32 pb-14 px-6 border-b border-neutral-900 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-[100%] blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-neutral-300">
              International Map
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8">
            Explore Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-yellow-500">Cinema</span>
          </h1>

          {/* Interactive Pill Selector */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {COUNTRIES.map(country => {
              const isSelected = selectedCountry === country.code;
              return (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border
                    ${isSelected 
                      ? "bg-white text-black border-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" 
                      : "bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white"
                    }
                  `}
                >
                  <MapPin className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-neutral-500"}`} />
                  {country.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-16 space-y-24">
        
        {/* Wealthiest Celebrities Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <div className="w-1.5 h-8 bg-green-500 rounded-full" />
              Trending Icons
            </h2>
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Highest Reach
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Actor Card */}
            {maleActorData && (
            <motion.div 
              key={`${selectedCountry}-male`}
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              onClick={() => setSelectedActorId(maleActorData.id)}
              className="group relative bg-[#121215] rounded-3xl overflow-hidden border border-neutral-800 hover:border-green-500/50 shadow-2xl p-6 flex flex-col sm:flex-row items-center gap-6 transition-colors cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] group-hover:bg-green-500/20 transition-all rounded-full" />
              
              <div className="relative shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-neutral-800 group-hover:border-green-500 transition-colors shadow-lg z-10 bg-neutral-900 flex items-center justify-center">
                <img 
                  src={maleActorData.profile_path ? `https://image.tmdb.org/t/p/w500${maleActorData.profile_path}` : "https://via.placeholder.com/300"} 
                  alt={maleActorData.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              
              <div className="flex flex-col text-center sm:text-left z-10 w-full">
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1">Top Actor</p>
                <h3 className="text-2xl font-black text-white mb-2">{maleActorData.name}</h3>
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-green-400 font-black text-xs md:text-sm bg-green-950/30 px-3 py-1.5 rounded-xl border border-green-900/50 w-max mx-auto sm:mx-0">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  Popularity Score: {Math.round(maleActorData.popularity || 0)}
                </div>
              </div>
            </motion.div>
            )}
            
            {/* Actress Card */}
            {femaleActorData && (
            <motion.div 
              key={`${selectedCountry}-female`}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              onClick={() => setSelectedActorId(femaleActorData.id)}
              className="group relative bg-[#121215] rounded-3xl overflow-hidden border border-neutral-800 hover:border-rose-500/50 shadow-2xl p-6 flex flex-col sm:flex-row items-center gap-6 transition-colors cursor-pointer"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/10 blur-[50px] group-hover:bg-rose-500/20 transition-all rounded-full" />
              
              <div className="relative shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-neutral-800 group-hover:border-rose-500 transition-colors shadow-lg z-10 bg-neutral-900 flex items-center justify-center">
                <img 
                  src={femaleActorData.profile_path ? `https://image.tmdb.org/t/p/w500${femaleActorData.profile_path}` : "https://via.placeholder.com/300"} 
                  alt={femaleActorData.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              
              <div className="flex flex-col text-center sm:text-left z-10 w-full">
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1">Top Actress</p>
                <h3 className="text-2xl font-black text-white mb-2">{femaleActorData.name}</h3>
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-rose-400 font-black text-xs md:text-sm bg-rose-950/30 px-3 py-1.5 rounded-xl border border-rose-900/50 w-max mx-auto sm:mx-0">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  Popularity Score: {Math.round(femaleActorData.popularity || 0)}
                </div>
              </div>
            </motion.div>
            )}
          </div>
        </section>

        {/* Global Cinema Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#F5C518] rounded-full" />
              Top Global Masterpieces
            </h2>
            <span className="text-xs font-bold text-[#F5C518] uppercase tracking-wider bg-[#F5C518]/10 px-3 py-1 rounded-full border border-[#F5C518]/20 flex items-center gap-1 hidden md:flex">
              <Sparkles className="w-3 h-3" /> Popular Right Now
            </span>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-12 h-12 border-4 border-neutral-800 border-t-[#F5C518] rounded-full animate-spin" />
              <p className="text-neutral-500 font-bold animate-pulse">Syncing Global Data...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20 text-neutral-400 bg-neutral-900/50 rounded-3xl border border-neutral-800">
              <Globe className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-xl font-bold text-white mb-2">No regional data mapped.</p>
              <p>We couldn't fetch popular movies for this territory.</p>
            </div>
          ) : (
            <motion.div 
              variants={gridContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-12"
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