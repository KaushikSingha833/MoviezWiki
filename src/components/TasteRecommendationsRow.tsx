"use client";

import { useEffect, useState } from "react";
import { useTaste } from "@/context/TasteContext";
import MovieCarousel from "./MovieCarousel";
import { loadMoreSearchResults } from "@/actions/movieActions";

export default function TasteRecommendationsRow() {
  const { getTopGenre } = useTaste();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [genreName, setGenreName] = useState<string>("");

  useEffect(() => {
    const fetchTasteRecs = async () => {
      const topGenre = getTopGenre();
      if (!topGenre) {
        setRecommendations([]);
        return;
      }
      
      setGenreName(topGenre.name);

      try {
        // Fetch movies specifically for their top genre
        // We use loadMoreSearchResults with genres parameter (which discovers movies by genre)
        const recs = await loadMoreSearchResults({ genres: String(topGenre.id), page: 1 });
        
        // Shuffle the results to keep it fresh
        const shuffled = recs.sort(() => 0.5 - Math.random()).slice(0, 20);
        setRecommendations(shuffled);
      } catch (err) {
        console.error("Failed to load taste recommendations", err);
      }
    };

    fetchTasteRecs();
  }, []);

  // Don't render if we don't have enough data to form a taste profile yet
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="relative z-10 w-full mb-8 mt-12 pt-8 border-t border-white/5">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="mb-2 px-4 sm:px-0">
        <p className="text-rose-400 text-sm font-bold tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> 
          Taste DNA Match
        </p>
      </div>
      
      <MovieCarousel 
        title={`Because you like ${genreName}`} 
        movies={recommendations} 
      />
    </div>
  );
}
