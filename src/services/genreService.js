// Firebase
import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
// Utils
import { convertErrors } from "@/utils/errorMessages";
// VUE Libraries
import { useToast } from "vue-toastification";

// Composables
const toast = useToast();

// Collection
const genresCollection = collection(db, "genres");

/**
 * Real-time subscription to the collection
 * Keeps the list of genres synchronized in real time with Firestore, so there is no need to reload the page to see new data
 */

export const subscribeGenres = (callback) => {
  return onSnapshot(genresCollection, (snapshot) => {
    const genres = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(genres);
  });
};

/**
 * Method to retrieve all genres from the database
 * Returns a toast if fails
 */

export const getGenres = async () => {
  try {
    const snapshot = await getDocs(genresCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    toast.error(
      "Ha ocurrido un error al cargar los generos: " +
        convertErrors(error.code),
    );
  }
};

// Method to add a new genre to the database

export const createGenre = async (genre) => {
  return await addDoc(genresCollection, genre);
};

// Method to update a genre of the database

export const updateGenre = async (id, genre) => {
  const genreRef = doc(db, "genres", id);
  return await updateDoc(genreRef, genre);
};

// Method to delete a genre of the database

export const deleteGenre = async (id) => {
  const genreRef = doc(db, "genres", id);
  return await deleteDoc(genreRef);
};
