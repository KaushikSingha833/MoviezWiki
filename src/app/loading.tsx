"use client";

import { motion } from "framer-motion";
import { Film } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-transparent relative overflow-hidden">
      
      {/* Cinematic Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] md:w-[30rem] h-[20rem] md:h-[30rem] bg-[#F5C518]/5 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Branding */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="mb-6 text-[#F5C518] p-4 bg-black/40 rounded-full border border-neutral-800 shadow-2xl backdrop-blur-md"
        >
          <Film className="w-8 h-8 opacity-90" />
        </motion.div>
        
        <h2 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase mb-8 drop-shadow-2xl flex items-center gap-1">
          Loading<span className="text-[#F5C518] animate-pulse">...</span>
        </h2>
        
        {/* Sleek Progress Bar */}
        <div className="w-48 md:w-64 h-1 bg-neutral-900 rounded-full overflow-hidden shadow-inner relative border border-neutral-800/50">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#F5C518] to-transparent w-full"
            animate={{ 
              x: ["-100%", "100%"] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
      
    </div>
  );
}
