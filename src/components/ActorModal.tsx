"use client";

import { useEffect, useState } from "react";
import { X, Calendar, MapPin, Film, User } from "lucide-react";
import { getPersonDetails } from "@/actions/movieActions";
import MovieCard from "./MovieCard";

export default function ActorModal({ personId, onClose }: { personId: number, onClose: () => void }) {
  const [actor, setActor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    const fetchActor = async () => {
      setIsLoading(true);
      const data = await getPersonDetails(personId);
      setActor(data);
      setIsLoading(false);
    };
    fetchActor();
  }, [personId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-[#141414] w-[300px] h-[300px] rounded-2xl border border-neutral-800 flex flex-col items-center justify-center z-10 shadow-2xl">
          <div className="w-8 h-8 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-bold animate-pulse text-sm">Extracting Archives...</p>
        </div>
      </div>
    );
  }

  if (!actor) return null;

  const credits = actor.combined_credits?.cast || [];
  // Dedup credits by id to avoid overlapping keys from TMDB quirks
  const uniqueCredits: any[] = Array.from(new Map(credits.map((c: any) => [c.id, c])).values());
  // Sort credits by popularity or vote count to show their best work first
  const topCredits = uniqueCredits
    .filter(c => c.poster_path && (c.vote_count > 50 || c.popularity > 10))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20); // Top 20 best roles

  const IMAGE_BASE = "https://image.tmdb.org/t/p/h632"; // High res

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 px-0 sm:px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-[#141414] rounded-2xl overflow-y-auto shadow-2xl border border-neutral-700/50 animate-in fade-in zoom-in-95 duration-300 custom-scrollbar flex flex-col">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[210] bg-black/50 hover:bg-neutral-800 text-white p-2 md:p-2.5 rounded-full transition-all backdrop-blur-md border border-neutral-600 hover:scale-110 shadow-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 min-h-[50vh] shrink-0">
          {/* Left Hero Image */}
          <div className="w-full h-[50vh] md:h-full md:col-span-2 relative shrink-0">
            {actor.profile_path ? (
              <>
                <img 
                  src={`${IMAGE_BASE}${actor.profile_path}`}
                  className="w-full h-full object-cover"
                  alt={actor.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent md:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#141414]/20 to-[#141414] hidden md:block" />
              </>
            ) : (
              <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center bg-neutral-900 border-r border-neutral-800">
                <User className="w-24 h-24 text-neutral-600" />
              </div>
            )}
            
            {/* Mobile overlays for title */}
            <div className="absolute bottom-0 left-0 p-6 w-full md:hidden flex flex-col justify-end z-10 text-white">
              <h2 className="text-4xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(0,0,0,1)]">{actor.name}</h2>
              <p className="text-[#F5C518] font-bold text-xs uppercase tracking-widest">{actor.known_for_department}</p>
            </div>
          </div>

          {/* Right Information Flow */}
          <div className="p-6 md:p-10 w-full md:col-span-3 flex flex-col relative z-20 md:overflow-y-auto custom-scrollbar">
            
            {/* Desktop Title */}
            <div className="hidden md:block mb-8">
              <span className="text-[#F5C518] font-bold text-[10px] uppercase tracking-widest bg-[#F5C518]/10 px-2 py-1 rounded inline-block mb-3 border border-[#F5C518]/20">
                {actor.known_for_department}
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{actor.name}</h2>
            </div>
            
            {/* Bio Stats */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 border-y border-neutral-800 py-4">
               {actor.birthday && (
                 <div className="flex items-center gap-2 text-sm text-neutral-300">
                   <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                   <div>
                     <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider block">Born</span>
                     <span className="font-semibold text-white">{actor.birthday}</span>
                   </div>
                 </div>
               )}
               {actor.place_of_birth && (
                 <div className="flex items-center gap-2 text-sm text-neutral-300 border-l border-neutral-800 pl-4 sm:pl-8">
                   <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                   <div>
                     <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider block">Birthplace</span>
                     <span className="font-semibold text-white line-clamp-1">{actor.place_of_birth}</span>
                   </div>
                 </div>
               )}
            </div>

            {/* Biography */}
            <div className="mb-6">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                Biography
              </h3>
              {actor.biography ? (
                <div className="relative">
                  <p className={`text-neutral-300 text-sm leading-relaxed font-light ${!showFullBio && actor.biography.length > 600 ? 'line-clamp-6' : ''}`}>
                    {actor.biography}
                  </p>
                  
                  {!showFullBio && actor.biography.length > 600 && (
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#141414] to-transparent pointer-events-none" />
                  )}
                  
                  {actor.biography.length > 600 && (
                    <button 
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="text-[#F5C518] text-xs font-bold uppercase tracking-wider mt-2 hover:underline relative z-10"
                    >
                      {showFullBio ? 'Read Less' : 'Read Full Biography'}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-neutral-500 italic text-sm">No biography isolated in TMDB database.</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Filmography Array */}
        {!showFullBio && (
          <div className="p-6 md:p-10 border-t border-neutral-800 bg-[#0a0a0c] shrink-0">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-[#F5C518]" /> Cinematic Profile
              </h3>
              <div className="h-px bg-neutral-800 flex-1" />
              <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                {topCredits.length} Matches
              </span>
            </div>

            {topCredits.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-2">
                {topCredits.map((media) => (
                  <MovieCard key={media.id} movie={media} />
                ))}
              </div>
            ) : (
              <div className="text-neutral-500 italic bg-neutral-900/40 border border-neutral-800 rounded-xl p-8 text-center text-sm font-medium">
                No significant filmography mapped.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
