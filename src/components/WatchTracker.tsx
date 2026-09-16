"use client";

import { useEffect } from "react";
import { useRecentlyWatched, WatchedMedia } from "@/hooks/useRecentlyWatched";

export default function WatchTracker({ media }: { media: Omit<WatchedMedia, "timestamp"> }) {
  const { addWatchedMedia, isLoaded } = useRecentlyWatched();

  useEffect(() => {
    if (isLoaded) {
      addWatchedMedia(media);
    }
  }, [media.id, media.type, isLoaded, addWatchedMedia]);

  return null; // This component is invisible
}
