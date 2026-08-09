"use client";

import { useState } from "react";
import { User, Sparkles } from "lucide-react";
import ActorModal from "./ActorModal";

export default function PersonCard({ person }: { person: any }) {
  const [showActorModal, setShowActorModal] = useState(false);
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  
  // Clean up known_for to only valid movies/shows with titles
  const knownFor = Array.isArray(person.known_for) 
    ? person.known_for.filter((item: any) => item.title || item.name).slice(0, 3) 
    : [];

  return (
    <>
      <div className="relative w-full aspect-[2/3] group/card">
        <div 
          onClick={() => setShowActorModal(true)}
          className="absolute inset-0 rounded-lg bg-neutral-900 transition-all duration-300 delay-300 md:group-hover/card:scale-125 md:group-hover/card:z-50 md:group-hover/card:-translate-y-6 md:group-hover/card:shadow-2xl overflow-hidden cursor-pointer z-10 flex flex-col border border-transparent md:group-hover/card:border-neutral-700"
        >
          <div className="relative w-full h-full md:group-hover/card:h-[60%] transition-all duration-300 delay-300 shrink-0 bg-[#0a0a0c] flex items-center justify-center">
            {person.profile_path ? (
              <img 
                src={`${IMAGE_BASE_URL}${person.profile_path}`} 
                alt={person.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-neutral-700" />
            )}
            
            <div className="absolute top-2 right-2 z-10 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 delay-300">
              <div className="bg-indigo-600/90 backdrop-blur-sm px-2 py-1 flex items-center justify-center text-white rounded shadow-lg border border-indigo-500/50">
                <Sparkles className="w-3 h-3 mr-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{person.known_for_department}</span>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-100 md:opacity-0 flex flex-col justify-end p-3 md:hidden">
              <h3 className="font-bold text-white mb-1 text-sm line-clamp-2 drop-shadow-md">{person.name}</h3>
              <p className="text-[#F5C518] text-[9px] font-bold uppercase tracking-widest">{person.known_for_department}</p>
            </div>
          </div>

          <div className="h-0 opacity-0 md:group-hover/card:h-[40%] md:group-hover/card:opacity-100 bg-[#141414] transition-all duration-300 delay-300 flex flex-col p-3 w-full overflow-hidden border-t border-neutral-800">
            <h3 className="font-black text-white text-sm mb-1 truncate shrink-0">{person.name}</h3>
            
            {knownFor.length > 0 ? (
              <div className="flex flex-col flex-grow min-h-0 overflow-hidden">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Known For</p>
                <div className="flex gap-2">
                  {knownFor.map((item: any) => (
                    <div key={item.id} className="relative w-1/3 aspect-[2/3] rounded overflow-hidden border border-neutral-800">
                      {item.poster_path ? (
                        <img src={`${IMAGE_BASE_URL}${item.poster_path}`} alt={item.title || item.name} className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-[8px] text-neutral-600 text-center p-1 font-semibold">{item.title || item.name}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center py-4">
                <span className="text-[10px] text-neutral-500 italic">No significant cinematic credits mapped.</span>
              </div>
            )}
            
            <button className="w-full mt-3 bg-[#F5C518] text-black text-[10px] font-black py-1.5 rounded uppercase tracking-wider hover:bg-yellow-500 transition-colors shrink-0">
              View Biography
            </button>
          </div>
        </div>
      </div>

      {showActorModal && (
        <ActorModal personId={person.id} onClose={() => setShowActorModal(false)} />
      )}
    </>
  );
}
