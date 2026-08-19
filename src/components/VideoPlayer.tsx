"use client";

import { useState } from "react";
import { Server, Settings2 } from "lucide-react";

type ServerOption = {
  name: string;
  url: (id: string, type: "movie" | "tv") => string;
  description: string;
};

const servers: ServerOption[] = [
  {
    name: "Server 1 (Multi-Audio)",
    description: "AutoEmbed - Often has dual audio (Hindi/Tamil) built-in",
    url: (id, type) => `https://autoembed.co/${type}/tmdb/${id}`,
  },
  {
    name: "Server 2 (Multi-Audio)",
    description: "VidLink - Check the gear icon ⚙️ in the player for language options",
    url: (id, type) => `https://vidlink.pro/${type}/${id}`,
  },
  {
    name: "Server 3 (Fast / English)",
    description: "VidSrc - High speed, but usually English only",
    url: (id, type) => `https://vidsrc.to/embed/${type}/${id}`,
  },
];

export default function VideoPlayer({
  tmdbId,
  type,
}: {
  tmdbId: string;
  type: "movie" | "tv";
}) {
  const [activeServer, setActiveServer] = useState<number>(0);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Video Player */}
      <div className="w-full aspect-video bg-neutral-950 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-neutral-800 relative">
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
  );
}
