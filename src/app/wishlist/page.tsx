"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Heart, Lock, Sparkles, FolderHeart, ArrowRight, Film, User, ListPlus, LayoutGrid, Plus, Trash2, X, Globe } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import PersonCard from "@/components/PersonCard";
import { useWishlist } from "@/context/WishlistContext";
import { createList, deleteList, toggleListPrivacy } from "@/lib/lists";
import { toggleMainWishlistPrivacy } from "@/lib/profiles";

const gridContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

export default function WishlistPage() {
  const { wishlist, user, customLists, profile } = useWishlist();

  // Tab State
  const [activeTab, setActiveTab] = useState<"wishlist" | "lists">("wishlist");

  // Create List State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Route saved objects into two specific buckets for rendering
  const savedPeople = wishlist.filter(item => item.media_type === "person");
  const savedMedia = wishlist.filter(item => item.media_type !== "person");

  const handleCreateList = async () => {
    if (!newTitle.trim() || !user) return;
    setIsCreating(true);
    await createList(user.uid, newTitle, newDesc);
    setNewTitle("");
    setNewDesc("");
    setShowCreateModal(false);
    setIsCreating(false);
  };

  const handleDeleteList = async (listId: string) => {
    if (!user) return;
    const confirm = window.confirm("Are you sure you want to delete this list forever?");
    if (confirm) {
      await deleteList(user.uid, listId);
    }
  };

  const handleToggleListPrivacy = async (listId: string, currentIsPrivate: boolean) => {
    if (!user) return;
    await toggleListPrivacy(user.uid, listId, currentIsPrivate);
  };

  const handleToggleMainPrivacy = async () => {
    if (!user || !profile) return;
    await toggleMainWishlistPrivacy(user.uid, !!profile.isMainWishlistPrivate);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden">
      
      {/* Premium Dashboard Header */}
      <header className="relative w-full pt-32 pb-16 px-6 lg:px-12 border-b border-neutral-900 overflow-hidden">
        {/* Aesthetic Background Accents */}
        <div className="absolute top-0 left-[20%] w-96 h-96 bg-[#F5C518]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-[10%] w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
              <FolderHeart className="w-4 h-4 text-[#F5C518]" />
              <span className="text-xs font-bold tracking-widest uppercase text-neutral-300">
                Personal Collection
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-2">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-yellow-500">Wishlist</span>
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-medium max-w-xl">
              Your curated cinematic library. Titles you save across the ecosystem synchronize here automatically.
            </p>
          </div>
          
          {user && (
            <div className="flex flex-col items-start md:items-end p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-sm min-w-[200px]">
              <span className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">
                Library Size
              </span>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black text-white">{wishlist.length + customLists.length}</span>
                <span className="text-sm font-bold text-[#F5C518]">ASSETS</span>
              </div>
              {profile && (
                <button
                  onClick={handleToggleMainPrivacy}
                  className="flex items-center gap-1.5 px-3 py-1 bg-black/40 border border-neutral-700 hover:border-neutral-500 hover:text-white rounded-lg text-xs font-bold text-neutral-400 transition-colors"
                >
                  {profile.isMainWishlistPrivate ? (
                    <><Lock className="w-3 h-3 text-rose-500" /> Private</>
                  ) : (
                    <><Globe className="w-3 h-3 text-emerald-500" /> Public</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {user && (
        <div className="max-w-[1400px] mx-auto px-6 py-6 border-b border-neutral-900 flex justify-center md:justify-start gap-4">
          <button 
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${activeTab === "wishlist" ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}
          >
            <FolderHeart className="w-5 h-5" /> Master Wishlist
          </button>
          <button 
            onClick={() => setActiveTab("lists")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${activeTab === "lists" ? 'bg-[#F5C518] text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'}`}
          >
            <ListPlus className="w-5 h-5" /> Custom Lists
          </button>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 min-h-[60vh]">
        
        {!user ? (
          
          /* Logged Out / Lock Screen State */
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center py-24 px-4 bg-gradient-to-b from-neutral-900/50 to-black rounded-[3rem] border border-neutral-800/80 shadow-2xl relative overflow-hidden"
          >
            {/* Lock Modal Aura */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-[#F5C518]/10 rounded-full blur-[80px] animate-pulse" />
            </div>

            <div className="w-20 h-20 bg-black border border-neutral-800 rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10">
              <Lock className="w-8 h-8 text-[#F5C518]" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
              Authentication Required
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-md relative z-10">
              Your cinematic library is encrypted. Connect your account to sync your watchlist across the globe.
            </p>
            
            <Link href="/login" className="relative z-10">
              <button className="group flex items-center gap-3 bg-white text-black font-black py-4 px-10 rounded-full hover:bg-neutral-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                Secure Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

        ) : activeTab === "lists" ? (

          <div className="flex flex-col gap-8 pb-24">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
              <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <LayoutGrid className="w-6 h-6 text-[#F5C518]" /> My Letterboxd Lists
              </h2>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-[#F5C518] hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,197,24,0.2)] hover:scale-105"
              >
                <Plus className="w-5 h-5 font-black" /> Create List
              </button>
            </div>

            {customLists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customLists.map(list => (
                  <div key={list.id} className="group relative bg-[#121215]/80 backdrop-blur-xl border border-neutral-800/80 rounded-[2rem] p-8 flex flex-col hover:border-[#F5C518]/50 transition-all duration-500 shadow-2xl overflow-hidden hover:shadow-[0_0_40px_rgba(245,197,24,0.1)] hover:-translate-y-1">
                    {/* Soft background glow */}
                    <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#F5C518]/5 rounded-full blur-[80px] group-hover:bg-[#F5C518]/10 transition-colors pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex-1 pr-4">
                        <h3 className="text-2xl font-black text-white group-hover:text-[#F5C518] transition-colors line-clamp-1 mb-3">{list.title}</h3>
                        <div className="flex flex-wrap gap-2 items-center">
                          <p className="text-neutral-300 text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 backdrop-blur-md">
                            <Film className="w-3 h-3 text-[#F5C518]" />
                            {list.items ? list.items.length : 0} ITEMS
                          </p>
                          <button
                            onClick={() => handleToggleListPrivacy(list.id, !!list.isPrivate)}
                            className="bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center backdrop-blur-md"
                            title={list.isPrivate ? "Unlock List" : "Lock List"}
                          >
                            {list.isPrivate ? (
                               <><Lock className="w-3 h-3 text-rose-500 mr-1.5" /> <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Private</span></>
                            ) : (
                               <><Globe className="w-3 h-3 text-emerald-500 mr-1.5" /> <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Public</span></>
                            )}
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteList(list.id)}
                        className="p-2 text-neutral-600 opacity-100 md:opacity-0 group-hover:opacity-100 md:text-neutral-700 md:hover:text-red-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all border border-transparent hover:border-red-500/30 shrink-0"
                        title="Delete List"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-neutral-400 text-sm mb-10 line-clamp-2 min-h-[40px] relative z-10 leading-relaxed font-medium">
                      {list.description || "No curation notes provided for this collection."}
                    </p>
                    
                    <div className="mt-auto relative z-10 block">
                       <Link href={`/list/${profile?.username || user.uid}/${list.id}`} className="block">
                         <div className="bg-black/60 border border-neutral-800/80 hover:border-neutral-600 rounded-2xl p-4 flex items-center justify-between group/link transition-colors backdrop-blur-md">
                           <div className="flex flex-col truncate pr-4">
                             <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1 group-hover/link:text-neutral-400 transition-colors">List Access URL</span>
                             <span className="text-sm font-bold text-indigo-400/70 truncate group-hover/link:text-indigo-400 transition-colors font-mono">
                               .../list/{profile?.username}/{list.id}
                             </span>
                           </div>
                           <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shrink-0 group-hover/link:bg-white group-hover/link:text-black transition-all group-hover/link:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                             <ArrowRight className="w-4 h-4" />
                           </div>
                         </div>
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#121215]/50 border border-neutral-800/50 rounded-3xl text-center">
                <ListPlus className="w-16 h-16 text-neutral-800 mb-4" />
                <h4 className="text-xl font-black text-neutral-300">No Lists Yet</h4>
                <p className="text-neutral-500 max-w-sm mt-2">
                  Create your first highly curated collection of movies and share it globally.
                </p>
              </div>
            )}
          </div>

        ) : wishlist.length > 0 ? (
          
          <div className="flex flex-col gap-12 md:gap-20 pb-24">
            {/* Cinematic Movies & TV Segment */}
            {savedMedia.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-8 flex items-center gap-3 border-b border-neutral-900 pb-4">
                  <Film className="w-6 h-6 text-[#F5C518]" /> Saved Titles
                </h2>
                <motion.div 
                  variants={gridContainer}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-12"
                >
                  {savedMedia.map((movie: any) => (
                    <motion.div key={movie.id} variants={cardItem} className="flex-shrink-0">
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Favorite Actors Segment */}
            {savedPeople.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-8 flex items-center gap-3 border-b border-neutral-900 pb-4">
                  <User className="w-6 h-6 text-rose-500" /> Favorite Cast & Crew
                </h2>
                <motion.div 
                  variants={gridContainer}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-12"
                >
                  {savedPeople.map((person: any) => (
                    <motion.div key={person.id} variants={cardItem} className="flex-shrink-0">
                      <PersonCard person={person} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        ) : (
          /* Empty Zero-State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center py-28 px-4 bg-[#121215]/80 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden"
          >
            {/* Floating Particles/Aura */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 bg-rose-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div 
              animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 mb-8"
            >
              <Heart className="w-24 h-24 text-neutral-800 drop-shadow-2xl" />
              <div className="absolute top-0 right-0 p-2 bg-black rounded-full border border-neutral-800">
                <Sparkles className="w-5 h-5 text-rose-500" />
              </div>
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 relative z-10 tracking-tight">
              An Empty Canvas
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-lg relative z-10">
              You haven't saved any masterpieces yet. Explore the global ecosystem and hit the heart icon to start building your library.
            </p>
            
            <Link href="/" className="relative z-10">
              <button className="group flex items-center gap-3 bg-[#F5C518] text-black font-black py-4 px-10 rounded-full hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(245,197,24,0.2)]">
                Explore Top Movies
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

        )}
      </main>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <FolderHeart className="w-6 h-6 text-[#F5C518]" /> Build List
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-neutral-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Curation Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My Top 10 A24 Horror" 
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white font-bold placeholder-neutral-600 focus:outline-none focus:border-[#F5C518]"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Optional Description</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What is this list about?" 
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-[#F5C518] resize-none"
                />
              </div>
            </div>
            
            <button 
              onClick={handleCreateList}
              disabled={!newTitle.trim() || isCreating}
              className="mt-8 w-full bg-[#F5C518] hover:bg-yellow-400 disabled:opacity-50 text-black py-4 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:shadow-[0_0_30px_rgba(245,197,24,0.5)] flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Plus className="w-5 h-5" /> Generate Magic URL</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}