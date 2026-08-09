import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Executes a secure read operation against a strictly defined public-facing Wishlist.
 * Requires Firebase Security Rules to allow read on users/{uid}/wishlist
 */
export const getPublicVault = async (targetUid: string): Promise<{ items: any[], isPrivate: boolean }> => {
  if (!targetUid) return { items: [], isPrivate: false };

  try {
    const vaultRef = collection(db, "users", targetUid, "wishlist");
    const snapshot = await getDocs(vaultRef);

    const vaultItems: any[] = [];
    snapshot.forEach((doc) => {
      // Return the literal stored object array
      vaultItems.push({ id: doc.id, ...doc.data() });
    });

    // Optionally sort by saved order.
    return { items: vaultItems, isPrivate: false };
  } catch (error: any) {
    if (error?.code === 'permission-denied' || error?.message?.includes("Missing or insufficient permissions")) {
      return { items: [], isPrivate: true };
    }
    return { items: [], isPrivate: false };
  }
};
