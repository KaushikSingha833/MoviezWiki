"use client";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-12">
      <div className="relative w-full max-w-2xl bg-[#1a1a1a] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-indigo-600/50">
        <div className="bg-gradient-to-r from-indigo-900 to-[#1a1a1a] p-6 border-b border-neutral-800 flex justify-between items-center">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            ✨ AI Summary: <span className="text-[#F5C518] truncate max-w-[200px] sm:max-w-[300px]">{title}</span>
          </h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black"
          >
            ✕
          </button>
        </div>
        
        <div className="p-8 min-h-[200px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-indigo-400 font-semibold animate-pulse">Gemini is analyzing the movie...</p>
            </div>
          ) : (
            <p className="text-lg text-neutral-200 leading-relaxed font-medium">
              {summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}