import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import { SettingsProvider } from "@/context/SettingsContext";
import Navbar from "@/components/Navbar";
import AuthWarningModal from "@/components/AuthWarningModal";
import CookieConsentBanner from "@/components/CookieConsentBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoviezWiki",
  description: "Your dynamic destination for movies and shows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SettingsProvider>
          <WishlistProvider>
            <Navbar />
            {children}
            <AuthWarningModal />
            <CookieConsentBanner />
          </WishlistProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}