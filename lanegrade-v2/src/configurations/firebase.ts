import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut, UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCs_SwQOHv13AxErN6syz5uhAxC_VI04Gg",
  authDomain: "lane-grade.firebaseapp.com",
  projectId: "lane-grade",
  storageBucket: "lane-grade.appspot.com",
  messagingSenderId: "793296784119",
  appId: "1:793296784119:web:970af0a07a2bf087fa61f2",
  measurementId: "G-1G6RH943FX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
};
