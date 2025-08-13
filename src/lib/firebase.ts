// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "apiKey": "AIzaSyDNBmYP8uspds_0NuH5g3MHfD9RFkqRPo8",
  "projectId": "bookhatch-reader",
  "appId": "1:326452768095:web:cb72dc01638efd9b5c5aea",
  "storageBucket": "bookhatch-reader.firebasestorage.app",
  "authDomain": "bookhatch-reader.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "326452768095"
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
