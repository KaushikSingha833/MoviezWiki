import { db } from "./firebase";
import { doc, getDoc, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, Timestamp, getDocs, collection } from "firebase/firestore";

export interface CustomList {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  items: any[];
  isPrivate?: boolean;
  approvedUsers?: string[];
}

/**
 * Normalizes a title into a URL friendly slug (e.g. "My Top 10 Movies!" -> "my-top-10-movies")
 */
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Creates a brand new Empty List bucket.
 */
export const createList = async (userId: string, title: string, description: string = "") => {
  if (!userId || !title) return false;
  
  const listId = slugify(title);
  if (!listId) return false;

  try {
    const listRef = doc(db, "users", userId, "lists", listId);
    
    // Check collision
    const snap = await getDoc(listRef);
    if (snap.exists()) {
      throw new Error("A list with this URL slug already exists.");
    }

    await setDoc(listRef, {
      id: listId,
      title,
      description,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      items: [], // Empty array by default
      isPrivate: false,
      approvedUsers: []
    });
    
    return listId;
  } catch (error) {
    console.error("List Creation Error:", error);
    return null;
  }
};

/**
 * Completely erases a Custom List.
 */
export const deleteList = async (userId: string, listId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId, "lists", listId));
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Injects a full movie or actor object into the `items` array of a list.
 */
export const addToList = async (userId: string, listId: string, itemData: any) => {
  try {
    const listRef = doc(db, "users", userId, "lists", listId);
    await updateDoc(listRef, {
      items: arrayUnion(itemData),
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (e) {
    console.error("Failed to add to list:", e);
    return false;
  }
};

/**
 * Removes a full movie or actor object from the `items` array of a list.
 */
export const removeFromList = async (userId: string, listId: string, itemData: any) => {
  try {
    const listRef = doc(db, "users", userId, "lists", listId);
    await updateDoc(listRef, {
      items: arrayRemove(itemData),
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (e) {
    console.error("Failed to remove from list:", e);
    return false;
  }
};

/**
 * Fetches exactly one Public list by the creator's UID (useful for the Shareable URL).
 */
export const getPublicList = async (targetUid: string, listId: string): Promise<{ list: CustomList | null, isPrivate: boolean }> => {
  try {
    const listRef = doc(db, "users", targetUid, "lists", listId);
    const snap = await getDoc(listRef);
    
    if (snap.exists()) {
      const data = snap.data();
      return {
        list: {
          id: data.id,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          items: data.items || [],
          isPrivate: data.isPrivate || false,
          approvedUsers: data.approvedUsers || []
        },
        isPrivate: false
      };
    }
    return { list: null, isPrivate: false };
  } catch (e: any) {
    if (e?.code === 'permission-denied' || e?.message?.includes("Missing or insufficient permissions")) {
      return { list: null, isPrivate: true };
    }
    return { list: null, isPrivate: false };
  }
};

/**
 * Toggles a Custom List's privacy state
 */
export const toggleListPrivacy = async (userId: string, listId: string, currentIsPrivate: boolean) => {
  try {
    const listRef = doc(db, "users", userId, "lists", listId);
    await updateDoc(listRef, {
      isPrivate: !currentIsPrivate
    });
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Fetches all of a user's lists (useful for their Public Profile page or dashboard).
 */
export const getAllUserLists = async (targetUid: string): Promise<CustomList[]> => {
  try {
    const listsRef = collection(db, "users", targetUid, "lists");
    const snap = await getDocs(listsRef);
    
    const results: CustomList[] = [];
    snap.forEach(doc => {
      const data = doc.data();
      results.push({
        id: data.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        items: data.items || [],
        isPrivate: data.isPrivate || false,
        approvedUsers: data.approvedUsers || []
      });
    });
    
    // Sort by newest string
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (e) {
    return [];
  }
};
