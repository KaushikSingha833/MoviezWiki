"use client";

import Link from "next/link";
import { Play, X } from "lucide-react";
import { WatchedMedia } from "@/hooks/useRecentlyWatched";

const THUMB_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";

export default function ContinueWatchingCard({
  media,
  onRemove,
  index
}: {
  media: WatchedMedia;
  onRemove: (id: string | number, type: "movie" | "tv") => void;
  index?: number;
}) {
  const imageUrl = media.backdrop_path 
    ? `${BACKDROP_BASE_URL}${media.backdrop_path}` 
    : media.poster_path 
      ? `${THUMB_BASE_URL}${media.poster_path}`
      : "/placeholder.jpg"; // Provide a fallback if needed

  return (
    <div className={`relative group min-w-[280px] sm:min-w-[320px] max-w-[350px] aspect-[16/9] bg-neutral-900 rounded-2xl overflow-hidden cursor-pointer shrink-0 transition-transform hover:scale-105 hover:shadow-[0_0_20px_rgba(245,197,24,0.4)] border border-neutral-800 hover:border-[#F5C518] ${index === 0 ? 'origin-left' : 'origin-center'}`}>
      <Link href={`/watch/${media.type}/${media.id}`} className="absolute inset-0 z-10 block">
        <img 
          src={imageUrl}
          alt={media.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100">
          <div className="w-14 h-14 rounded-full bg-[#F5C518] flex items-center justify-center shadow-[0_0_30px_rgba(245,197,24,0.5)]">
            <Play className="w-6 h-6 text-black ml-1 fill-current" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 p-4 w-full">
          <span className="text-[10px] uppercase tracking-wider font-black text-[#F5C518] bg-black/50 px-2 py-0.5 rounded backdrop-blur-md border border-[#F5C518]/30 inline-block mb-1">
            {media.type === 'tv' ? 'TV Series' : 'Movie'}
          </span>
          <h4 className="text-white font-bold text-sm sm:text-base line-clamp-1 group-hover:text-[#F5C518] transition-colors shadow-black drop-shadow-md">
            {media.title}
          </h4>
          <div className="w-full h-1 bg-neutral-800 rounded-full mt-2 overflow-hidden">
             {/* Fake progress bar purely for aesthetic feel (Netflix style) */}
             <div className="h-full bg-[#F5C518] rounded-full w-[65%]" />
          </div>
        </div>
      </Link>
      
      {/* Remove Button (Z-index higher than the link) */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(media.id, media.type);
        }}
        className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-neutral-800 border border-transparent hover:border-[#F5C518]/50 text-neutral-400 hover:text-white flex items-center justify-center backdrop-blur-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
        title="Remove from history"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
