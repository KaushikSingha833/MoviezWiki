"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

export default function AISummaryModal({ 
  isOpen, 
  onClose, 
  summary, 
  title, 
  isLoading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  summary: string; 
  title: string; 
  isLoading: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-neutral-900/90 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)] border border-white/10"
          >
            {/* Top Glowing Edge */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
            
            <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                AI Summary: <span className="text-[#F5C518] truncate max-w-[150px] sm:max-w-[300px]">{title}</span>
              </h3>
              <button 
                onClick={onClose} 
                className="text-neutral-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 hover:scale-105 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-8 md:p-10 min-h-[250px] flex items-center justify-center relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
              
              {isLoading ? (
                <div className="flex flex-col items-center gap-6 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl animate-pulse" />
                    <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-white text-lg font-bold tracking-wide">Analyzing Media</p>
                    <p className="text-indigo-300 text-sm font-medium animate-pulse">Generating insights...</p>
                  </div>
                </div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-base md:text-lg text-neutral-200 leading-relaxed font-medium relative z-10"
                >
                  {summary}
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}