
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZk99sXJdRjMV_t97MZfPsiPua-w4OqbE",
  authDomain: "bookhatch-reader.firebaseapp.com",
  projectId: "bookhatch-reader",
  storageBucket: "bookhatch-reader.firebasestorage.app",
  messagingSenderId: "326452768095",
  appId: "1:326452768095:web:cb72dc01638efd9b5c5aea"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// To re-enable Analytics and Remote Config, you must first go to your
// Firebase project settings, integrate with Google Analytics, and then
// provide the generated `measurementId` in the firebaseConfig object above.
const remoteConfig = undefined;
const analytics = null;


export { app, db, auth, storage, remoteConfig, analytics };
