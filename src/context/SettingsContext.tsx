"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface SettingsContextType {
  cookieConsent: boolean | null;
  region: string;
  preferenceMode: "global" | "national";
  childMode: boolean;
  setCookieConsent: (consent: boolean) => void;
  setRegion: (region: string) => void;
  setPreferenceMode: (mode: "global" | "national") => void;
  setChildMode: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [cookieConsent, setCookieConsentState] = useState<boolean | null>(null);
  const [region, setRegionState] = useState<string>("US");
  const [preferenceMode, setPreferenceModeState] = useState<"global" | "national">("global");
  const [childMode, setChildModeState] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from cookies on mount
  useEffect(() => {
    const rawConsent = Cookies.get("cookieConsent");
    if (rawConsent === "true") {
      setCookieConsentState(true);
      
      const savedRegion = Cookies.get("region");
      const savedPref = Cookies.get("preferenceMode") as "global" | "national";
      const savedChild = Cookies.get("childMode");
      
      if (savedRegion) setRegionState(savedRegion);
      if (savedPref) setPreferenceModeState(savedPref);
      if (savedChild === "true") setChildModeState(true);
    } else if (rawConsent === "false") {
      setCookieConsentState(false);
    }
    
    setIsInitialized(true);
  }, []);

  const setCookieConsent = (consent: boolean) => {
    setCookieConsentState(consent);
    Cookies.set("cookieConsent", String(consent), { expires: 365, path: "/" });
    
    if (!consent) {
      // If they deny consent, we wipe their personalized cookies to remain compliant
      Cookies.remove("region");
      Cookies.remove("preferenceMode");
      Cookies.remove("childMode");
      setRegionState("US"); // Global fallback
      setPreferenceModeState("global");
      setChildModeState(false);
    }
  };

  const setRegion = (code: string) => {
    setRegionState(code);
    if (cookieConsent) {
      Cookies.set("region", code, { expires: 365, path: "/" });
    }
  };

  const setPreferenceMode = (mode: "global" | "national") => {
    setPreferenceModeState(mode);
    if (cookieConsent) {
      Cookies.set("preferenceMode", mode, { expires: 365, path: "/" });
    }
  };

  const setChildMode = (enabled: boolean) => {
    setChildModeState(enabled);
    if (cookieConsent) {
      Cookies.set("childMode", String(enabled), { expires: 365, path: "/" });
    }
  };

  const resetToDefaults = () => {
    setRegionState("US");
    setPreferenceModeState("global");
    setChildModeState(false);
    if (cookieConsent) {
      Cookies.remove("region");
      Cookies.remove("preferenceMode");
      Cookies.remove("childMode");
    }
  };

  // If initialized and cookieConsent is true, but no region exists, automatically resolve geo-IP
  useEffect(() => {
    if (isInitialized && cookieConsent && !Cookies.get("region")) {
      const lockInGeoIP = async () => {
        try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();
          if (data && data.country_code) {
            setRegion(data.country_code);
          }
        } catch (error) {
          console.error("GeoIP resolution failed:", error);
          setRegion("US"); // Graceful fallback
        }
      };
      lockInGeoIP();
    }
  }, [isInitialized, cookieConsent]);

  return (
    <SettingsContext.Provider value={{
      cookieConsent,
      region,
      preferenceMode,
      childMode,
      setCookieConsent,
      setRegion,
      setPreferenceMode,
      setChildMode,
      resetToDefaults
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
