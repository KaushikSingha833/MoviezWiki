"use client";

import { useState, useEffect } from "react";
import { getMovieTrailer, getTVDetails, getTVSeasonTrailer } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import { X, Play, Sparkles, Star, Calendar, Tv } from "lucide-react";
import { getGenreNames } from "@/lib/genres";
import AISummaryModal from "./AISummaryModal";

export default function InfoModal({ movie, onClose }: { movie: any, onClose: () => void }) {
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"; // High res for modal
  const THUMB_BASE_URL = "https://image.tmdb.org/t/p/w500";
  
  const isTV = (movie.name && !movie.title) || movie.media_type === "tv";
  const title = movie.title || movie.name;
  const genres = getGenreNames(movie.genre_ids);
  
  // States for standard actions
  const [mainTrailerKey, setMainTrailerKey] = useState<string | null>(null);
  const [showMainTrailer, setShowMainTrailer] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  
  // States specific to TV Series
  const [tvSeasons, setTvSeasons] = useState<any[]>([]);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(isTV);

  useEffect(() => {
    if (isTV) {
      loadTVData();
    }
  }, [movie.id, isTV]);

  const loadTVData = async () => {
    setIsLoadingSeasons(true);
    const details = await getTVDetails(movie.id);
    if (details && details.seasons) {
      // Filter out 'Specials' (season_number 0) and load trailers for valid seasons
      const validSeasons = details.seasons.filter((s: any) => s.season_number > 0);
      
      const seasonsWithTrailers = await Promise.all(
        validSeasons.map(async (season: any) => {
          const trailer = await getTVSeasonTrailer(movie.id, season.season_number);
          return { ...season, trailer_key: trailer };
        })
      );
      setTvSeasons(seasonsWithTrailers);
    }
    setIsLoadingSeasons(false);
  };

  const handlePlayMainTrailer = async () => {
    setIsLoadingAction(true);
    const key = await getMovieTrailer(movie.id, isTV ? "tv" : "movie");
    setMainTrailerKey(key);
    setShowMainTrailer(true);
    setIsLoadingAction(false);
  };

  const handleAISummary = async () => {
    setShowAIModal(true);
    if (!aiSummary) {
      setIsLoadingAction(true);
      const summary = await getAISummary(title, movie.overview);
      setAiSummary(summary);
      setIsLoadingAction(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 px-0 sm:px-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        
        {/* Modal Container */}
        <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#141414] rounded-2xl overflow-y-auto shadow-2xl border border-neutral-800 animate-in fade-in zoom-in-95 duration-300 scrollbar-hide">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] bg-black/60 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Section */}
          <div className="relative w-full h-[50vh] md:h-[60vh]">
            <img 
              src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`} 
              className="w-full h-full object-cover"
              alt={title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
            
            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">{title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold mb-6">
                <span className="text-green-500 font-bold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-green-500" /> {(movie.vote_average * 10).toFixed(0)}% Match
                </span>
                <span className="text-neutral-300 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {movie.release_date ? movie.release_date.split('-')[0] : movie.first_air_date ? movie.first_air_date.split('-')[0] : "N/A"}
                </span>
                {isTV && (
                  <span className="border border-neutral-600 px-2 py-0.5 rounded text-neutral-300 text-xs tracking-wider flex items-center gap-1">
                    <Tv className="w-3 h-3" /> SERIES
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePlayMainTrailer}
                  disabled={isLoadingAction}
                  className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-6 md:px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-black" /> {isLoadingAction ? 'Loading...' : 'Play Trailer'}
                </button>
                <button 
                  onClick={handleAISummary}
                  className="flex items-center gap-2 bg-neutral-600/60 hover:bg-neutral-600/80 backdrop-blur-md text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 border border-neutral-500"
                >
                  <Sparkles className="w-5 h-5 text-[#F5C518]" /> Insight Summaries
                </button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-12 md:pt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light">
                {movie.overview}
              </p>
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <span className="text-neutral-500">Genres:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {genres.map((g, idx) => (
                    <span key={idx} className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs font-semibold border border-neutral-700">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-neutral-500">Popularity Score:</span>
                <p className="text-white font-medium">{movie.popularity?.toFixed(0)} Points</p>
              </div>
            </div>
          </div>

          {/* TV Shows Exclusive: Season Traversing */}
          {isTV && (
            <div className="p-6 md:p-12 pt-0">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl font-black text-white">Episodes & Seasons</h3>
                <div className="h-px bg-neutral-800 flex-1" />
              </div>

              {isLoadingSeasons ? (
                <div className="flex items-center gap-3 text-neutral-500 font-bold p-8 justify-center bg-neutral-900/40 rounded-xl border border-neutral-800">
                  <div className="w-5 h-5 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
                  Extracting Season Data...
                </div>
              ) : tvSeasons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tvSeasons.map((season) => (
                    <div key={season.id} className="group relative bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-colors shadow-lg flex flex-col">
                      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                         {season.poster_path ? (
                            <img src={`${THUMB_BASE_URL}${season.poster_path}`} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-500" alt={season.name} />
                         ) : (
                            <div className="text-neutral-700 font-bold">No Image</div>
                         )}
                         
                         {season.trailer_key ? (
                            <button 
                              onClick={() => { setMainTrailerKey(season.trailer_key); setShowMainTrailer(true); }}
                              className="absolute inset-0 m-auto w-12 h-12 bg-white/20 hover:bg-[#F5C518] text-white hover:text-black backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                            >
                              <Play className="w-5 h-5 fill-current ml-1" />
                            </button>
                         ) : (
                            <div className="absolute inset-x-0 bottom-4 text-center">
                              <span className="bg-black/80 text-neutral-400 text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-neutral-700">No Trailer Found</span>
                            </div>
                         )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-white text-base mb-1">{season.name}</h4>
                          <p className="text-neutral-500 text-xs font-semibold">{season.episode_count} Episodes • {season.air_date ? season.air_date.split('-')[0] : 'TBA'}</p>
                        </div>
                        {season.overview && (
                          <p className="text-neutral-400 text-xs line-clamp-3 mt-3">{season.overview}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-500 italic">Could not fetch season data.</div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Embedded Main Trailer Modal from MovieCard */}
      {showMainTrailer && mainTrailerKey && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 md:p-12">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] border border-neutral-800">
            <button 
              onClick={() => setShowMainTrailer(false)} 
              className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-neutral-800 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${mainTrailerKey}?autoplay=1&controls=1`}
              title="YouTube Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Embedded AI Modal */}
      <AISummaryModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        summary={aiSummary}
        title={title}
        isLoading={isLoadingAction}
      />
    </>
  );
}
