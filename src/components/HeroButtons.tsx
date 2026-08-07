"use client";

import { useState } from "react";
import { getMovieTrailer } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import AISummaryModal from "@/components/AISummaryModal";

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
      <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
        <button 
          onClick={handlePlayTrailer}
          disabled={isLoading}
          className="w-full sm:w-auto bg-[#F5C518] text-black font-bold py-3 px-8 rounded-md hover:bg-yellow-500 hover:scale-105 transition-all duration-300 flex justify-center items-center shadow-lg disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          {isLoading ? "..." : "Play"}
        </button>
        <button 
          onClick={handleAISummary}
          className="w-full sm:w-auto bg-neutral-500/50 text-white font-bold py-3 px-8 rounded-md hover:bg-neutral-500/70 hover:scale-105 transition-all duration-300 flex justify-center items-center backdrop-blur-sm shadow-lg border border-neutral-500/50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ✨ AI Summary
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