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
    <div className="flex flex-col lg:flex-row gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-neutral-800 content-auto">
      <div className="w-full lg:w-[70%] flex flex-col bg-black rounded-lg overflow-hidden relative shadow-2xl">
        <div className="w-full aspect-video relative group">
          {isPlaying && trailerKey ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1`}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <div 
              className="w-full h-full relative cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <img
                src={activeMovie?.backdrop_path ? `${BACKDROP_BASE_URL}${activeMovie.backdrop_path}` : 'https://via.placeholder.com/780x439?text=No+Backdrop'}
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                alt={activeMovie?.title}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#F5C518] hover:bg-yellow-400 text-black flex items-center justify-center shadow-[0_0_30px_rgba(245,197,24,0.6)] transform group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 md:absolute md:bottom-0 md:left-0 md:right-0 md:bg-gradient-to-t md:from-black/90 md:to-transparent md:p-6 md:pointer-events-none bg-neutral-900 md:bg-transparent">
          <h3 className="text-xl md:text-3xl font-black text-white drop-shadow-md">{activeMovie?.title}</h3>
          {activeMovie?.genre_ids && (
            <div className="flex flex-wrap gap-2 mt-2 mb-1">
              {getGenreNames(activeMovie.genre_ids).map((genre, idx) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900/90 text-[#F5C518] border border-[#F5C518]/40 shadow-lg backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] mr-1.5"></span>
                  {genre}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm text-neutral-300 line-clamp-2 mt-1 md:mt-2 drop-shadow-md max-w-3xl">
            {activeMovie?.overview}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[30%] flex flex-col gap-3 overflow-y-auto max-h-[400px] lg:max-h-[500px] scrollbar-hide pr-2">
        {movies.map((movie) => (
          <button
            key={movie.id}
            onClick={() => handleSelectMovie(movie)}
            className={`flex items-start gap-3 p-2 rounded-lg transition-colors text-left w-full ${
              activeMovie.id === movie.id 
                ? 'bg-neutral-800 border border-[#F5C518]' 
                : 'hover:bg-neutral-800 border border-transparent'
            }`}
          >
            <img
              src={movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/150x225'}
              className="w-20 h-28 object-cover rounded-md shadow-md shrink-0"
              alt={movie.title}
              loading="lazy"
              decoding="async"
            />
            <div className="flex-1 overflow-hidden">
              <h4 className="font-bold text-sm text-white line-clamp-1">{movie.title}</h4>
              {movie.genre_ids && (
                <div className="flex flex-wrap gap-1 my-1">
                  {getGenreNames(movie.genre_ids).slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-neutral-900/90 text-neutral-300 border border-neutral-700/60 shadow-sm">
                      <span className="w-1 h-1 rounded-full bg-[#F5C518] mr-1"></span>
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{movie.overview}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}