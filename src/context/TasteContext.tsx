"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics"
};

type TasteProfile = Record<string, number>;

interface TasteContextType {
  tasteProfile: TasteProfile;
  logInteraction: (genreIds: number[], weight: number) => void;
  getTopGenre: () => { id: number; name: string; score: number } | null;
}

const TasteContext = createContext<TasteContextType | undefined>(undefined);

export function TasteProvider({ children }: { children: React.ReactNode }) {
  const [tasteProfile, setTasteProfile] = useState<TasteProfile>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load taste profile from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("moviez_taste_dna");
      if (saved) {
        setTasteProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse taste DNA");
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && Object.keys(tasteProfile).length > 0) {
      localStorage.setItem("moviez_taste_dna", JSON.stringify(tasteProfile));
    }
  }, [tasteProfile, isLoaded]);

  const logInteraction = (genreIds: number[], weight: number) => {
    if (!genreIds || genreIds.length === 0) return;
    
    setTasteProfile(prev => {
      const updated = { ...prev };
      
      // Decay old scores slightly over time to keep tastes fresh
      // We decay every time we log a new interaction so old clicks fade
      for (const key in updated) {
        updated[key] = updated[key] * 0.99; 
      }
      
      // Add weight to the interacted genres
      genreIds.forEach(id => {
        const current = updated[String(id)] || 0;
        updated[String(id)] = current + weight;
      });
      
      return updated;
    });
  };

  const getTopGenre = () => {
    if (Object.keys(tasteProfile).length === 0) return null;
    
    let maxId = "";
    let maxScore = -1;
    
    for (const [idStr, score] of Object.entries(tasteProfile)) {
      if (score > maxScore) {
        maxScore = score;
        maxId = idStr;
      }
    }
    
    if (maxScore < 5) return null; // Require at least 5 points to confidently recommend
    
    const id = parseInt(maxId, 10);
    return {
      id,
      name: GENRE_MAP[id] || "Movies",
      score: maxScore
    };
  };

  return (
    <TasteContext.Provider value={{ tasteProfile, logInteraction, getTopGenre }}>
      {children}
    </TasteContext.Provider>
  );
}

export function useTaste() {
  const context = useContext(TasteContext);
  if (context === undefined) {
    throw new Error("useTaste must be used within a TasteProvider");
  }
  return context;
}
