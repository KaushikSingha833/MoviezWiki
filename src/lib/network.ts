import { db } from "./firebase";
import { doc, getDoc, setDoc, deleteDoc, writeBatch, collection, getDocs } from "firebase/firestore";
import { pushNotification } from "./notifications";
import { getMyProfile, UserProfile } from "./profiles";

/**
 * Executes a bidirectional graph update:
 * 1. Puts TargetUID into My "following" list.
 * 2. Puts MyUID into Target's "followers" list.
 */
export const followUser = async (myUid: string, targetUid: string, myUsername?: string): Promise<boolean> => {
  if (!myUid || !targetUid || myUid === targetUid) return false;

  try {
    const batch = writeBatch(db);

    const followingRef = doc(db, "users", myUid, "following", targetUid);
    batch.set(followingRef, { followedAt: new Date() });

    const followerRef = doc(db, "users", targetUid, "followers", myUid);
    batch.set(followerRef, { followedAt: new Date() });

    await batch.commit();

    if (myUsername) {
      await pushNotification(targetUid, "follow", myUid, myUsername);
    }
    
    return true;
  } catch (error) {
    console.error("Graph Error - followUser Failed:", error);
    return false;
  }
};

/**
 * Erases the bidirectional relationship.
 */
export const unfollowUser = async (myUid: string, targetUid: string): Promise<boolean> => {
  if (!myUid || !targetUid || myUid === targetUid) return false;

  try {
    const batch = writeBatch(db);

    const followingRef = doc(db, "users", myUid, "following", targetUid);
    batch.delete(followingRef);

    const followerRef = doc(db, "users", targetUid, "followers", myUid);
    batch.delete(followerRef);

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Graph Error - unfollowUser Failed:", error);
    return false;
  }
};

/**
 * Evaluates the current state of a graph node (Are we following this target currently?)
 */
export const getFollowState = async (myUid: string, targetUid: string): Promise<boolean> => {
  if (!myUid || !targetUid) return false;

  try {
    const followingRef = doc(db, "users", myUid, "following", targetUid);
    const snap = await getDoc(followingRef);
    return snap.exists();
  } catch (error) {
    return false;
  }
};

/**
 * Extracts active numerical metrics for an Instagram-style persona dashboard.
 */
export const getNetworkCounts = async (targetUid: string) => {
  if (!targetUid) return { followers: 0, following: 0 };

  try {
    // For large scale production (millions of users), this approach requires Cloud Functions maintaining integer states.
    // However, for this architectural phase, reading the snapshot `.size` is 100% accurate and functional.
    const followersRef = collection(db, "users", targetUid, "followers");
    const followingRef = collection(db, "users", targetUid, "following");

    const [followersSnap, followingSnap] = await Promise.all([
      getDocs(followersRef),
      getDocs(followingRef)
    ]);

    return {
      followers: followersSnap.size,
      following: followingSnap.size
    };
  } catch (error) {
    console.error("Network Metrics retrieval failed", error);
    return { followers: 0, following: 0 };
  }
};

/**
 * Extracts a concrete list of user profiles representing the network (followers/following)
 */
export const getNetworkList = async (targetUid: string, type: "followers" | "following"): Promise<UserProfile[]> => {
  if (!targetUid) return [];

  try {
    const listRef = collection(db, "users", targetUid, type);
    const snap = await getDocs(listRef);
    
    // We only have UIDs, so we map them to fetch actual public profiles
    const profiles: UserProfile[] = [];
    
    // Using a simple loop is fine for small networks. For massive influencers, this would need pagination.
    for (const doc of snap.docs) {
      const uid = doc.id;
      const profile = await getMyProfile(uid); 
      if (profile) profiles.push(profile);
    }
    
    return profiles;
  } catch (error) {
    console.error(`Failed to fetch ${type}:`, error);
    return [];
  }
};
