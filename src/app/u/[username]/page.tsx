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
    if (user?.uid !== profile?.uid) return; // Only owner can see this
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
    <div className="min-h-screen bg-[#0a0a0c] text-white pt-24 pb-20 overflow-x-hidden font-sans">
      
      {/* Premium Profile Header Card */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-[#0a0a0c] rounded-[3rem] blur-xl" />
        
        <div className="bg-[#121215]/80 backdrop-blur-xl border border-neutral-800/80 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
          
          {/* Aesthetic Highlights */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
          
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-neutral-900 rounded-full border-4 border-[#121215] ring-2 ring-neutral-800 flex items-center justify-center shadow-2xl relative overflow-hidden">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-neutral-600" />
            )}
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          <div className="flex-1 text-center md:text-left relative z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
                {profile.displayName}
              </h1>
              {user?.uid === profile.uid && (
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-neutral-800/80 border border-neutral-700 text-neutral-300 font-bold px-2 py-1 rounded uppercase tracking-wider">
                  You
                </span>
              )}
            </div>
            
            <p className="text-[#F5C518] font-bold tracking-wide text-lg mb-6 drop-shadow-md">
              @{profile.username}
            </p>
            
            <div className="flex items-center justify-center md:justify-start gap-6 border-y border-neutral-800/50 py-4 mb-6 relative">
              <div 
                className={`text-center md:text-left flex flex-col items-center md:items-start group ${user?.uid === profile.uid ? 'cursor-pointer hover:bg-white/5 p-2 rounded-xl transition -m-2' : ''}`}
                onClick={() => handleOpenNetwork("followers")}
              >
                <span className="text-xl md:text-2xl font-black text-white">{followersCount}</span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest group-hover:text-neutral-300 transition-colors">Followers</span>
              </div>
              <div className="w-px h-8 bg-neutral-800" />
              <div 
                className={`text-center md:text-left flex flex-col items-center md:items-start group ${user?.uid === profile.uid ? 'cursor-pointer hover:bg-white/5 p-2 rounded-xl transition -m-2' : ''}`}
                onClick={() => handleOpenNetwork("following")}
              >
                <span className="text-xl md:text-2xl font-black text-white">{followingCount}</span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest group-hover:text-neutral-300 transition-colors">Following</span>
              </div>
              <div className="w-px h-8 bg-neutral-800" />
              <div className="text-center md:text-left flex flex-col items-center md:items-start group">
                <div className="flex items-center justify-center h-[28px] md:h-[32px]">
                   <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Verified</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {user?.uid === profile.uid ? (
                <button 
                  onClick={() => router.push("/settings")}
                  className="flex-1 bg-[#1a1a2e] hover:bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 hover:text-white font-black py-3 px-6 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Edit Profile Settings
                </button>
              ) : (
                <button 
                  onClick={handleToggleFollow}
                  disabled={isToggling}
                  className={`flex-1 font-black py-3 px-6 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 ${isFollowing ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'}`}
                >
                  {isToggling ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
      </div>
      
      {/* Vault / Public Wishlist Segment */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12 pb-24 relative z-20">
        <h3 className="text-xl md:text-2xl font-black text-white mb-8 flex items-center gap-3 border-b border-neutral-800/80 pb-4">
          <FolderHeart className="w-6 h-6 text-[#F5C518]" /> 
          {profile.displayName.split(' ')[0]}'s Curated Vault
          {vaultLoading && <div className="ml-2 w-4 h-4 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />}
        </h3>
        
        {!vaultLoading && isVaultPrivate ? (
           <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#121215]/50 border border-neutral-800/50 rounded-3xl text-center">
             <Lock className="w-16 h-16 text-[#F5C518] mb-4" />
             <h4 className="text-xl font-black text-white">Private Master Vault</h4>
             <p className="text-neutral-500 max-w-sm mt-2 mb-6">
               @{profile.username} has sealed their main wishlist.
             </p>
             {!user ? (
                <Link href="/login" className="bg-white text-black font-black py-3 px-6 rounded-xl hover:bg-neutral-200 transition">
                  Login to Request Access
                </Link>
             ) : vaultRequestSent ? (
                <button disabled className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black py-3 px-6 rounded-xl transition cursor-default">
                  Request Sent ✓
                </button>
             ) : (
                <button onClick={handleRequestVaultAccess} className="bg-[#F5C518] hover:bg-yellow-400 text-black font-black py-3 px-6 rounded-xl transition shadow-[0_0_20px_rgba(245,197,24,0.2)]">
                  Request Access
                </button>
             )}
           </div>
        ) : !vaultLoading && vaultItems.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#121215]/50 border border-neutral-800/50 rounded-3xl text-center">
             <Heart className="w-16 h-16 text-neutral-800 mb-4" />
             <h4 className="text-xl font-black text-neutral-300">Vault is Empty</h4>
             <p className="text-neutral-500 max-w-sm mt-2">
               {profile.username} hasn't shared any favorite movies, shows, or actors to their public collection yet.
             </p>
           </div>
        ) : (
          <div className="flex flex-col gap-12">
            {vaultItems.filter(i => i.media_type !== "person").length > 0 && (
              <div>
                <h4 className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-4 flex items-center gap-2">
                  <Film className="w-4 h-4 text-indigo-400" /> Saved Titles
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
              <div className="mt-8">
                <h4 className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-rose-500" /> Favorite Cast & Crew
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
