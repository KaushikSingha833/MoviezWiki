"use client";

import { useState } from "react";
import { Server, Settings2, Lightbulb, X, Sparkles, Zap, Globe, Shield } from "lucide-react";

type ServerOption = {
  name: string;
  tag: string;
  badgeColor: string;
  url: (id: string, type: "movie" | "tv") => string;
  description: string;
};

const servers: ServerOption[] = [
  {
    name: "Server 1 (Vidsrc.cc)",
    tag: "Multi-Audio",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    description: "Alternative player. Often includes Hindi & multi-lingual dubbed tracks.",
    url: (id, type) => `https://vidsrc.cc/v2/embed/${type}/${id}`,
  },
  {
    name: "Server 2 (AutoEmbed)",
    tag: "Dual Audio ⚙️",
    badgeColor: "bg-[#F5C518]/10 text-amber-300 border-[#F5C518]/30",
    description: "Standard dual audio support. Look for the player settings gear icon.",
    url: (id, type) => `https://autoembed.co/${type}/tmdb/${id}`,
  },
  {
    name: "Server 3 (VidLink)",
    tag: "High Quality",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    description: "Crisp 1080p stream with customizable subtitle options.",
    url: (id, type) => `https://vidlink.pro/${type}/${id}`,
  },
  {
    name: "Server 4 (VidSrc.me)",
    tag: "Ultra Fast",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    description: "Instant high-speed CDN buffer. Best for original language audio.",
    url: (id, type) => `https://vidsrc.me/embed/${type}?tmdb=${id}`,
  },
  {
    name: "Server 5 (VidSrc.to)",
    tag: "Backup Mirror",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    description: "Reliable fallback mirror if other servers are under load.",
    url: (id, type) => `https://vidsrc.to/embed/${type}/${id}`,
  }
];

export default function VideoPlayer({
  tmdbId,
  type,
}: {
  tmdbId: string;
  type: "movie" | "tv";
}) {
  const [activeServer, setActiveServer] = useState<number>(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  return (
    <>
      {/* Theater Mode Dark Overlay */}
      {isTheaterMode && (
        <div 
          className="fixed inset-0 bg-black/95 z-[9000] backdrop-blur-xl transition-all duration-700" 
          onClick={() => setIsTheaterMode(false)}
        />
      )}

      <div className={`w-full flex flex-col gap-6 transition-all duration-700 ${isTheaterMode ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96vw] max-w-7xl z-[9010]' : 'relative'}`}>
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#F5C518] border border-[#F5C518]/30 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              IMAX Player Live
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-neutral-400">
              <Zap className="w-3 h-3 text-[#F5C518]" /> 1080p HD • Adaptive Bitrate
            </span>
          </div>

          <button 
            type="button"
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer select-none active:scale-95 ${
              isTheaterMode 
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                : 'bg-black/60 text-[#F5C518] border-[#F5C518]/30 hover:bg-[#F5C518] hover:text-black backdrop-blur-md shadow-md'
            }`}
          >
            {isTheaterMode ? (
              <><X className="w-4 h-4" /> Exit Theater Mode</>
            ) : (
              <><Lightbulb className="w-4 h-4" /> Lights Out</>
            )}
          </button>
        </div>

        {/* Video Player Display */}
        <div className="relative group">
          {/* Ambient Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#F5C518]/10 via-purple-500/5 to-[#F5C518]/10 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

          <div className={`w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/15 relative transition-all duration-700 ${
            isTheaterMode 
              ? 'shadow-[0_0_150px_-20px_rgba(245,197,24,0.25)] ring-1 ring-white/20' 
              : 'shadow-[0_25px_70px_rgba(0,0,0,0.95)]'
          }`}>
            <iframe
              key={`player-${tmdbId}-${activeServer}`}
              src={servers[activeServer].url(tmdbId, type)}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
              referrerPolicy="origin"
            ></iframe>
          </div>
        </div>

        {/* Server Selection Controls */}
        <div className="bg-gradient-to-br from-neutral-900/90 via-neutral-950 to-black border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center text-[#F5C518]">
                <Settings2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm sm:text-base tracking-tight">
                  High-Speed Streaming Servers
                </h3>
                <p className="text-[11px] text-neutral-400">Switch server if you experience buffering or require different language dubs</p>
              </div>
            </div>
            <span className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-wider text-[#F5C518] bg-[#F5C518]/10 px-2.5 py-1 rounded-full border border-[#F5C518]/20">
              5 Active Mirrors
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {servers.map((server, index) => {
              const isActive = activeServer === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveServer(index)}
                  className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-b from-[#F5C518]/15 via-[#F5C518]/5 to-transparent border-[#F5C518] shadow-[0_0_25px_rgba(245,197,24,0.2)] scale-[1.02]"
                      : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Server className={`w-3.5 h-3.5 ${isActive ? "text-[#F5C518]" : "text-neutral-400"}`} />
                      <span className={`font-bold text-xs ${isActive ? "text-white" : "text-neutral-300"}`}>
                        Server {index + 1}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${server.badgeColor}`}>
                      {server.tag}
                    </span>
                  </div>
                  <span className={`text-[11px] line-clamp-2 leading-tight ${isActive ? "text-neutral-200" : "text-neutral-400"}`}>
                    {server.description}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Audio Dub Tip */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-neutral-400">
            <Globe className="w-4 h-4 text-[#F5C518] shrink-0" />
            <p>
              <strong className="text-white">Multi-Language Tip:</strong> For Hindi, Tamil, Telugu, Spanish or French dubs, select <strong>Server 1</strong> or <strong>Server 2</strong>. Once playing, tap the gear icon ⚙️ inside the player to switch audio tracks.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
