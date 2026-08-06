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
  authLoaded: boolean;
  showAuthWarning: boolean;
  setShowAuthWarning: (val: boolean) => void;
};

const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoaded(true);
      
      if (currentUser && db) {
        const wishlistRef = collection(db, "users", currentUser.uid, "wishlist");
        const unsubscribeSnapshot = onSnapshot(wishlistRef, (snapshot) => {
          const items = snapshot.docs.map((doc) => doc.data());
          setWishlist(items);
        });
        return () => unsubscribeSnapshot();
      } else {
        setWishlist([]);
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
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, user, authLoaded, showAuthWarning, setShowAuthWarning }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);