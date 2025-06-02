// /firebase/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Config อ่านจาก .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// ป้องกัน initialize ซ้ำตอน dev (Next.js/React)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔥 กำหนดชื่อ Firestore Database Instance ตรงนี้
const db = initializeFirestore(app, {}, "sss-marketplace-db");
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
