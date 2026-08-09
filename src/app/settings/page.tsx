"use client";

import { useSettings } from "@/context/SettingsContext";
import { Settings, Globe, ShieldAlert, AlertTriangle, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    setMounted(true);
  }, []);

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
