import { db } from "./firebase";
import { collection, doc, setDoc, deleteDoc, Timestamp, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export type NotificationType = "follow" | "list_access" | "main_wishlist_access";

export interface AppNotification {
  id: string;
  type: NotificationType;
  fromUid: string;
  fromUsername: string; // snapshot for quick UI
  targetId?: string; // e.g. listId 
  targetName?: string; // e.g. List Title
  status: "pending" | "approved" | "denied" | "read";
  createdAt: Date;
}

/**
 * Pushes a notification to an owner's tray.
 */
export const pushNotification = async (
  ownerUid: string,
  type: NotificationType,
  fromUid: string,
  fromUsername: string,
  targetId?: string,
  targetName?: string
) => {
  if (ownerUid === fromUid) return false; // purely a fail-safe, you can't notify yourself

  try {
    const notifId = `${type}_${fromUid}_${targetId || 'core'}`;
    const notifRef = doc(db, "users", ownerUid, "notifications", notifId);
    
    await setDoc(notifRef, {
      id: notifId,
      type,
      fromUid,
      fromUsername,
      targetId: targetId || null,
      targetName: targetName || null,
      status: type === "follow" ? "read" : "pending", 
      createdAt: Timestamp.now()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Failed to push notification.", error);
    return false;
  }
};

/**
 * Marks a single notification as read/resolved.
 */
export const dismissNotification = async (ownerUid: string, notifId: string) => {
  try {
    const notifRef = doc(db, "users", ownerUid, "notifications", notifId);
    await deleteDoc(notifRef);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Approves a network access request
 */
export const approveAccessRequest = async (ownerUid: string, notifId: string, type: NotificationType, requesterUid: string, listId?: string) => {
  try {
    if (type === "list_access" && listId) {
      // Add requester to the List's whitelist
      const listRef = doc(db, "users", ownerUid, "lists", listId);
      await updateDoc(listRef, {
        approvedUsers: arrayUnion(requesterUid)
      });
    } else if (type === "main_wishlist_access") {
      // Add requester to the Owner's main master whitelist
      const ownerRef = doc(db, "users", ownerUid);
      await updateDoc(ownerRef, {
        mainWishlistApprovedUsers: arrayUnion(requesterUid)
      });
    }

    // Erase the notification so it's resolved
    await dismissNotification(ownerUid, notifId);
    return true;
  } catch (error) {
    console.error("Approval error:", error);
    return false;
  }
};
