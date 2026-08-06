import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- Make sure this is here

const firebaseConfig = {
  apiKey: "AIzaSyD_6neSg9BMrqtDFOns1z47UCy3cONLrII",
  authDomain: "moviezwiki-904d5.firebaseapp.com",
  projectId: "moviezwiki-904d5",
  storageBucket: "moviezwiki-904d5.firebasestorage.app",
  messagingSenderId: "984858805094",
  appId: "1:984858805094:web:4c4c3451723925010f7ea7",
  measurementId: "G-X2VJXCKCT1"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app); // <-- Make sure this is initialized

export { app, auth, db }; // <-- Make sure db is exported