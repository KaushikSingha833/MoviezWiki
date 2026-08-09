"use client";

import { useSettings } from "@/context/SettingsContext";
import { Cookie, ShieldAlert, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CookieConsentBanner() {
  const { cookieConsent, setCookieConsent } = useSettings();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Avoid hydration mismatch on first pass

  return (
    <AnimatePresence>
      {cookieConsent === null && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          className="fixed bottom-0 left-0 w-full z-[9999] p-4 flex justify-center"
        >
          <div className="bg-[#121215]/90 backdrop-blur-xl border border-neutral-700 p-6 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center gap-6">
            <div className="flex bg-[#F5C518]/10 p-4 rounded-full text-[#F5C518] shrink-0">
              <Cookie className="w-8 h-8" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                Telemetry & Cookies Framework
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                We use cookies to lock in your "National Preference" localization filters, auto-detect your initial region, and maintain active "Child Mode" protection configurations across the platform. Do you approve core tracking telemetry?
              </p>
            </div>
            
            <div className="flex gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setCookieConsent(false)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition"
              >
                <X className="w-4 h-4" /> Deny
              </button>
              <button
                onClick={() => setCookieConsent(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-black bg-[#F5C518] hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(245,197,24,0.4)]"
              >
                <Check className="w-4 h-4" /> Allow Tracking
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
