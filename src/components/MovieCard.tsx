"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMovieTrailer } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import { useWishlist } from "@/context/WishlistContext";
import { getGenreNames } from "@/lib/genres";
import Link from "next/link";
import AISummaryModal from "./AISummaryModal";
import InfoModal from "./InfoModal";
import { Info, Play, Sparkles, Video } from "lucide-react";

export default function MovieCard({ movie, index }: { movie: any, index?: number }) {
  const genres = getGenreNames(movie.genre_ids);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hoverPosition, setHoverPosition] = useState<'left' | 'right' | 'center'>('center');

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const container = cardRef.current.closest('.overflow-y-auto, .overflow-x-auto, .snap-x') as HTMLElement;
      
      const containerLeft = container ? container.getBoundingClientRect().left : 0;
      const containerRight = container ? container.getBoundingClientRect().right : window.innerWidth;
      const containerWidth = container ? container.getBoundingClientRect().width : window.innerWidth;
      
      // Calculate position relative to container
      const relativeLeft = rect.left - containerLeft;
      const relativeRight = containerRight - rect.right;
      const threshold = containerWidth * 0.20; // 20% of container width

      if (relativeLeft < threshold) {
        setHoverPosition('left');
      } else if (relativeRight < threshold) {
        setHoverPosition('right');
      } else {
        setHoverPosition('center');
      }
    }
    
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(true);
    }, 400); // 400ms delay for Netflix-style intent
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(false);
  };

  const cancelHover = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(false);
  };
  
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
      <div 
        ref={cardRef}
        className={`relative w-full aspect-[2/3] transition-z duration-300 ${isHovered ? 'z-50' : 'z-10'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* BASE CARD (Always visible underneath) */}
        <div className="absolute inset-0 rounded-md bg-neutral-900 overflow-hidden shadow-md">
          <img 
            src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
            alt={movie.title || movie.name}
            className="w-full h-full object-cover"
          />
          
          {/* Action Buttons Overlay (Always visible) */}
          <div 
            className="absolute top-2 right-2 flex flex-col gap-2 z-20"
            onMouseEnter={cancelHover}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(movie);
              }}
              className="bg-black/60 p-2 rounded-full hover:bg-white hover:text-black transition-colors shadow-lg border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors ${isSaved ? 'text-red-500 hover:text-red-600' : 'text-white hover:text-black'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowInfoModal(true);
              }}
              className="bg-black/60 p-2 rounded-full hover:bg-white hover:text-black transition-colors flex items-center justify-center text-white shadow-lg border border-white/20"
            >
              <Info className="w-4 h-4" />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePlayTrailer(e);
              }}
              disabled={isLoadingTrailer}
              className="bg-black/60 p-2 rounded-full hover:bg-white hover:text-black transition-colors flex items-center justify-center text-white shadow-lg border border-white/20 disabled:opacity-50"
            >
              {isLoadingTrailer ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Video className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* MOBILE FALLBACK OVERLAY (Visible only on touch screens / below md breakpoint) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-100 md:opacity-0 flex flex-col justify-end p-2.5 md:hidden pointer-events-none">
            <div className="pointer-events-auto flex flex-col w-full relative z-30">
              <span className="text-white text-xs font-bold mb-1 line-clamp-2 drop-shadow-md pr-10">
                {movie.title || movie.name}
              </span>
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2 pr-10">
                  {genres.slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/60 text-[#F5C518] border border-[#F5C518]/30 backdrop-blur-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-col space-y-1.5">
                <Link 
                  href={`/watch/${movie.name && !movie.title ? 'tv' : 'movie'}/${movie.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#F5C518] hover:bg-yellow-500 text-black text-[10px] font-bold py-1.5 px-2 rounded w-full transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" /> Watch Now
                </Link>
                <button 
                  onClick={handleAISummary}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient text-white text-[10px] font-bold py-1.5 px-2 rounded w-full transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                >
                  <Sparkles className="w-3 h-3 text-[#F5C518] animate-pulse" /> AI Summary
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* HOVER CARD (Framer Motion Popup) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.95, 
                width: "100%", 
                y: "-50%", 
                x: hoverPosition === 'left' ? "0%" : hoverPosition === 'right' ? "-100%" : "-50%",
                left: hoverPosition === 'left' ? "0%" : hoverPosition === 'right' ? "100%" : "50%"
              }}
              animate={{ 
                opacity: 1, 
                scale: 1.15, 
                width: "150%", 
                y: "-50%", 
                x: hoverPosition === 'left' ? "0%" : hoverPosition === 'right' ? "-100%" : "-50%",
                left: hoverPosition === 'left' ? "0%" : hoverPosition === 'right' ? "100%" : "50%"
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                width: "100%", 
                y: "-50%", 
                x: hoverPosition === 'left' ? "0%" : hoverPosition === 'right' ? "-100%" : "-50%",
                left: hoverPosition === 'left' ? "0%" : hoverPosition === 'right' ? "100%" : "50%"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`absolute top-1/2 ${hoverPosition === 'left' ? 'origin-left' : hoverPosition === 'right' ? 'origin-right' : 'origin-center'} bg-[#141414] rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-neutral-700 z-50 flex flex-col cursor-pointer`}
            >
              {/* Top Image Section (Cropped to aspect-video on hover to save space) */}
              <div className="relative w-full aspect-video shrink-0 bg-neutral-900 overflow-hidden">
                <img 
                  src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`} 
                  alt={movie.title || movie.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Fade gradient at the bottom of the image to blend into the card body */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(movie);
                    }}
                    className="bg-black/60 p-2 rounded-full hover:bg-white hover:text-black transition-colors shadow-lg border border-white/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors ${isSaved ? 'text-red-500 hover:text-red-600' : 'text-white hover:text-black'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInfoModal(true);
                    }}
                    className="bg-black/60 p-2 rounded-full hover:bg-white hover:text-black transition-colors flex items-center justify-center text-white shadow-lg border border-white/20"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayTrailer(e);
                    }}
                    disabled={isLoadingTrailer}
                    className="bg-black/60 p-2 rounded-full hover:bg-white hover:text-black transition-colors flex items-center justify-center text-white shadow-lg border border-white/20 disabled:opacity-50"
                  >
                    {isLoadingTrailer ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Video className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Info Section */}
              <div className="p-3 flex flex-col w-full relative z-20 bg-[#141414]">
                <h3 className="font-bold text-white text-[13px] mb-1.5 truncate tracking-wide">
                  {movie.title || movie.name}
                </h3>
                
                {/* Genres */}
                {genres.length > 0 && (
                  <div className="flex flex-nowrap overflow-hidden gap-1.5 mb-2 shrink-0">
                    {genres.slice(0, 3).map((genre, idx) => (
                      <span key={idx} className="inline-flex items-center text-[9px] font-semibold text-neutral-400 whitespace-nowrap">
                        <span className="w-1 h-1 rounded-full bg-[#F5C518] mr-1.5 opacity-80 shrink-0"></span>
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Description */}
                <p className="text-[10px] text-neutral-400 line-clamp-3 leading-relaxed mb-3">
                  {movie.overview}
                </p>
                
                {/* Bottom Action Buttons */}
                <div className="flex gap-2 mt-auto shrink-0 h-[28px]">
                  <Link 
                    href={`/watch/${movie.name && !movie.title ? 'tv' : 'movie'}/${movie.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white hover:bg-neutral-200 text-black text-[10px] font-bold rounded-md flex-1 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" /> Watch Now
                  </Link>
                  <button 
                    onClick={handleAISummary}
                    className="relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right rounded-md flex-1 overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-white/5 hover:border-white/20"
                  >
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-full group-hover:opacity-0 group-hover:scale-50">
                      <span className="text-white text-[10px] font-bold flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#F5C518]" /> AI Summary</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] translate-y-full opacity-0 scale-50 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100 bg-gradient-to-r from-purple-600 to-indigo-600">
                      <Sparkles className="w-4 h-4 text-[#F5C518] animate-spin-slow drop-shadow-[0_0_8px_rgba(245,197,24,0.8)]" />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

      {showInfoModal && (
        <InfoModal movie={movie} onClose={() => setShowInfoModal(false)} />
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