"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { getMyProfile } from "@/lib/profiles";

/**
 * Interceptor Route
 * This is not a real view. It acts like the Instagram "Profile" tab.
 * It quietly finds out who you are, looks up your public handle, 
 * and hard-redirects you to your gorgeous Public Persona page.
 */
export default function ProfileRedirector() {
  const router = useRouter();
  const { user, authLoaded } = useWishlist();

  useEffect(() => {
    if (authLoaded) {
      if (!user) {
        // Not logged in -> send to login
        router.replace("/login");
        return;
      }

      // See if they have claimed an identity yet
      getMyProfile(user.uid).then(profile => {
        if (profile?.username) {
          // Send to their public hub!
          router.replace(`/u/${profile.username}`);
        } else {
          // They don't have a username yet! Force them to settings to claim one.
          router.replace("/settings");
        }
      });
    }
  }, [user, authLoaded, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-neutral-500 text-sm font-bold tracking-widest uppercase">Routing to Identity...</div>
      </div>
    </div>
  );
}
