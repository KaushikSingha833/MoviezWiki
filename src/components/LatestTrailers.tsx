"use client";

import { useState, useEffect } from "react";
import { getMovieTrailer } from "@/actions/movieActions";
import { getGenreNames } from "@/lib/genres";

export default function LatestTrailers({ movies }: { movies: any[] }) {
  const [activeMovie, setActiveMovie] = useState(movies[0]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

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

  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-neutral-800">
      <div className="w-full lg:w-[70%] flex flex-col bg-black rounded-lg overflow-hidden relative shadow-2xl">
        <div className="w-full aspect-video relative">
          {trailerKey ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1`}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={`${IMAGE_BASE_URL}${activeMovie?.backdrop_path}`}
              className="w-full h-full object-cover opacity-50"
              alt={activeMovie?.title}
            />
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
            onClick={() => setActiveMovie(movie)}
            className={`flex items-start gap-3 p-2 rounded-lg transition-colors text-left w-full ${
              activeMovie.id === movie.id 
                ? 'bg-neutral-800 border border-[#F5C518]' 
                : 'hover:bg-neutral-800 border border-transparent'
            }`}
          >
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              className="w-20 h-28 object-cover rounded-md shadow-md shrink-0"
              alt={movie.title}
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