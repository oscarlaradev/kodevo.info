// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAuth, type Auth } from 'firebase/auth';

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyDvtKReGj7zIX5Ep_RlHInWKCpQvWvJ7NE",
  authDomain: "kick-1626294198830.firebaseapp.com",
  projectId: "kick-1626294198830",
  storageBucket: "kick-1626294198830.appspot.com", // Corrected from .firebasestorage.app based on typical Firebase config
  messagingSenderId: "482374412279",
  appId: "1:482374412279:web:1f415433f6d440e51f70f2",
  measurementId: "G-0HMWRZVYKV"
};

let app: FirebaseApp;
let firestore: Firestore;
let storage: FirebaseStorage;
let auth: Auth;

console.log('[Firebase Init] Attempting to initialize Firebase...');

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('[Firebase Init] Firebase app initialized successfully.');
  } catch (error) {
    console.error('[Firebase Init] Error initializing Firebase app:', error);
    // In a real app, you might want to handle this more gracefully,
    // but for now, errors in initialization will prevent services from working.
    // We throw to make it obvious during development if config is bad.
    throw new Error(`Failed to initialize Firebase with provided config: ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  app = getApps()[0];
  console.log('[Firebase Init] Firebase app already initialized.');
}

try {
  firestore = getFirestore(app);
  console.log('[Firebase Init] Firestore initialized.');
} catch (error) {
  console.error('[Firebase Init] Error initializing Firestore:', error);
  throw new Error(`Failed to initialize Firestore: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  storage = getStorage(app);
  console.log('[Firebase Init] Storage initialized.');
} catch (error) {
  console.error('[Firebase Init] Error initializing Storage:', error);
  throw new Error(`Failed to initialize Storage: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  auth = getAuth(app);
  console.log('[Firebase Init] Auth initialized.');
} catch (error) {
  console.error('[Firebase Init] Error initializing Auth:', error);
  throw new Error(`Failed to initialize Auth: ${error instanceof Error ? error.message : String(error)}`);
}

export { app, firestore, storage, auth };
