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
const moviesCollection = collection(db, "movies");

/**
 * Real-time subscription to the collection
 * Keeps the list of movies synchronized in real time with Firestore, so there is no need to reload the page to see new data
 */

export const subscribeMovies = (callback) => {
  return onSnapshot(moviesCollection, (snapshot) => {
    const movies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(movies);
  });
};

export const getMovies = async () => {
  try {
    const snapshot = await getDocs(moviesCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    toast.error(
      "Ha ocurrido un error al cargar las peliculas: " +
        convertErrors(error.code),
    );
  }
};

// Method to add a new movie to the database

export const createMovie = async (movie) => {
  return await addDoc(moviesCollection, movie);
};

// Method to update a movie of the database

export const updateMovie = async (id, movie) => {
  const movieRef = doc(db, "movies", id);
  return await updateDoc(movieRef, movie);
};

// Method to delete a movie of the database

export const deleteMovie = async (id) => {
  const movieRef = doc(db, "movies", id);
  return await deleteDoc(movieRef);
};
