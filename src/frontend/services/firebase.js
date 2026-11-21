import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYCKcYJ6u6jkb54qUNlk2A9PGjstjyc3Y",
  authDomain: "pwa-sample-9c068.firebaseapp.com",
  projectId: "pwa-sample-9c068",
  storageBucket: "pwa-sample-9c068.firebasestorage.app",
  messagingSenderId: "549586540109",
  appId: "1:549586540109:web:bfde05e43d0cd070f0ee04",
  measurementId: "G-B3QDBBR9S4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
