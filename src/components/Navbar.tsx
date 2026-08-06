"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, authLoaded } = useWishlist();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/welcome";

  if (isAuthPage) return null;

  const NavLinks = ({ mobile = false }) => (
    <>
      <Link href="/" onClick={() => mobile && setIsMobileMenuOpen(false)} className={pathname === '/' ? 'text-[#F5C518] border-b-2 border-[#F5C518] pb-1' : 'hover:text-neutral-300 transition-colors'}>Home</Link>
      <Link href="/wishlist" onClick={() => mobile && setIsMobileMenuOpen(false)} className={pathname === '/wishlist' ? 'text-[#F5C518] border-b-2 border-[#F5C518] pb-1' : 'hover:text-neutral-300 transition-colors'}>Wishlist</Link>
      <Link href="/country" onClick={() => mobile && setIsMobileMenuOpen(false)} className={pathname === '/country' ? 'text-[#F5C518] border-b-2 border-[#F5C518] pb-1' : 'hover:text-neutral-300 transition-colors'}>By Country</Link>
      <Link href="/welcome" onClick={() => mobile && setIsMobileMenuOpen(false)} className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-[#F5C518] border border-[#F5C518]/40 hover:bg-[#F5C518] hover:text-black font-bold px-3.5 py-1 rounded-full text-xs transition-all duration-300 shadow-sm">
        <span>✨</span> Discover V2
      </Link>
      {authLoaded && !user ? (
        <Link href="/login" onClick={() => mobile && setIsMobileMenuOpen(false)} className="hover:text-neutral-300 transition-colors md:ml-2">Login</Link>
      ) : authLoaded && user ? (
        <div className={`flex items-center gap-3 ${mobile ? 'mt-4' : 'ml-4'} bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-700 shadow-inner`}>
          <span className="text-xs text-neutral-300 font-medium truncate max-w-[150px]">{user.email}</span>
          <button 
            onClick={() => {
              handleLogout();
              if (mobile) setIsMobileMenuOpen(false);
            }} 
            className="text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-full transition-colors"
            title="Log Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      ) : null}
    </>
  );

  return (
    <header className="bg-[#181818] border-b border-neutral-800 sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link href="/" className="text-xl md:text-2xl font-black text-[#F5C518]">MoviezWiki</Link>
          <nav className="hidden lg:flex space-x-6 font-semibold text-sm items-center">
            <NavLinks />
          </nav>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <form action="/search" className="hidden sm:flex relative">
            <input 
              type="text" 
              name="q"
              placeholder="Search movies..." 
              className="bg-neutral-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#F5C518] text-sm w-48 md:w-64"
              required
            />
            <button type="submit" className="bg-[#F5C518] hover:bg-yellow-500 transition-colors text-black px-4 py-2 rounded-r-md font-bold text-sm">
              Search
            </button>
          </form>

          <button 
            className="lg:hidden text-white p-2 hover:bg-neutral-800 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#181818] border-t border-neutral-800 p-4 flex flex-col space-y-6 shadow-inner absolute w-full left-0">
          <form action="/search" className="flex relative sm:hidden w-full">
            <input 
              type="text" 
              name="q"
              placeholder="Search movies..." 
              className="bg-neutral-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#F5C518] text-sm w-full"
              required
            />
            <button type="submit" className="bg-[#F5C518] hover:bg-yellow-500 transition-colors text-black px-4 py-2 rounded-r-md font-bold text-sm">
              Search
            </button>
          </form>
          <div className="flex flex-col space-y-4 font-semibold text-sm pl-2">
            <NavLinks mobile={true} />
          </div>
        </div>
      )}
    </header>
  );
}