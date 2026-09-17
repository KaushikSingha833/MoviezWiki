"use client";

import { useState, useEffect } from "react";
import { getMovieTrailer, getTVDetails, getTVSeasonTrailer, getStreamingProviders, getMediaCredits, getMediaReviews } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import { X, Play, Sparkles, Star, Calendar, Tv, MessageCircle, User, Share2, Trash2, Heart, ListPlus, Check } from "lucide-react";
import Link from "next/link";
import { getGenreNames } from "@/lib/genres";
import AISummaryModal from "./AISummaryModal";
import MovieCard from "./MovieCard";
import { getSimilarMedia } from "@/actions/movieActions";
import ActorModal from "./ActorModal";
import { useWishlist } from "@/context/WishlistContext";
import { addCommunityComment, getCommunityComments, deleteCommunityComment, CommunityComment } from "@/lib/comments";
import { addToList, removeFromList } from "@/lib/lists";

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
  const [similarPage, setSimilarPage] = useState(1);
  const [hasMoreSimilar, setHasMoreSimilar] = useState(true);
  const [isLoadingMoreSimilar, setIsLoadingMoreSimilar] = useState(false);

  // New Cast States
  const [cast, setCast] = useState<any[]>([]);
  const [isLoadingCast, setIsLoadingCast] = useState(true);

  // New Reviews States
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(5);
  const [selectedActorId, setSelectedActorId] = useState<number | null>(null);

  // Native Comments State
  const { user, customLists, toggleWishlist, isInWishlist } = useWishlist();
  const [nativeComments, setNativeComments] = useState<CommunityComment[]>([]);
  const [isFetchingNative, setIsFetchingNative] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentRating, setNewCommentRating] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // List Management State
  const [showListDropdown, setShowListDropdown] = useState(false);
  const isHearted = isInWishlist(movie.id);

  const handleToggleCustomList = async (listId: string, currentItems: any[]) => {
    if (!user) return;
    const exists = currentItems.some(i => i.id === movie.id);
    if (exists) {
       await removeFromList(user.uid, listId, movie);
    } else {
       await addToList(user.uid, listId, movie);
    }
  };

  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
    
    // Intercept hardware Back Button (mobile)
    window.history.pushState({ modalOpen: true }, "");
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onClose]);

  const handleManualClose = () => {
    // If the dummy state is still on the stack, pop it so we don't break the user's history
    if (window.history.state && window.history.state.modalOpen) {
      window.history.back(); // This will trigger popstate, which calls onClose()
    } else {
      onClose();
    }
  };

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
      const similar = await getSimilarMedia(movie.id, isTV ? "tv" : "movie", 1);
      setSimilarMedia(similar);
      setHasMoreSimilar(similar.length > 0);
      setSimilarPage(1);
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

  const loadMoreSimilar = async () => {
    if (!hasMoreSimilar || isLoadingMoreSimilar) return;
    setIsLoadingMoreSimilar(true);
    const nextPage = similarPage + 1;
    const more = await getSimilarMedia(movie.id, isTV ? "tv" : "movie", nextPage);
    
    setSimilarMedia(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const newItems = more.filter((item: any) => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });
    
    setSimilarPage(nextPage);
    setHasMoreSimilar(more.length > 0);
    setIsLoadingMoreSimilar(false);
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
    if (!showReviews) {
      if (reviews.length === 0) {
        setIsLoadingReviews(true);
        const fetchedReviews = await getMediaReviews(movie.id, isTV ? "tv" : "movie");
        setReviews(fetchedReviews);
        setIsLoadingReviews(false);
      }
      if (nativeComments.length === 0) {
        setIsFetchingNative(true);
        const fetchedNative = await getCommunityComments(movie.id, isTV ? "tv" : "movie");
        setNativeComments(fetchedNative);
        setIsFetchingNative(false);
      }
    }
  };

  const handleSubmitNativeComment = async () => {
    if (!user) {
      alert("Please log in to join the discussion.");
      return;
    }
    if (!newCommentText.trim()) return;
    if (newCommentRating === 0) {
      alert("Please select a star rating!");
      return;
    }

    setIsSubmittingComment(true);
    const userName = user.displayName || user.email?.split("@")[0] || "Anonymous Master";
    
    const newComment = await addCommunityComment(
      movie.id,
      isTV ? "tv" : "movie",
      user.uid,
      userName,
      newCommentText,
      newCommentRating
    );

    if (newComment) {
      setNativeComments(prev => [newComment, ...prev]);
      setNewCommentText("");
      setNewCommentRating(0);
      setHoverRating(0);
    } else {
      alert("Error submitting comment. Please try again later.");
    }
    setIsSubmittingComment(false);
  };

  const handleDeleteRequest = (commentId: string) => {
    setCommentToDelete(commentId);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    const success = await deleteCommunityComment(commentToDelete);
    if (success) {
       setNativeComments(prev => prev.filter(c => c.id !== commentToDelete));
    } else {
       alert("Failed to delete comment. Permissions may be missing.");
    }
    setCommentToDelete(null);
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
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={handleManualClose} />
        
        {/* Modal Container */}
        <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#141414] rounded-2xl overflow-y-auto shadow-2xl border border-neutral-800 animate-in fade-in zoom-in-95 duration-300 scrollbar-hide">
          
          <button 
            onClick={handleManualClose}
            className="absolute top-4 right-4 z-[110] bg-black/60 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors backdrop-blur-md border border-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Section */}
          <div className="relative w-full h-auto min-h-[50vh] md:min-h-[60vh] flex flex-col justify-end">
            <img 
              src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`} 
              className="absolute inset-0 w-full h-full object-cover"
              alt={title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
            
            {/* Overlay Info */}
            <div className="relative z-10 p-6 pt-24 md:p-12 w-full max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">{title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold mb-6">
                
                {/* IMDb Rating Badge */}
                <span className="bg-[#F5C518] text-black px-2 py-0.5 rounded font-black tracking-tight text-xs flex items-center gap-1">
                  IMDb {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </span>

                {/* Rotten Tomatoes Rating Badge (Mocked via TMDB) */}
                <span className="flex items-center gap-1 text-rose-500 font-bold text-xs bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  🍅 {movie.vote_average ? (movie.vote_average * 10).toFixed(0) : "N/A"}%
                </span>

                <span className="text-neutral-300 flex items-center gap-1 border-l border-neutral-700 pl-4">
                  <Calendar className="w-4 h-4" /> {movie.release_date ? movie.release_date.split('-')[0] : movie.first_air_date ? movie.first_air_date.split('-')[0] : "N/A"}
                </span>
                
                {isTV && (
                  <span className="border border-neutral-600 px-2 py-0.5 rounded text-neutral-300 text-xs tracking-wider flex items-center gap-1">
                    <Tv className="w-3 h-3" /> SERIES
                  </span>
                )}
              </div>

              {/* Action Buttons Container */}
              <div className="flex flex-col gap-3 md:gap-4 mt-2">
                
                {/* Primary Actions Row */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Link
                    href={`/watch/${isTV ? 'tv' : 'movie'}/${movie.id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-[#d4a810] text-black px-4 md:px-8 py-2.5 md:py-3 rounded-lg font-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,197,24,0.3)] text-sm md:text-base whitespace-nowrap"
                  >
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-black" /> Watch Now
                  </Link>

                  <button 
                    onClick={handlePlayMainTrailer}
                    disabled={isLoadingAction}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-neutral-800/80 hover:bg-white hover:text-black text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-xl text-sm md:text-base backdrop-blur-md border border-neutral-600 whitespace-nowrap"
                  >
                    {isLoadingAction ? '...' : 'Trailer'}
                  </button>
                  
                  {/* Icon Group (Heart + List) so they don't break individually */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Quick Heart Wishlist */}
                    <button 
                      onClick={() => toggleWishlist(movie)}
                      className="p-2.5 md:p-3 bg-black/60 hover:bg-neutral-800 backdrop-blur-md rounded-lg border border-neutral-600 transition-all hover:scale-110 shadow-xl"
                    >
                      <Heart className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isHearted ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                    </button>
                    
                    {/* Custom List Dropdown */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowListDropdown(!showListDropdown)}
                        className={`p-2.5 md:p-3 bg-black/60 hover:bg-neutral-800 backdrop-blur-md rounded-lg border transition-all shadow-xl ${showListDropdown ? 'border-[#F5C518] scale-110' : 'border-neutral-600 hover:scale-110'}`}
                      >
                        <ListPlus className={`w-4 h-4 md:w-5 md:h-5 ${showListDropdown ? 'text-[#F5C518]' : 'text-white'}`} />
                      </button>
                      
                      {showListDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#121215] border border-neutral-700 rounded-xl shadow-2xl z-[200] overflow-hidden">
                          <div className="p-2 border-b border-neutral-800/80">
                            <span className="text-[10px] font-bold tracking-widest text-[#F5C518] uppercase">Add to List</span>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {user && customLists && customLists.length > 0 ? (
                              customLists.map(list => {
                                const inList = list.items?.some((i:any) => i.id === movie.id);
                                return (
                                  <button 
                                    key={list.id} 
                                    onClick={() => handleToggleCustomList(list.id, list.items || [])}
                                    className="w-full text-left px-3 py-2.5 text-xs text-white hover:bg-neutral-800 flex items-center justify-between transition-colors"
                                  >
                                    <span className="truncate pr-2 font-medium">{list.title}</span>
                                    {inList && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                                  </button>
                                );
                              })
                            ) : (
                              <div className="px-3 py-3 text-xs text-neutral-500 italic">No lists created.</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secondary Features Row */}
                <div className="flex flex-row items-center gap-2 md:gap-3">
                  <button 
                    onClick={handleAISummary}
                    className="flex-1 flex items-center justify-center gap-2 bg-neutral-800/80 hover:bg-neutral-700/80 backdrop-blur-md text-white px-2 sm:px-4 md:px-6 py-2.5 rounded-lg font-bold transition-all hover:scale-105 border border-neutral-600 shadow-xl text-xs md:text-sm whitespace-nowrap"
                  >
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#F5C518] shrink-0" /> <span className="truncate">Insight Summaries</span>
                  </button>
                  <button 
                    onClick={handleShowReviews}
                    className={`flex-1 flex items-center justify-center gap-2 px-2 sm:px-4 md:px-6 py-2.5 rounded-lg font-bold transition-all hover:scale-105 shadow-xl border text-xs md:text-sm whitespace-nowrap ${
                      showReviews 
                        ? "bg-[#F5C518] text-black border-[#F5C518]" 
                        : "bg-black/60 hover:bg-neutral-800/80 backdrop-blur-md text-white border-neutral-600"
                    }`}
                  >
                    <MessageCircle className={`w-3 h-3 md:w-4 md:h-4 shrink-0 ${showReviews ? "text-black" : "text-[#F5C518]"}`} /> <span className="truncate">Audience Reviews</span>
                  </button>
                </div>
                
                {/* Share Button Row */}
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-3 md:px-5 py-2.5 rounded-lg font-bold transition-all hover:scale-105 shadow-xl border bg-black/60 hover:bg-neutral-800/80 backdrop-blur-md text-white border-neutral-600 text-xs md:text-sm"
                >
                  <Share2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-400 shrink-0" /> Share
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
                   <button 
                     key={c.id} 
                     onClick={() => setSelectedActorId(c.id)}
                     className="flex-shrink-0 w-24 snap-start group/cast flex flex-col items-center bg-transparent focus:outline-none"
                   >
                     <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-neutral-800 border-2 border-transparent group-hover/cast:border-[#F5C518] transition-all duration-300 shadow-xl mb-3">
                       {c.profile_path ? (
                         <img src={`${THUMB_BASE_URL}${c.profile_path}`} className="w-full h-full object-cover group-hover/cast:scale-110 transition-transform duration-500" alt={c.name} />
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 text-xs bg-neutral-900 font-medium">No Photo</div>
                       )}
                     </div>
                     <p className="text-white text-xs font-bold text-center w-full leading-tight mb-1 group-hover/cast:text-[#F5C518] transition-colors">{c.name}</p>
                     <p className="text-neutral-500 text-[10px] font-medium text-center w-full line-clamp-2">{c.character}</p>
                   </button>
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

              {/* Native Comment Input Box */}
              <div className="mb-10 bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                {!user && (
                  <div className="absolute inset-0 z-10 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center rounded-2xl">
                    <p className="text-white font-bold mb-3 text-lg">Join the Discussion</p>
                    <a href="/login" className="bg-[#F5C518] text-black px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg">Login to Review</a>
                  </div>
                )}
                <div className={!user ? "opacity-30 pointer-events-none" : ""}>
                   <div className="flex gap-1 mb-4">
                     {[1,2,3,4,5,6,7,8,9,10].map(star => (
                        <button key={star} onClick={() => setNewCommentRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="group outline-none hover:scale-110 transition-transform">
                          <Star className={`w-6 h-6 transition-colors ${star <= (hoverRating || newCommentRating) ? "fill-[#F5C518] text-[#F5C518]" : "text-neutral-700"}`} />
                        </button>
                     ))}
                   </div>
                   <textarea
                     value={newCommentText}
                     onChange={(e) => setNewCommentText(e.target.value)}
                     placeholder="What did you think about this?"
                     className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-[#F5C518] transition-colors resize-none min-h-[100px] shadow-inner"
                   />
                   <div className="mt-4 flex justify-end">
                     <button 
                       onClick={handleSubmitNativeComment}
                       disabled={isSubmittingComment || !newCommentText.trim() || newCommentRating === 0}
                       className="bg-[#F5C518] text-black font-bold px-6 py-2 rounded-lg disabled:opacity-50 transition-all shadow-lg hover:bg-[#d4a810]"
                     >
                       {isSubmittingComment ? "Posting..." : "Post Review"}
                     </button>
                   </div>
                </div>
              </div>

              {isLoadingReviews || isFetchingNative ? (
                 <div className="flex items-center gap-3 text-neutral-500 font-bold p-8 justify-center bg-neutral-900/40 rounded-xl border border-neutral-800">
                   <div className="w-5 h-5 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
                   Fetching real user opinions...
                 </div>
              ) : (reviews.length > 0 || nativeComments.length > 0) ? (
                 <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x items-stretch">
                   
                   {/* Native Community Reviews (Rendered First) */}
                   {nativeComments.map((nc) => (
                     <div key={nc.id} className="flex-shrink-0 w-[85vw] sm:w-96 snap-start bg-[#121212] border border-[#F5C518]/30 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col max-h-[350px] hover:border-[#F5C518]/60 transition-colors">
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F5C518] to-transparent/10" />
                       
                       <div className="flex justify-between items-start mb-4 relative z-10">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-black border border-[#F5C518]/50 flex items-center justify-center shrink-0">
                             <User className="w-5 h-5 text-[#F5C518]" />
                           </div>
                           <div>
                             <p className="text-white text-sm font-bold line-clamp-1 flex items-center gap-2">
                               {nc.userName}
                               <span className="text-neutral-500 font-normal text-[10px] whitespace-nowrap">
                                 {nc.createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                               </span>
                             </p>
                             <p className="text-[#F5C518] text-[10px] font-black tracking-wide uppercase drop-shadow">Community Member</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <div className="flex items-center gap-1 bg-[#F5C518]/10 px-2 py-1 rounded border border-[#F5C518]/30 shrink-0">
                             <Star className="w-3.5 h-3.5 fill-[#F5C518] text-[#F5C518]" />
                             <span className="text-[#F5C518] font-bold text-xs">{nc.rating}/10</span>
                           </div>
                           {/* Owner Delete Button */}
                           {user?.uid === nc.userId && (
                             <button onClick={() => handleDeleteRequest(nc.id)} className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors border border-transparent hover:border-red-500/30">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                         </div>
                       </div>
                       <div className="text-neutral-100 text-sm leading-relaxed overflow-y-auto pr-2 custom-scrollbar flex-1 font-medium whitespace-pre-wrap">
                         {nc.text}
                       </div>
                     </div>
                   ))}

                   {/* Standard TMDB Reviews */}
                   {reviews.slice(0, visibleReviewsCount).map((r, i) => {
                     const avatarUrl = getAvatarFallback(r.author_details?.avatar_path);
                     const rating = r.author_details?.rating;
                     return (
                       <div key={i} className="flex-shrink-0 w-[85vw] sm:w-96 snap-start bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl hover:border-neutral-700 transition-colors flex flex-col max-h-[350px]">
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
                   Be the first to review this!
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
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-2 w-full">
                  {similarMedia.map((media) => (
                    <MovieCard key={media.id} movie={media} />
                  ))}
                </div>
                {hasMoreSimilar && (
                  <button 
                    onClick={loadMoreSimilar}
                    disabled={isLoadingMoreSimilar}
                    className="mt-8 mb-4 bg-neutral-900 border border-neutral-700 hover:border-[#F5C518] hover:text-[#F5C518] text-neutral-300 px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-[0_0_15px_rgba(245,197,24,0.3)] flex items-center justify-center min-w-[250px]"
                  >
                    {isLoadingMoreSimilar ? (
                      <div className="w-5 h-5 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Load More Suggestions"
                    )}
                  </button>
                )}
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

      {/* Embedded Actor Modal */}
      {selectedActorId && (
        <ActorModal personId={selectedActorId} onClose={() => setSelectedActorId(null)} />
      )}

      {/* Delete Confirmation Modal */}
      {commentToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Delete Review?</h3>
            <p className="text-neutral-400 text-sm mb-8 font-medium">This action cannot be undone. Are you sure you want to permanently obliterate this comment?</p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setCommentToDelete(null)}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-bold transition-colors border border-neutral-700"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteComment}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
