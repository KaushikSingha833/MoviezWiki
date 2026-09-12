"use client";

import { useEffect, useState, use } from "react";
import { getProfileByUsername, UserProfile } from "@/lib/profiles";
import { useWishlist } from "@/context/WishlistContext";
import { Lock, User, Calendar, MapPin, Activity, ShieldCheck, Heart, UserPlus, UserMinus, Settings, FolderHeart, Film } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getNetworkCounts, getFollowState, followUser, unfollowUser, getNetworkList } from "@/lib/network";
import { getPublicVault } from "@/lib/vault";
import { motion, Variants } from "framer-motion";
import MovieCard from "@/components/MovieCard";
import PersonCard from "@/components/PersonCard";
import { pushNotification } from "@/lib/notifications";

const gridContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const { user, profile: myProfile, authLoaded } = useWishlist();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Network State
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Vault State
  const [vaultItems, setVaultItems] = useState<any[]>([]);
  const [vaultLoading, setVaultLoading] = useState(true);
  const [isVaultPrivate, setIsVaultPrivate] = useState(false);
  const [vaultRequestSent, setVaultRequestSent] = useState(false);

  // Network Viewer State
  const [showNetworkModal, setShowNetworkModal] = useState<"followers" | "following" | null>(null);
  const [networkUsers, setNetworkUsers] = useState<UserProfile[]>([]);
  const [loadingNetwork, setLoadingNetwork] = useState(false);

  useEffect(() => {
    if (authLoaded && user && username) {
      getProfileByUsername(username).then((data) => {
        setProfile(data);
        setLoading(false);
        
        if (data) {
           getNetworkCounts(data.uid).then(counts => {
             setFollowersCount(counts.followers);
             setFollowingCount(counts.following);
           });
           
           getFollowState(user.uid, data.uid).then(state => {
             setIsFollowing(state);
           });
           
           getPublicVault(data.uid).then(result => {
             setVaultItems(result.items);
             setIsVaultPrivate(result.isPrivate);
             setVaultLoading(false);
           });
        }
      });
    } else if (authLoaded && !user) {
      setLoading(false); 
    }
  }, [authLoaded, user, username]);

  const handleToggleFollow = async () => {
    if (!user || !profile || isToggling) return;
    setIsToggling(true);
    
    if (isFollowing) {
      await unfollowUser(user.uid, profile.uid);
      setIsFollowing(false);
      setFollowersCount(prev => Math.max(0, prev - 1));
    } else {
      await followUser(user.uid, profile.uid, myProfile?.username);
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
    
    setIsToggling(false);
  };

  const handleRequestVaultAccess = async () => {
    if (!user || !myProfile || !profile) return;
    await pushNotification(
      profile.uid,
      "main_wishlist_access",
      user.uid,
      myProfile.username
    );
    setVaultRequestSent(true);
  };

  const handleOpenNetwork = async (type: "followers" | "following") => {
    if (!profile || user?.uid !== profile.uid) return; // Only owner can see this
    setShowNetworkModal(type);
    setLoadingNetwork(true);
    const results = await getNetworkList(profile.uid, type);
    setNetworkUsers(results);
    setLoadingNetwork(false);
  };

  // Secure locked state if not logged in
  if (authLoaded && !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#121215] border border-neutral-800 rounded-3xl p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[60px]" />
          <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
            <Lock className="w-8 h-8 text-[#F5C518]" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3 relative z-10">Private Ecosystem</h2>
          <p className="text-neutral-400 text-sm mb-8 relative z-10 leading-relaxed">
            Public profiles and social graphs are encrypted. You must be an authenticated member of the network to view other profiles.
          </p>
          <Link href="/login" className="block relative z-10">
            <button className="w-full bg-white text-black font-black py-4 px-6 rounded-xl hover:bg-neutral-200 transition shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Secure Login ➔
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !authLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-24 h-24 bg-neutral-900 rounded-full border border-neutral-800" />
          <div className="h-6 w-32 bg-neutral-900 rounded" />
          <div className="text-neutral-600 text-sm font-bold">Decrypting Identity Hub...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-5xl font-black text-white mb-4">404</h1>
          <p className="text-neutral-400">The neural link to @{username} could not be established.</p>
          <p className="text-neutral-500 text-sm mt-2">This handle may have been abandoned or never existed.</p>
          <Link href="/" className="inline-block mt-8 text-[#F5C518] hover:underline font-bold">Go back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans pb-24">
      
      {/* Premium Cover Banner */}
      <div className="w-full h-48 md:h-72 bg-gradient-to-br from-[#121215] via-[#0a0a0c] to-[#F5C518]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#F5C518]/20 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
      </div>

      {/* Main Profile Info Overlay */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 relative z-20 -mt-20 md:-mt-32">
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end mb-8 md:mb-12">
          
          {/* Overlapping Avatar */}
          <div className="w-36 h-36 md:w-48 md:h-48 shrink-0 bg-[#0a0a0c] rounded-full p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative group">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#F5C518]/50 bg-[#121215] flex items-center justify-center relative">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <User className="w-20 h-20 text-neutral-600" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            {/* Online Status / Verified Badge Overlap */}
            <div className="absolute bottom-4 right-4 bg-[#0a0a0c] rounded-full p-1 shadow-lg">
              <div className="bg-[#F5C518] text-black w-8 h-8 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          {/* Text and Actions */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-lg">
                {profile.displayName}
              </h1>
              {user?.uid === profile.uid && (
                <span className="bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/30 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest shadow-inner">
                  You
                </span>
              )}
            </div>
            
            <p className="text-[#F5C518] font-bold tracking-widest text-sm md:text-base mb-6">
              @{profile.username}
            </p>
            
            {/* Quick Actions (Desktop & Mobile) */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 w-full max-w-md md:max-w-none">
              {user?.uid === profile.uid ? (
                <button 
                  onClick={() => router.push("/settings")}
                  className="flex-1 md:flex-none bg-[#121215] hover:bg-neutral-800 border border-neutral-700/50 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all flex justify-center items-center gap-2 hover:border-[#F5C518]/50 hover:shadow-[0_0_15px_rgba(245,197,24,0.15)]"
                >
                  <Settings className="w-4 h-4 text-neutral-400" /> Settings
                </button>
              ) : (
                <button 
                  onClick={handleToggleFollow}
                  disabled={isToggling}
                  className={`flex-1 md:flex-none font-bold py-3 px-8 rounded-full shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 border ${isFollowing ? 'bg-[#121215] hover:bg-neutral-800 border-neutral-700/50 text-white' : 'bg-[#F5C518] hover:bg-yellow-400 text-black border-[#F5C518] shadow-[0_0_20px_rgba(245,197,24,0.2)] hover:scale-105'}`}
                >
                  {isToggling ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isFollowing ? (
                    <><UserMinus className="w-4 h-4" /> Unfollow</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Follow @{profile.username}</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
           <div 
             className="bg-[#121215]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col items-center md:items-start group hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer shadow-lg relative overflow-hidden"
             onClick={() => handleOpenNetwork("followers")}
           >
             <div className="absolute top-0 right-0 w-20 h-20 bg-[#F5C518]/5 rounded-bl-full group-hover:bg-[#F5C518]/10 transition-colors"></div>
             <span className="text-3xl md:text-4xl font-black text-white relative z-10">{followersCount}</span>
             <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2 relative z-10">
               <User className="w-3 h-3 text-[#F5C518]" /> Followers
             </span>
           </div>
           
           <div 
             className="bg-[#121215]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col items-center md:items-start group hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer shadow-lg relative overflow-hidden"
             onClick={() => handleOpenNetwork("following")}
           >
             <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-colors"></div>
             <span className="text-3xl md:text-4xl font-black text-white relative z-10">{followingCount}</span>
             <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2 relative z-10">
               <UserPlus className="w-3 h-3 text-emerald-400" /> Following
             </span>
           </div>

           <div className="bg-[#121215]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col items-center md:items-start shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-bl-full"></div>
             <span className="text-3xl md:text-4xl font-black text-white relative z-10">{vaultItems.length}</span>
             <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2 relative z-10">
               <FolderHeart className="w-3 h-3 text-rose-500" /> Saved Items
             </span>
           </div>
           
           <div className="bg-[#121215]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center shadow-lg">
             <div className="w-12 h-12 rounded-full bg-[#F5C518]/10 flex items-center justify-center mb-3 border border-[#F5C518]/20 shadow-[0_0_15px_rgba(245,197,24,0.15)]">
               <Activity className="w-6 h-6 text-[#F5C518]" />
             </div>
             <span className="text-xs text-[#F5C518] font-bold uppercase tracking-widest text-center">Active Link</span>
           </div>
        </div>
      </div>
      
      {/* Vault / Public Wishlist Segment */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pb-24 relative z-20">
        <h3 className="text-2xl md:text-3xl font-black text-white mb-10 flex items-center gap-4">
          <div className="p-3 bg-[#F5C518]/10 rounded-2xl border border-[#F5C518]/20 shadow-[0_0_20px_rgba(245,197,24,0.15)]">
            <FolderHeart className="w-7 h-7 text-[#F5C518]" /> 
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            {(profile.displayName || profile.username).split(' ')[0]}'s Curated Vault
          </span>
          {vaultLoading && <div className="ml-4 w-5 h-5 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />}
        </h3>
        
        {!vaultLoading && isVaultPrivate ? (
           <div className="flex flex-col items-center justify-center py-24 px-4 bg-[#121215]/50 border border-white/5 rounded-[2.5rem] text-center shadow-inner relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F5C518]/5 rounded-full blur-[80px]"></div>
             <Lock className="w-20 h-20 text-[#F5C518] mb-6 relative z-10" />
             <h4 className="text-2xl md:text-3xl font-black text-white relative z-10">Private Master Vault</h4>
             <p className="text-neutral-400 text-sm md:text-base max-w-md mt-4 mb-10 relative z-10 leading-relaxed">
               @{profile.username} has sealed their main wishlist. Request access to view their curated collection.
             </p>
             {!user ? (
                <Link href="/login" className="bg-white text-black font-black py-4 px-10 rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 relative z-10">
                  Login to Request Access
                </Link>
             ) : vaultRequestSent ? (
                <button disabled className="border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-black py-4 px-10 rounded-full transition cursor-default shadow-[0_0_20px_rgba(16,185,129,0.2)] relative z-10">
                  Request Sent ✓
                </button>
             ) : (
                <button onClick={handleRequestVaultAccess} className="bg-[#F5C518] hover:bg-yellow-400 text-black font-black py-4 px-10 rounded-full transition-all shadow-[0_0_30px_rgba(245,197,24,0.3)] hover:scale-105 relative z-10">
                  Request Access
                </button>
             )}
           </div>
        ) : !vaultLoading && vaultItems.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 px-4 bg-[#121215]/30 border border-dashed border-white/10 rounded-[2.5rem] text-center">
             <Heart className="w-16 h-16 text-neutral-800 mb-6" />
             <h4 className="text-xl md:text-2xl font-black text-neutral-500">Vault is Empty</h4>
             <p className="text-neutral-600 max-w-sm mt-3 leading-relaxed">
               {profile.username} hasn't shared any favorite movies, shows, or actors to their public collection yet.
             </p>
           </div>
        ) : (
          <div className="flex flex-col gap-16">
            {vaultItems.filter(i => i.media_type !== "person").length > 0 && (
              <div>
                <h4 className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-6 flex items-center gap-3">
                  <Film className="w-4 h-4 text-[#F5C518]" /> Saved Titles
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2"></div>
                </h4>
                <motion.div variants={gridContainer} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
                  {vaultItems.filter(i => i.media_type !== "person").map((movie: any) => (
                    <motion.div key={movie.id} variants={cardItem}>
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
            
            {vaultItems.filter(i => i.media_type === "person").length > 0 && (
              <div>
                <h4 className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-6 flex items-center gap-3">
                  <User className="w-4 h-4 text-rose-500" /> Favorite Cast & Crew
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2"></div>
                </h4>
                <motion.div variants={gridContainer} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
                  {vaultItems.filter(i => i.media_type === "person").map((person: any) => (
                    <motion.div key={person.id} variants={cardItem}>
                      <PersonCard person={person} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Network Modal */}
      {showNetworkModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh] shadow-2xl">
            <div className="p-6 border-b border-neutral-800/80 flex items-center justify-between">
              <h3 className="text-xl font-black text-white capitalize">{showNetworkModal}</h3>
              <button onClick={() => setShowNetworkModal(null)} className="text-neutral-500 hover:text-white transition bg-neutral-900 p-2 rounded-full">
                 ✕ 
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {loadingNetwork ? (
                <div className="flex justify-center p-8">
                  <div className="w-8 h-8 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : networkUsers.length === 0 ? (
                <div className="text-center p-8 text-neutral-500 font-medium">
                  {showNetworkModal === "followers" ? "No followers yet." : "You aren't following anyone yet."}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {networkUsers.map((netUser) => (
                    <Link 
                      key={netUser.uid} 
                      href={`/u/${netUser.username}`} 
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition border border-transparent hover:border-neutral-800"
                      onClick={() => setShowNetworkModal(null)}
                    >
                      <div className="w-12 h-12 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 shadow-md shrink-0">
                        {netUser.photoURL ? (
                          <img src={netUser.photoURL} alt={netUser.username} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-neutral-600 m-auto mt-3" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">{netUser.displayName}</div>
                        <div className="text-xs font-bold text-neutral-500">@{netUser.username}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
