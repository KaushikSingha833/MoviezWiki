"use client";

import { useState } from "react";
import { Server, Settings2, Lightbulb, X } from "lucide-react";

type ServerOption = {
  name: string;
  url: (id: string, type: "movie" | "tv") => string;
  description: string;
};

const servers: ServerOption[] = [
  {
    name: "Server 1 (Vidsrc.cc)",
    description: "Alternative player. Sometimes includes multi-audio.",
    url: (id, type) => `https://vidsrc.cc/v2/embed/${type}/${id}`,
  },
  {
    name: "Server 2 (AutoEmbed)",
    description: "Standard dual audio support. Check the gear icon ⚙️.",
    url: (id, type) => `https://autoembed.co/${type}/tmdb/${id}`,
  },
  {
    name: "Server 3 (VidLink)",
    description: "Check the settings icon in the player for audio tracks.",
    url: (id, type) => `https://vidlink.pro/${type}/${id}`,
  },
  {
    name: "Server 4 (VidSrc.me - Fast)",
    description: "High speed, but usually English only.",
    url: (id, type) => `https://vidsrc.me/embed/${type}?tmdb=${id}`,
  },
  {
    name: "Server 5 (VidSrc.to)",
    description: "Alternative fast server.",
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
          className="fixed inset-0 bg-black/95 z-[9000] backdrop-blur-md transition-all duration-700" 
          onClick={() => setIsTheaterMode(false)}
        />
      )}

      <div className={`w-full flex flex-col gap-4 transition-all duration-700 ${isTheaterMode ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-6xl z-[9010]' : 'relative'}`}>
        
        {/* Theater Mode Toggle Button */}
        <div className="flex justify-end absolute -top-12 right-0 z-[9020]">
          <button 
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              isTheaterMode 
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-white' 
                : 'bg-black/60 text-[#F5C518] border-[#F5C518]/30 hover:bg-[#F5C518] hover:text-black backdrop-blur-md'
            }`}
          >
            {isTheaterMode ? (
              <><X className="w-4 h-4" /> Exit Theater Mode</>
            ) : (
              <><Lightbulb className="w-4 h-4" /> Lights Out</>
            )}
          </button>
        </div>

        {/* Video Player */}
        <div className={`w-full aspect-video bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 relative transition-shadow duration-700 ${isTheaterMode ? 'shadow-[0_0_150px_-20px_rgba(255,255,255,0.15)] ring-1 ring-white/10' : 'shadow-[0_0_60px_rgba(0,0,0,0.9)]'}`}>
        <iframe
          src={servers[activeServer].url(tmdbId, type)}
          className="w-full h-full border-0 absolute inset-0"
          allowFullScreen
          referrerPolicy="origin"
        ></iframe>
      </div>

      {/* Server Selection Controls */}
      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-5 h-5 text-[#F5C518]" />
          <h3 className="text-white font-bold text-sm sm:text-base">
            Change Server (For Different Languages)
          </h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {servers.map((server, index) => (
            <button
              key={index}
              onClick={() => setActiveServer(index)}
              className={`flex-1 flex flex-col items-start p-3 rounded-lg border transition-all text-left ${
                activeServer === index
                  ? "bg-[#F5C518]/10 border-[#F5C518] shadow-[0_0_15px_rgba(245,197,24,0.15)]"
                  : "bg-black/50 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Server className={`w-4 h-4 ${activeServer === index ? "text-[#F5C518]" : "text-neutral-400"}`} />
                <span className={`font-bold text-sm ${activeServer === index ? "text-white" : "text-neutral-300"}`}>
                  {server.name}
                </span>
              </div>
              <span className={`text-xs ${activeServer === index ? "text-neutral-300" : "text-neutral-500"}`}>
                {server.description}
              </span>
            </button>
          ))}
        </div>
        
        {/* Helper text for user */}
        <p className="text-neutral-500 text-xs mt-4">
          <strong className="text-[#F5C518]">Tip:</strong> If you're looking for Hindi, Tamil, or other dubbed versions, try Server 1 or Server 2. Once the video loads, check the player's internal settings (usually a gear icon ⚙️) to switch audio tracks.
        </p>
      </div>
    </div>
    </>
  );
}
