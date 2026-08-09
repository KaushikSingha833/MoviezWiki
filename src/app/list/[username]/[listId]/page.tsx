"use client";

import { useEffect, useState } from "react";
import { getPublicList, CustomList } from "@/lib/lists";
import { getProfileByUsername } from "@/lib/profiles";
import { Copy, Plus, Heart, User, Film, AlertTriangle, Lock, ArrowRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import PersonCard from "@/components/PersonCard";
import Link from "next/link";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { pushNotification } from "@/lib/notifications";

export default function GenericPublicListPage({ params }: { params: Promise<{ username: string, listId: string }> }) {
  const unwrappedParams = React.use(params);
  
  const { user: currentUser, profile: currentProfile } = useWishlist();
  
  const [list, setList] = useState<CustomList | null>(null);
  const [creatorUser, setCreatorUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true);
      // Resolve the identity based on the username string
      const profileInfo = await getProfileByUsername(unwrappedParams.username);
      
      if (!profileInfo) {
        setIsLoading(false);
        return;
      }
      
      setCreatorUser(profileInfo);
      
      // Look up the specific list using the resolved User ID and listId slug
      const { list: listData, isPrivate: privateError } = await getPublicList(profileInfo.uid, unwrappedParams.listId);
      setList(listData);
      setIsPrivate(privateError);
      
      setIsLoading(false);
    };
    
    loadAssets();
  }, [unwrappedParams.username, unwrappedParams.listId]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRequestAccess = async () => {
    if (!currentUser || !currentProfile || !creatorUser) return;
    await pushNotification(
      creatorUser.uid,
      "list_access",
      currentUser.uid,
      currentProfile.username,
      unwrappedParams.listId,
      unwrappedParams.listId // we don't have the title since it's private, so we pass the slug
    );
    setRequestSent(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F5C518] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(245,197,24,0.5)]" />
      </div>
    );
  }

  if (!creatorUser || (!list && !isPrivate)) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-4">
        <div className="bg-[#121215] border border-neutral-800 rounded-3xl p-10 max-w-lg text-center shadow-2xl">
           <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-6 drop-shadow-2xl" />
           <h1 className="text-3xl font-black text-white mb-2">404: List Not Found</h1>
           <p className="text-neutral-400 mb-8 font-medium">This curator might have deleted the list, or the spacetime continuum has collapsed.</p>
           <Link href="/">
             <button className="bg-[#F5C518] hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,197,24,0.2)]">
               Return to Discovery
             </button>
           </Link>
        </div>
      </div>
    );
  }

  if (isPrivate || (list?.isPrivate && !list.approvedUsers?.includes(currentUser?.uid) && currentUser?.uid !== creatorUser.uid)) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#121215] border border-neutral-800 rounded-3xl p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px]" />
          <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
            <Lock className="w-8 h-8 text-[#F5C518]" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3 relative z-10">Private Collection</h2>
          <p className="text-neutral-400 text-sm mb-8 relative z-10 leading-relaxed">
            @{creatorUser.username} has sealed this list. You must request access to view their curated titles.
          </p>
          
          {!currentUser ? (
            <Link href="/login" className="block relative z-10">
              <button className="w-full bg-white text-black font-black py-4 px-6 rounded-xl hover:bg-neutral-200 transition shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Login to Request Access
              </button>
            </Link>
          ) : requestSent ? (
            <button disabled className="w-full relative z-10 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black py-4 px-6 rounded-xl transition cursor-default">
              Request Sent ✓
            </button>
          ) : (
            <button onClick={handleRequestAccess} className="w-full relative z-10 bg-[#F5C518] hover:bg-yellow-400 text-black font-black py-4 px-6 rounded-xl transition shadow-[0_0_20px_rgba(245,197,24,0.2)]">
              Request Access
            </button>
          )}
        </div>
      </div>
    );
  }

  // Safety net
  if (!list) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden pt-24">
      {/* Hero Showcase */}
      <header className="relative w-full max-w-[1400px] mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="relative z-10 max-w-3xl">
          <Link href={`/u/${creatorUser.username}`} className="inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-md transition-colors">
            <div className="w-6 h-6 rounded-full bg-[#121215] flex items-center justify-center overflow-hidden border border-[#F5C518]/50">
               {creatorUser.photoURL ? (
                 <img src={creatorUser.photoURL} alt={creatorUser.username} className="w-full h-full object-cover" />
               ) : (
                 <User className="w-3 h-3 text-[#F5C518]" />
               )}
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-neutral-300">
               Curated by <span className="text-indigo-400">@{creatorUser.username}</span>
            </span>
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            {list.title}
          </h1>
          {list.description && (
            <p className="text-neutral-400 text-lg font-medium leading-relaxed mb-8 border-l-2 border-[#F5C518] pl-4">
              {list.description}
            </p>
          )}
          <button 
            onClick={copyUrl}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-neutral-700"
          >
            <Copy className={`w-4 h-4 ${isCopied ? 'text-emerald-400' : 'text-neutral-400'}`} /> 
            {isCopied ? 'Copied URL!' : 'Share Public URL'}
          </button>
        </div>

        {/* Stats Block */}
        <div className="flex flex-col gap-4 text-center md:text-right shrink-0">
           <div className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-center">
             <span className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-2">
               Curated Assets
             </span>
             <div className="flex items-baseline justify-center md:justify-end gap-2">
               <span className="text-5xl font-black text-[#F5C518]">{list.items.length}</span>
               <span className="text-sm font-bold text-neutral-400">ITEMS</span>
             </div>
           </div>
        </div>
      </header>

      {/* Grid Canvas */}
      <main className="max-w-[1400px] mx-auto px-6 pb-32">
         {list.items.length > 0 ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-12">
             {list.items.map((item, idx) => {
                if (item.media_type === "person") {
                  return (
                    <div key={item.id || idx} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                      <PersonCard person={item} />
                    </div>
                  );
                } else {
                  return (
                    <div key={item.id || idx} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                      <MovieCard movie={item} />
                    </div>
                  );
                }
             })}
           </div>
         ) : (
           <div className="text-center py-32 bg-[#121215]/50 border border-neutral-800/50 rounded-[3rem]">
              <Film className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">The List is Empty</h2>
              <p className="text-neutral-500 max-w-sm mx-auto">This magnificent curator hasn't added any titles here yet.</p>
           </div>
         )}
      </main>
    </div>
  );
}
