import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import AuthWarningModal from "@/components/AuthWarningModal";

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
        <WishlistProvider>
          <Navbar />
          {children}
          <AuthWarningModal />
        </WishlistProvider>
      </body>
    </html>
  );
}