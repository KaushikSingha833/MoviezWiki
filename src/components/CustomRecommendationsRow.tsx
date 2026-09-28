"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { useWishlist } from "@/context/WishlistContext";
import MovieCarousel from "./MovieCarousel";
import { getSimilarMedia } from "@/actions/movieActions";

export default function CustomRecommendationsRow() {
  const { useCustomRecommendations } = useSettings();
  const { wishlist } = useWishlist();
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Only run if the setting is turned on and we have items
    if (!useCustomRecommendations || wishlist.length === 0) {
      setRecommendations([]);
      return;
    }

    const fetchRecs = async () => {
      try {
        // Pick up to 3 random items from the user's wishlist to base recommendations on
        const itemsToUse = [...wishlist].sort(() => 0.5 - Math.random()).slice(0, 3);
        
        let allRecs: any[] = [];
        for (const item of itemsToUse) {
           const type = item.name && !item.title ? "tv" : "movie";
           const recs = await getSimilarMedia(item.id, type);
           allRecs = [...allRecs, ...recs];
        }
        
        // Remove duplicates and filter out items already in the wishlist
        const uniqueRecs = Array.from(new Map(allRecs.map((m) => [m.id, m])).values());
        const filteredRecs = uniqueRecs.filter(rec => !wishlist.some(w => w.id === rec.id));
        
        // Shuffle the results to keep it fresh
        const shuffled = filteredRecs.sort(() => 0.5 - Math.random()).slice(0, 20);
        setRecommendations(shuffled);
      } catch (err) {
        console.error("Failed to load recommendations", err);
      }
    };

    fetchRecs();
  }, [useCustomRecommendations, wishlist]);

  if (!useCustomRecommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="relative z-10 w-full rounded-2xl bg-gradient-to-r from-purple-900/10 via-black to-black p-4 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
      <MovieCarousel title="✨ Recommended For You" movies={recommendations} />
    </div>
  );
}
