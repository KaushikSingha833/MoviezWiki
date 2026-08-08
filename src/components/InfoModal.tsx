"use client";

import { useState, useEffect } from "react";
import { getMovieTrailer, getTVDetails, getTVSeasonTrailer, getStreamingProviders, getMediaCredits, getMediaReviews } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import { X, Play, Sparkles, Star, Calendar, Tv, MessageCircle, User, Share2 } from "lucide-react";
import { getGenreNames } from "@/lib/genres";
import AISummaryModal from "./AISummaryModal";
import MovieCard from "./MovieCard";
import { getSimilarMedia } from "@/actions/movieActions";

const getDirectPlatformLink = (providerName: string, title: string) => {
  const query = encodeURIComponent(title);
  const name = providerName.toLowerCase();
  
  if (name.includes("netflix")) return `https://www.netflix.com/search?q=${query}`;
  if (name.includes("amazon") || name.includes("prime")) return `https://www.amazon.com/s?k=${query}&i=instant-video`;
  if (name.includes("hulu")) return `https://www.hulu.com/search?q=${query}`;
  if (name.includes("disney") || name.includes("hotstar")) return `https://www.hotstar.com/in/explore?searchQuery=${query}`;
  if (name.includes("apple")) return `https://tv.apple.com/us/search?q=${query}`;
  if (name.includes("peacock")) return `https://www.peacocktv.com/watch/search?q=${query}`;
  if (name.includes("max") || name.includes("hbo")) return `https://play.max.com/search?q=${query}`;
  if (name.includes("paramount")) return `https://www.paramountplus.com/search/?q=${query}`;
  if (name.includes("crunchyroll")) return `https://www.crunchyroll.com/search?q=${query}`;
  
  return `https://www.google.com/search?q=${encodeURIComponent(title + " streaming on " + providerName)}`;
};

