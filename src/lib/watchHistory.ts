import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { WatchedMedia } from "@/hooks/useRecentlyWatched";

export const getWatchHistory = async (userId: string): Promise<WatchedMedia[]> => {
  if (!userId) return [];
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists() && snap.data().watchHistory) {
      return snap.data().watchHistory;
    }
    return [];
  } catch (error) {
    console.error("Error fetching watch history:", error);
    return [];
  }
};

export const addToWatchHistory = async (userId: string, media: Omit<WatchedMedia, "timestamp">) => {
  if (!userId) return;
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    
    let history: WatchedMedia[] = [];
    if (snap.exists() && snap.data().watchHistory) {
      history = snap.data().watchHistory;
    }

    // Remove if already exists to push it to the front
    const filtered = history.filter(m => !(m.id === media.id && m.type === media.type));
    
    const newItem = { ...media, timestamp: Date.now() };
    const updated = [newItem, ...filtered].slice(0, 20); // Keep max 20

    if (!snap.exists()) {
      await setDoc(userRef, { watchHistory: updated }, { merge: true });
    } else {
      await updateDoc(userRef, { watchHistory: updated });
    }
    return updated;
  } catch (error) {
    console.error("Error adding to watch history:", error);
  }
};

export const removeFromWatchHistory = async (userId: string, mediaId: string | number, mediaType: "movie" | "tv") => {
  if (!userId) return;
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    
    if (snap.exists() && snap.data().watchHistory) {
      const history: WatchedMedia[] = snap.data().watchHistory;
      const updated = history.filter(m => !(String(m.id) === String(mediaId) && m.type === mediaType));
      await updateDoc(userRef, { watchHistory: updated });
      return updated;
    }
  } catch (error) {
    console.error("Error removing from watch history:", error);
  }
};

export const clearWatchHistory = async (userId: string) => {
  if (!userId) return;
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { watchHistory: [] });
  } catch (error) {
    console.error("Error clearing watch history:", error);
  }
};
