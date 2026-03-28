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

const peliculasCollection = collection(db, "peliculas");

export const subscribePeliculas = (callback) => {
  return onSnapshot(peliculasCollection, (snapshot) => {
    const pelis = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(pelis);
  });
};

export const getPeliculas = async () => {
  const snapshot = await getDocs(peliculasCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const createPelicula = async (pelicula) => {
  return await addDoc(peliculasCollection, pelicula);
};

export const updatePelicula = async (id, pelicula) => {
  const peliculaRef = doc(db, "peliculas", id);
  return await updateDoc(peliculaRef, pelicula);
};

export const deletePelicula = async (id) => {
  const peliculaRef = doc(db, "peliculas", id);
  return await deleteDoc(peliculaRef);
};
