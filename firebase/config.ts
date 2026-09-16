import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

export function getAppInstance(): FirebaseApp {
  if (!appInstance) {
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      throw new Error(
        'Firebase config missing. Set NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID in Vercel environment variables.'
      );
    }
    if (getApps().length === 0) {
      appInstance = initializeApp(firebaseConfig as any);
    } else {
      appInstance = getApp();
    }
  }
  return appInstance;
}

export function getAuthInstance(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getAppInstance());
  }
  return authInstance;
}

export function getFirestoreInstance(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getAppInstance());
  }
  return dbInstance;
}

export { firebaseConfig };
