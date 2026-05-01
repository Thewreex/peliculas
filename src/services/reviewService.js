// Firebase
import { db } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";

// Collections
const reviewsCollection = collection(db, "reviews");

/**
 * Method to save reviews to the database
 * The date attribute uses the Timestamp.now() method to assign the date when the data was saved
 */

export const saveReview = async (review) => {
  return await addDoc(reviewsCollection, {
    ...review,
    date: Timestamp.now(),
  });
};

/**
 * Real-time subscription to the collection
 * Keeps the list of reviews synchronized in real time with Firestore, so there is no need to reload the page to see new data
 */

export const subscribeReviews = (movieId, callback) => {
  const q = query(
    reviewsCollection,
    where("movieId", "==", movieId),
    orderBy("date", "desc"),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const reviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(reviews);
    },
    (error) => {
      console.error("Error al obtener reviews:", error);
    },
  );
};
