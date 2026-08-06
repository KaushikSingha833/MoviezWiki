"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMovieTrailer, getMoviesByCountry, getPersonDetails } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import { useWishlist } from "@/context/WishlistContext";
import { getGenreNames } from "@/lib/genres";
import AISummaryModal from "@/components/AISummaryModal";

const CELEB_DATA: Record<string, any> = {
  IN: {
    name: "India",
    male: { name: "Shah Rukh Khan", tmdbId: 35742, netWorth: "$730 Million" },
    female: { name: "Juhi Chawla", tmdbId: 85931, netWorth: "$55 Million" }
  },
  US: {
    name: "United States",
    male: { name: "Tyler Perry", tmdbId: 54935, netWorth: "$1.4 Billion" },
    female: { name: "Jami Gertz", tmdbId: 19515, netWorth: "$3 Billion" }
  },
  KR: {
    name: "South Korea",
    male: { name: "Kim Soo-hyun", tmdbId: 1253326, netWorth: "$117 Million" },
    female: { name: "Lee Young-ae", tmdbId: 113337, netWorth: "$40 Million" }
  },
  GB: {
    name: "United Kingdom",
    male: { name: "Daniel Craig", tmdbId: 8784, netWorth: "$160 Million" },
    female: { name: "Catherine Zeta-Jones", tmdbId: 1160, netWorth: "$150 Million" }
  },
  JP: {
    name: "Japan",
    male: { name: "Ken Watanabe", tmdbId: 3899, netWorth: "$40 Million" },
    female: { name: "Ayumi Hamasaki", tmdbId: 104273, netWorth: "$70 Million" }
  },
  FR: {
    name: "France",
    male: { name: "Gérard Depardieu", tmdbId: 3291, netWorth: "$200 Million" },
    female: { name: "Catherine Deneuve", tmdbId: 1326, netWorth: "$75 Million" }
  },
  CN: {
    name: "China",
    male: { name: "Jackie Chan", tmdbId: 18897, netWorth: "$400 Million" },
    female: { name: "Fan Bingbing", tmdbId: 118837, netWorth: "$100 Million" }
  },
  AU: {
    name: "Australia",
    male: { name: "Chris Hemsworth", tmdbId: 74568, netWorth: "$130 Million" },
    female: { name: "Nicole Kidman", tmdbId: 2227, netWorth: "$250 Million" }
  },
  CA: {
    name: "Canada",
    male: { name: "Keanu Reeves", tmdbId: 6384, netWorth: "$380 Million" },
    female: { name: "Celine Dion", tmdbId: 58838, netWorth: "$800 Million" }
  }
};


export default function CountryPage() {
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [movies, setMovies] = useState<any[]>([]);
  const [maleActorImg, setMaleActorImg] = useState<string | null>(null);
  const [femaleActorImg, setFemaleActorImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [activeAITitle, setActiveAITitle] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

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
      
      setMaleActorImg(
        maleData?.profile_path 
          ? `https://image.tmdb.org/t/p/w500${maleData.profile_path}` 
          : null
      );
      setFemaleActorImg(
        femaleData?.profile_path 
          ? `https://image.tmdb.org/t/p/w500${femaleData.profile_path}` 
          : null
      );

      setLoading(false);
    };

    fetchData();
  }, [selectedCountry]);

  const handlePlayTrailer = async (id: number) => {
    const key = await getMovieTrailer(id);
    setTrailerKey(key);
    setShowTrailerModal(true);
  };

  const handleAISummary = async (title: string, overview: string) => {
    setShowAIModal(true);
    setActiveAITitle(title);
    setAiSummary("");
    setIsLoadingAI(true);
    const summary = await getAISummary(title, overview);
    setAiSummary(summary);
    setIsLoadingAI(false);
  };

  const activeCelebData = CELEB_DATA[selectedCountry];

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <h1 className="text-3xl font-bold flex items-center border-l-4 border-[#F5C518] pl-3 mb-6 md:mb-0">
            Global Cinema & Icons
          </h1>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg focus:ring-[#F5C518] focus:border-[#F5C518] block p-3 outline-none cursor-pointer"
          >
            {Object.keys(CELEB_DATA).map(code => (
              <option key={code} value={code}>{CELEB_DATA[code].name}</option>
            ))}
          </select>
        </div>

        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6 text-neutral-300 uppercase tracking-wider text-center">
            Wealthiest Celebrities in {activeCelebData.name}
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-neutral-800 shadow-2xl flex items-center w-full md:w-96 p-4">
              <img 
                src={maleActorImg || "https://via.placeholder.com/150"} 
                alt={activeCelebData.male.name} 
                className="w-24 h-24 rounded-full object-cover border-2 border-[#F5C518] shrink-0" 
              />
              <div className="ml-6">
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">Richest Actor</p>
                <h3 className="text-xl font-bold text-white">{activeCelebData.male.name}</h3>
                <p className="text-[#F5C518] font-black text-lg mt-1">{activeCelebData.male.netWorth}</p>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-neutral-800 shadow-2xl flex items-center w-full md:w-96 p-4">
              <img 
                src={femaleActorImg || "https://via.placeholder.com/150"} 
                alt={activeCelebData.female.name} 
                className="w-24 h-24 rounded-full object-cover border-2 border-[#F5C518] shrink-0" 
              />
              <div className="ml-6">
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">Richest Actress</p>
                <h3 className="text-xl font-bold text-white">{activeCelebData.female.name}</h3>
                <p className="text-[#F5C518] font-black text-lg mt-1">{activeCelebData.female.netWorth}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center border-l-4 border-[#F5C518] pl-3">
            Top 10 Movies from {activeCelebData.name}
          </h2>
          
          {loading ? (
            <div className="text-center py-20 text-[#F5C518] font-bold">Loading movies...</div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20 text-neutral-400 bg-neutral-900/50 rounded-xl border border-neutral-800">
              No movies found for this country.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {movies.map((movie) => {
                const isSaved = isInWishlist(movie.id);
                return (
                  <div key={movie.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-neutral-800 flex flex-col group relative">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-black/80 text-[#F5C518] font-black px-2 py-1 rounded text-sm flex items-center gap-1">
                        <span>★</span> {movie.vote_average?.toFixed(1)}
                      </div>
                      <button 
                        onClick={() => toggleWishlist(movie)}
                        className="absolute top-2 right-2 bg-black/80 p-2 rounded-full z-10 hover:bg-black"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${isSaved ? 'text-red-500' : 'text-white hover:text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg mb-1 truncate" title={movie.title}>{movie.title}</h3>
                      
                      {movie.genre_ids && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {getGenreNames(movie.genre_ids).slice(0, 2).map((genre, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800/80 text-neutral-300 border border-neutral-700/60 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] mr-1.5"></span>
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handlePlayTrailer(movie.id)}
                          className="bg-[#F5C518] hover:bg-yellow-500 text-black text-xs font-bold py-2 px-1 rounded transition-colors"
                        >
                          ▶ Trailer
                        </button>
                        <button 
                          onClick={() => handleAISummary(movie.title, movie.overview)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-1 rounded transition-colors"
                        >
                          ✨ AI Summary
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {showTrailerModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 md:p-12">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
            <button 
              onClick={() => setShowTrailerModal(false)} 
              className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
            {trailerKey ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1`}
                title="YouTube Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-400">
                No official YouTube trailer available.
              </div>
            )}
          </div>
        </div>
      )}

      <AISummaryModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        summary={aiSummary}
        title={activeAITitle}
        isLoading={isLoadingAI}
      />
    </div>
  );
}