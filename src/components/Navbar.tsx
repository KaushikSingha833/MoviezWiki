"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useSettings } from "@/context/SettingsContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { getSearchSuggestions } from "@/actions/movieActions";
import { searchUsers } from "@/lib/profiles";
import { GENRE_MAP } from "@/lib/genres";
import { Filter, SlidersHorizontal, Search, Settings2, Popcorn, Film, Globe, User, Bell, Check, X, Lock, Home, Map, Sparkles, LogIn, FolderHeart } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { approveAccessRequest, dismissNotification, AppNotification } from "@/lib/notifications";

function getFlagEmoji(countryCode: string) {
  if (!countryCode) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const SearchBar = ({ isMobile = false }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  // Search State Managers
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced Filter States
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  
  // AI Neural Search Engine State
  const [isAiMode, setIsAiMode] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Auto-Suggestions (Hybrid: TMDB + Firebase)
  useEffect(() => {
    const fetchSugg = async () => {
      const q = query.trim();
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }
      
      // Perform parallel fetch to both external TMDB API and Internal Firebase Nodes
      const [tmdbRes, firebaseRes] = await Promise.all([
        getSearchSuggestions(q),
        searchUsers(q)
      ]);
      
      // Map Firebase results to fit the dropdown schema
      const mappedUsers = firebaseRes.map(u => ({
        ...u,
        name: u.displayName,
        media_type: 'social',
        profile_path: u.photoURL,
        social_username: u.username
      }));
      
      // Stitch them together (Social users at the absolute top)
      setSuggestions([...mappedUsers, ...tmdbRes]);
    };
    
    const timer = setTimeout(fetchSugg, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle Form Submission for Advanced Search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    setShowFilters(false);
    
    const params = new URLSearchParams();
    if (query.trim()) params.append('q', query.trim());
    if (selectedGenres.length > 0) params.append('genres', selectedGenres.join(','));
    if (selectedRegion) params.append('region', selectedRegion);
    if (isAiMode && query.trim()) params.append('ai', 'true');
    
    // If all inputs are blank, do not route
    if (!query.trim() && selectedGenres.length === 0 && !selectedRegion) return;
    
    router.push(`/search?${params.toString()}`);
  };

  const toggleGenre = (id: number) => {
    setSelectedGenres(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  return (
    <div className={`relative ${isMobile ? 'w-full flex' : 'hidden md:flex'}`} ref={containerRef}>
      <form onSubmit={handleSearchSubmit} className={`flex relative items-center w-full shadow-lg rounded-md overflow-hidden group transition-all duration-300 ${isAiMode ? 'ring-2 ring-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : ''}`}>
        <input 
          type="text" 
          name="q"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); setShowFilters(false); }}
          onFocus={() => { if (query.length >= 2) setShowDropdown(true); }}
          placeholder={isAiMode ? "Describe a movie (e.g. funny heist)..." : "Search movies, tv, people..."} 
          className={`bg-[#0a0a0c] text-white px-5 py-2.5 focus:outline-none focus:ring-1 focus:ring-${isAiMode ? 'indigo-500' : '[#F5C518]'} text-sm group-hover:bg-[#121215] transition-colors border-y border-l border-neutral-800 ${isMobile ? 'w-full' : 'w-[280px]'}`}
          autoComplete="off"
        />
        
        {/* Toggle AI Mode Button */}
        <button 
          type="button"
          onClick={() => { setIsAiMode(!isAiMode); setShowDropdown(false); setShowFilters(false); }}
          className={`px-3 py-2.5 border-y transition-all border-neutral-800 flex items-center justify-center ${isAiMode ? 'bg-[#1a1a2e] text-indigo-400 border-l border-neutral-800' : 'bg-[#0a0a0c] text-neutral-400 hover:text-white group-hover:bg-[#121215]'}`}
          title="Deep AI Semantic Search"
        >
          <span className="text-sm">✨</span>
        </button>

        {/* Toggle Filters Button */}
        <button 
          type="button"
          onClick={() => { setShowFilters(!showFilters); setShowDropdown(false); }}
          className={`px-3 py-2.5 border-y text-neutral-400 hover:text-white transition-colors border-neutral-800 flex items-center justify-center ${showFilters ? 'bg-[#1a1a1a] text-[#F5C518]' : 'bg-[#0a0a0c] group-hover:bg-[#121215]'}`}
          title="Advanced Filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Submit Search Button */}
        <button 
          type="submit" 
          className={`transition-colors text-black px-5 py-2.5 font-bold text-sm border-y border-r flex justify-center items-center ${isAiMode ? 'bg-indigo-500 hover:bg-indigo-400 border-indigo-500' : 'bg-[#F5C518] hover:bg-yellow-500 border-[#F5C518]'}`}
        >
           <Search className="w-4 h-4" />
        </button>
      </form>
      
      {/* Search Auto-Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && !showFilters && (
        <div className="absolute top-full left-0 mt-2 w-full bg-[#121215] border border-neutral-700/50 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[100] flex flex-col">
          {suggestions.map((s, i) => {
            const isSocial = s.media_type === 'social';
            const title = s.title || s.name;
            const imgPath = s.poster_path || s.profile_path;
            
            // TMDB paths vs Firebase direct photo URL
            const imgUrl = isSocial ? imgPath : (imgPath ? `https://image.tmdb.org/t/p/w92${imgPath}` : null);
            
            return (
              <Link 
                key={i} 
                href={isSocial ? `/u/${s.social_username}` : `/search?q=${encodeURIComponent(title)}`}
                onClick={() => { setShowDropdown(false); setQuery(isSocial ? "" : title); }}
                className={`flex items-center gap-4 p-3 transition-colors border-b last:border-0 ${isSocial ? 'bg-indigo-900/10 hover:bg-indigo-900/30 border-indigo-500/20' : 'hover:bg-neutral-800/80 border-neutral-800/50'}`}
              >
                <div className={`w-9 h-12 bg-neutral-900 rounded bg-cover bg-center shrink-0 border border-neutral-800 flex items-center justify-center overflow-hidden ${isSocial ? 'rounded-full w-10 h-10 border-indigo-500/50' : ''}`} style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : 'none' }}>
                  {!imgUrl && (
                    isSocial ? <User className="w-5 h-5 text-indigo-400" /> : <span className="text-xs text-neutral-600 font-bold">?</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold line-clamp-1 ${isSocial ? 'text-indigo-100' : 'text-white'}`}>
                    {title}
                  </span>
                  
                  {isSocial ? (
                     <span className="text-indigo-400 text-[10px] uppercase font-black tracking-widest mt-0.5">
                       @{s.social_username}
                     </span>
                  ) : (
                     <span className="text-[#F5C518] text-[9px] uppercase font-bold tracking-widest">
                       {s.media_type === 'person' ? 'Person' : s.media_type === 'tv' ? 'TV Series' : 'Movie'}
                     </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Advanced Discovery Filters Popover */}
      {showFilters && (
        <div className="absolute top-full right-0 lg:left-0 mt-3 w-[320px] sm:w-[400px] md:w-[480px] bg-[#121215]/95 backdrop-blur-xl border border-neutral-700/50 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.9)] overflow-hidden z-[100] flex flex-col">
           <div className="p-4 sm:p-6 border-b border-neutral-800">
             <div className="flex items-center gap-2 mb-1">
               <Settings2 className="w-5 h-5 text-[#F5C518]" />
               <h3 className="text-lg font-black text-white tracking-tight">Discovery Engine</h3>
             </div>
             <p className="text-xs font-medium text-neutral-500">Find titles instantly by selecting categories. Text query is optional!</p>
           </div>
           <div className="p-4 sm:p-6 flex flex-col gap-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
             
             {/* Region Filter */}
             <div>
               <div className="flex items-center gap-2 mb-3">
                 <Globe className="w-4 h-4 text-emerald-400" />
                 <h4 className="text-sm font-bold tracking-widest uppercase text-neutral-300">Industry / Region</h4>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                 {[
                   { id: "", label: "Global / All" },
                   { id: "hollywood", label: "Hollywood (US)" },
                   { id: "bollywood", label: "Bollywood (Hindi)" },
                   { id: "tollywood", label: "Tollywood (Telugu)" },
                   { id: "korean", label: "K-Drama / Korean" },
                   { id: "anime", label: "Anime (Japan)" }
                 ].map(reg => (
                   <label key={reg.id} className={`flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all border ${selectedRegion === reg.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' : 'bg-black/50 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'}`}>
                     <input type="radio" name="region" value={reg.id} checked={selectedRegion === reg.id} onChange={() => setSelectedRegion(reg.id)} className="hidden" />
                     {reg.label}
                   </label>
                 ))}
               </div>
             </div>
             
             {/* Genres Filter (To-Do List Checklist style) */}
             <div>
               <div className="flex items-center gap-2 mb-3">
                 <Film className="w-4 h-4 text-indigo-400" />
                 <h4 className="text-sm font-bold tracking-widest uppercase text-neutral-300">Movie Genres Checklist</h4>
               </div>
               <div className="grid grid-cols-2 gap-2 text-xs">
                 {Object.entries(GENRE_MAP).filter(([id, name]) => Number(id) <= 10752 && name !== "Documentary").map(([id, name]) => {
                   const gId = Number(id);
                   const isChecked = selectedGenres.includes(gId);
                   return (
                     <label key={gId} onClick={(e) => { e.preventDefault(); toggleGenre(gId); }} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                       <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-neutral-600 bg-black/50'}`}>
                         {isChecked && <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                       </div>
                       <span className={isChecked ? 'text-white font-bold' : 'text-neutral-400 font-medium'}>{name}</span>
                     </label>
                   )
                 })}
               </div>
             </div>
             
           </div>

           <div className="p-4 sm:p-6 border-t border-neutral-800 bg-[#0a0a0c] flex gap-3">
             <button 
               type="button"
               onClick={() => { setSelectedGenres([]); setSelectedRegion(""); setQuery(""); }}
               className="px-4 py-3 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 font-bold text-xs transition-all flex-1"
             >
               Reset Array
             </button>
             <button 
               type="button"
               onClick={handleSearchSubmit}
               className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#F5C518] to-yellow-600 text-black font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:scale-[1.02] transition-all flex-[2] flex items-center justify-center gap-2"
             >
               <Popcorn className="w-4 h-4" /> Find Curated Movies
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const { user, authLoaded } = useWishlist();
  const { region } = useSettings();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Subscribe to Notifications
  useEffect(() => {
    if (authLoaded && user && db) {
      const q = query(
        collection(db, "users", user.uid, "notifications"),
        orderBy("createdAt", "desc")
      );
      const unsub = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => doc.data() as AppNotification);
        setNotifications(notifs);
      });
      return () => unsub();
    } else {
      setNotifications([]);
    }
  }, [authLoaded, user]);

  // Click outside notification dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.status === "pending" || n.status === "read").length; // Keeping read to show them until dismissed

  const handleApprove = async (notif: AppNotification) => {
    if (!user) return;
    await approveAccessRequest(user.uid, notif.id, notif.type, notif.fromUid, notif.targetId);
  };
  
  const handleDismiss = async (notifId: string) => {
    if (!user) return;
    await dismissNotification(user.uid, notifId);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/welcome";
  if (isAuthPage) return null;

  const NavLinks = ({ mobile = false }) => (
    <>
      <Link href="/" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`flex items-center gap-3 transition-colors ${pathname === '/' ? 'text-[#F5C518]' : 'text-neutral-500 hover:text-white'}`} title="Home">
         <Home className="w-5 h-5 md:w-6 md:h-6" />
         {mobile && <span>Home</span>}
      </Link>
      <Link href="/wishlist" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`flex items-center gap-3 transition-colors ${pathname === '/wishlist' ? 'text-[#F5C518]' : 'text-neutral-500 hover:text-white'}`} title="Wishlist">
         <FolderHeart className="w-5 h-5 md:w-6 md:h-6" />
         {mobile && <span>Wishlist</span>}
      </Link>
      <Link href="/country" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`flex items-center gap-3 transition-colors ${pathname === '/country' ? 'text-[#F5C518]' : 'text-neutral-500 hover:text-white'}`} title="By Country">
         <Map className="w-5 h-5 md:w-6 md:h-6" />
         {mobile && <span>World Map</span>}
      </Link>
      <Link href="/welcome" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`flex items-center gap-3 transition-all ${pathname === '/welcome' ? 'text-[#F5C518] drop-shadow-[0_0_10px_rgba(245,197,24,0.5)] scale-110' : 'text-neutral-500 hover:text-[#F5C518] hover:scale-110'}`} title="Discover V2">
         <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
         {mobile && <span>Discover</span>}
      </Link>
      {mobile && (
        <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-300 transition-colors flex items-center gap-3 text-neutral-500">
          <Settings2 className="w-5 h-5" /> <span>Settings</span>
        </Link>
      )}
      {authLoaded && !user ? (
        <Link href="/login" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`flex items-center gap-3 transition-colors md:ml-4 ${pathname === '/login' ? 'text-white' : 'text-neutral-500 hover:text-white'}`} title="Login">
           <LogIn className="w-5 h-5 md:w-6 md:h-6" />
           {mobile && <span>Login</span>}
        </Link>
      ) : authLoaded && user ? (
        <>
          <Link href="/profile" onClick={() => mobile && setIsMobileMenuOpen(false)} className={`flex items-center gap-3 transition-colors md:ml-2 ${pathname === '/profile' || pathname.startsWith('/u/') ? 'text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'text-neutral-500 hover:text-indigo-400'}`} title="My Profile">
             <User className="w-5 h-5 md:w-6 md:h-6" />
             {mobile && <span>Profile</span>}
          </Link>
          <div className={`flex items-center gap-3 ${mobile ? 'mt-6' : 'ml-4'} bg-neutral-900 border border-neutral-700/50 py-1.5 px-3 rounded-full`}>
            <span className="text-[10px] sm:text-xs text-neutral-400 font-bold truncate max-w-[120px]">{user.email}</span>
            <button 
              onClick={() => { handleLogout(); if (mobile) setIsMobileMenuOpen(false); }} 
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-full transition-colors shrink-0"
              title="Log Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </>
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
          <SearchBar />

          {/* Notifications Center */}
          {authLoaded && user && (
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className={`relative p-2 rounded-full transition-colors ${showNotifs ? 'bg-indigo-500/20 text-indigo-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                )}
              </button>
              
              {showNotifs && (
                <div className="absolute top-full right-0 mt-3 w-[320px] bg-[#121215]/95 backdrop-blur-xl border border-neutral-700/50 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.9)] overflow-hidden z-[100] flex flex-col">
                  <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1a1a1a]">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                       <Bell className="w-4 h-4 text-indigo-400" /> Notifications
                    </h3>
                    <span className="text-xs font-bold text-neutral-500">{notifications.length} alerts</span>
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-neutral-500 text-sm">
                         It's quiet in here...
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-4 border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                            {notif.type === 'follow' ? <User className="w-4 h-4 text-indigo-400" /> : <Lock className="w-4 h-4 text-[#F5C518]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-neutral-300 leading-snug">
                              <span className="font-bold text-white">@{notif.fromUsername}</span>
                              {notif.type === 'follow' ? " started following you!" : 
                               notif.type === 'list_access' ? ` requested access to '${notif.targetName}'.` :
                               " requested access to your Master Wishlist."}
                            </p>
                            
                            {(notif.type === 'list_access' || notif.type === 'main_wishlist_access') && notif.status === 'pending' && (
                              <div className="flex gap-2 mt-3">
                                <button onClick={() => handleApprove(notif)} className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 hover:text-black hover:border-emerald-500 text-emerald-400 font-bold py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
                                  <Check className="w-3 h-3" /> Approve
                                </button>
                                <button onClick={() => handleDismiss(notif.id)} className="flex-1 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 hover:text-black hover:border-rose-500 text-rose-400 font-bold py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
                                  <X className="w-3 h-3" /> Deny
                                </button>
                              </div>
                            )}
                            
                            {notif.type === 'follow' && (
                              <div className="mt-2">
                                <button onClick={() => handleDismiss(notif.id)} className="text-[10px] text-neutral-500 hover:text-white uppercase font-bold tracking-widest">
                                  Dismiss
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Region and Settings Pill */}
          {mounted && (
            <Link href="/settings" className="hidden md:flex items-center gap-2 bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-full hover:bg-neutral-800 transition-colors shadow-inner" title="Global Settings">
               <span className="text-sm">{getFlagEmoji(region)} {region}</span>
               <div className="w-[1px] h-4 bg-neutral-700" />
               <Settings2 className="w-4 h-4 text-neutral-400 hover:text-white" />
            </Link>
          )}

          <button 
            className="md:hidden text-white p-2 hover:bg-neutral-800 rounded-md transition-colors"
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
        <div className="md:hidden bg-[#181818] border-t border-neutral-800 p-4 flex flex-col space-y-6 shadow-inner absolute w-full left-0 z-50">
          <SearchBar isMobile={true} />
          <div className="flex flex-col space-y-4 font-semibold text-sm pl-2">
            <NavLinks mobile={true} />
          </div>
        </div>
      )}
    </header>
  );
}