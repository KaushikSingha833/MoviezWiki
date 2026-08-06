"use client";

import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthWarningModal() {
  const { showAuthWarning, setShowAuthWarning, user, authLoaded } = useWishlist();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/wishlist' && authLoaded && !user) {
      setShowAuthWarning(true);
    }
  }, [pathname, user, authLoaded, setShowAuthWarning]);

  if (!showAuthWarning) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4">
      <div className="max-w-md w-full bg-[#1a1a1a] p-8 rounded-xl border border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.15)] text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Authentication Required</h3>
        <p className="text-neutral-400 mb-6">You must log in to access and manage your personal wishlist.</p>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => {
              setShowAuthWarning(false);
              if(pathname === '/wishlist') router.push('/');
            }} 
            className="px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors"
          >
            Go Back
          </button>
          <Link 
            href="/login" 
            onClick={() => setShowAuthWarning(false)} 
            className="px-4 py-2 rounded-md bg-[#F5C518] hover:bg-yellow-500 text-black font-bold transition-colors shadow-lg shadow-yellow-500/20"
          >
            Log In Now
          </Link>
        </div>
      </div>
    </div>
  );
}