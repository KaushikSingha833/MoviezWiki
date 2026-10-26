"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Video, Sparkles, Star, Clapperboard } from "lucide-react";
import { getMovieTrailer } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import AISummaryModal from "@/components/AISummaryModal";
import { getGenreNames } from "@/lib/genres";

const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

export default function CinematicSpotlight({ 
  movie, 
  spotlightBadge = "IMAX Spotlight Premiere" 
}: { 
  movie: any;
  spotlightBadge?: string;
}) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  if (!movie) return null;

  const mediaType = movie.name && !movie.title ? "tv" : "movie";
  const title = movie.title || movie.name;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "8.4";
  const releaseYear = (movie.release_date || movie.first_air_date)?.slice(0, 4) || "2026";
  const genres = movie.genre_ids ? getGenreNames(movie.genre_ids).slice(0, 3) : [];

  const handlePlayTrailer = async () => {
    setIsLoadingTrailer(true);
    const key = await getMovieTrailer(movie.id, mediaType);
    setTrailerKey(key);
    setShowModal(true);
    setIsLoadingTrailer(false);
  };

  const handleAISummary = async () => {
    setShowAIModal(true);
    if (!aiSummary) {
      setIsLoadingAI(true);
      const summary = await getAISummary(title, movie.overview || "Curator spotlight title.");
      setAiSummary(summary);
      setIsLoadingAI(false);
    }
  };

  return (
    <section className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] bg-[#0c0c0c] my-10 md:my-14 content-auto">
      {/* Background Backdrop with Parallax Scale on Hover */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={`${BACKDROP_BASE_URL}${movie.backdrop_path}`}
          alt={title}
          className="w-full h-full object-cover object-center opacity-40 md:opacity-50 scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
          loading="lazy"
          decoding="async"
        />
        {/* Deep Apple TV+ / IMAX Style Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/80 md:via-[#0c0c0c]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/90 md:via-[#0c0c0c]/70 to-transparent" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#F5C518]/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col justify-end p-6 sm:p-10 md:p-14 min-h-[380px] md:min-h-[480px] max-w-3xl">
        {/* Spotlight Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#F5C518]/25 to-yellow-600/15 backdrop-blur-xl border border-[#F5C518]/50 shadow-[0_0_15px_rgba(245,197,24,0.3)]">
            <Clapperboard className="w-3.5 h-3.5 text-[#F5C518]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#F5C518]">
              {spotlightBadge}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-sm">
            <Star className="w-3.5 h-3.5 text-[#F5C518] fill-[#F5C518]" />
            <span>{rating}</span>
          </div>

          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold text-neutral-300 border border-white/15 bg-white/5 backdrop-blur-sm">
            {releaseYear}
          </span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-black tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm">
            4K ULTRA HD
          </span>
        </div>

        {/* Title */}
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-3 drop-shadow-xl">
          {title}
        </h3>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {genres.map((g, idx) => (
              <span 
                key={idx}
                className="text-xs font-semibold text-neutral-300 border border-white/10 bg-black/40 backdrop-blur-md rounded-full px-3 py-0.5"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl line-clamp-3 leading-relaxed mb-6 font-normal drop-shadow">
          {movie.overview}
        </p>

        {/* Interactive Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/watch/${mediaType}/${movie.id}`}
            className="bg-gradient-to-r from-[#F5C518] to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-black font-extrabold py-3 px-7 rounded-full shadow-[0_0_30px_rgba(245,197,24,0.35)] hover:shadow-[0_0_40px_rgba(245,197,24,0.55)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
            <span>Stream Now</span>
          </Link>

          <button
            onClick={handlePlayTrailer}
            disabled={isLoadingTrailer}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Video className="w-4 h-4 text-neutral-300" />
            <span>{isLoadingTrailer ? "Loading..." : "Watch Trailer"}</span>
          </button>

          <button
            onClick={handleAISummary}
            className="bg-purple-600/20 hover:bg-purple-600/35 text-white font-bold py-3 px-6 rounded-full backdrop-blur-xl border border-purple-500/30 hover:border-purple-500/60 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#F5C518]" />
            <span className="hidden sm:inline">AI Analysis</span>
          </button>
        </div>
      </div>

      {/* Trailer Modal */}
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
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-400">
                No official trailer found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      <AISummaryModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        summary={aiSummary}
        title={title}
        isLoading={isLoadingAI}
      />
    </section>
  );
}
