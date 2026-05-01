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
} from "firebase/firestore";

// Favorites collection

const favoritesCollection = collection(db, "favorites");

/**
 * Real-time subscription to the collection
 * Keeps the list of favorites synchronized in real time with Firestore, so there is no need to reload the page to see new data
 */

export const subscribeFavorites = (userId, callback) => {
  const q = query(favoritesCollection, where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const favorites = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(favorites);
  });
};

// Method to add a new favorite movie to the database

export const addFavorite = async (userId, movieId) => {
  return await addDoc(favoritesCollection, {
    userId,
    movieId,
  });
};

// Method to remove a favorite in the database

export const removeFavorite = async (favoriteId) => {
  const favoriteRef = doc(db, "favorites", favoriteId);
  return await deleteDoc(favoriteRef);
};
