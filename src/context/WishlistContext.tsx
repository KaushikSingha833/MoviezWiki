"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type WishlistContextType = {
  wishlist: any[];
  toggleWishlist: (movie: any) => Promise<void>;
  isInWishlist: (movieId: number) => boolean;
  user: any;
  profile: any;
  authLoaded: boolean;
  showAuthWarning: boolean;
  setShowAuthWarning: (val: boolean) => void;
  customLists: any[];
};

const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [customLists, setCustomLists] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoaded(true);
      
      if (currentUser && db) {
        // Fetch User Profile Realtime (for username and meta)
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeProfile = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
             setProfile(snapshot.data());
          }
        });

        const wishlistRef = collection(db, "users", currentUser.uid, "wishlist");
        const unsubscribeWishlist = onSnapshot(wishlistRef, (snapshot) => {
          const items = snapshot.docs.map((doc) => doc.data());
          setWishlist(items);
        });
        
        const listsRef = collection(db, "users", currentUser.uid, "lists");
        const unsubscribeLists = onSnapshot(listsRef, (snapshot) => {
          const fetchedLists = snapshot.docs.map((doc) => doc.data());
          // Sort by creation time (newest first)
          fetchedLists.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
          setCustomLists(fetchedLists);
        });

        // We wrap unsub in a single function
        return () => {
           unsubscribeProfile();
           unsubscribeWishlist();
           unsubscribeLists();
        };
      } else {
        setWishlist([]);
        setCustomLists([]);
        setProfile(null);
      }
    });
    
    return () => unsubscribeAuth();
  }, []);

  const toggleWishlist = async (movie: any) => {
    if (!user) {
      setShowAuthWarning(true);
      return;
    }
    
    if (!db) {
      return;
    }

    try {
      const userWishlistRef = collection(db, "users", user.uid, "wishlist");
      const movieRef = doc(userWishlistRef, movie.id.toString());
      
      const isWishlisted = wishlist.some((item) => item.id === movie.id);

      if (isWishlisted) {
        await deleteDoc(movieRef);
      } else {
        await setDoc(movieRef, movie);
      }
    } catch (error) {
    }
  };

  const isInWishlist = (movieId: number) => {
    return wishlist.some((item) => item.id === movieId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, user, profile, authLoaded, showAuthWarning, setShowAuthWarning, customLists }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);