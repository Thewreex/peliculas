// Firebase
import { auth, db } from "@/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";

// METHODS

/**
 * Method to register new users
 * Creates the new user using the createUserWithEmailAndPassword method
 * Additionally, it stores this user's data in the database
 */

export const register = async (email, password, name) => {
  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredentials.user;

  await setDoc(doc(db, "users", user.uid), {
    name: name,
    role: "user",
    email: email,
  });

  return user;
};

/**
 * Method to log in
 * First, it uses the signInWithEmailAndPassword method to send the data to Firebase, and if valid, it returns an object with the user's information
 */

export const login = async (email, password) => {
  const userCredentials = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredentials.user;
};

/**
 * Retrieves the currently authenticated user as a Promise.
 * Wraps Firebase's onAuthStateChanged in a Promise to allow async/await usage.
 * The listener is automatically unsubscribed after the first response to prevent memory leaks.
 */

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject,
    );
  });
};

// Method to log out
export const logout = async () => {
  await signOut(auth);
};

/**
 * Method to get the role of the active user
 * Checks if the user exists; if so, it returns their role
 * Otherwise, it returns null
 */

export const getUserRole = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().role;
  }

  return null;
};

/**

* Method to get the userProfile of the active user
* Checks if the user exists; if so, it returns their data
* Otherwise, it returns null
  */

export const getUserProfile = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
};

/**
 * Method to check if the email exists
 * It is used during user registration to prevent creating more than one account with the same email
 */

export const checkEmailExists = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};
