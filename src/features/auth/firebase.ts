"use client";

// Purpose: Initialize Firebase client primitives on demand.
// Callers: AuthProvider, authenticated data services, and upload flows.
// Deps: Firebase app/auth/firestore/storage SDKs and Firebase environment reader.
// API: getFirebaseAuth(), getFirebaseDb(), getFirebaseStorage(), googleProvider, and auth SDK functions.
// Side effects: Initializes or reuses the Firebase browser app when Firebase services are requested.
import { getApp, getApps, initializeApp, type FirebaseApp } from "@firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type User
} from "@firebase/auth";
import { getFirestore, type Firestore } from "@firebase/firestore";
import { getStorage, type FirebaseStorage } from "@firebase/storage";
import { readFirebaseConfig } from "@/lib/env";

let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

const getFirebaseApp = (): FirebaseApp => (getApps().length ? getApp() : initializeApp(readFirebaseConfig()));

export const getFirebaseAuth = () => {
  if (authInstance) return authInstance;

  authInstance = getAuth(getFirebaseApp());
  return authInstance;
};

export const getFirebaseDb = () => {
  if (dbInstance) return dbInstance;

  dbInstance = getFirestore(getFirebaseApp());
  return dbInstance;
};

export const getFirebaseStorage = () => {
  if (storageInstance) return storageInstance;

  storageInstance = getStorage(getFirebaseApp());
  return storageInstance;
};

export const googleProvider = new GoogleAuthProvider();

export { getFirestore, getStorage, onAuthStateChanged, signInWithPopup, signOut, type User };
