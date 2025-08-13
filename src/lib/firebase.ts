
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getRemoteConfig } from "firebase/remote-config";
import { getAnalytics } from "firebase/analytics";

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

// Client-side only services
const remoteConfig = typeof window !== 'undefined' ? getRemoteConfig(app) : undefined;
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;


if (remoteConfig) {
    // You can set default values for your remote config parameters here
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
    remoteConfig.defaultConfig = {
        "welcome_message": "Welcome to BookHatch Reader!",
    };
}


export { app, db, auth, storage, remoteConfig, analytics };
