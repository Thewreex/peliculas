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
const actorsCollection = collection(db, "actors");

// Methods

/**
 * Real-time subscription to the collection
 * Keeps the list of actors synchronized in real time with Firestore, so there is no need to reload the page to see new data
 */

export const subscribeActors = (callback) => {
  return onSnapshot(actorsCollection, (snapshot) => {
    const actors = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(actors);
  });
};

/**
 * Method to retrieve all actors from the database
 * Returns a toast if fail
 */

export const getActors = async () => {
  try {
    const snapshot = await getDocs(actorsCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    toast.error(
      "Ha ocurrido un error al cargar los actores: " +
        convertErrors(error.code),
    );
  }
};

// Method to add a new actor to the database

export const createActor = async (actor) => {
  return await addDoc(actorsCollection, actor);
};

// Method to update a actor from the database

export const updateActor = async (id, actor) => {
  const actorRef = doc(db, "actors", id);
  return await updateDoc(actorRef, actor);
};

// Method to delete a actor from the database

export const deleteActor = async (id) => {
  const actorRef = doc(db, "actors", id);
  return await deleteDoc(actorRef);
};
