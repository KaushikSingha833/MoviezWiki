"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Globe, Wallet, Sparkles, MapPin } from "lucide-react";
import { getMoviesByCountry, getPersonDetails } from "@/actions/movieActions";
import MovieCard from "@/components/MovieCard";

const CELEB_DATA: Record<string, any> = {
  IN: { name: "India", male: { name: "Shah Rukh Khan", tmdbId: 35742, netWorth: "$730 Million" }, female: { name: "Juhi Chawla", tmdbId: 85931, netWorth: "$55 Million" } },
  US: { name: "United States", male: { name: "Tyler Perry", tmdbId: 54935, netWorth: "$1.4 Billion" }, female: { name: "Jami Gertz", tmdbId: 19515, netWorth: "$3 Billion" } },
  KR: { name: "South Korea", male: { name: "Kim Soo-hyun", tmdbId: 1253326, netWorth: "$117 Million" }, female: { name: "Lee Young-ae", tmdbId: 113337, netWorth: "$40 Million" } },
  GB: { name: "United Kingdom", male: { name: "Daniel Craig", tmdbId: 8784, netWorth: "$160 Million" }, female: { name: "Catherine Zeta-Jones", tmdbId: 1160, netWorth: "$150 Million" } },
  JP: { name: "Japan", male: { name: "Ken Watanabe", tmdbId: 3899, netWorth: "$40 Million" }, female: { name: "Ayumi Hamasaki", tmdbId: 104273, netWorth: "$70 Million" } },
  FR: { name: "France", male: { name: "Gérard Depardieu", tmdbId: 3291, netWorth: "$200 Million" }, female: { name: "Catherine Deneuve", tmdbId: 1326, netWorth: "$75 Million" } },
  CN: { name: "China", male: { name: "Jackie Chan", tmdbId: 18897, netWorth: "$400 Million" }, female: { name: "Fan Bingbing", tmdbId: 118837, netWorth: "$100 Million" } },
  AU: { name: "Australia", male: { name: "Chris Hemsworth", tmdbId: 74568, netWorth: "$130 Million" }, female: { name: "Nicole Kidman", tmdbId: 2227, netWorth: "$250 Million" } },
  CA: { name: "Canada", male: { name: "Keanu Reeves", tmdbId: 6384, netWorth: "$380 Million" }, female: { name: "Celine Dion", tmdbId: 58838, netWorth: "$800 Million" } }
};

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
  const [maleActorImg, setMaleActorImg] = useState<string | null>(null);
  const [femaleActorImg, setFemaleActorImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const activeData = CELEB_DATA[selectedCountry];

      const [countryMovies, maleData, femaleData] = await Promise.all([
        getMoviesByCountry(selectedCountry),
        getPersonDetails(activeData.male.tmdbId),
        getPersonDetails(activeData.female.tmdbId)
      ]);

      setMovies(countryMovies);
      
      setMaleActorImg(maleData?.profile_path ? `https://image.tmdb.org/t/p/w500${maleData.profile_path}` : null);
      setFemaleActorImg(femaleData?.profile_path ? `https://image.tmdb.org/t/p/w500${femaleData.profile_path}` : null);

      setLoading(false);
    };

    fetchData();
  }, [selectedCountry]);

  const activeCelebData = CELEB_DATA[selectedCountry];

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
            {Object.keys(CELEB_DATA).map(code => {
              const isSelected = selectedCountry === code;
              return (
                <button
                  key={code}
                  onClick={() => setSelectedCountry(code)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border
                    ${isSelected 
                      ? "bg-white text-black border-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" 
                      : "bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white"
                    }
                  `}
                >
                  <MapPin className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-neutral-500"}`} />
                  {CELEB_DATA[code].name}
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
              Wealthiest Icons
            </h2>
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
              <Wallet className="w-3 h-3" /> Net Worth
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Actor Card */}
            <motion.div 
              key={`${selectedCountry}-male`}
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="group relative bg-[#121215] rounded-3xl overflow-hidden border border-neutral-800 hover:border-green-500/50 shadow-2xl p-6 flex flex-col sm:flex-row items-center gap-6 transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] group-hover:bg-green-500/20 transition-all rounded-full" />
              
              <div className="relative shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-neutral-800 group-hover:border-green-500 transition-colors shadow-lg z-10">
                <img 
                  src={maleActorImg || "https://via.placeholder.com/300"} 
                  alt={activeCelebData.male.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              
              <div className="flex flex-col text-center sm:text-left z-10 w-full">
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1">Highest Paid Actor</p>
                <h3 className="text-2xl font-black text-white mb-2">{activeCelebData.male.name}</h3>
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-green-400 font-black text-xl md:text-3xl bg-green-950/30 px-4 py-2 rounded-xl border border-green-900/50 w-max mx-auto sm:mx-0">
                  <Wallet className="w-5 h-5 text-green-500" />
                  {activeCelebData.male.netWorth}
                </div>
              </div>
            </motion.div>
            
            {/* Actress Card */}
            <motion.div 
              key={`${selectedCountry}-female`}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="group relative bg-[#121215] rounded-3xl overflow-hidden border border-neutral-800 hover:border-rose-500/50 shadow-2xl p-6 flex flex-col sm:flex-row items-center gap-6 transition-colors"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/10 blur-[50px] group-hover:bg-rose-500/20 transition-all rounded-full" />
              
              <div className="relative shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-neutral-800 group-hover:border-rose-500 transition-colors shadow-lg z-10">
                <img 
                  src={femaleActorImg || "https://via.placeholder.com/300"} 
                  alt={activeCelebData.female.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              
              <div className="flex flex-col text-center sm:text-left z-10 w-full">
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1">Highest Paid Actress</p>
                <h3 className="text-2xl font-black text-white mb-2">{activeCelebData.female.name}</h3>
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-rose-400 font-black text-xl md:text-3xl bg-rose-950/30 px-4 py-2 rounded-xl border border-rose-900/50 w-max mx-auto sm:mx-0">
                  <Wallet className="w-5 h-5 text-rose-500" />
                  {activeCelebData.female.netWorth}
                </div>
              </div>
            </motion.div>
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

    </div>
  );
}