export default function InfoModal({ movie, onClose }: { movie: any, onClose: () => void }) {
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
  const THUMB_BASE_URL = "https://image.tmdb.org/t/p/w500";
  
  const isTV = (movie.name && !movie.title) || movie.media_type === "tv";
  const title = movie.title || movie.name;
  const genres = getGenreNames(movie.genre_ids);
  
  const [mainTrailerKey, setMainTrailerKey] = useState<string | null>(null);
  const [showMainTrailer, setShowMainTrailer] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  
  const [tvSeasons, setTvSeasons] = useState<any[]>([]);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(isTV);

  const [providersData, setProvidersData] = useState<{ providers: any[], watchLink: string } | null>(null);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  const [similarMedia, setSimilarMedia] = useState<any[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);

  // New Cast States
  const [cast, setCast] = useState<any[]>([]);
  const [isLoadingCast, setIsLoadingCast] = useState(true);

  // New Reviews States
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(5);

  useEffect(() => {
    if (isTV) {
      loadTVData();
    }
    
    const loadProviders = async () => {
      setIsLoadingProviders(true);
      const data = await getStreamingProviders(movie.id, isTV ? "tv" : "movie");
      setProvidersData(data);
      setIsLoadingProviders(false);
    };

    const loadSimilar = async () => {
      setIsLoadingSimilar(true);
      const similar = await getSimilarMedia(movie.id, isTV ? "tv" : "movie");
      setSimilarMedia(similar);
      setIsLoadingSimilar(false);
    };

    const loadCast = async () => {
      setIsLoadingCast(true);
      const castData = await getMediaCredits(movie.id, isTV ? "tv" : "movie");
      setCast(castData.slice(0, 15)); // Top 15 actors for the scroll UI
      setIsLoadingCast(false);
    };
    
    loadProviders();
    loadCast();
    loadSimilar();
  }, [movie.id, isTV]);

  const loadTVData = async () => {
    setIsLoadingSeasons(true);
    const details = await getTVDetails(movie.id);
    if (details && details.seasons) {
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

  const handleShowReviews = async () => {
    setShowReviews(!showReviews);
    if (!showReviews && reviews.length === 0) {
      setIsLoadingReviews(true);
      const fetchedReviews = await getMediaReviews(movie.id, isTV ? "tv" : "movie");
      setReviews(fetchedReviews);
      setIsLoadingReviews(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/movies/${movie.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${title} on MoviezWiki!`,
          url: url
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const getAvatarFallback = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("/http")) return path.substring(1);
    return `https://image.tmdb.org/t/p/w200${path}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 px-0 sm:px-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
        
        {/* Modal Container */}
        <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#141414] rounded-2xl overflow-y-auto shadow-2xl border border-neutral-800 animate-in fade-in zoom-in-95 duration-300 scrollbar-hide">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] bg-black/60 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors backdrop-blur-md border border-neutral-600"
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
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <button 
                  onClick={handlePlayMainTrailer}
                  disabled={isLoadingAction}
                  className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-5 md:px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-xl text-sm md:text-base"
                >
                  <Play className="w-5 h-5 fill-black" /> {isLoadingAction ? 'Loading...' : 'Play Trailer'}
                </button>
                <button 
                  onClick={handleAISummary}
                  className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700/80 backdrop-blur-md text-white px-5 md:px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 border border-neutral-600 shadow-xl text-sm md:text-base"
                >
                  <Sparkles className="w-5 h-5 text-[#F5C518]" /> Insight Summaries
                </button>
                <button 
                  onClick={handleShowReviews}
                  className={`flex items-center gap-2 px-5 md:px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-xl border text-sm md:text-base ${
                    showReviews 
                      ? "bg-[#F5C518] text-black border-[#F5C518]" 
                      : "bg-black/60 hover:bg-neutral-800/80 backdrop-blur-md text-white border-neutral-600"
                  }`}
                >
                  <MessageCircle className={`w-5 h-5 ${showReviews ? "text-black" : "text-[#F5C518]"}`} /> Audience Reviews
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 md:px-5 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-xl border bg-black/60 hover:bg-neutral-800/80 backdrop-blur-md text-white border-neutral-600 text-sm md:text-base"
                >
                  <Share2 className="w-5 h-5 text-emerald-400" /> Share
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
            
            {/* Right Side Stats & Providers */}
            <div className="flex flex-col gap-6 text-sm">
              <div>
                <span className="text-neutral-500 block mb-2">Genres:</span>
                <div className="flex flex-wrap gap-2">
                  {genres.map((g, idx) => (
                    <span key={idx} className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs font-semibold border border-neutral-700">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="h-px bg-neutral-800 w-full"></div>
              
              <div>
                <span className="text-neutral-500 block mb-2">Where to Watch:</span>
                {isLoadingProviders ? (
                  <div className="text-neutral-400 text-xs flex items-center gap-2">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div> Scanning platforms...
                  </div>
                ) : providersData && providersData.providers.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {providersData.providers.map((p: any) => {
                      const platformName = p.provider_name.toLowerCase().includes("hotstar") ? "Jio Hotstar" : p.provider_name;
                      return (
                      <a 
                        key={p.provider_id} 
                        href={getDirectPlatformLink(p.provider_name, title)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative group/provider block"
                      >
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${p.logo_path}`} 
                          alt={platformName}
                          className="w-10 h-10 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-neutral-700 hover:scale-110 hover:border-emerald-400 transition-all duration-300 pointer-events-auto"
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold tracking-wide whitespace-nowrap px-2 py-1 rounded shadow-lg border border-neutral-800 opacity-0 group-hover/provider:opacity-100 pointer-events-none z-[150] transition-opacity">
                          Stream on {platformName}
                        </div>
                      </a>
                    )})}
                  </div>
                ) : (
                  <span className="inline-block bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs px-3 py-1.5 rounded-full font-medium">
                    Not Currently Streaming
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Top Cast Section */}
          <div className="px-6 md:px-12 pb-8">
            <div className="flex items-center gap-4 mb-5">
              <h3 className="text-xl font-bold text-white">Top Cast</h3>
              <div className="h-px bg-neutral-800 flex-1" />
            </div>

            {isLoadingCast ? (
               <div className="flex items-center gap-3 text-neutral-500 font-bold justify-center bg-neutral-900/40 rounded-xl border border-neutral-800 p-6">
                 <div className="w-4 h-4 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" /> 
                 Extracting Cast Roster...
               </div>
            ) : cast.length > 0 ? (
               <div className="flex overflow-x-auto gap-4 md:gap-6 pb-2 scrollbar-hide snap-x">
                 {cast.map(c => (
                   <div key={c.id} className="flex-shrink-0 w-24 snap-start group/cast flex flex-col items-center">
                     <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-neutral-800 border-2 border-transparent group-hover/cast:border-[#F5C518] transition-all duration-300 shadow-xl mb-3">
                       {c.profile_path ? (
                         <img src={`${THUMB_BASE_URL}${c.profile_path}`} className="w-full h-full object-cover group-hover/cast:scale-110 transition-transform duration-500" alt={c.name} />
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 text-xs bg-neutral-900 font-medium">No Photo</div>
                       )}
                     </div>
                     <p className="text-white text-xs font-bold text-center w-full leading-tight mb-1">{c.name}</p>
                     <p className="text-neutral-500 text-[10px] font-medium text-center w-full line-clamp-2">{c.character}</p>
                   </div>
                 ))}
               </div>
            ) : (
               <p className="text-neutral-500 text-sm italic">No cast information available.</p>
            )}
          </div>

          {/* Collapsible Reviews Section */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showReviews ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="px-6 md:px-12 pb-8 bg-black/40 border-y border-neutral-800/50 py-8">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-[#F5C518]" /> Audience Reviews
                </h3>
                <div className="h-px bg-neutral-800 flex-1" />
              </div>

              {isLoadingReviews ? (
                 <div className="flex items-center gap-3 text-neutral-500 font-bold p-8 justify-center bg-neutral-900/40 rounded-xl border border-neutral-800">
                   <div className="w-5 h-5 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
                   Fetching real user opinions...
                 </div>
              ) : reviews.length > 0 ? (
                 <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x items-stretch">
                   {reviews.slice(0, visibleReviewsCount).map((r, i) => {
                     const avatarUrl = getAvatarFallback(r.author_details?.avatar_path);
                     const rating = r.author_details?.rating;
                     return (
                       <div key={i} className="flex-shrink-0 w-80 sm:w-96 snap-start bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 shadow-xl hover:border-neutral-700 transition-colors flex flex-col max-h-[350px]">
                         <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-[#F5C518]/50 overflow-hidden flex items-center justify-center shrink-0">
                               {avatarUrl ? (
                                 <img src={avatarUrl} alt={r.author} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                               ) : (
                                 <User className="w-5 h-5 text-neutral-500" />
                               )}
                             </div>
                             <div>
                               <p className="text-white text-sm font-bold line-clamp-1">{r.author}</p>
                               <p className="text-neutral-500 text-[10px] font-medium tracking-wide uppercase">TMDB Member</p>
                             </div>
                           </div>
                           {rating && (
                             <div className="flex items-center gap-1 bg-[#F5C518]/10 px-2 py-1 rounded border border-[#F5C518]/20 shrink-0">
                               <Star className="w-3.5 h-3.5 fill-[#F5C518] text-[#F5C518]" />
                               <span className="text-[#F5C518] font-bold text-xs">{rating}/10</span>
                             </div>
                           )}
                         </div>
                         <div className="text-neutral-300 text-sm leading-relaxed overflow-y-auto pr-2 custom-scrollbar flex-1 font-light italic">
                           "{r.content.replace(/_|-|\*/g, '')}"
                         </div>
                       </div>
                     );
                   })}
                   
                   {visibleReviewsCount < reviews.length && (
                     <div 
                       onClick={() => setVisibleReviewsCount(prev => prev + 5)}
                       className="flex-shrink-0 w-80 sm:w-96 snap-start flex flex-col items-center justify-center p-6 bg-[#1a1a1a]/50 border-2 border-dashed border-neutral-800 rounded-2xl cursor-pointer hover:bg-neutral-800/50 hover:border-[#F5C518]/50 transition-all group"
                     >
                       <div className="w-12 h-12 rounded-full bg-[#141414] border border-neutral-700 flex items-center justify-center mb-3 group-hover:border-[#F5C518] transition-colors">
                          <MessageCircle className="w-5 h-5 text-neutral-400 group-hover:text-[#F5C518] transition-colors" />
                       </div>
                       <span className="text-white font-bold text-lg mb-1 group-hover:text-[#F5C518] transition-colors">Read More</span>
                       <span className="text-neutral-500 text-xs font-semibold">{reviews.length - visibleReviewsCount} remaining comments</span>
                     </div>
                   )}
                 </div>
              ) : (
                 <div className="text-neutral-500 italic bg-neutral-900/40 border border-neutral-800 rounded-xl p-8 text-center text-sm font-medium">
                   No audience reviews are currently available for this title on TMDB.
                 </div>
              )}
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

          {/* Similar Media Section - Placed properly INSIDE the scroll view container */}
          <div className="p-6 md:p-12 bg-[#0a0a0c] border-t border-neutral-800 relative z-20">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-2xl font-black text-white">More Like This</h3>
              <div className="h-px bg-neutral-800 flex-1" />
            </div>

            {isLoadingSimilar ? (
              <div className="flex items-center gap-3 text-neutral-500 font-bold p-8 justify-center bg-neutral-900/40 rounded-xl border border-neutral-800">
                <div className="w-5 h-5 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
                Finding similar titles...
              </div>
            ) : similarMedia.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-2">
                {similarMedia.map((media) => (
                  <MovieCard key={media.id} movie={media} />
                ))}
              </div>
            ) : (
              <div className="text-neutral-500 italic bg-neutral-900/40 border border-neutral-800 rounded-xl p-8 text-center text-sm font-medium">
                No similar media currently available.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Embedded Main Trailer Modal */}
      {showMainTrailer && mainTrailerKey && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 md:p-12">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] border border-neutral-800">
            <button 
              onClick={() => setShowMainTrailer(false)} 
              className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-neutral-800 rounded-full w-10 h-10 flex items-center justify-center transition-colors border border-neutral-700"
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
