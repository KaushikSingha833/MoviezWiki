"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Sparkles } from "lucide-react";
import ActorModal from "./ActorModal";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function CelebrityRow({ celebrities }: { celebrities: any[] }) {
  const [selectedActorId, setSelectedActorId] = useState<number | null>(null);

  if (!celebrities || celebrities.length === 0) return null;

  return (
    <section className="relative w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#F5C518] rounded-full" />
          A-List Celebrities
        </h2>
        <span className="text-xs font-bold text-[#F5C518] uppercase tracking-wider bg-[#F5C518]/10 px-3 py-1 rounded-full border border-[#F5C518]/20 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Trending Weekly
        </span>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex space-x-5 overflow-x-auto pb-8 scrollbar-hide snap-x px-2"
      >
        {celebrities.slice(0, 10).map((person: any) => (
          <motion.div 
            key={person.id} 
            variants={item}
            onClick={() => setSelectedActorId(person.id)}
            className="relative flex-shrink-0 snap-start w-36 sm:w-44 lg:w-48 aspect-[2/3] rounded-3xl overflow-hidden group cursor-pointer border border-neutral-800 hover:border-[#F5C518]/50 shadow-xl transition-colors duration-300 bg-neutral-900"
          >
            <img 
              src={person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : 'https://via.placeholder.com/300x450'} 
              alt={person.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            {/* Cinematic Gradient Fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
            
            <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white font-black text-sm lg:text-base truncate drop-shadow-md">
                {person.name}
              </p>
              <div className="w-6 h-0.5 bg-[#F5C518] mt-2 group-hover:w-full transition-all duration-500 ease-out" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {selectedActorId && (
        <ActorModal personId={selectedActorId} onClose={() => setSelectedActorId(null)} />
      )}
    </section>
  );
}
