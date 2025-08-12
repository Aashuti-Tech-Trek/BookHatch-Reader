
"use client";

import { useEffect, useState, createContext } from 'react';
import { onAuthStateChanged, type User, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { AuthContext } from '@/hooks/use-auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (name: string, email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    // Update Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Create a user document in Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      name,
      email,
      bio: `A new author on BookHatch Reader.`,
      profilePicture: `https://placehold.co/128x128.png`,
      followers: 0,
      following: 0,
      totalLikes: 0,
      averageRating: 0,
      createdAt: new Date(),
    });

    // We manually set the user state here to include the new display name
    // as onAuthStateChanged might not fire immediately with the updated profile
    setUser({ ...user, displayName: name });

    return userCredential;
  };
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user already exists in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // If user doesn't exist, create a new document
       await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email,
        bio: "A new author on BookHatch Reader.",
        profilePicture: user.photoURL || `https://placehold.co/128x128.png`,
        followers: 0,
        following: 0,
        totalLikes: 0,
        averageRating: 0,
        createdAt: new Date(),
      });
    }
    return userCredential;
  };


  const value = {
    user,
    loading,
    signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signUp,
    signOut: () => signOut(auth),
    signInWithGoogle: handleGoogleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
