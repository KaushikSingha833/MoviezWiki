import { db } from "./firebase";
import { doc, getDoc, setDoc, deleteDoc, writeBatch, collection, query, where, getDocs, Timestamp, limit } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  username: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  isMainWishlistPrivate?: boolean;
  mainWishlistApprovedUsers?: string[];
}

/**
 * Checks if a specific username string is already taken in the global index.
 * Usernames should be universally lowercased to prevent spoofing.
 */
export const checkUsernameAvailable = async (username: string): Promise<boolean> => {
  if (!username || username.length < 3) return false;
  try {
    const rawUsername = username.toLowerCase().trim();
    const usernameRef = doc(db, "usernames", rawUsername);
    const snap = await getDoc(usernameRef);
    return !snap.exists(); // Available if it does not exist
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
};

/**
 * Atomically claims a username for a specific user ID.
 * Uses a Firestore Batch to ensure the `users` config AND `usernames` index are updated simultaneously.
 * If the user already had a username, it releases the old one.
 */
export const claimUsername = async (
  userId: string, 
  newUsername: string, 
  oldUsername: string | null = null,
  displayName: string = "Cinephile"
): Promise<boolean> => {
  try {
    const safeUsername = newUsername.toLowerCase().trim();
    const batch = writeBatch(db);

    // 1. Lock the new string in the global index
    const newUsernameRef = doc(db, "usernames", safeUsername);
    batch.set(newUsernameRef, { uid: userId, createdAt: Timestamp.now() });

    // 2. Erase their old username footprint so someone else can claim it
    if (oldUsername) {
      const safeOld = oldUsername.toLowerCase().trim();
      if (safeOld !== safeUsername) {
        const oldUsernameRef = doc(db, "usernames", safeOld);
        batch.delete(oldUsernameRef);
      }
    }

    // 3. Attach the active username directly to their private user file
    const userProfileRef = doc(db, "users", userId);
    batch.set(userProfileRef, {
      uid: userId,
      username: safeUsername,
      displayName: displayName,
      updatedAt: Timestamp.now()
    }, { merge: true });

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Critical error claiming username:", error);
    return false;
  }
};

/**
 * Looks up a profile safely. Converts a username URL into a private User Document search.
 */
export const getProfileByUsername = async (username: string): Promise<UserProfile | null> => {
  if (!username) return null;
  try {
    const safeUsername = username.toLowerCase().trim();
    
    // First, find the hidden UID anchored to this public username
    const usernameRef = doc(db, "usernames", safeUsername);
    const usernameSnap = await getDoc(usernameRef);
    
    if (!usernameSnap.exists()) return null;
    const { uid } = usernameSnap.data();

    // Second, pull safe public details
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;
    
    const data = userSnap.data();
    return {
      uid: data.uid,
      username: data.username,
      displayName: data.displayName || "Unknown User",
      photoURL: data.photoURL || null,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
    };
  } catch (error) {
    console.error("Error looking up public profile", error);
    return null;
  }
};

/**
 * Quickly fetch my own basic public profile to see if I have a username yet
 */
export const getMyProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;
    
    const data = userSnap.data();
    return {
      uid: data.uid,
      username: data.username,
      displayName: data.displayName,
      photoURL: data.photoURL,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
    };
  } catch (error) {
    return null;
  }
};

/**
 * Toggles the privacy state of the user's root Wishlist
 */
export const toggleMainWishlistPrivacy = async (userId: string, currentIsPrivate: boolean) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      isMainWishlistPrivate: !currentIsPrivate
    }, { merge: true });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Executes a fast prefix search against the `users` collection to find social usernames.
 * Firestore doesn't have native robust full text search, so this uses the >= and <= boundary hack.
 */
export const searchUsers = async (searchQuery: string): Promise<UserProfile[]> => {
  if (!searchQuery || searchQuery.length < 2) return [];
  
  try {
    const rawSearch = searchQuery.toLowerCase().trim();
    // In Firebase, we can do a prefix search by querying strings between rawSearch and rawSearch + \uf8ff
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("username", ">=", rawSearch),
      where("username", "<=", rawSearch + "\uf8ff"),
      limit(3)
    );
    
    const snap = await getDocs(q);
    const results: UserProfile[] = [];
    
    snap.forEach(doc => {
      const data = doc.data();
      if (data.username) {
        results.push({
          uid: data.uid,
          username: data.username,
          displayName: data.displayName || "User",
          photoURL: data.photoURL || null,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        });
      }
    });
    
    return results;
  } catch (error) {
    console.error("Social Search Error:", error);
    return [];
  }
};
