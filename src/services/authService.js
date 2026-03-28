import { auth, db } from "@/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

export const register = async (email, password, nombre) => {
  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredentials.user;

  await setDoc(doc(db, "usuarios", user.uid), {
    nombre: nombre,
    rol: "user",
  });

  return user;
};

export const login = async (email, password) => {
  const userCredentials = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredentials.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const getUserRol = async (uid) => {
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().rol;
  }

  return null;
};

export const getUserProfile = async (uid) => {
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
};
