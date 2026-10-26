"use client";

import { useState } from "react";
import { Flame, Film, Trophy, Video, Tv, Sparkles, Star, Clapperboard } from "lucide-react";

interface VibeOption {
  id: string;
  label: string;
  targetId: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VIBES: VibeOption[] = [
  { id: "all", label: "All Highlights", targetId: "highlights", icon: Flame },
  { id: "nowplaying", label: "Now Playing", targetId: "nowplaying", icon: Film },
  { id: "top10", label: "Top 10 Charts", targetId: "top10", icon: Trophy },
  { id: "trailers", label: "Cinema Trailers", targetId: "trailers", icon: Video },
  { id: "tv", label: "TV Series", targetId: "tvseries", icon: Tv },
  { id: "anime", label: "Anime Realm", targetId: "anime", icon: Sparkles },
  { id: "kdrama", label: "K-Dramas", targetId: "kdrama", icon: Clapperboard },
  { id: "celebrities", label: "VIP Stars", targetId: "celebrities", icon: Star },
];

export default function QuickVibeBar() {
  const [activeVibe, setActiveVibe] = useState("all");

  const handleVibeClick = (vibe: VibeOption) => {
    setActiveVibe(vibe.id);
    const element = document.getElementById(vibe.targetId);
    if (element) {
      const yOffset = -90; // Offset for navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 px-1 smooth-scroll-x">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          {VIBES.map((vibe) => {
            const Icon = vibe.icon;
            const isActive = activeVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => handleVibeClick(vibe)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#F5C518] text-black shadow-[0_0_20px_rgba(245,197,24,0.4)] scale-[1.02]"
                    : "text-neutral-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-black fill-current" : "text-[#F5C518]"}`} />
                <span>{vibe.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
