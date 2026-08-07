"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clapperboard, Home, Film, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50rem] h-[50rem] bg-indigo-600/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[40rem] h-[40rem] bg-[#F5C518]/5 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
        
        {/* Animated 404 Display */}
        <div className="relative mb-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            className="flex items-center justify-center gap-4 text-7xl md:text-9xl font-black tracking-tighter"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-600">4</span>
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                y: [0, -15, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#F5C518] drop-shadow-[0_0_30px_rgba(245,197,24,0.4)]"
            >
              <Clapperboard className="w-20 h-20 md:w-32 md:h-32 stroke-[1.5]" />
            </motion.div>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-600">4</span>
          </motion.div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#F5C518]/50 to-transparent mt-8"
          />
        </div>

        {/* Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Lost on the Cutting Room Floor
          </h1>
          <p className="text-neutral-400 text-lg font-medium leading-relaxed">
            The scene you are looking for didn't make the final cut. It may have been deleted, renamed, or perhaps it only exists in an alternate cinematic universe.
          </p>
        </motion.div>

        {/* Interactive Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/">
            <button className="group flex items-center gap-3 bg-[#F5C518] text-black font-black py-4 px-8 rounded-full hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(245,197,24,0.2)]">
              <Home className="w-5 h-5" />
              Return to Main Stage
            </button>
          </Link>
          <Link href="/welcome">
            <button className="group flex items-center gap-3 bg-neutral-900 border border-neutral-700 text-white font-bold py-4 px-8 rounded-full hover:bg-neutral-800 hover:border-neutral-500 hover:scale-105 active:scale-95 transition-all">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Enter AI Discovery
            </button>
          </Link>
        </motion.div>
        
        {/* Floating Ambient Icons */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[30%] opacity-20 pointer-events-none hidden lg:block"
        >
          <Film className="w-24 h-24" />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-[10%] bottom-[30%] opacity-10 pointer-events-none hidden lg:block"
        >
          <Film className="w-32 h-32 text-indigo-400" />
        </motion.div>

      </div>
    </div>
  );
}
