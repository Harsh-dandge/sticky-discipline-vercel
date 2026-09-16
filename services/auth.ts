import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signOut, onAuthStateChanged as firebaseOnAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { User } from '@/types/task';
import { createUserProfile } from '@/services/firestore';

export async function login(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: credential.user.uid,
    email: credential.user.email!,
    displayName: credential.user.displayName || email.split('@')[0],
    photoURL: credential.user.photoURL || undefined,
  };
}

export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  return {
    uid: credential.user.uid,
    email: credential.user.email!,
    displayName: credential.user.displayName || credential.user.email!.split('@')[0],
    photoURL: credential.user.photoURL || undefined,
  };
}

export async function register(email: string, password: string, displayName: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user: User = {
    uid: credential.user.uid,
    email: credential.user.email!,
    displayName,
    photoURL: credential.user.photoURL || undefined,
  };
  await createUserProfile(user);
  return user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return firebaseOnAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
        photoURL: firebaseUser.photoURL || undefined,
      };
      await createUserProfile(user);
      callback(user);
    } else {
      callback(null);
    }
  });
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}
