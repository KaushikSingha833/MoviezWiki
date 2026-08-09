"use client";

import { useSettings } from "@/context/SettingsContext";
import { Settings, Globe, ShieldAlert, AlertTriangle, RefreshCcw, User, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { checkUsernameAvailable, claimUsername, getMyProfile } from "@/lib/profiles";

export default function SettingsPage() {
  const { 
    cookieConsent, 
    region, 
    preferenceMode, 
    childMode, 
    setRegion, 
    setPreferenceMode, 
    setChildMode,
    resetToDefaults,
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

  useEffect(() => {
    setMounted(true);
    
    if (user) {
      getMyProfile(user.uid).then(prof => {
        if (prof?.username) setCurrentUsername(prof.username);
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
    } else {
      alert("Error locking username. It may have just been claimed.");
    }
    setIsClaiming(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#1a1a2e] p-3 rounded-full text-indigo-400">
              <Settings className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">System Preferences</h1>
          </div>
          <p className="text-neutral-400 text-sm">Manage your localized experience, content safety rules, and tracking definitions.</p>
        </header>

        {/* Phase 1: Digital Identity */}
        <section className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[80px]" />
          
          <h2 className="text-lg font-black mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> Digital Identity & Social
          </h2>
          <p className="text-neutral-400 text-sm mb-6 max-w-xl">
            Claim a globally unique handle. This establishes your public profile, allowing critics and friends to discover your curated Wishlist and Activity.
          </p>

          {!authLoaded ? (
            <div className="text-sm text-neutral-500 animate-pulse">Synchronizing auth layer...</div>
          ) : !user ? (
            <div className="bg-black border border-neutral-800 p-4 rounded-xl flex items-center justify-between text-sm">
              <span className="text-neutral-400">You must be logged in to claim an identity.</span>
              <button 
                onClick={() => router.push("/login")}
                className="bg-white text-black font-bold px-4 py-2 rounded shadow hover:bg-neutral-200 transition"
              >
                Connect Auth
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 relative z-10">
              
              {currentUsername && (
                <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">Active Handle</p>
                    <p className="text-xl font-black text-white">@{currentUsername}</p>
                  </div>
                  <button 
                    onClick={() => router.push(`/u/${currentUsername}`)}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg border border-indigo-500 transition-all"
                  >
                    View Public Hub
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 mt-4">
                  {currentUsername ? "Re-assign Handle" : "Claim New Handle"}
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 z-10 font-black text-neutral-500 group-focus-within:text-[#F5C518] transition-colors">@</div>
                  <input
                    type="text"
                    value={desiredUsername}
                    onChange={(e) => setDesiredUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    placeholder="cinemaster99"
                    maxLength={15}
                    className="w-full bg-black border border-neutral-800 rounded-xl pl-10 pr-24 py-3 text-white focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all shadow-inner"
                  />
                  
                  {/* Validation Indicators */}
                  <div className="absolute right-4 flex items-center gap-2">
                    {isChecking && <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />}
                    
                    {!isChecking && desiredUsername.length >= 3 && isAvailable === true && (
                      <CheckCircle className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                    )}
                    
                    {!isChecking && desiredUsername.length >= 3 && isAvailable === false && (
                      <XCircle className="w-5 h-5 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
                    )}
                  </div>
                </div>
                
                {desiredUsername.length > 0 && desiredUsername.length < 3 && (
                   <p className="text-xs mt-2 text-rose-500">Handle must be at least 3 characters alphanumeric.</p>
                )}
                
                {desiredUsername.length >= 3 && isAvailable === false && !isChecking && (
                   <p className="text-xs mt-2 text-rose-500 font-medium">Handle is already claimed globally. Try another.</p>
                )}
              </div>

              {desiredUsername.length >= 3 && isAvailable === true && (
                <button
                  onClick={handleClaimUsername}
                  disabled={isClaiming}
                  className="w-full bg-gradient-to-r from-[#F5C518] to-yellow-500 hover:to-[#F5C518] text-black font-black py-4 rounded-xl shadow-[0_4px_20px_rgba(245,197,24,0.2)] hover:shadow-[0_4px_25px_rgba(245,197,24,0.4)] transition-all flex justify-center items-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isClaiming ? "Encrypting Identity..." : "Seal Identity ➔"}
                </button>
              )}

            </div>
          )}
        </section>

        {/* Global vs National Mode */}
        <section className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px]" />
          
          <h2 className="text-lg font-black mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" /> Content Engine Algorithm
          </h2>
          <p className="text-neutral-400 text-sm mb-6">Select how the Discovery AI builds your Home Page feeds based on your primary region.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setPreferenceMode("global")}
              className={`p-4 rounded-xl border text-left transition-all ${preferenceMode === 'global' ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-black/30 border-neutral-800 hover:border-neutral-600'}`}
            >
              <h3 className={`font-bold mb-1 ${preferenceMode === 'global' ? 'text-emerald-400' : 'text-white'}`}>Global Network (Default)</h3>
              <p className="text-xs text-neutral-500">Shows the highest-rated and most trending content universally across the planet.</p>
            </button>
            <button 
              onClick={() => setPreferenceMode("national")}
              className={`p-4 rounded-xl border text-left transition-all ${preferenceMode === 'national' ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-black/30 border-neutral-800 hover:border-neutral-600'}`}
            >
              <h3 className={`font-bold mb-1 ${preferenceMode === 'national' ? 'text-emerald-400' : 'text-white'}`}>National Preference (70%)</h3>
              <p className="text-xs text-neutral-500">Rewrites the homepage dynamically to prioritize trending films and shows strictly from your physical region.</p>
            </button>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4 border-t border-neutral-800 pt-6">
            <div className="flex-1">
              <h4 className="text-sm font-bold text-neutral-300">Active Localization Lock</h4>
              <p className="text-xs text-neutral-500">Your current primary region code. Auto-detected via IP.</p>
            </div>
            <select 
              value={region} 
              onChange={(e) => setRegion(e.target.value)}
              className="bg-black border border-neutral-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="US">🇺🇸 United States (US)</option>
              <option value="IN">🇮🇳 India (IN)</option>
              <option value="KR">🇰🇷 South Korea (KR)</option>
              <option value="JP">🇯🇵 Japan (JP)</option>
              <option value="GB">🇬🇧 United Kingdom (GB)</option>
              <option value="FR">🇫🇷 France (FR)</option>
            </select>
          </div>
        </section>

        {/* Safe Mode */}
        <section className="bg-[#121215] border border-neutral-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px]" />
          
          <h2 className="text-lg font-black mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" /> Child / Safe Mode
          </h2>
          
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-6">
              <h3 className="font-bold text-neutral-300 mb-1">Strict Content Filtering</h3>
              <p className="text-xs text-neutral-500">
                When enabled, the server forcibly drops all mature API requests and limits all Discovery grids to Family/PG-rated content only.
              </p>
            </div>
            <button 
              onClick={() => setChildMode(!childMode)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${childMode ? 'bg-amber-500' : 'bg-neutral-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${childMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* Advanced Danger Zone */}
        <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" /> Data & Identity
          </h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-red-500/10 pb-4">
              <div>
                <h3 className="font-bold text-neutral-300 text-sm">Telemetry Consent</h3>
                <p className="text-xs text-neutral-500">Revoking consent purges localized cookies immediately.</p>
              </div>
              <button 
                onClick={() => {
                  setCookieConsent(false);
                  router.push("/");
                }}
                className="text-xs bg-black text-red-400 hover:text-red-300 px-4 py-2 rounded-full border border-red-500/20"
              >
                Revoke Consent
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral-300 text-sm">Factory Reset Navigation</h3>
                <p className="text-xs text-neutral-500">Restore default global values without dropping consent.</p>
              </div>
              <button 
                onClick={() => {
                  resetToDefaults();
                  alert("Settings successfully restored to Default Global Mode.");
                }}
                className="text-xs flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-full hover:bg-neutral-700 border border-neutral-700"
              >
                <RefreshCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
