"use client";

import { useState } from "react";
import { getMovieTrailer } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import { useWishlist } from "@/context/WishlistContext";
import { getGenreNames } from "@/lib/genres";
import AISummaryModal from "@/components/AISummaryModal";
import InfoModal from "@/components/InfoModal";
import { Info } from "lucide-react";

export default function TopTenCard({ item, index }: { item: any, index: number }) {
  const genres = getGenreNames(item.genre_ids);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  const { wishlist, toggleWishlist } = useWishlist();
  const isInWishlist = wishlist.some((w: any) => w.id === item.id);
  
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const handlePlayTrailer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    const mediaType = item.name && !item.title ? "tv" : "movie";
    
    const key = await getMovieTrailer(item.id, mediaType);
    
    setTrailerKey(key);
    setShowModal(true);
    setIsLoading(false);
  };

  const handleAISummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAIModal(true);
    if (!aiSummary) {
      setIsLoadingAI(true);
      const summary = await getAISummary(item.title || item.name || "Untitled", item.overview || "No plot overview available.");
      setAiSummary(summary);
      setIsLoadingAI(false);
    }
  };
  
  return (
    <>
      <div className="relative flex-shrink-0 snap-start flex items-center h-48 md:h-64 mt-4 group/card overflow-visible">
        <span 
          className="absolute left-0 -translate-x-8 md:-translate-x-12 text-[8rem] md:text-[12rem] font-black leading-none select-none z-0"
          style={{
            WebkitTextStroke: "4px #555",
            color: "#121212", 
            textShadow: "4px 4px 10px rgba(0,0,0,0.8)",
          }}
        >
          {index + 1}
        </span>
        
        <div className="relative z-10 w-32 md:w-44 h-full ml-12 md:ml-16">
          <div className="absolute inset-0 rounded-lg bg-neutral-900 transition-all duration-300 delay-300 md:group-hover/card:scale-125 md:group-hover/card:z-50 md:group-hover/card:-translate-y-6 md:group-hover/card:shadow-2xl overflow-hidden cursor-pointer z-10 flex flex-col border border-transparent md:group-hover/card:border-neutral-700 origin-bottom-left">
            <div className="relative w-full h-full md:group-hover/card:h-[50%] transition-all duration-300 delay-300 shrink-0">
              <img 
                src={`${IMAGE_BASE_URL}${item.poster_path}`} 
                alt={item.title || item.name}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-2 right-2 flex flex-col gap-2 z-30">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item);
                  }}
                  className="p-1.5 bg-black/60 rounded-full hover:bg-black/80 transition-colors border border-neutral-700 hover:border-transparent shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isInWishlist ? "red" : "none"}
                    stroke={isInWishlist ? "red" : "white"}
                    strokeWidth="2"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfoModal(true);
                  }}
                  className="p-1.5 bg-black/60 rounded-full hover:bg-black/80 flex items-center justify-center text-white hover:text-indigo-400 transition-colors border border-neutral-700 hover:border-transparent shadow-lg"
                >
                  <Info className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-100 md:opacity-0 flex flex-col justify-end p-2.5 md:hidden">
                <span className="text-white text-xs font-bold mb-1 line-clamp-2">
                  {item.title || item.name}
                </span>
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {genres.slice(0, 2).map((genre, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-black/60 text-[#F5C518] border border-[#F5C518]/30 backdrop-blur-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-col space-y-1.5">
                  <button 
                    onClick={handlePlayTrailer}
                    disabled={isLoading}
                    className="bg-[#F5C518] hover:bg-yellow-500 text-black text-xs font-bold py-1.5 px-2 rounded w-full transition-colors relative z-20"
                  >
                    {isLoading ? '...' : '▶ Trailer'}
                  </button>
                  <button 
                    onClick={handleAISummary}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-2 rounded w-full transition-colors relative z-20"
                  >
                    ✨ AI Summary
                  </button>
                </div>
              </div>
            </div>

            <div className="h-0 opacity-0 md:group-hover/card:h-[50%] md:group-hover/card:opacity-100 bg-[#141414] transition-all duration-300 delay-300 flex flex-col p-2.5 w-full overflow-hidden">
              <h3 className="font-bold text-white text-xs mb-1 truncate">{item.title || item.name}</h3>
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {genres.slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-semibold bg-neutral-800/80 text-neutral-300 border border-neutral-700/60 shadow-inner truncate max-w-[80px]">
                      <span className="w-1 h-1 rounded-full bg-[#F5C518] mr-1 shrink-0"></span>
                      <span className="truncate">{genre}</span>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[8px] md:text-[9px] text-neutral-300 line-clamp-2 mb-1.5 leading-tight flex-grow">{item.overview}</p>
              <div className="flex gap-1.5 mt-auto">
                <button 
                  onClick={handlePlayTrailer} 
                  disabled={isLoading}
                  className="bg-[#F5C518] hover:bg-yellow-500 text-black text-[9px] font-bold py-1.5 px-2 rounded flex-1 transition-colors relative z-20"
                >
                  {isLoading ? '...' : '▶ Play'}
                </button>
                <button 
                  onClick={handleAISummary}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold py-1.5 px-2 rounded flex-1 transition-colors relative z-20"
                >
                  ✨ AI Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 md:p-12">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
            <button 
              onClick={() => setShowModal(false)} 
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

      {showInfoModal && (
        <InfoModal movie={item} onClose={() => setShowInfoModal(false)} />
      )}

      <AISummaryModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        summary={aiSummary}
        title={item.title || item.name || "Untitled"}
        isLoading={isLoadingAI}
      />
    </>
  );
}