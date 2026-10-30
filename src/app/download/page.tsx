"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Smartphone,
  ShieldCheck,
  Zap,
  Film,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Sliders,
  Share2
} from "lucide-react";
import { useState } from "react";

export default function DownloadAppPage() {
  const [downloadStarted, setDownloadStarted] = useState(false);

  const APK_DOWNLOAD_URL = "https://github.com/KaushikSingha833/MoviezWiki/releases/latest/download/MoviezWiki.apk";
  const LOCAL_APK_URL = "/downloads/MoviezWiki.apk";

  const handleDownloadClick = () => {
    setDownloadStarted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#F5C518] selection:text-black relative overflow-hidden pb-24">
      {/* Background Ambient Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#F5C518]/15 via-purple-900/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-amber-300 backdrop-blur-md mb-6 shadow-lg"
          >
            <Smartphone className="w-4 h-4 text-[#F5C518]" />
            <span>Official Android APK • v1.0.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6"
          >
            MoviezWiki for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#F5C518] to-yellow-500 drop-shadow-[0_0_35px_rgba(245,197,24,0.3)]">
              Android
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-400 text-base sm:text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Experience ultimate cinema with edge-to-edge 120Hz playback, zero browser URL bars, native back gestures, and instant catalog access.
          </motion.p>

          {/* MAIN DOWNLOAD ACTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <a
              href={APK_DOWNLOAD_URL}
              onClick={handleDownloadClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F5C518] to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-black font-black text-base sm:text-lg shadow-[0_12px_35px_rgba(245,197,24,0.35)] hover:shadow-[0_16px_45px_rgba(245,197,24,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Download className="w-6 h-6 stroke-[2.5]" />
              <span>Download APK</span>
              <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full font-bold ml-1">
                ~4.5 MB
              </span>
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-base backdrop-blur-md transition-all hover:scale-[1.02]"
            >
              <span>Continue in Web</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </Link>
          </motion.div>

          {/* Download Started Prompt */}
          {downloadStarted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold max-w-md mx-auto mb-6 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Downloading started! Check your browser downloads to install.</span>
            </motion.div>
          )}

          {/* Quick Specs / Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-neutral-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Virus Free & Safe</span>
            </div>
            <span className="text-neutral-700">•</span>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#F5C518]" />
              <span>Android 8.0 (Oreo) and newer</span>
            </div>
            <span className="text-neutral-700">•</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Auto-Updating Web Core</span>
            </div>
          </div>
        </div>

        {/* NATIVE APP ADVANTAGES GRID */}
        <div className="mb-20 sm:mb-28">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
              Built for True Movie Buffs
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
              Everything you love about MoviezWiki, now elevated with Android hardware acceleration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <Film className="w-6 h-6 text-[#F5C518]" />,
                title: "Pure Edge-to-Edge",
                desc: "No browser search bars or tabs. Immersive true fullscreen video cinema on every title."
              },
              {
                icon: <Zap className="w-6 h-6 text-amber-400" />,
                title: "120Hz Ultra Smooth",
                desc: "Lag-free poster carousel panning and instantaneous search auto-suggestions."
              },
              {
                icon: <RotateCcw className="w-6 h-6 text-emerald-400" />,
                title: "Hardware Back Button",
                desc: "Your phone's native back button naturally closes modals, trailer popups, and leaves menus."
              },
              {
                icon: <Share2 className="w-6 h-6 text-indigo-400" />,
                title: "Unified Web Sync",
                desc: "Log in with your existing account. All saved watchlists, vaults, and AI taste notes sync automatically."
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#121215]/80 border border-white/5 hover:border-[#F5C518]/30 transition-all hover:bg-[#15151a] group shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STEP-BY-STEP INSTALLATION GUIDE */}
        <div className="mb-20 sm:mb-28 bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F5C518]/5 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-10">
            How to Install the APK in 3 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 relative">
              <span className="text-4xl font-black text-[#F5C518]/40 mb-3 block">01</span>
              <h3 className="text-lg font-bold text-white mb-2">Download File</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Tap the &quot;Download APK&quot; button above. When your browser asks to keep the file, tap <strong className="text-white">Download anyway</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 relative">
              <span className="text-4xl font-black text-[#F5C518]/40 mb-3 block">02</span>
              <h3 className="text-lg font-bold text-white mb-2">Enable Install</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Open the downloaded APK from your notification bar. If prompted with <strong className="text-white">Install Unknown Apps</strong>, tap Settings and allow Chrome/browser.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 relative">
              <span className="text-4xl font-black text-[#F5C518]/40 mb-3 block">03</span>
              <h3 className="text-lg font-bold text-white mb-2">Launch & Enjoy</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Tap <strong className="text-white">Install</strong>. Once completed, open MoviezWiki from your app drawer and enjoy uninterrupted streaming!
              </p>
            </div>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <HelpCircle className="w-5 h-5 text-[#F5C518]" />
            <h2 className="text-xl sm:text-2xl font-black text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is this APK safe to install on my device?",
                a: "Yes, 100%! The APK is built directly from our open GitHub repository with standard Android runtime security. It contains no adware, tracking bloat, or third-party modifications."
              },
              {
                q: "Do I have to re-download the APK every time a new movie is added?",
                a: "No! The app connects directly to the live MoviezWiki cloud engine. New releases, trailers, wishlist updates, and design improvements appear inside the app instantly without needing to reinstall."
              },
              {
                q: "Can I use both the Website and the Android App?",
                a: "Absolutely. Both versions share the exact same Firebase account. Log in with your email on either platform and your wishlist, watch history, and profile will be in sync."
              }
            ].map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#121215]/60 border border-white/5">
                <h3 className="text-sm sm:text-base font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
