// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getStorage, type FirebaseStorage } from 'firebase/storage'; // We'll use this later for file uploads
// import { getAuth, type Auth } from 'firebase/auth'; // We'll use this later for authentication

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvtKReGj7zIX5Ep_RlHInWKCpQvWvJ7NE",
  authDomain: "kick-1626294198830.firebaseapp.com",
  projectId: "kick-1626294198830",
  storageBucket: "kick-1626294198830.firebasestorage.app",
  messagingSenderId: "482374412279",
  appId: "1:482374412279:web:1f415433f6d440e51f70f2",
  measurementId: "G-0HMWRZVYKV"
};

let app: FirebaseApp;
let firestore: Firestore;
// let storage: FirebaseStorage; // For later
// let auth: Auth; // For later

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

firestore = getFirestore(app);
// storage = getStorage(app); // For later
// auth = getAuth(app); // For later

export { app, firestore /*, storage, auth */ };
