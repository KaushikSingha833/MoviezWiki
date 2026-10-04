"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Film, Heart } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/welcome";
  
  if (isAuthPage) return null;

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 py-8 px-4 relative z-10">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Project Branding */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Film className="w-5 h-5 text-[#F5C518]" />
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 tracking-tighter">MoviezWiki</span>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full pt-6 border-t border-neutral-800/50">
          <p className="text-xs text-neutral-500 font-medium mb-4 md:mb-0">
            © {new Date().getFullYear()} MoviezWiki. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse mx-0.5" /> by AEROTech.
          </div>
        </div>

      </div>
    </footer>
  );
}
