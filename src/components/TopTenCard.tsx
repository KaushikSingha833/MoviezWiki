"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMovieTrailer } from "@/actions/movieActions";
import { getAISummary } from "@/actions/aiActions";
import { useWishlist } from "@/context/WishlistContext";
import { getGenreNames } from "@/lib/genres";
import Link from "next/link";
import AISummaryModal from "@/components/AISummaryModal";
import InfoModal from "@/components/InfoModal";
import { Info, Play } from "lucide-react";

export default function TopTenCard({ item, index }: { item: any, index: number }) {
  const genres = getGenreNames(item.genre_ids);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // Custom hover logic to prevent accidental flickers
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
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
  
  const { wishlist, toggleWishlist } = useWishlist();
  const isInWishlist = wishlist.some((w: any) => w.id === item.id);
  
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const handlePlayTrailer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    const mediaType = item.name && !item.title ? "tv" : "movie";
    
    const key = await getMovieTrailer(item.id, mediaType);
    
    setTrailerKey(key);
    setShowModal(true);
    setIsLoading(false);
  };

  const handleAISummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAIModal(true);
    if (!aiSummary) {
      setIsLoadingAI(true);
      const summary = await getAISummary(item.title || item.name || "Untitled", item.overview || "No plot overview available.");
      setAiSummary(summary);
      setIsLoadingAI(false);
    }
  };
  
  return (
    <>
      <div className="relative flex-shrink-0 snap-start flex items-center h-48 md:h-64 mt-4 overflow-visible">
        {/* Massive Background Number */}
        <span 
          className="absolute left-0 -translate-x-8 md:-translate-x-12 text-[8rem] md:text-[12rem] font-black leading-none select-none z-0"
          style={{
            WebkitTextStroke: "4px #555",
            color: "#121212", 
            textShadow: "4px 4px 10px rgba(0,0,0,0.8)",
          }}
        >
          {index + 1}
        </span>
        
        {/* Movie Poster Container */}
        <div 
          className={`relative w-32 md:w-44 h-full ml-12 md:ml-16 transition-z duration-300 ${isHovered ? 'z-50' : 'z-10'}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* BASE CARD (Always visible underneath) */}
          <div className="absolute inset-0 rounded-md bg-neutral-900 overflow-hidden shadow-md">
            <img 
              src={`${IMAGE_BASE_URL}${item.poster_path}`} 
              alt={item.title || item.name}
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
                  toggleWishlist(item);
                }}
                className="bg-black/60 p-2 rounded-full hover:bg-white hover:text-black transition-colors shadow-lg border border-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 md:w-5 md:h-5 transition-colors ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-white hover:text-black'}`} viewBox="0 0 20 20" fill="currentColor">
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
                <Info className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              
              <Link 
                href={`/watch/${item.name && !item.title ? 'tv' : 'movie'}/${item.id}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-black/60 p-2 rounded-full hover:bg-white hover:text-black transition-colors flex items-center justify-center text-white shadow-lg border border-white/20"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              </Link>
            </div>

            {/* MOBILE FALLBACK OVERLAY (Visible only on touch screens / below md breakpoint) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-100 md:opacity-0 flex flex-col justify-end p-2.5 md:hidden pointer-events-none">
              <div className="pointer-events-auto flex flex-col w-full relative z-30">
                <span className="text-white text-xs font-bold mb-2 line-clamp-2 drop-shadow-md pr-10">
                  {item.title || item.name}
                </span>
                <div className="flex flex-col space-y-1.5">
                  <button 
                    onClick={handlePlayTrailer}
                    disabled={isLoading}
                    className="bg-[#F5C518] hover:bg-yellow-500 text-black text-[10px] font-bold py-1.5 px-2 rounded w-full transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? '...' : <><Play className="w-3 h-3 fill-current" /> Trailer</>}
                  </button>
                  <button 
                    onClick={handleAISummary}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 px-2 rounded w-full transition-colors flex items-center justify-center gap-1.5"
                  >
                    ✨ AI Summary
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* HOVER CARD (Framer Motion Popup) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, width: "100%", y: "-50%", x: index === 0 ? "0%" : "-50%" }}
                animate={{ opacity: 1, scale: 1.15, width: "150%", y: "-50%", x: index === 0 ? "0%" : "-50%" }}
                exit={{ opacity: 0, scale: 0.95, width: "100%", y: "-50%", x: index === 0 ? "0%" : "-50%" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`absolute top-1/2 ${index === 0 ? 'left-0 origin-left' : 'left-1/2 origin-center'} bg-[#141414] rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-neutral-700 z-50 flex flex-col cursor-pointer`}
              >
                {/* Top Image Section (Cropped to aspect-video) */}
                <div className="relative w-full aspect-video shrink-0 bg-neutral-900 overflow-hidden">
                  <img 
                    src={`${IMAGE_BASE_URL}${item.backdrop_path || item.poster_path}`} 
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Fade gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item);
                      }}
                      className="bg-black/60 p-2 rounded-full hover:bg-white hover:text-black transition-colors shadow-lg border border-white/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 md:w-5 md:h-5 transition-colors ${isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-white hover:text-black'}`} viewBox="0 0 20 20" fill="currentColor">
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
                      <Info className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    
                    <Link 
                      href={`/watch/${item.name && !item.title ? 'tv' : 'movie'}/${item.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-black/60 p-2 rounded-full hover:bg-white hover:text-black transition-colors flex items-center justify-center text-white shadow-lg border border-white/20"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    </Link>
                  </div>
                </div>

                {/* Bottom Info Section */}
                <div className="p-3 flex flex-col w-full relative z-20 bg-[#141414]">
                  <h3 className="font-bold text-white text-[13px] mb-1.5 truncate tracking-wide">
                    {item.title || item.name}
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
                    {item.overview}
                  </p>
                  
                  {/* Bottom Action Buttons */}
                  <div className="flex gap-2 mt-auto shrink-0">
                    <button 
                      onClick={handlePlayTrailer} 
                      disabled={isLoading}
                      className="bg-white hover:bg-neutral-200 text-black text-[10px] font-bold py-2 px-2 rounded-md flex-1 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {isLoading ? '...' : <><Play className="w-3 h-3 fill-current" /> Trailer</>}
                    </button>
                    <button 
                      onClick={handleAISummary}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-2 px-2 rounded-md flex-1 transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                    >
                      ✨ AI Summary
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
        <InfoModal movie={item} onClose={() => setShowInfoModal(false)} />
      )}

      <AISummaryModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        summary={aiSummary}
        title={item.title || item.name}
        isLoading={isLoadingAI}
      />
    </>
  );
}