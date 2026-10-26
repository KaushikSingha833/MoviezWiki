"use client";

import { useState } from "react";
import Link from "next/link";
import { getMovieTrailer } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import AISummaryModal from "@/components/AISummaryModal";
import { Play, Video, Sparkles, Loader2 } from "lucide-react";

export default function HeroButtons({ movie, onInteractionChange }: { movie: any, onInteractionChange?: (acting: boolean) => void }) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleAISummary = async () => {
    if (!movie) return;
    setShowAIModal(true);
    if (onInteractionChange) onInteractionChange(true);
    if (!aiSummary) {
      setIsLoadingAI(true);
      const summary = await getAISummary(movie.title || movie.name || "Untitled", movie.overview || "No plot overview available.");
      setAiSummary(summary);
      setIsLoadingAI(false);
    }
  };

  const handlePlayTrailer = async () => {
    if (!movie) return;
    setIsLoading(true);
    
    const mediaType = movie.name && !movie.title ? "tv" : "movie";
    const key = await getMovieTrailer(movie.id, mediaType);
    
    setTrailerKey(key);
    setShowModal(true);
    if (onInteractionChange) onInteractionChange(true);
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-3 w-full sm:w-auto flex-wrap">
        <Link
          href={`/watch/${movie?.name && !movie?.title ? 'tv' : 'movie'}/${movie?.id}`}
          className="w-full sm:w-auto bg-gradient-to-r from-[#F5C518] to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-black font-extrabold py-3.5 px-8 rounded-full shadow-[0_0_30px_rgba(245,197,24,0.4)] hover:shadow-[0_0_40px_rgba(245,197,24,0.6)] hover:scale-105 active:scale-95 transition-all flex justify-center items-center gap-2 shrink-0 group"
        >
          <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
          <span>Watch {movie?.name && !movie?.title ? 'Series' : 'Movie'}</span>
        </Link>
        
        <button 
          onClick={handlePlayTrailer}
          disabled={isLoading}
          className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-7 rounded-full backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-lg hover:scale-105 active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-neutral-300" />
          ) : (
            <Video className="w-5 h-5 text-neutral-300" />
          )}
          <span>Trailer</span>
        </button>

        <button 
          onClick={handleAISummary}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-indigo-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 text-white font-bold py-3.5 px-7 rounded-full backdrop-blur-xl border border-purple-500/30 hover:border-purple-500/60 shadow-lg hover:scale-105 active:scale-95 transition-all flex justify-center items-center gap-2 shrink-0"
        >
          <Sparkles className="w-5 h-5 text-[#F5C518]" />
          <span>AI Insights</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 md:p-12">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
            <button 
              onClick={() => { setShowModal(false); if (onInteractionChange) onInteractionChange(false); }} 
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
        onClose={() => { setShowAIModal(false); if (onInteractionChange) onInteractionChange(false); }}
        summary={aiSummary}
        title={movie?.title || movie?.name || "Untitled"}
        isLoading={isLoadingAI}
      />
    </>
  );
}