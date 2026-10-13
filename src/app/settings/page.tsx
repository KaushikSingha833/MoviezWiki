"use client";

import { useSettings } from "@/context/SettingsContext";
import { Settings, Globe, ShieldAlert, AlertTriangle, RefreshCcw, User, CheckCircle, XCircle, X, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { checkUsernameAvailable, claimUsername, getMyProfile, updateProfileAvatar } from "@/lib/profiles";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const PRESET_AVATARS = [
  { id: "knight", url: "/avatars/knight.jpg", label: "The Knight" },
  { id: "marine", url: "/avatars/marine.jpg", label: "The Marine" },
  { id: "ninja", url: "/avatars/ninja.jpg", label: "The Ninja" },
  { id: "wizard", url: "/avatars/wizard.jpg", label: "The Wizard" },
  { id: "cyberpunk", url: "/avatars/cyberpunk.jpg", label: "The Hacker" },
  { id: "car", url: "/avatars/car.jpg", label: "Neon Sports Car" },
  { id: "lotus", url: "/avatars/lotus.jpg", label: "Glowing Lotus" },
  { id: "lion", url: "/avatars/lion.jpg", label: "Majestic Lion" },
  { id: "panda", url: "/avatars/panda.jpg", label: "Cute Panda" },
  { id: "wolf", url: "/avatars/wolf.jpg", label: "Fierce Wolf" },
  { id: "hooded", url: "/avatars/hooded.jpg", label: "Mysterious Figure" },
  { id: "spiderman", url: "/avatars/spiderman.png", label: "Spider-Man" },
  { id: "spidergwen", url: "/avatars/spidergwen.png", label: "Spider-Gwen" },
  { id: "ironman", url: "/avatars/ironman.png", label: "Iron Man" },
  { id: "thor", url: "/avatars/thor.png", label: "Thor" },
  { id: "batman", url: "/avatars/batman.png", label: "Batman" },
  { id: "superman", url: "/avatars/superman.png", label: "Superman" },
  { id: "hulk", url: "/avatars/hulk.png", label: "The Hulk" },
  { id: "blackpanther", url: "/avatars/blackpanther.png", label: "Black Panther" },
  { id: "daredevil", url: "/avatars/daredevil.png", label: "Daredevil" },
  { id: "coolcat", url: "/avatars/coolcat.png", label: "Cool Cat" },
  { id: "dogcigar", url: "/avatars/dogcigar.png", label: "Boss Dog" },
  { id: "dogninja", url: "/avatars/dogninja.png", label: "Ninja Dog" },
  { id: "dogknife", url: "/avatars/dogknife.png", label: "Sus Dog" },
  { id: "bearcoffee", url: "/avatars/bearcoffee.png", label: "Coffee Bear" },
  { id: "pandawink", url: "/avatars/pandawink.png", label: "Winking Panda" },
  { id: "squidgame", url: "/avatars/frontman.png", label: "Front Man" },
];

export default function SettingsPage() {
  const { 
    cookieConsent, 
    region, 
    preferenceMode, 
    childMode, 
    useCustomRecommendations,
    setRegion, 
    setPreferenceMode, 
    setChildMode,
    setUseCustomRecommendations,
    resetToDefaults,
    revokeConsent,
    setCookieConsent
  } = useSettings();
  
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, authLoaded } = useWishlist();

  // Social Identity State
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [desiredUsername, setDesiredUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [avatarCategory, setAvatarCategory] = useState<string>("All");

  const filteredAvatars = PRESET_AVATARS.filter((avatar) => {
    if (avatarCategory === "All") return true;
    if (avatarCategory === "Heroes") {
      return ["spiderman", "spidergwen", "ironman", "thor", "batman", "superman", "hulk", "blackpanther", "daredevil"].includes(avatar.id);
    }
    if (avatarCategory === "Anime & Sci-Fi") {
      return ["knight", "marine", "ninja", "wizard", "cyberpunk", "hooded", "squidgame"].includes(avatar.id);
    }
    if (avatarCategory === "Pop & Animals") {
      return ["coolcat", "dogcigar", "dogninja", "dogknife", "bearcoffee", "pandawink", "panda", "lion", "wolf", "car", "lotus"].includes(avatar.id);
    }
    return true;
  });

  // Modal & Custom Alert States
  const [confirmModal, setConfirmModal] = useState<"factory_reset" | "revoke_consent" | null>(null);
  const [customAlert, setCustomAlert] = useState<{
    show: boolean;
    type: "success" | "warning" | "error" | "info";
    title: string;
    message: string;
    redirectUrl?: string;
  } | null>(null);

  const showAlert = (alertData: {
    type: "success" | "warning" | "error" | "info";
    title: string;
    message: string;
    redirectUrl?: string;
  }) => {
    setCustomAlert({
      show: true,
      ...alertData
    });
  };

  const closeAlert = () => {
    if (customAlert?.redirectUrl) {
      router.push(customAlert.redirectUrl);
    }
    setCustomAlert(null);
  };

  // Auto-dismiss custom alert
  useEffect(() => {
    if (customAlert?.show && !customAlert.redirectUrl) {
      const timer = setTimeout(() => {
        setCustomAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [customAlert]);

  // Auto-redirect if custom alert has a redirectUrl
  useEffect(() => {
    if (customAlert?.show && customAlert.redirectUrl) {
      const timer = setTimeout(() => {
        router.push(customAlert.redirectUrl!);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [customAlert, router]);

  useEffect(() => {
    setMounted(true);
    
    if (user) {
      getMyProfile(user.uid).then(prof => {
        if (prof?.username) setCurrentUsername(prof.username);
        if (prof?.photoURL) setCurrentAvatar(prof.photoURL);
      });
    }
  }, [user]);

  // Debounced Availability Checker
  useEffect(() => {
    if (desiredUsername.length < 3) {
      setIsAvailable(null);
      return;
    }
    
    if (desiredUsername.toLowerCase().trim() === currentUsername?.toLowerCase().trim()) {
      setIsAvailable(true);
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      const available = await checkUsernameAvailable(desiredUsername);
      setIsAvailable(available);
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [desiredUsername, currentUsername]);

  const handleClaimUsername = async () => {
    if (!user || !isAvailable || desiredUsername.length < 3) return;
    setIsClaiming(true);
    const success = await claimUsername(user.uid, desiredUsername, currentUsername, user.displayName || "Cinephile");
    if (success) {
      setCurrentUsername(desiredUsername.toLowerCase().trim());
      setDesiredUsername("");
      showAlert({
        type: "success",
        title: "Handle Locked & Verified",
        message: `Your public handle @${desiredUsername.toLowerCase().trim()} has been secured successfully!`
      });
    } else {
      showAlert({
        type: "error",
        title: "Handle Unavailable",
        message: "Error locking username. It may have just been claimed by another user."
      });
    }
    setIsClaiming(false);
  };

  const handleSelectAvatar = async (url: string) => {
    if (!user) return;
    setIsUpdatingAvatar(true);
    const success = await updateProfileAvatar(user.uid, url);
    if (success) {
      setCurrentAvatar(url);
      showAlert({
        type: "success",
        title: "Avatar Updated",
        message: "Your new avatar has been updated instantly across MoviezWiki."
      });
    } else {
      showAlert({
        type: "error",
        title: "Avatar Update Failed",
        message: "Failed to update profile avatar. Please try again."
      });
    }
    setIsUpdatingAvatar(false);
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setConfirmModal(null);
    showAlert({
      type: "success",
      title: "Factory Defaults Restored",
      message: "All navigation settings, region locks, content safety rules, and learned taste profiles have been reset to initial global defaults."
    });
  };

  const handleConfirmRevoke = () => {
    revokeConsent();
    setConfirmModal(null);
    showAlert({
      type: "warning",
      title: "Consent Revoked & Data Purged",
      message: "All localized cookies, tracking telemetry, and taste models have been erased. Returning to homepage...",
      redirectUrl: "/"
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#07070a] text-white pt-24 pb-28 px-4 md:px-8 relative overflow-hidden selection:bg-[#F5C518]/30 selection:text-white">
      {/* Dynamic Background Atmosphere Glows */}
      <div className="absolute top-10 left-1/4 w-[420px] h-[420px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[360px] h-[360px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER HERO AREA */}
        <header className="relative">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-black tracking-widest uppercase text-neutral-300">
                System Deck
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                {region === "IN" ? "🇮🇳 India Engine Lock" : `${region} Engine Lock`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
                <span className="text-[#F5C518]">⚡</span>
                <span>Feed Engine v2.4</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">
                Studio Preferences
              </h1>
            </div>
          </div>
          <p className="text-neutral-400 text-sm max-w-2xl leading-relaxed mt-1">
            Personalize your cinematic feed algorithms, manage your public critic identity, lock in regional streaming filters, and configure safety protocols.
          </p>
        </header>

        {/* SECTION 1: DIGITAL PERSONA & AVATAR VAULT */}
        <section className="bg-gradient-to-b from-[#111116] to-[#0c0c10] border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-black flex items-center gap-2.5 text-white">
              <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
                <User className="w-5 h-5" />
              </div>
              Digital Persona & Public Identity
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              Critic Hub
            </span>
          </div>

          <p className="text-neutral-400 text-xs md:text-sm mb-6 max-w-xl leading-relaxed">
            Claim a globally unique handle to establish your public profile, letting film critics and friends discover your curated Wishlist and movie ratings.
          </p>

          {!authLoaded ? (
            <div className="text-xs text-neutral-500 animate-pulse flex items-center gap-2 p-4 bg-black/40 rounded-2xl border border-neutral-800">
              <div className="w-3 h-3 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              Synchronizing auth identity layer...
            </div>
          ) : !user ? (
            <div className="bg-black/60 border border-neutral-800/80 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Guest Session</h4>
                  <p className="text-xs text-neutral-400">Sign in to lock in your critic handle and sync custom avatars.</p>
                </div>
              </div>
              <Link 
                href="/login"
                className="bg-white text-black font-extrabold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-neutral-200 transition-all text-xs flex items-center gap-1.5"
              >
                <span>Connect Auth</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6 relative z-10">
              
              {/* Active Profile Card */}
              {currentUsername && (
                <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-black/40 border border-indigo-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-[0_4px_25px_rgba(99,102,241,0.15)]">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-[#F5C518]/60 shadow-[0_0_20px_rgba(245,197,24,0.3)] shrink-0">
                      <Image 
                        src={currentAvatar || "/avatars/knight.jpg"} 
                        alt="Current Avatar" 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                          Active Persona
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      </div>
                      <p className="text-2xl font-black text-white tracking-tight">@{currentUsername}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => router.push(`/u/${currentUsername}`)}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-2.5 px-5 rounded-xl shadow-lg shadow-indigo-600/30 border border-indigo-400/40 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>View Public Hub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Handle Claim Input */}
              <div className="bg-black/40 border border-neutral-800/80 rounded-2xl p-5">
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-wider mb-2.5">
                  {currentUsername ? "Re-assign Public Handle" : "Claim Unique Handle"}
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 z-10 font-black text-neutral-500 group-focus-within:text-[#F5C518] transition-colors text-base">@</div>
                  <input
                    type="text"
                    value={desiredUsername}
                    onChange={(e) => setDesiredUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    placeholder="cinemaster99"
                    maxLength={15}
                    className="w-full bg-[#0a0a0e] border border-neutral-800 rounded-xl pl-10 pr-24 py-3.5 text-white font-semibold placeholder:text-neutral-600 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all shadow-inner text-sm"
                  />
                  
                  {/* Validation Indicators */}
                  <div className="absolute right-4 flex items-center gap-2">
                    {isChecking && <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />}
                    
                    {!isChecking && desiredUsername.length >= 3 && isAvailable === true && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" /> Available
                      </span>
                    )}
                    
                    {!isChecking && desiredUsername.length >= 3 && isAvailable === false && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Taken
                      </span>
                    )}
                  </div>
                </div>
                
                {desiredUsername.length > 0 && desiredUsername.length < 3 && (
                   <p className="text-xs mt-2 text-rose-400 flex items-center gap-1">
                     <span>⚠️</span> Handle must be at least 3 characters alphanumeric.
                   </p>
                )}
                
                {desiredUsername.length >= 3 && isAvailable === false && !isChecking && (
                   <p className="text-xs mt-2 text-rose-400 font-medium flex items-center gap-1">
                     <span>✕</span> Handle is already claimed globally. Try another variant.
                   </p>
                )}

                {desiredUsername.length >= 3 && isAvailable === true && (
                  <button
                    onClick={handleClaimUsername}
                    disabled={isClaiming}
                    className="w-full mt-3 bg-gradient-to-r from-[#F5C518] to-yellow-500 hover:to-[#F5C518] text-black font-black py-3.5 rounded-xl shadow-[0_4px_20px_rgba(245,197,24,0.25)] hover:shadow-[0_4px_25px_rgba(245,197,24,0.4)] transition-all flex justify-center items-center gap-2 disabled:opacity-50 text-xs active:scale-95"
                  >
                    {isClaiming ? "Locking Identity..." : "Seal Digital Identity ➔"}
                  </button>
                )}
              </div>

              {/* Free Avatar Showcase Vault */}
              <div className="pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span>VIP Character Avatars</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        100% Free
                      </span>
                    </h3>
                    <p className="text-[11px] text-neutral-400">Click any avatar to instantly equip it to your profile.</p>
                  </div>

                  {/* Category Pills */}
                  <div className="flex gap-1.5 p-1 bg-black/60 border border-neutral-800 rounded-xl">
                    {["All", "Heroes", "Anime & Sci-Fi", "Pop & Animals"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setAvatarCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          avatarCategory === cat
                            ? "bg-[#F5C518] text-black shadow-sm"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Grid */}
                <div className="p-3.5 bg-black/40 border border-neutral-800/80 rounded-2xl">
                  <div className="flex flex-wrap gap-3 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {filteredAvatars.map((avatar) => {
                      const isCurrent = currentAvatar === avatar.url;
                      return (
                        <button
                          key={avatar.id}
                          disabled={isUpdatingAvatar}
                          onClick={() => handleSelectAvatar(avatar.url)}
                          className={`group relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                            isCurrent
                              ? "border-[#F5C518] scale-105 shadow-[0_0_20px_rgba(245,197,24,0.4)] ring-2 ring-[#F5C518]/30"
                              : "border-neutral-800 hover:border-neutral-500 hover:scale-105 opacity-70 hover:opacity-100"
                          }`}
                          title={avatar.label}
                        >
                          <Image src={avatar.url} alt={avatar.label} fill className="object-cover" />
                          {isCurrent && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F5C518] text-black flex items-center justify-center text-[9px] font-black shadow">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}
        </section>

        {/* SECTION 2: CONTENT ENGINE & REGIONAL DISCOVERY */}
        <section className="bg-gradient-to-b from-[#111116] to-[#0c0c10] border border-white/[0.08] hover:border-emerald-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-black flex items-center gap-2.5 text-white">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Globe className="w-5 h-5" />
              </div>
              Content Engine & Regional Discovery
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              AI Algorithm
            </span>
          </div>

          <p className="text-neutral-400 text-xs md:text-sm mb-6 leading-relaxed">
            Select how the MoviezWiki Discovery AI curates your home page carousels and trending feeds.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button 
              onClick={() => setPreferenceMode("global")}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
                preferenceMode === 'global' 
                  ? 'bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-black border-emerald-500 ring-2 ring-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                  : 'bg-black/40 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌐</span>
                  <h3 className={`font-black text-sm ${preferenceMode === 'global' ? 'text-emerald-400' : 'text-white'}`}>
                    Global Network
                  </h3>
                </div>
                {preferenceMode === 'global' && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-black shadow-sm">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Aggregates worldwide trending box office releases, global Netflix/Prime hits, and universally celebrated classics.
              </p>
            </button>

            <button 
              onClick={() => setPreferenceMode("national")}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
                preferenceMode === 'national' 
                  ? 'bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-black border-emerald-500 ring-2 ring-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                  : 'bg-black/40 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇮🇳</span>
                  <h3 className={`font-black text-sm ${preferenceMode === 'national' ? 'text-emerald-400' : 'text-white'}`}>
                    National Preference (70%)
                  </h3>
                </div>
                {preferenceMode === 'national' && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-black shadow-sm">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Prioritizes local cinema (Bollywood, Tollywood, regional blockbusters) strictly matching your active region.
              </p>
            </button>
          </div>

          {/* Active Localization Lock Bar */}
          <div className="p-4 bg-black/40 border border-neutral-800/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-xs font-black text-white">Active Localization Lock</h4>
                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  Default: India
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Primary region for trending feeds, national OTT tracking, and release dates.
              </p>
            </div>

            <div className="shrink-0">
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="bg-[#0e0e13] border border-neutral-700 hover:border-emerald-500/50 text-white font-bold rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-inner"
              >
                <option value="IN">🇮🇳 India (IN) - Default</option>
                <option value="US">🇺🇸 United States (US)</option>
                <option value="KR">🇰🇷 South Korea (KR)</option>
                <option value="JP">🇯🇵 Japan (JP)</option>
                <option value="GB">🇬🇧 United Kingdom (GB)</option>
                <option value="FR">🇫🇷 France (FR)</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 3: SAFETY FILTERS & NEURAL AI ENGINE (DUAL BENTO GRID) */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Child / Safe Mode Card */}
          <section className="bg-gradient-to-b from-[#111116] to-[#0c0c10] border border-white/[0.08] hover:border-amber-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-[70px] pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  {childMode ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                <h3 className="font-black text-white text-base">Child / Safe Mode</h3>
              </div>

              <button 
                onClick={() => setChildMode(!childMode)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                  childMode ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-neutral-800 border border-neutral-700'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow ${
                  childMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              When activated, server queries automatically drop all mature/R-rated content and lock Discovery to Family & PG certified titles only.
            </p>

            <div className="p-2.5 bg-black/40 border border-neutral-800/80 rounded-xl text-[11px] flex items-center justify-between">
              <span className="text-neutral-400">Content Rating:</span>
              <span className={`font-bold ${childMode ? 'text-amber-400' : 'text-neutral-400'}`}>
                {childMode ? 'Strictly Family / PG-13' : 'Unrestricted (All Ages)'}
              </span>
            </div>
          </section>

          {/* Personalized Neural Recommendations Card */}
          <section className="bg-gradient-to-b from-[#111116] to-[#0c0c10] border border-white/[0.08] hover:border-purple-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-[70px] pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-black text-white text-base">Neural Taste Engine</h3>
              </div>

              <button 
                onClick={() => setUseCustomRecommendations(!useCustomRecommendations)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                  useCustomRecommendations ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-neutral-800 border border-neutral-700'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow ${
                  useCustomRecommendations ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Dynamically analyzes your personal Wishlist and rating history to synthesize an algorithmic "Recommended for You" row on the Home screen.
            </p>

            <div className="p-2.5 bg-black/40 border border-neutral-800/80 rounded-xl text-[11px] flex items-center justify-between">
              <span className="text-neutral-400">Personalization State:</span>
              <span className={`font-bold ${useCustomRecommendations ? 'text-purple-400' : 'text-neutral-400'}`}>
                {useCustomRecommendations ? 'Neural AI Synthesis Active' : 'Standby / Default Feeds'}
              </span>
            </div>
          </section>

        </div>

        {/* SECTION 4: DATA PRIVACY & SYSTEM RESET VAULT */}
        <section className="bg-gradient-to-b from-red-950/[0.08] to-[#0c0c10] border border-red-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg md:text-xl font-black flex items-center gap-2.5 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              Data Privacy & System Control
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
              Critical Actions
            </span>
          </div>

          <p className="text-neutral-400 text-xs md:text-sm mb-6 leading-relaxed">
            Manage your localized tracking consent tokens or restore complete global factory configurations.
          </p>

          <div className="flex flex-col gap-4">
            
            {/* Telemetry Consent Row */}
            <div className="bg-black/40 border border-red-500/15 hover:border-red-500/30 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white">Telemetry & Tracking Consent</h4>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                    Purge
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Revoking consent purges all localized cookies, taste vectors, and device identifiers immediately.
                </p>
              </div>

              <button 
                type="button"
                onClick={() => setConfirmModal("revoke_consent")}
                className="shrink-0 text-xs bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 px-5 py-2.5 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all font-extrabold shadow-sm active:scale-95"
              >
                Revoke Consent
              </button>
            </div>

            {/* Factory Reset Row */}
            <div className="bg-black/40 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white">Factory Reset Navigation</h4>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                    India Default
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Restores default Global discovery and locks region back to India (IN) without dropping your consent.
                </p>
              </div>

              <button 
                type="button"
                onClick={() => setConfirmModal("factory_reset")}
                className="shrink-0 text-xs flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-xl border border-neutral-700 hover:border-neutral-500 transition-all font-extrabold shadow-sm active:scale-95"
              >
                <RefreshCcw className="w-3.5 h-3.5 text-[#F5C518]" />
                <span>Reset to Defaults</span>
              </button>
            </div>

          </div>
        </section>

      </div>

      {/* Interactive Warning Dialog (Confirmation Modal) & Custom Alert */}
      {mounted && typeof document !== "undefined" && createPortal(
        <>
          {/* CONFIRMATION WARNING MODAL (YES / NO) */}
          <AnimatePresence>
            {confirmModal && (
              <div 
                className="fixed inset-0 z-[10050] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                onClick={() => setConfirmModal(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.93, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93, y: 15 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative max-w-md w-full bg-[#121217] border rounded-2xl p-6 shadow-2xl overflow-hidden ${
                    confirmModal === "factory_reset" 
                      ? "border-amber-500/30 shadow-[0_0_50px_rgba(245,197,24,0.15)]" 
                      : "border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                  }`}
                >
                  {/* Ambient blur glow */}
                  <div 
                    className={`absolute -top-16 -left-16 w-44 h-44 rounded-full blur-[70px] pointer-events-none ${
                      confirmModal === "factory_reset" ? "bg-amber-500/20" : "bg-red-500/20"
                    }`} 
                  />

                  {/* Close icon */}
                  <button 
                    type="button"
                    onClick={() => setConfirmModal(null)}
                    className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Icon badge */}
                  <div className="flex flex-col items-center text-center mb-5">
                    <div 
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border ${
                        confirmModal === "factory_reset" 
                          ? "bg-amber-500/10 border-amber-500/30 text-[#F5C518] shadow-[0_0_20px_rgba(245,197,24,0.2)]" 
                          : "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                      }`}
                    >
                      {confirmModal === "factory_reset" ? (
                        <RefreshCcw className="w-7 h-7" />
                      ) : (
                        <ShieldAlert className="w-7 h-7" />
                      )}
                    </div>

                    <span 
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border mb-2 ${
                        confirmModal === "factory_reset" 
                          ? "text-amber-400 bg-amber-500/10 border-amber-500/20" 
                          : "text-red-400 bg-red-500/10 border-red-500/20"
                      }`}
                    >
                      {confirmModal === "factory_reset" ? "Warning • Configuration Reset" : "Destructive Privacy Action"}
                    </span>

                    <h3 className="text-xl font-black text-white tracking-tight">
                      {confirmModal === "factory_reset" ? "Restore Factory Defaults?" : "Revoke Telemetry Consent?"}
                    </h3>
                  </div>

                  {/* Explanation text */}
                  <p className="text-neutral-400 text-xs leading-relaxed text-center mb-5">
                    {confirmModal === "factory_reset" ? (
                      "Are you sure you want to restore navigation defaults? This will reset your content algorithms, region locks, and recommendation models without dropping your telemetry consent."
                    ) : (
                      "Are you sure you want to revoke consent? This will immediately wipe all stored cookies, local tracking telemetry, and taste models from your device."
                    )}
                  </p>

                  {/* Impact breakdown box */}
                  <div className="bg-black/50 border border-neutral-800/80 rounded-xl p-3.5 mb-6 text-xs flex flex-col gap-2">
                    {confirmModal === "factory_reset" ? (
                      <>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span className="text-neutral-400">Content Algorithm:</span>
                          <span className="font-semibold text-emerald-400">Global Network</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span className="text-neutral-400">Region Lock:</span>
                          <span className="font-semibold text-white">India (IN)</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span className="text-neutral-400">Child Mode & Custom Recs:</span>
                          <span className="font-semibold text-rose-400">Disabled (Off)</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span className="text-neutral-400">Taste DNA Profile:</span>
                          <span className="font-semibold text-amber-400">Purged</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span className="text-neutral-400">Telemetry Consent:</span>
                          <span className="font-semibold text-neutral-400">Retained</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span className="text-neutral-400">Browser Cookies:</span>
                          <span className="font-semibold text-rose-400">Purged Immediately</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span className="text-neutral-400">Telemetry State:</span>
                          <span className="font-semibold text-rose-400">Revoked / Unanswered</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span className="text-neutral-400">Learned Taste History:</span>
                          <span className="font-semibold text-neutral-400">Destroyed</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span className="text-neutral-400">Next Destination:</span>
                          <span className="font-semibold text-indigo-400">Homepage (Prompted Again)</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Buttons (Yes / No) */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmModal(null)}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold text-neutral-300 bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 hover:text-white transition-all active:scale-95"
                    >
                      No, Cancel
                    </button>

                    {confirmModal === "factory_reset" ? (
                      <button
                        type="button"
                        onClick={handleConfirmReset}
                        className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-black bg-[#F5C518] hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(245,197,24,0.3)] flex items-center justify-center gap-2 active:scale-95"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        Yes, Reset
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConfirmRevoke}
                        className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-red-600 hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(239,68,68,0.35)] flex items-center justify-center gap-2 active:scale-95"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Yes, Revoke
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* CUSTOM ALERT BOX (REPLACING NATIVE ALERT) */}
          <AnimatePresence>
            {customAlert && customAlert.show && (
              <div 
                className="fixed inset-0 z-[10060] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-auto"
                onClick={closeAlert}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`max-w-md w-full bg-[#121217] border rounded-2xl p-6 shadow-2xl relative overflow-hidden ${
                    customAlert.type === "success" 
                      ? "border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.2)]" 
                      : customAlert.type === "warning"
                      ? "border-amber-500/40 shadow-[0_0_40px_rgba(245,197,24,0.2)]"
                      : customAlert.type === "error"
                      ? "border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.2)]"
                      : "border-indigo-500/40 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
                  }`}
                >
                  <div 
                    className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-[50px] pointer-events-none ${
                      customAlert.type === "success" 
                        ? "bg-emerald-500/15" 
                        : customAlert.type === "warning"
                        ? "bg-amber-500/15"
                        : customAlert.type === "error"
                        ? "bg-rose-500/15"
                        : "bg-indigo-500/15"
                    }`} 
                  />

                  <div className="flex items-start gap-4">
                    <div 
                      className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center border ${
                        customAlert.type === "success" 
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                          : customAlert.type === "warning"
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,197,24,0.3)]"
                          : customAlert.type === "error"
                          ? "bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                          : "bg-indigo-500/15 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                      }`}
                    >
                      {customAlert.type === "success" && <CheckCircle className="w-6 h-6" />}
                      {customAlert.type === "warning" && <AlertTriangle className="w-6 h-6" />}
                      {customAlert.type === "error" && <XCircle className="w-6 h-6" />}
                      {customAlert.type === "info" && <ShieldAlert className="w-6 h-6" />}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <h4 className="text-base font-black text-white mb-1 tracking-tight">
                        {customAlert.title}
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {customAlert.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeAlert}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95 ${
                        customAlert.type === "success"
                          ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20"
                          : customAlert.type === "warning"
                          ? "bg-[#F5C518] hover:bg-yellow-400 text-black shadow-yellow-500/20"
                          : customAlert.type === "error"
                          ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white"
                      }`}
                    >
                      <span>{customAlert.redirectUrl ? "Continue ➔" : "Dismiss"}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
}
