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

const resenasCollection = collection(db, "resenas");

export const guardarResena = async (resena) => {
  return await addDoc(resenasCollection, {
    ...resena,
    fecha: Timestamp.now(),
  });
};

export const subscribeResenas = (peliculaId, callback) => {
  const q = query(
    resenasCollection,
    where("peliculaId", "==", peliculaId),
    orderBy("fecha", "desc"),
  );
  return onSnapshot(q, (snapshot) => {
    const resenas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(resenas);
  });
};
