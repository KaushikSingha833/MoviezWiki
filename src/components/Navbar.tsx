"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const pathname = usePathname();
  const { user, authLoaded } = useWishlist();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/welcome";

  if (isAuthPage) return null;

  return (
    <header className="flex items-center justify-between p-4 bg-[#181818] border-b border-neutral-800 sticky top-0 z-40">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-2xl font-black text-[#F5C518]">MoviezWiki</Link>
        <nav className="hidden md:flex space-x-6 font-semibold text-sm items-center">
          <Link href="/" className={pathname === '/' ? 'text-[#F5C518] border-b-2 border-[#F5C518] pb-1' : 'hover:text-neutral-300 transition-colors'}>Home</Link>
          <Link href="/wishlist" className={pathname === '/wishlist' ? 'text-[#F5C518] border-b-2 border-[#F5C518] pb-1' : 'hover:text-neutral-300 transition-colors'}>Wishlist</Link>
          <Link href="/country" className={pathname === '/country' ? 'text-[#F5C518] border-b-2 border-[#F5C518] pb-1' : 'hover:text-neutral-300 transition-colors'}>By Country</Link>
          <Link href="/welcome" className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-[#F5C518] border border-[#F5C518]/40 hover:bg-[#F5C518] hover:text-black font-bold px-3.5 py-1 rounded-full text-xs transition-all duration-300 shadow-sm">
            <span>✨</span> Discover V2
          </Link>
          
          {authLoaded && !user ? (
            <Link href="/login" className="hover:text-neutral-300 transition-colors ml-2">Login</Link>
          ) : authLoaded && user ? (
            <div className="flex items-center gap-3 ml-4 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-700 shadow-inner">
              <span className="text-xs text-neutral-300 font-medium truncate max-w-[150px]">{user.email}</span>
              <button 
                onClick={handleLogout} 
                className="text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-full transition-colors"
                title="Log Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>
          ) : null}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <form action="/search" className="relative flex">
          <input 
            type="text" 
            name="q"
            placeholder="Search movies..." 
            className="bg-neutral-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#F5C518] text-sm w-48 lg:w-64"
            required
          />
          <button type="submit" className="bg-[#F5C518] hover:bg-yellow-500 transition-colors text-black px-4 py-2 rounded-r-md font-bold text-sm">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}