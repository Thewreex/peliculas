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

const favoritosCollection = collection(db, "favoritos");

export const subscribeFavoritos = (userId, callback) => {
  const q = query(favoritosCollection, where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const favoritos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(favoritos);
  });
};

export const addFavorito = async (userId, peliculaId) => {
  return await addDoc(favoritosCollection, {
    userId,
    peliculaId,
  });
};

export const removeFavorito = async (favoriteId) => {
  const favoritoRef = doc(db, "favoritos", favoriteId);
  return await deleteDoc(favoritoRef);
};
