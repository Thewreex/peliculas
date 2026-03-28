import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const generosCollection = collection(db, "generos");

export const getGeneros = async () => {
  const snapshot = await getDocs(generosCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const createGenero = async (genero) => {
  return await addDoc(generosCollection, genero);
};

export const updateGenero = async (id, genero) => {
  const generoRef = doc(db, "generos", id);
  return await updateDoc(generoRef, genero);
};

export const deleteGenero = async (id) => {
  const generoRef = doc(db, "generos", id);
  return await deleteDoc(generoRef);
};
