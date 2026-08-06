"use client";

import { useState } from "react";
import { getMovieTrailer } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import { useWishlist } from "@/context/WishlistContext";
import { getGenreNames } from "@/lib/genres";
import AISummaryModal from "./AISummaryModal";

export default function MovieCard({ movie }: { movie: any }) {
  const genres = getGenreNames(movie.genre_ids);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const isSaved = isInWishlist(movie.id);

  const handlePlayTrailer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoadingTrailer(true);
    const mediaType = movie.name && !movie.title ? "tv" : "movie";
    const key = await getMovieTrailer(movie.id, mediaType);
    setTrailerKey(key);
    setShowTrailerModal(true);
    setIsLoadingTrailer(false);
  };

  const handleAISummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAIModal(true);
    if (!aiSummary) {
      setIsLoadingAI(true);
      const summary = await getAISummary(movie.title || movie.name, movie.overview);
      setAiSummary(summary);
      setIsLoadingAI(false);
    }
  };

  return (
    <>
      <div className="relative w-full aspect-[2/3] group/card">
        <div className="absolute inset-0 rounded-lg bg-neutral-900 transition-all duration-300 delay-300 md:group-hover/card:scale-125 md:group-hover/card:z-50 md:group-hover/card:-translate-y-6 md:group-hover/card:shadow-2xl overflow-hidden cursor-pointer z-10 flex flex-col border border-transparent md:group-hover/card:border-neutral-700">
          <div className="relative w-full h-full md:group-hover/card:h-[50%] transition-all duration-300 delay-300 shrink-0">
            <img 
              src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
              alt={movie.title || movie.name}
              className="w-full h-full object-cover"
            />
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(movie);
              }}
              className="absolute top-2 right-2 bg-black/60 p-2 rounded-full opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 delay-300 z-10 hover:bg-black/80"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors ${isSaved ? 'text-red-500' : 'text-white hover:text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-100 md:opacity-0 flex flex-col justify-end p-3 md:hidden">
              <h3 className="font-bold text-white mb-1 text-xs line-clamp-2 drop-shadow-md">{movie.title || movie.name}</h3>
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {genres.slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/60 text-[#F5C518] border border-[#F5C518]/30 backdrop-blur-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-col space-y-1.5">
                <button 
                  onClick={handlePlayTrailer} 
                  disabled={isLoadingTrailer}
                  className="bg-[#F5C518] hover:bg-yellow-500 text-black text-xs font-bold py-1.5 px-2 rounded w-full transition-colors relative z-20"
                >
                  {isLoadingTrailer ? '...' : '▶ Play'}
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

          <div className="h-0 opacity-0 md:group-hover/card:h-[50%] md:group-hover/card:opacity-100 bg-[#141414] transition-all duration-300 delay-300 flex flex-col p-3 w-full overflow-hidden">
            <h3 className="font-bold text-white text-xs md:text-sm mb-1 truncate">{movie.title || movie.name}</h3>
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {genres.slice(0, 2).map((genre, idx) => (
                  <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-neutral-800/80 text-neutral-300 border border-neutral-700/60 shadow-inner truncate max-w-[85px]">
                    <span className="w-1 h-1 rounded-full bg-[#F5C518] mr-1 shrink-0"></span>
                    <span className="truncate">{genre}</span>
                  </span>
                ))}
              </div>
            )}
            <p className="text-[9px] text-neutral-400 line-clamp-2 mb-2 leading-snug flex-grow">{movie.overview}</p>
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={handlePlayTrailer} 
                disabled={isLoadingTrailer}
                className="bg-[#F5C518] hover:bg-yellow-500 text-black text-[10px] font-bold py-1.5 px-2 rounded flex-1 transition-colors relative z-20"
              >
                {isLoadingTrailer ? '...' : '▶ Play Trailer'}
              </button>
              <button 
                onClick={handleAISummary}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 px-2 rounded flex-1 transition-colors relative z-20"
              >
                ✨ AI Summary
              </button>
            </div>
          </div>
        </div>
      </div>

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
        title={movie.title || movie.name}
        isLoading={isLoadingAI}
      />
    </>
  );
}