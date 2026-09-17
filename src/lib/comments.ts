import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, deleteDoc, doc } from "firebase/firestore";

export interface CommunityComment {
  id: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  userId: string;
  userName: string;
  userPhotoURL?: string;
  text: string;
  rating: number;
  createdAt: Date;
}

/**
 * Pushes a local comment dynamically into Firestore Cloud
 */
export const addCommunityComment = async (
  mediaId: number,
  mediaType: "movie" | "tv",
  userId: string,
  userName: string,
  text: string,
  rating: number,
  userPhotoURL?: string
): Promise<CommunityComment | null> => {
  try {
    const commentsRef = collection(db, "comments");
    
    // We utilize Firestore server-side timestamps but also keep a local instance to return instantly
    const newCommentData = {
      mediaId,
      mediaType,
      userId,
      userName,
      userPhotoURL: userPhotoURL || null,
      text,
      rating,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(commentsRef, newCommentData);

    return {
      id: docRef.id,
      mediaId,
      mediaType,
      userId,
      userName,
      userPhotoURL,
      text,
      rating,
      createdAt: new Date()
    };
  } catch (error) {
    console.error("Error writing community comment to Firebase:", error);
    return null;
  }
};

/**
 * Extracts and maps native community comments for specific media
 */
export const getCommunityComments = async (
  mediaId: number,
  mediaType: "movie" | "tv"
): Promise<CommunityComment[]> => {
  try {
    const commentsRef = collection(db, "comments");
    
    // We search only the exact media ID to bypass strict Firestore composite indexing requirements,
    // then safely filter the media type and sort natively on the client!
    const q = query(
      commentsRef, 
      where("mediaId", "==", mediaId)
    );
    
    const querySnapshot = await getDocs(q);
    const nativeComments: CommunityComment[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.mediaType === mediaType) {
        nativeComments.push({
          id: doc.id,
          mediaId: data.mediaId,
          mediaType: data.mediaType,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          text: data.text,
          rating: data.rating,
          createdAt: data.createdAt.toDate(),
        });
      }
    });

    // Native sort newest first
    nativeComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return nativeComments;
  } catch (error) {
    // Note: If Firestore index is missing, it will log an error with a URL to build the index!
    console.error("Error extracting native comments from Firebase:", error);
    return [];
  }
};

/**
 * securely deletes a specific comment document from Firestore
 */
export const deleteCommunityComment = async (commentId: string): Promise<boolean> => {
  try {
    const commentRef = doc(db, "comments", commentId);
    await deleteDoc(commentRef);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
};
