"use client";

import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  getWatchHistory, 
  addToWatchHistory, 
  removeFromWatchHistory, 
  clearWatchHistory as clearFirebaseHistory 
} from "@/lib/watchHistory";

export type WatchedMedia = {
  id: string | number;
  title: string;
  type: "movie" | "tv";
  poster_path: string;
  backdrop_path: string;
  timestamp: number;
};

export function useRecentlyWatched() {
  const [recentlyWatched, setRecentlyWatched] = useState<WatchedMedia[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const history = await getWatchHistory(user.uid);
        setRecentlyWatched(history);
      } else {
        setUserId(null);
        setRecentlyWatched([]);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const addWatchedMedia = useCallback(async (media: Omit<WatchedMedia, "timestamp">) => {
    if (!userId) return; // Only track for logged in users
    
    // Optimistic UI update
    setRecentlyWatched(prev => {
      const filtered = prev.filter(m => !(m.id === media.id && m.type === media.type));
      const newItem = { ...media, timestamp: Date.now() };
      return [newItem, ...filtered].slice(0, 20);
    });

    // Background sync
    await addToWatchHistory(userId, media);
  }, [userId]);

  const removeWatchedMedia = useCallback(async (id: string | number, type: "movie" | "tv") => {
    if (!userId) return;

    // Optimistic UI update
    setRecentlyWatched(prev => prev.filter(m => !(String(m.id) === String(id) && m.type === type)));

    // Background sync
    await removeFromWatchHistory(userId, id, type);
  }, [userId]);

  const clearAllWatched = useCallback(async () => {
    if (!userId) return;

    // Optimistic UI update
    setRecentlyWatched([]);

    // Background sync
    await clearFirebaseHistory(userId);
  }, [userId]);

  return {
    recentlyWatched,
    isLoaded,
    addWatchedMedia,
    removeWatchedMedia,
    clearAllWatched,
    isLoggedIn: !!userId
  };
}
