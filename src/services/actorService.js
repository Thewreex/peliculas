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

const actoresCollection = collection(db, "actores");

export const subscribeActores = (callback) => {
  return onSnapshot(actoresCollection, (snapshot) => {
    const actores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(actores);
  });
};

export const getActores = async () => {
  try {
    const snapshot = await getDocs(actoresCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Ha ocurrido un error al cargar los actores: ", error);
  }
};

export const createActor = async (actor) => {
  return await addDoc(actoresCollection, actor);
};

export const updateActor = async (id, actor) => {
  const actorRef = doc(db, "actores", id);
  return await updateDoc(actorRef, actor);
};

export const deleteActor = async (id) => {
  const actorRef = doc(db, "actores", id);
  return await deleteDoc(actorRef);
};
