"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Pause,
  Volume2,
  Maximize2,
  ArrowLeft,
  RotateCcw,
  Sliders,
  Share2,
  QrCode,
  Layers,
  ChevronDown,
  Info,
  Copy,
  ExternalLink,
  Cpu,
  HardDrive,
  Lock,
  BatteryCharging,
  Eye,
  Check,
  X,
  Heart,
  Bookmark,
  UserPlus,
  Users,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Wifi
} from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";

export default function DownloadAppPage() {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [qrTarget, setQrTarget] = useState<"page" | "direct">("page");

  // Phone Mockup 5-State Interactive Guided Tour:
  // 0 = Favorites & Feed, 1 = Details Pop-up, 2 = 16:9 Cinema Player, 3 = Friends Wishlist, 4 = Settings & Privacy
  const [simStep, setSimStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [privacyToggled, setPrivacyToggled] = useState(true);

  const APK_DOWNLOAD_URL = "https://github.com/KaushikSingha833/MoviezWiki/releases/download/v1.0.0/MoviezWiki.apk";
  const GITHUB_RELEASES_URL = "https://github.com/KaushikSingha833/MoviezWiki/releases/latest";
  const SITE_URL = "https://moviez-wiki.vercel.app/download";

  // Comprehensive ~13-second auto-looping guided tour of MoviezWiki Mobile
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runLoop = () => {
      setSimStep(0); // 0: Feed & Favorites (2.8s)
      setIsFavorited(false);
      setIsFollowing(false);

      // Tap Heart button at 0.9s
      timeoutId = setTimeout(() => {
        setIsFavorited(true);

        // Move to Step 1: Details Pop-up at 2.6s
        timeoutId = setTimeout(() => {
          setSimStep(1); // 1: Details Pop-up (2.2s)

          // Move to Step 2: 16:9 Cinema Player at 2.0s
          timeoutId = setTimeout(() => {
            setSimStep(2); // 2: 16:9 Cinema Player (3.0s)

            // Move to Step 3: Friends & Community Wishlists at 3.0s
            timeoutId = setTimeout(() => {
              setSimStep(3); // 3: Friends Wishlists (2.8s)

              // Tap Follow friend at 1.0s
              timeoutId = setTimeout(() => {
                setIsFollowing(true);

                // Move to Step 4: Settings & Privacy at 1.8s
                timeoutId = setTimeout(() => {
                  setSimStep(4); // 4: Settings & Privacy (2.8s)

                  // Loop back smoothly to Step 0
                  timeoutId = setTimeout(() => {
                    runLoop();
                  }, 2800);
                }, 1800);
              }, 1000);
            }, 3000);
          }, 2000);
        }, 1700);
      }, 900);
    };

    runLoop();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const targetUrl = qrTarget === "direct" ? APK_DOWNLOAD_URL : SITE_URL;
    QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#050505",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code Generation Error:", err));
  }, [qrTarget]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showQrModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showQrModal]);

  const handleDownloadClick = () => {
    setDownloadStarted(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(SITE_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#F5C518] selection:text-black relative overflow-hidden pb-32">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[650px] bg-gradient-to-b from-[#F5C518]/15 via-purple-900/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-15%] w-[600px] h-[600px] bg-yellow-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute top-[75%] left-[-15%] w-[600px] h-[600px] bg-indigo-600/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 relative z-10">

        {/* =========================================================================
            HERO SECTION: DUAL COLUMN (Left Pitch, Right Smartphone Mockup)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-24 lg:mb-32">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-transparent border border-[#F5C518]/25 text-xs sm:text-sm font-bold text-amber-300 backdrop-blur-md mb-6 shadow-lg shadow-black/40"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5C518] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5C518]"></span>
              </span>
              <span>Official Release v1.0.0 • Pure Android Cinema</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-[1.08]"
            >
              Cinema in Your Pocket.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#F5C518] to-yellow-500 drop-shadow-[0_0_40px_rgba(245,197,24,0.35)]">
                MoviezWiki
              </span>{" "}
              for Android.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-neutral-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Immerse yourself in edge-to-edge 120Hz cinema playback with zero browser search bars, native back gestures, instant cloud sync, and ultra-lightweight battery optimization.
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
            >
              <a
                href={APK_DOWNLOAD_URL}
                onClick={handleDownloadClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F5C518] via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-base sm:text-lg shadow-[0_12px_40px_rgba(245,197,24,0.35)] hover:shadow-[0_18px_50px_rgba(245,197,24,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <Download className="w-6 h-6 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
                <span>Download Official APK</span>
                <span className="text-xs bg-black/20 px-2.5 py-1 rounded-full font-bold">
                  ~4.5 MB
                </span>
              </a>

              <button
                onClick={() => setShowQrModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-base backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <QrCode className="w-5 h-5 text-amber-300" />
                <span>Scan QR Code</span>
              </button>
            </motion.div>

            {/* Download Status Toast */}
            {downloadStarted && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold max-w-lg mx-auto lg:mx-0 mb-6 flex items-center gap-3 shadow-lg shadow-emerald-500/5"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">APK Download Started!</p>
                  <p className="text-xs text-emerald-400/80">Check your notification shade or browser downloads folder to install.</p>
                </div>
              </motion.div>
            )}

            {/* Quick Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-semibold text-neutral-400 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Virus Free & Verified</span>
              </div>
              <span className="text-neutral-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#F5C518]" />
                <span>Android 8.0 to Android 15</span>
              </div>
              <span className="text-neutral-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Auto-Updating Cloud Core</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Smartphone Frame Showcase */}
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-[300px] sm:w-[340px]"
            >
              {/* Glow Behind Mockup */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#F5C518]/25 to-purple-600/20 rounded-[50px] blur-3xl transform scale-105 pointer-events-none" />


              {/* Phone Outer Chassis */}
              <div className="relative rounded-[48px] p-3.5 bg-gradient-to-b from-neutral-700 via-neutral-900 to-black shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] border border-neutral-700/60">
                {/* Screen Bezel */}
                <div className="relative rounded-[38px] overflow-hidden bg-[#050505] aspect-[9/19] flex flex-col border border-white/5 shadow-inner">
                  
                  {/* Dynamic Island / Speaker Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
                    <div className="w-2 h-2 rounded-full bg-neutral-900" />
                    <div className="w-2 h-2 rounded-full bg-blue-950/80" />
                  </div>

                  {/* Simulated App Header */}
                  <div className="pt-10 px-4 pb-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10">
                    <div className="flex items-center gap-1.5">
                      <Film className="w-4 h-4 text-[#F5C518]" />
                      <span className="text-xs font-black tracking-tighter text-amber-300">MoviezWiki</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-neutral-300">
                        HD
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-black font-bold text-[10px] flex items-center justify-center">
                        M
                      </div>
                    </div>
                  </div>

                  {/* Simulated App Content Body */}
                  <div className="flex-1 px-4 overflow-hidden relative">
                    {/* Step 0: Animated Touch Pointer on Spider-Man & Favorites */}
                    {simStep === 0 && (
                      <>
                        {/* Cursor 1: Tapping the Heart Favorites Icon at 0.4s */}
                        <motion.div
                          key="heart-cursor"
                          initial={{ opacity: 0, scale: 0.7, x: 50, y: -10 }}
                          animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0.7, 1, 0.8, 1.25],
                            x: [50, 42, 42, 42],
                            y: [-10, -2, -2, -2],
                          }}
                          transition={{ duration: 0.9, delay: 0.3 }}
                          className="absolute top-16 right-6 z-30 pointer-events-none flex flex-col items-center"
                        >
                          <div className="w-8 h-8 rounded-full bg-rose-500/40 border-2 border-rose-400 animate-ping" />
                          <div className="w-5 h-5 rounded-full bg-rose-500 border border-white -mt-7 shadow-xl flex items-center justify-center">
                            <Heart className="w-2.5 h-2.5 fill-white text-white" />
                          </div>
                        </motion.div>

                        {/* Favorite Toast Notification */}
                        {isFavorited && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute top-2 left-4 right-4 z-30 p-2 rounded-xl bg-rose-950/90 border border-rose-500/40 backdrop-blur-md text-[8.5px] font-bold text-rose-200 flex items-center gap-1.5 shadow-xl"
                          >
                            <Heart className="w-3 h-3 fill-rose-500 text-rose-500 shrink-0" />
                            <span>Added Spider-Man to 4K Favorites!</span>
                          </motion.div>
                        )}

                        {/* Cursor 2: Tapping the Spider-Man Banner at 1.4s */}
                        <motion.div
                          key="movie-cursor"
                          initial={{ opacity: 0, scale: 0.7, x: 25, y: 35 }}
                          animate={{
                            opacity: [0, 0, 1, 1, 0],
                            scale: [0.7, 0.7, 1, 0.8, 1.2],
                            x: [25, 25, 0, 0, 0],
                            y: [35, 35, 0, 0, 0],
                          }}
                          transition={{ duration: 1.2, delay: 1.2, times: [0, 0.2, 0.5, 0.75, 1] }}
                          className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#F5C518]/30 border-2 border-[#F5C518] backdrop-blur-md flex items-center justify-center animate-ping" />
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#F5C518] to-yellow-300 border-2 border-white -mt-8 shadow-xl flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-black/80" />
                          </div>
                          <span className="text-[8px] font-black text-black bg-[#F5C518] px-2 py-0.5 rounded-full mt-1 shadow">
                            Opening Movie Info...
                          </span>
                        </motion.div>
                      </>
                    )}

                    {/* Featured Movie Hero Banner with Real TMDB Backdrop */}
                    <motion.div
                      animate={simStep === 0 ? { scale: [1, 1, 0.97, 1] } : {}}
                      transition={{ duration: 1.2, times: [0, 0.6, 0.75, 1], delay: 1.3 }}
                      onClick={() => setSimStep(1)}
                      className="relative h-44 rounded-2xl overflow-hidden border border-white/10 p-3 flex flex-col justify-end shadow-xl mb-3.5 group cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <img
                        src="https://image.tmdb.org/t/p/w780/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg"
                        alt="Spider-Man: No Way Home"
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#F5C518] text-black font-black text-[9px] uppercase tracking-wider">
                            Featured
                          </span>
                          <div className="flex items-center gap-1.5">
                            {/* Heart Favorites Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFavorited(!isFavorited);
                              }}
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                isFavorited
                                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/50 scale-110"
                                  : "bg-black/60 border border-white/10 text-white/80 hover:text-white"
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${isFavorited ? "fill-white" : ""}`} />
                            </button>

                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[9px] font-bold text-amber-300">
                              <Play className="w-2.5 h-2.5 fill-current text-[#F5C518]" />
                              <span>Play</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-amber-300 tracking-wider uppercase block">
                          Trending #1 Today
                        </span>
                        <h4 className="text-sm font-black text-white leading-tight drop-shadow-md">
                          Spider-Man: No Way Home
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400">
                            <span>★ 8.9</span>
                          </div>
                          <span className="text-[10px] text-neutral-300 font-medium drop-shadow">• 2h 28m • 4K HDR</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Quick Row 1: Continue Watching with Real Backdrops */}
                    <div className="mb-3.5">
                      <div className="flex justify-between items-center mb-1.5 px-0.5">
                        <span className="text-[11px] font-bold text-white tracking-tight">Continue Watching</span>
                        <span className="text-[9px] font-bold text-amber-400">See All</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            title: "Spider-Verse",
                            img: "https://image.tmdb.org/t/p/w500/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
                            progress: 80,
                          },
                          {
                            title: "Dark Knight",
                            img: "https://image.tmdb.org/t/p/w500/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
                            progress: 45,
                          },
                          {
                            title: "Interstellar",
                            img: "https://image.tmdb.org/t/p/w500/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
                            progress: 65,
                          },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-white/10 h-20 relative overflow-hidden flex flex-col justify-between p-1.5 shadow-md bg-neutral-900 group"
                          >
                            <img
                              src={item.img}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            
                            {/* Play Icon Badge */}
                            <div className="relative z-10 w-4 h-4 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center border border-white/10 ml-auto">
                              <Play className="w-2 h-2 fill-white text-white translate-x-[0.5px]" />
                            </div>

                            {/* Progress Bar & Title */}
                            <div className="relative z-10 w-full">
                              <p className="text-[9px] font-bold text-white truncate drop-shadow mb-1">
                                {item.title}
                              </p>
                              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#F5C518] h-full rounded-full"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Row 2: Curated For You with Real Posters */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5 px-0.5">
                        <span className="text-[11px] font-bold text-white tracking-tight">Curated For You</span>
                        <span className="text-[9px] font-bold text-amber-400">AI Taste</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            title: "No Way Home",
                            rating: "8.9",
                            img: "https://image.tmdb.org/t/p/w342/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
                          },
                          {
                            title: "Oppenheimer",
                            rating: "8.8",
                            img: "https://image.tmdb.org/t/p/w342/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                          },
                          {
                            title: "Dune: Part Two",
                            rating: "8.7",
                            img: "https://image.tmdb.org/t/p/w342/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                          },
                        ].map((movie, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-white/10 h-28 relative overflow-hidden shadow-lg bg-neutral-900 group"
                          >
                            <img
                              src={movie.img}
                              alt={movie.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                            
                            {/* Rating Badge */}
                            <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[8px] font-bold text-amber-400">
                              ★ {movie.rating}
                            </div>

                            {/* Title bottom overlay */}
                            <div className="absolute bottom-1 left-1 right-1">
                              <p className="text-[9px] font-bold text-white truncate drop-shadow">
                                {movie.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* =====================================================================
                      STEP 1 ANIMATION: POP-UP DETAILS MODAL (Slides Up)
                  ===================================================================== */}
                  <AnimatePresence>
                    {simStep === 1 && (
                      <motion.div
                        key="popup-modal"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex flex-col justify-end p-2.5"
                      >
                        <div className="bg-[#121216] border border-white/15 rounded-3xl p-3.5 shadow-2xl overflow-hidden relative">
                          {/* Top Drag Handle */}
                          <div className="w-10 h-1 bg-white/25 rounded-full mx-auto mb-2.5" />

                          {/* Movie Backdrop Header */}
                          <div className="relative h-28 rounded-2xl overflow-hidden mb-2.5 border border-white/10">
                            <img
                              src="https://image.tmdb.org/t/p/w780/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg"
                              alt="Spider-Man"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent" />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[8px] font-bold text-amber-300">
                              ★ 8.9 TMDB
                            </div>
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#F5C518] text-black text-[8px] font-black uppercase tracking-wider">
                              Cinema Preview
                            </div>
                          </div>

                          {/* Title & Metadata */}
                          <h4 className="text-sm font-black text-white leading-tight mb-1">
                            Spider-Man: No Way Home
                          </h4>
                          <div className="flex items-center gap-1.5 text-[9px] font-semibold text-neutral-400 mb-2">
                            <span>2021</span>
                            <span>•</span>
                            <span>2h 28m</span>
                            <span>•</span>
                            <span className="text-[#F5C518] font-bold">4K HDR</span>
                            <span>•</span>
                            <span>Action / Sci-Fi</span>
                          </div>

                          <p className="text-[9px] text-neutral-300 line-clamp-2 leading-relaxed mb-3">
                            Peter Parker's secret identity is revealed. Desperate for help, he turns to Doctor Strange to undo the reveal, unleashing dangerous multiverse foes...
                          </p>

                          {/* Watch Movie Button with Tap Effect */}
                          <div className="relative">
                            <motion.div
                              animate={{ scale: [1, 1, 0.95, 1] }}
                              transition={{ duration: 1.0, times: [0, 0.6, 0.75, 1], delay: 0.3 }}
                              onClick={() => setSimStep(2)}
                              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#F5C518] to-yellow-500 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-black" />
                              <span>Watch Movie in 4K</span>
                            </motion.div>

                            {/* Animated Tap Cursor over Watch Button */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: [0, 1, 1, 0], scale: [0.7, 1, 0.8, 1.25] }}
                              transition={{ duration: 0.9, delay: 0.5 }}
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center z-10"
                            >
                              <div className="w-8 h-8 rounded-full bg-white/50 border-2 border-white animate-ping" />
                              <div className="w-5 h-5 rounded-full bg-white border border-black -mt-7 shadow-lg" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* =====================================================================
                      STEP 2 ANIMATION: TRUE HORIZONTAL 16:9 CINEMA PLAYER
                  ===================================================================== */}
                  <AnimatePresence>
                    {simStep === 2 && (
                      <motion.div
                        key="cinema-player"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 280 }}
                        className="absolute inset-0 z-30 bg-[#08080a] flex flex-col justify-between overflow-hidden"
                      >
                        {/* Top Navigation Header inside Phone (Clean & Always Pristine) */}
                        <div className="pt-10 px-3.5 pb-2 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-md relative z-20">
                          <div className="flex items-center gap-2">
                            {/* Native Back Button with animated tap target */}
                            <div className="relative">
                              <motion.button
                                animate={{ scale: [1, 1, 0.88, 1] }}
                                transition={{ duration: 0.8, delay: 1.5 }}
                                onClick={() => setSimStep(0)}
                                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-all shadow"
                              >
                                <ArrowLeft className="w-3.5 h-3.5 text-white" />
                              </motion.button>

                              {/* Animated Tap Cursor clicking the Back button at end of step */}
                              <motion.div
                                initial={{ opacity: 0, scale: 0.6, x: 15, y: 15 }}
                                animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 0.8, 1.2], x: [15, 0, 0, 0], y: [15, 0, 0, 0] }}
                                transition={{ duration: 0.8, delay: 1.4 }}
                                className="absolute -bottom-6 -right-2 pointer-events-none flex flex-col items-center z-30"
                              >
                                <div className="w-6 h-6 rounded-full bg-white/60 border border-white animate-ping" />
                                <div className="w-4 h-4 rounded-full bg-[#F5C518] border border-black -mt-5 shadow-lg" />
                              </motion.div>
                            </div>

                            <div className="truncate max-w-[150px]">
                              <p className="text-[11px] font-black text-white truncate leading-tight">Spider-Man: No Way Home</p>
                              <p className="text-[8px] font-semibold text-neutral-400">4K Ultra HD • Cinema Mode</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2 py-0.5 rounded-full bg-[#F5C518]/20 border border-[#F5C518]/40 text-[#F5C518] text-[8px] font-black uppercase">
                              4K HDR
                            </span>
                          </div>
                        </div>

                        {/* Main Center Area: THE HORIZONTAL 16:9 WIDESCREEN CINEMA PLAYER */}
                        <div className="flex-1 px-3.5 py-2 flex flex-col justify-center">
                          {/* Ambient Backlight Glow behind 16:9 Frame */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-[#F5C518]/25 to-blue-600/20 rounded-2xl blur-xl scale-95 pointer-events-none" />

                            {/* 16:9 Widescreen Player Frame */}
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.9)] flex flex-col justify-between group">
                              {/* Horizontal Movie Scene (Widescreen 16:9 Aspect Ratio) */}
                              <img
                                src="https://image.tmdb.org/t/p/w780/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg"
                                alt="Spider-Man 16:9 Widescreen Cinema"
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

                              {/* Player Top Overlay */}
                              <div className="p-2.5 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                  <span className="text-[8px] font-bold text-white/90 drop-shadow">120 FPS STREAM</span>
                                </div>
                                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 text-[8px] font-bold text-amber-300">
                                  <Sparkles className="w-2.5 h-2.5 text-[#F5C518]" />
                                  <span>Dolby Vision</span>
                                </div>
                              </div>

                              {/* Center Play/Pause Pulsing Ring */}
                              <div className="self-center my-auto relative z-10 flex items-center justify-center">
                                <motion.div
                                  animate={{ scale: [1, 1.08, 1] }}
                                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                                  className="w-10 h-10 rounded-full bg-black/70 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-2xl text-[#F5C518]"
                                >
                                  <Pause className="w-4 h-4 fill-current" />
                                </motion.div>
                              </div>

                              {/* Player Bottom Scrubber Bar & Controls */}
                              <div className="p-2.5 relative z-10 bg-gradient-to-t from-black via-black/70 to-transparent">
                                {/* Progress Scrubber */}
                                <div className="flex items-center justify-between text-[8px] font-mono text-neutral-300 mb-1">
                                  <span className="text-[#F5C518] font-bold">01:14:32</span>
                                  <span className="text-neutral-400">02:28:10</span>
                                </div>
                                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mb-2 relative">
                                  <motion.div
                                    initial={{ width: "48%" }}
                                    animate={{ width: "56%" }}
                                    transition={{ duration: 2.4, ease: "linear" }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-[#F5C518] rounded-full relative"
                                  >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow" />
                                  </motion.div>
                                </div>

                                {/* Bottom Quick Row */}
                                <div className="flex items-center justify-between text-neutral-300">
                                  <div className="flex items-center gap-2">
                                    <Volume2 className="w-3.5 h-3.5 text-white" />
                                    <span className="text-[8px] font-semibold text-neutral-300">English 5.1</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-bold text-[#F5C518] bg-black/60 px-1.5 py-0.5 rounded border border-white/10">1080p / 4K</span>
                                    <Maximize2 className="w-3 h-3 text-neutral-300" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Below Cinema Player: Real Native Mobile Stream Dashboard */}
                          <div className="mt-2.5 bg-white/5 border border-white/10 rounded-2xl p-2.5">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[9px] font-bold text-white">Playback Stream Stats</span>
                              <span className="text-[8px] font-bold text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Buffer: 100% Full
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-1.5 text-center">
                              <div className="bg-black/50 border border-white/5 rounded-xl p-1.5">
                                <p className="text-[7px] text-neutral-400 uppercase font-semibold">Bitrate</p>
                                <p className="text-[9px] font-black text-amber-300">48.5 Mbps</p>
                              </div>
                              <div className="bg-black/50 border border-white/5 rounded-xl p-1.5">
                                <p className="text-[7px] text-neutral-400 uppercase font-semibold">Audio</p>
                                <p className="text-[9px] font-black text-white">Atmos 7.1</p>
                              </div>
                              <div className="bg-black/50 border border-white/5 rounded-xl p-1.5">
                                <p className="text-[7px] text-neutral-400 uppercase font-semibold">Display</p>
                                <p className="text-[9px] font-black text-emerald-400">120Hz Pro</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Simulated Android Gesture Navigation Bar at Bottom */}
                        <div className="h-6 flex items-center justify-center bg-black/95 relative z-20 border-t border-white/5">
                          <div className="w-24 h-1 bg-white/30 rounded-full" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* =====================================================================
                      STEP 3 ANIMATION: FRIENDS & COMMUNITY WISHLISTS
                  ===================================================================== */}
                  <AnimatePresence>
                    {simStep === 3 && (
                      <motion.div
                        key="social-wishlists"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 z-30 bg-[#08080a] flex flex-col justify-between overflow-hidden"
                      >
                        {/* Header */}
                        <div className="pt-10 px-4 pb-2 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-md relative z-15">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                              <Users className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <h3 className="text-xs font-black text-white leading-tight">Curators & Friends</h3>
                              <p className="text-[7.5px] font-semibold text-neutral-400">Public 4K Wishlists</p>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[7.5px] font-bold">
                            Live Sync
                          </span>
                        </div>

                        {/* Social Toast Notification */}
                        {isFollowing && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="mx-3 mt-1.5 p-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[7.5px] font-bold flex items-center gap-1.5 shadow-lg"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>Following Alex Cinephile • Wishlist Synced!</span>
                          </motion.div>
                        )}

                        {/* Friends Cards Feed */}
                        <div className="flex-1 px-3 py-1.5 space-y-2 overflow-hidden">
                          {/* Friend 1: Alex Cinephile */}
                          <div className="p-2 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[9px] font-black text-white shadow">
                                  AC
                                </div>
                                <div>
                                  <p className="text-[9.5px] font-black text-white leading-tight">Alex Cinephile</p>
                                  <p className="text-[7px] text-neutral-400">42 Reviews • 18 Wishlists</p>
                                </div>
                              </div>

                              {/* Follow Button with Tap Target */}
                              <div className="relative">
                                <button
                                  onClick={() => setIsFollowing(!isFollowing)}
                                  className={`px-2 py-0.5 rounded-full text-[8px] font-black transition-all flex items-center gap-1 ${
                                    isFollowing
                                      ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/30 scale-105"
                                      : "bg-[#F5C518] text-black hover:bg-yellow-400"
                                  }`}
                                >
                                  {isFollowing ? (
                                    <>
                                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                                      <span>Following</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserPlus className="w-2.5 h-2.5" />
                                      <span>+ Follow</span>
                                    </>
                                  )}
                                </button>

                                {/* Animated Tap Cursor over Follow button */}
                                {!isFollowing && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.6, x: 10, y: 10 }}
                                    animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 0.8, 1.2], x: [10, 0, 0, 0], y: [10, 0, 0, 0] }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center z-30"
                                  >
                                    <div className="w-5 h-5 rounded-full bg-white/60 border border-white animate-ping" />
                                    <div className="w-3.5 h-3.5 rounded-full bg-[#F5C518] border border-black -mt-4 shadow-lg" />
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            {/* Mini Wishlist Posters */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[7px] text-neutral-400 font-semibold uppercase shrink-0">Wishlist:</span>
                              <div className="flex items-center gap-1 flex-1 overflow-hidden">
                                {[
                                  { title: "Dune 2", img: "https://image.tmdb.org/t/p/w185/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg" },
                                  { title: "Interstellar", img: "https://image.tmdb.org/t/p/w185/xJHokMbljvjADYdit5fK5VQsXEG.jpg" },
                                  { title: "Spider-Verse", img: "https://image.tmdb.org/t/p/w185/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg" }
                                ].map((m, idx) => (
                                  <div key={idx} className="h-10 w-7 rounded-md overflow-hidden border border-white/10 relative shadow shrink-0">
                                    <img src={m.img} alt={m.title} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                                <div className="h-10 px-1 rounded-md bg-black/40 border border-white/5 flex items-center justify-center text-[7px] font-bold text-amber-300">
                                  +15
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Friend 2: Sophia Nolan */}
                          <div className="p-2 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-[9px] font-black text-white shadow">
                                  SN
                                </div>
                                <div>
                                  <div className="flex items-center gap-1">
                                    <p className="text-[9.5px] font-black text-white leading-tight">Sophia Nolan</p>
                                    <span className="px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[6px] font-bold">Top 1%</span>
                                  </div>
                                  <p className="text-[7px] text-neutral-400">98 Reviews • 4K Film Critic</p>
                                </div>
                              </div>

                              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 text-[7.5px] font-bold flex items-center gap-1">
                                <Bookmark className="w-2.5 h-2.5 text-[#F5C518]" />
                                <span>32 Lists</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[7px] text-neutral-400 font-semibold uppercase shrink-0">Favorites:</span>
                              <div className="flex items-center gap-1 flex-1 overflow-hidden">
                                {[
                                  { title: "Oppenheimer", img: "https://image.tmdb.org/t/p/w185/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
                                  { title: "Dark Knight", img: "https://image.tmdb.org/t/p/w185/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg" }
                                ].map((m, idx) => (
                                  <div key={idx} className="h-10 w-7 rounded-md overflow-hidden border border-white/10 relative shadow shrink-0">
                                    <img src={m.img} alt={m.title} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                                <div className="h-10 px-1 rounded-md bg-black/40 border border-white/5 flex items-center justify-center text-[7px] font-bold text-neutral-400">
                                  +28
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Simulated Android Gesture Navigation Bar */}
                        <div className="h-6 flex items-center justify-center bg-black/95 relative z-20 border-t border-white/5">
                          <div className="w-24 h-1 bg-white/30 rounded-full" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* =====================================================================
                      STEP 4 ANIMATION: SETTINGS & PRIVACY CONTROLS
                  ===================================================================== */}
                  <AnimatePresence>
                    {simStep === 4 && (
                      <motion.div
                        key="settings-privacy"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 z-30 bg-[#08080a] flex flex-col justify-between overflow-hidden"
                      >
                        {/* Header */}
                        <div className="pt-10 px-4 pb-2 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-md relative z-15">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                              <Shield className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <h3 className="text-xs font-black text-white leading-tight">Settings & Privacy</h3>
                              <p className="text-[7.5px] font-semibold text-neutral-400">Zero-Log Security & Hardware</p>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[7.5px] font-bold flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Protected</span>
                          </span>
                        </div>

                        {/* Settings List */}
                        <div className="flex-1 px-3 py-1.5 space-y-1.5 overflow-hidden">
                          {/* Toggle 1: Zero-Log Privacy Mode */}
                          <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between relative">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <ShieldCheck className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-white leading-tight">Zero-Log Private Browsing</p>
                                <p className="text-[7px] text-neutral-400">No watch history sent to servers</p>
                              </div>
                            </div>

                            {/* Glowing Switch Toggle */}
                            <div className="relative">
                              <div className="w-7 h-4 rounded-full bg-emerald-500 p-0.5 flex items-center justify-end shadow-md shadow-emerald-500/30">
                                <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                              </div>

                              {/* Animated Tap Cursor */}
                              <motion.div
                                initial={{ opacity: 0, scale: 0.6, x: 10, y: 10 }}
                                animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 0.8, 1.2], x: [10, 0, 0, 0], y: [10, 0, 0, 0] }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center z-30"
                              >
                                <div className="w-5 h-5 rounded-full bg-white/60 border border-white animate-ping" />
                                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-black -mt-4 shadow-lg" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Toggle 2: 120Hz Hardware Decoder */}
                          <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-lg bg-[#F5C518]/20 text-[#F5C518] flex items-center justify-center">
                                <Zap className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-white leading-tight">120Hz HEVC GPU Decoders</p>
                                <p className="text-[7px] text-neutral-400">Direct hardware 4K acceleration</p>
                              </div>
                            </div>
                            <div className="w-7 h-4 rounded-full bg-[#F5C518] p-0.5 flex items-center justify-end shadow-md shadow-amber-500/30">
                              <div className="w-3 h-3 rounded-full bg-black shadow-sm" />
                            </div>
                          </div>

                          {/* Toggle 3: Hide Wishlist from Public */}
                          <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                <Lock className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-white leading-tight">Private Wishlist Mode</p>
                                <p className="text-[7px] text-neutral-400">Share only with mutual friends</p>
                              </div>
                            </div>
                            <div className="w-7 h-4 rounded-full bg-white/20 p-0.5 flex items-center justify-start">
                              <div className="w-3 h-3 rounded-full bg-neutral-400 shadow-sm" />
                            </div>
                          </div>

                          {/* Toggle 4: Download on Wi-Fi Only */}
                          <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                <Wifi className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-white leading-tight">Wi-Fi Only 4K Downloads</p>
                                <p className="text-[7px] text-neutral-400">Preserve mobile cellular data</p>
                              </div>
                            </div>
                            <div className="w-7 h-4 rounded-full bg-emerald-500 p-0.5 flex items-center justify-end shadow-md shadow-emerald-500/30">
                              <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                            </div>
                          </div>
                        </div>

                        {/* Simulated Android Gesture Navigation Bar */}
                        <div className="h-6 flex items-center justify-center bg-black/95 relative z-20 border-t border-white/5">
                          <div className="w-24 h-1 bg-white/30 rounded-full" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Interactive Native Bottom App Navigation Bar */}
                  <div className="h-11 bg-black/95 border-t border-white/10 px-3 flex items-center justify-between relative z-25">
                    {[
                      { step: 0, icon: Film, label: "Home" },
                      { step: 1, icon: Heart, label: "Favorites" },
                      { step: 3, icon: Users, label: "Wishlists" },
                      { step: 4, icon: SettingsIcon, label: "Settings" },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive =
                        (tab.step === 0 && (simStep === 0 || simStep === 2)) ||
                        (tab.step === 1 && simStep === 1) ||
                        (tab.step === 3 && simStep === 3) ||
                        (tab.step === 4 && simStep === 4);
                      return (
                        <button
                          key={tab.label}
                          onClick={() => setSimStep(tab.step as any)}
                          className={`flex flex-col items-center gap-0.5 transition-all ${
                            isActive ? "text-[#F5C518] scale-105 font-bold" : "text-neutral-500 hover:text-neutral-300"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                          <span className="text-[7.5px]">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Simulated Android Gesture Navigation Bar */}
                  <div className="h-5 flex items-center justify-center bg-black relative z-20">
                    <div className="w-24 h-1 bg-white/30 rounded-full" />
                  </div>

                </div>
              </div>

              {/* Interactive Simulation Status Pills Below Phone */}
              <div className="flex items-center justify-center gap-1.5 mt-5 flex-wrap max-w-md mx-auto relative z-10">
                {[
                  { step: 0, label: "1. Favorites" },
                  { step: 1, label: "2. Movie Info" },
                  { step: 2, label: "3. 16:9 Cinema" },
                  { step: 3, label: "4. Wishlists" },
                  { step: 4, label: "5. Privacy" },
                ].map((pill) => (
                  <button
                    key={pill.step}
                    onClick={() => setSimStep(pill.step as any)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                      simStep === pill.step
                        ? "bg-[#F5C518] text-black shadow-lg shadow-amber-500/30 scale-105"
                        : "bg-white/5 border border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

        </div>

        {/* =========================================================================
            KEY PERFORMANCE METRICS STRIP
        ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-24 lg:mb-32">
          {[
            {
              metric: "4.5 MB",
              label: "Ultra-Lightweight Size",
              sub: "Installs in seconds without eating internal storage"
            },
            {
              metric: "< 400ms",
              label: "Instant Launch Time",
              sub: "Zero boot delay from your Android launcher"
            },
            {
              metric: "120 FPS",
              label: "Hardware Fluidity",
              sub: "Silky smooth panning across film catalogs"
            },
            {
              metric: "100%",
              label: "Real-Time Cloud Sync",
              sub: "Instant Firebase sync with your web watchlists"
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-[#111115]/80 border border-white/5 shadow-xl hover:border-[#F5C518]/30 transition-all text-center group"
            >
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-[#F5C518] to-yellow-500 mb-2 group-hover:scale-105 transition-transform">
                {stat.metric}
              </div>
              <div className="text-sm font-bold text-white mb-1">{stat.label}</div>
              <div className="text-xs text-neutral-400 leading-relaxed">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* =========================================================================
            DEEP DIVE: 6 NATIVE APP ADVANTAGES
        ========================================================================= */}
        <div className="mb-24 lg:mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-amber-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Native Android Advantage</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Engineered for Cinephiles
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base md:text-lg">
              Say goodbye to accidental tab refreshes and browser clutter. MoviezWiki Android delivers a distraction-free silver screen right in your hands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Film className="w-7 h-7 text-[#F5C518]" />,
                title: "Pure Edge-to-Edge Canvas",
                desc: "No browser search bars, address URL banners, or navigation bars eating up your viewing area. Experience 100% fullscreen true OLED playback."
              },
              {
                icon: <RotateCcw className="w-7 h-7 text-emerald-400" />,
                title: "Hardware Back Button Handling",
                desc: "Your phone's native back button or swipe gesture naturally closes open trailer modals, actor cards, and drawers without closing the page."
              },
              {
                icon: <Zap className="w-7 h-7 text-amber-400" />,
                title: "120Hz Hardware Accelerated",
                desc: "Utilizes Android hardware GPU acceleration for smooth carousel gestures, fast poster caching, and seamless trailer transitions."
              },
              {
                icon: <Share2 className="w-7 h-7 text-indigo-400" />,
                title: "Seamless Cloud Sync",
                desc: "Log in once with your Google or MoviezWiki account. All your saved watchlists, custom vaults, and AI recommendations stay in instant sync."
              },
              {
                icon: <BatteryCharging className="w-7 h-7 text-teal-400" />,
                title: "AMOLED Battery Optimization",
                desc: "Built with true obsidian #050505 dark theme that turns off OLED pixels on high-end smartphone displays, saving hours of battery life."
              },
              {
                icon: <Lock className="w-7 h-7 text-rose-400" />,
                title: "Privacy First & Zero Adware",
                desc: "We require zero intrusive permissions. No access to contacts, location, camera, or files. Clean, open-source security guaranteed."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-8 rounded-3xl bg-[#111115]/70 border border-white/5 hover:border-[#F5C518]/30 transition-all hover:bg-[#15151a] group shadow-xl relative overflow-hidden"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#F5C518]/10 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            COMPARISON MATRIX: BROWSER vs ANDROID APP
        ========================================================================= */}
        <div className="mb-24 lg:mb-32">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Web Browser vs. Android App
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Why installing the native APK delivers a superior movie watching experience.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[640px] rounded-3xl bg-[#101014] border border-white/10 p-6 sm:p-8 shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 pb-4">
                    <th className="py-4 text-sm font-bold text-neutral-400">Experience Feature</th>
                    <th className="py-4 text-sm font-bold text-neutral-400">Mobile Browser (Chrome/Safari)</th>
                    <th className="py-4 text-sm font-black text-amber-300 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#F5C518]" />
                      <span>MoviezWiki Native APK</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    {
                      feat: "Edge-to-Edge True Fullscreen",
                      web: "Blocked by URL search bar & browser tabs",
                      app: "100% Immersive Fullscreen Cinema",
                      better: true
                    },
                    {
                      feat: "Hardware Back Button Handling",
                      web: "Accidentally exits web page or reloads",
                      app: "Closes modals, trailers & menus smoothly",
                      better: true
                    },
                    {
                      feat: "Home Screen App Drawer Icon",
                      web: "Requires browser shortcut",
                      app: "Native Android App Drawer launcher",
                      better: true
                    },
                    {
                      feat: "RAM & Storage Footprint",
                      web: "Consumes browser tab memory (200MB+)",
                      app: "Ultra-lean standalone APK (~4.5MB)",
                      better: true
                    },
                    {
                      feat: "Continuous Playback Stability",
                      web: "Subject to browser tab background sleeping",
                      app: "Uninterrupted hardware video pipeline",
                      better: true
                    },
                    {
                      feat: "Live Catalog & Cloud Sync",
                      web: "Real-time Firebase database sync",
                      app: "Real-time Firebase database sync",
                      better: true
                    }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-semibold text-white">{row.feat}</td>
                      <td className="py-4 text-neutral-400">{row.web}</td>
                      <td className="py-4 font-bold text-amber-300 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{row.app}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3-STEP INSTALLATION WALKTHROUGH
        ========================================================================= */}
        <div className="mb-24 lg:mb-32 bg-gradient-to-b from-[#111116] to-[#0c0c0f] border border-white/10 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C518]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">Simple Setup</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              How to Install in 3 Easy Steps
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Android makes it simple to install independent apps. No rooting or special software required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 relative group hover:border-[#F5C518]/30 transition-all">
              <span className="text-5xl font-black text-[#F5C518]/25 group-hover:text-[#F5C518]/40 transition-colors mb-4 block">01</span>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Download className="w-5 h-5 text-[#F5C518]" />
                <span>Download APK</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-4">
                Tap the <strong className="text-amber-300">Download Official APK</strong> button. When Chrome or your browser asks to keep the file, tap <strong className="text-white">Download anyway</strong>.
              </p>
              <div className="text-[11px] font-semibold text-neutral-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                File: MoviezWiki.apk (~4.5 MB)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 relative group hover:border-[#F5C518]/30 transition-all">
              <span className="text-5xl font-black text-[#F5C518]/25 group-hover:text-[#F5C518]/40 transition-colors mb-4 block">02</span>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Enable Installation</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-4">
                Open the downloaded file from your notification bar. If your phone asks permission to install from this source, tap <strong className="text-white">Settings</strong> and toggle <strong className="text-white">Allow from this source</strong>.
              </p>
              <div className="text-[11px] font-semibold text-neutral-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                Standard Android security prompt
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 relative group hover:border-[#F5C518]/30 transition-all">
              <span className="text-5xl font-black text-[#F5C518]/25 group-hover:text-[#F5C518]/40 transition-colors mb-4 block">03</span>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Play className="w-5 h-5 text-amber-400" />
                <span>Open & Enjoy</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-4">
                Tap <strong className="text-white">Install</strong>. Once complete, tap <strong className="text-amber-300">Open</strong> to launch MoviezWiki directly from your Android app drawer.
              </p>
              <div className="text-[11px] font-semibold text-neutral-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                Log in to sync your existing watchlist
              </div>
            </div>
          </div>

          {/* Safety Notice Callout */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                <strong>Why does Android say &quot;File might be harmful&quot;?</strong> Android displays this default warning for any application downloaded outside Google Play Store. MoviezWiki is 100% safe, verified, and compiled directly from our open GitHub source.
              </p>
            </div>
            <a
              href="https://github.com/KaushikSingha833/MoviezWiki"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition-colors shrink-0"
            >
              <span>View Source Code</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* =========================================================================
            TECHNICAL SPECIFICATIONS CARD
        ========================================================================= */}
        <div className="mb-24 lg:mb-32">
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#111115] border border-white/10 p-6 sm:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
              <Cpu className="w-6 h-6 text-[#F5C518]" />
              <div>
                <h3 className="text-xl font-bold text-white">Technical Specifications</h3>
                <p className="text-xs text-neutral-400">Everything under the hood of MoviezWiki APK</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div>
                <span className="text-neutral-500 font-semibold block mb-1">App Package ID</span>
                <span className="text-white font-mono font-bold">com.moviezwiki.app</span>
              </div>
              <div>
                <span className="text-neutral-500 font-semibold block mb-1">Latest Version</span>
                <span className="text-amber-300 font-mono font-bold">v1.0.0 (Release)</span>
              </div>
              <div>
                <span className="text-neutral-500 font-semibold block mb-1">Package Size</span>
                <span className="text-white font-mono font-bold">~4.5 MB</span>
              </div>
              <div>
                <span className="text-neutral-500 font-semibold block mb-1">Minimum Android OS</span>
                <span className="text-white font-medium">Android 8.0 (API 26+)</span>
              </div>
              <div>
                <span className="text-neutral-500 font-semibold block mb-1">Target Architecture</span>
                <span className="text-white font-medium">Universal (ARM64 / x86_64)</span>
              </div>
              <div>
                <span className="text-neutral-500 font-semibold block mb-1">Permissions Required</span>
                <span className="text-emerald-400 font-semibold">INTERNET only</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FREQUENTLY ASKED QUESTIONS (ACCORDION)
        ========================================================================= */}
        <div className="max-w-3xl mx-auto mb-24 lg:mb-32">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-amber-400 mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is this APK completely safe to install on my device?",
                a: "Yes, 100%! MoviezWiki Android is built directly from our open GitHub repository using Google's official Android SDK build tools. It contains no adware, no telemetry tracking, and requires zero unnecessary phone permissions (no camera, contacts, or storage access)."
              },
              {
                q: "Do I have to re-download the APK every time a new movie is released?",
                a: "No! The app wrapper connects directly to the live MoviezWiki cloud engine. New releases, trailers, watchlist changes, and UI updates appear inside your app automatically without requiring an APK re-download."
              },
              {
                q: "Can I use my existing account on both the Website and the Android App?",
                a: "Absolutely! Both the web platform and the Android app share the exact same Firebase authentication and database. Simply log in with your email on your phone, and your saved watchlists, vaults, custom recommendations, and history will be waiting for you."
              },
              {
                q: "Why isn't MoviezWiki on the Google Play Store?",
                a: "Distributing the APK directly allows us to bypass Google Play Store licensing restrictions and provide users with a faster, ad-free, 100% free streaming companion with zero third-party platform limitations."
              },
              {
                q: "How do I update the app in the future?",
                a: "When a major native runtime update is released, you will receive an in-app banner linking directly to the latest APK. For regular day-to-day movie catalog additions and features, updates happen silently over the cloud!"
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#111115]/80 border border-white/5 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-bold text-white text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180 text-amber-300" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            BOTTOM HIGH-IMPACT CTA BANNER
        ========================================================================= */}
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-purple-900/20 border border-[#F5C518]/30 p-8 sm:p-14 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-radial-at-c from-[#F5C518]/10 via-transparent to-transparent pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 relative z-10">
            Ready to Upgrade Your Movie Experience?
          </h2>
          <p className="text-neutral-300 text-base sm:text-lg max-w-xl mx-auto mb-8 relative z-10">
            Download the official MoviezWiki APK now and enjoy uninterrupted cinema anywhere, anytime.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              href={APK_DOWNLOAD_URL}
              onClick={handleDownloadClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F5C518] to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-black font-black text-base sm:text-lg shadow-[0_12px_35px_rgba(245,197,24,0.35)] hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>Download APK (4.5 MB)</span>
            </a>

            <button
              onClick={() => setShowQrModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-base transition-all hover:scale-[1.02]"
            >
              <QrCode className="w-5 h-5 text-amber-300" />
              <span>Scan QR Code</span>
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          REAL SCANNABLE QR CODE MODAL (PORTALED DIRECTLY TO VIEWPORT BODY)
      ========================================================================= */}
      {mounted && showQrModal && createPortal(
        <AnimatePresence>
          {showQrModal && (
            <div
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowQrModal(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.2 }}
                className="bg-[#121216] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center relative shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                  title="Close"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-6 h-6 text-[#F5C518]" />
                </div>

                <h3 className="text-xl font-black text-white mb-1">Scan with Smartphone</h3>
                <p className="text-xs text-neutral-400 mb-4">
                  Point your camera to download MoviezWiki directly on your phone.
                </p>

                {/* Target Toggle */}
                <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 mb-4 text-xs font-semibold">
                  <button
                    onClick={() => setQrTarget("page")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      qrTarget === "page"
                        ? "bg-[#F5C518] text-black font-bold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Download Page
                  </button>
                  <button
                    onClick={() => setQrTarget("direct")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      qrTarget === "direct"
                        ? "bg-[#F5C518] text-black font-bold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Direct APK File
                  </button>
                </div>

                {/* Real High-Resolution Scannable QR Code */}
                <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl mb-4 border-4 border-amber-400/20">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Real Scannable QR Code for MoviezWiki"
                      className="w-52 h-52 sm:w-56 sm:h-56 mx-auto block object-contain"
                    />
                  ) : (
                    <div className="w-52 h-52 sm:w-56 sm:h-56 flex flex-col items-center justify-center bg-neutral-100 text-neutral-700 text-xs font-bold gap-2">
                      <div className="w-6 h-6 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                      <span>Generating QR Code...</span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-neutral-400 mb-5 leading-relaxed">
                  {qrTarget === "direct"
                    ? "Scanning starts direct download of MoviezWiki.apk (~4.5MB)."
                    : "Scanning opens the full MoviezWiki download & installation guide on your phone."}
                </p>

                {/* Direct Link Copy Button */}
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors active:scale-98"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Link Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>Copy Link to Clipboard</span>
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}
