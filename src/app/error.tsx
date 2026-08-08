"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-transparent relative overflow-hidden px-4">
      
      {/* Cinematic Glitch Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-rose-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg p-8 sm:p-12 bg-black/40 rounded-[2rem] border border-neutral-800/80 backdrop-blur-xl shadow-2xl"
      >
        <motion.div 
          animate={{ 
            rotate: [0, -10, 10, -5, 5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2 
          }}
          className="mb-8 p-5 bg-rose-500/10 rounded-full border border-rose-500/20"
        >
          <AlertOctagon className="w-16 h-16 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
        </motion.div>
        
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter mb-4">
          Transmission Interrupted
        </h2>
        
        <p className="text-sm sm:text-base text-neutral-400 mb-8 font-medium leading-relaxed">
          The database encountered a temporary network glitch or TMDB rate limit. Don't worry, the film reels are still intact.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Reload Scene
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 rounded-xl font-bold transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </div>
        
        {/* Subtle Error Hash */}
        <div className="mt-8 pt-6 border-t border-neutral-800/50 w-full">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-600">
            Error Code // {error.digest || 'RUNTIME_FAULT'}
          </p>
        </div>
      </motion.div>
      
    </div>
  );
}
