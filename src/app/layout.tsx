import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { TasteProvider } from "@/context/TasteContext";
import Navbar from "@/components/Navbar";
import AuthWarningModal from "@/components/AuthWarningModal";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import WikiBot from "@/components/WikiBot";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "700", "900"] });

export const metadata: Metadata = {
  title: "MoviezWiki",
  description: "Your dynamic destination for movies and shows",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body suppressHydrationWarning className={`${outfit.className} antialiased bg-[#050505] selection:bg-purple-500/30 selection:text-white relative`}>
        {/* Register Service Worker for PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        {/* Global Ambient Aurora Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>
        
        <SettingsProvider>
          <WishlistProvider>
            <TasteProvider>
              <Navbar />
              {children}
              <AuthWarningModal />
              <CookieConsentBanner />
              <WikiBot />
            </TasteProvider>
          </WishlistProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}