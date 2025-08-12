// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "bookhatch-reader",
  "appId": "1:326452768095:web:cb72dc01638efd9b5c5aea",
  "storageBucket": "bookhatch-reader.firebasestorage.app",
  "apiKey": "AIzaSyBZk99sXJdRjMV_t97MZfPsiPua-w4OqbE",
  "authDomain": "bookhatch-reader.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "326452768095"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
