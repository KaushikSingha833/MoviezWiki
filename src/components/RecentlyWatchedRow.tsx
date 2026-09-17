"use client";

import { useRecentlyWatched } from "@/hooks/useRecentlyWatched";
import ContinueWatchingCard from "./ContinueWatchingCard";
import { Clock, Trash2 } from "lucide-react";

export default function RecentlyWatchedRow() {
  const { recentlyWatched, isLoaded, removeWatchedMedia, clearAllWatched, isLoggedIn } = useRecentlyWatched();

  if (!isLoaded || !isLoggedIn || recentlyWatched.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full z-10">
      <div className="flex flex-row items-start md:items-end justify-between mb-6 gap-4">
        <div className="flex items-start md:items-center gap-3">
          <div className="w-1.5 h-8 bg-[#F5C518] rounded-full shadow-[0_0_15px_rgba(245,197,24,0.6)] shrink-0 mt-1 md:mt-0" />
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            Continue Watching <Clock className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 inline-block align-baseline ml-1" />
          </h2>
        </div>
        
        <button
          onClick={clearAllWatched}
          className="text-xs font-bold text-neutral-500 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-800 border border-transparent hover:border-neutral-700 shrink-0 whitespace-nowrap mt-1 md:mt-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="flex overflow-x-auto gap-4 pt-4 -mt-4 pb-8 custom-scrollbar snap-x snap-mandatory">
        {recentlyWatched.map((media, index) => (
          <div key={`${media.type}-${media.id}`} className="snap-start shrink-0">
            <ContinueWatchingCard 
              media={media} 
              index={index}
              onRemove={removeWatchedMedia} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}
