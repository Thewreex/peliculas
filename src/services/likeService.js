// Firebase
import { db } from "@/firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

// Favorites collection

const likesCollection = collection(db, "likes");

/**
 * Real-time subscription to the collection
 * Keeps the list of favorites synchronized in real time with Firestore, so there is no need to reload the page to see new data
 */

export const subscribeLikes = (userId, callback) => {
  const q = query(likesCollection, where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const likes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(likes);
  });
};

// Method to add a new favorite movie to the database

export const addLike = async (userId, reviewId) => {
  const result = await addDoc(likesCollection, {
    reviewId,
    userId,
  });

  const reviewRef = doc(db, "reviews", reviewId);
  await updateDoc(reviewRef, { likesCount: increment(1) });

  return result;
};

// Method to remove a favorite in the database

export const removeLike = async (likeId, reviewId) => {
  const likesRef = doc(db, "likes", likeId);
  await deleteDoc(likesRef);

  const reviewRef = doc(db, "reviews", reviewId);
  await updateDoc(reviewRef, { likesCount: increment(-1) });
};
