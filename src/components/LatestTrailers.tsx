"use client";

import { useState, useEffect } from "react";
import { getMovieTrailer } from "@/actions/movieActions";
import { getGenreNames } from "@/lib/genres";
import { Play } from "lucide-react";

export default function LatestTrailers({ movies }: { movies: any[] }) {
  const [activeMovie, setActiveMovie] = useState(movies[0]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w342";
  const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";

  useEffect(() => {
    let isCurrent = true;
    
    async function fetchTrailer() {
      if (activeMovie) {
        const key = await getMovieTrailer(activeMovie.id);
        if (isCurrent) {
          setTrailerKey(key);
        }
      }
    }
    fetchTrailer();
    
    return () => {
      isCurrent = false;
    };
  }, [activeMovie]);

  const handleSelectMovie = (movie: any) => {
    setActiveMovie(movie);
    setIsPlaying(true); // User explicitly clicked a movie, start playing
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 bg-gradient-to-br from-neutral-900/90 via-neutral-950 to-black p-4 sm:p-6 rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl content-auto">
      {/* Main Cinema Screen */}
      <div className="w-full lg:w-[70%] flex flex-col bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 group">
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2 pointer-events-none">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#F5C518] border border-[#F5C518]/30 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {isPlaying ? "Live Screening" : "Cinema Premiere"}
          </span>
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md text-neutral-300 border border-white/15">
            4K UHD • DOLBY AUDIO
          </span>
        </div>

        <div className="w-full aspect-video relative group">
          {isPlaying && trailerKey ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1`}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <div 
              className="w-full h-full relative cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <img
                src={activeMovie?.backdrop_path ? `${BACKDROP_BASE_URL}${activeMovie.backdrop_path}` : 'https://via.placeholder.com/780x439?text=No+Backdrop'}
                className="w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-700 ease-out"
                alt={activeMovie?.title}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-center justify-center">
                <div className="relative group/btn flex items-center justify-center">
                  <div className="absolute -inset-3 rounded-full bg-[#F5C518]/25 blur-xl group-hover/btn:bg-[#F5C518]/40 transition-all duration-300" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F5C518] hover:bg-yellow-400 text-black flex items-center justify-center shadow-[0_0_35px_rgba(245,197,24,0.6)] transform group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 md:absolute md:bottom-0 md:left-0 md:right-0 md:bg-gradient-to-t md:from-black md:via-black/80 md:to-transparent md:p-6 md:pointer-events-none bg-neutral-950 md:bg-transparent">
          <div className="flex items-center gap-2 mb-1.5">
            {activeMovie?.vote_average && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md">
                <span className="text-[#F5C518]">★</span> {activeMovie.vote_average.toFixed(1)}
              </span>
            )}
            {activeMovie?.release_date && (
              <span className="text-xs text-neutral-400 font-medium">
                {activeMovie.release_date.substring(0, 4)}
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-3xl font-black text-white drop-shadow-md tracking-tight">{activeMovie?.title}</h3>
          {activeMovie?.genre_ids && (
            <div className="flex flex-wrap gap-1.5 mt-2 mb-1">
              {getGenreNames(activeMovie.genre_ids).map((genre, idx) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900/90 text-[#F5C518] border border-[#F5C518]/40 shadow-lg backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] mr-1.5"></span>
                  {genre}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 mt-1 md:mt-2 drop-shadow-md max-w-3xl leading-relaxed">
            {activeMovie?.overview}
          </p>
        </div>
      </div>

      {/* Playlist Side Column */}
      <div className="w-full lg:w-[30%] flex flex-col gap-2.5 overflow-y-auto max-h-[420px] lg:max-h-[520px] scrollbar-hide pr-1">
        <div className="flex items-center justify-between pb-2 px-1 border-b border-white/10 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Up Next In Queue</span>
          <span className="text-[10px] font-bold text-[#F5C518] bg-[#F5C518]/10 px-2 py-0.5 rounded-full border border-[#F5C518]/20">
            {movies.length} Clips
          </span>
        </div>
        
        {movies.map((movie) => {
          const isSelected = activeMovie.id === movie.id;
          return (
            <button
              key={movie.id}
              onClick={() => handleSelectMovie(movie)}
              className={`flex items-start gap-3 p-2.5 rounded-2xl transition-all duration-300 text-left w-full cursor-pointer ${
                isSelected 
                  ? 'bg-white/[0.08] border border-[#F5C518]/70 shadow-[0_0_20px_rgba(245,197,24,0.15)] scale-[1.01]' 
                  : 'hover:bg-white/[0.04] border border-white/5 hover:border-white/15'
              }`}
            >
              <div className="relative w-20 h-24 rounded-xl overflow-hidden shadow-md shrink-0 bg-neutral-900">
                <img
                  src={movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/150x225'}
                  className="w-full h-full object-cover"
                  alt={movie.title}
                  loading="lazy"
                  decoding="async"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-[#F5C518]/30 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="w-6 h-6 rounded-full bg-[#F5C518] text-black flex items-center justify-center shadow-md">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className={`font-bold text-xs sm:text-sm line-clamp-1 transition-colors ${isSelected ? 'text-[#F5C518]' : 'text-white'}`}>
                  {movie.title}
                </h4>
                {movie.genre_ids && (
                  <div className="flex flex-wrap gap-1 my-1">
                    {getGenreNames(movie.genre_ids).slice(0, 2).map((genre, idx) => (
                      <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-white/5 text-neutral-300 border border-white/10">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-tight">{movie.overview}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}