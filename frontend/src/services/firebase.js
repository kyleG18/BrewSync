import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQdWI1x7PqoWQkqfnwxVpa-Vt2w5_RK0g",
  authDomain: "brewsync-pos-5fa0e.firebaseapp.com",
  projectId: "brewsync-pos-5fa0e",
  storageBucket: "brewsync-pos-5fa0e.firebasestorage.app",
  messagingSenderId: "459027136575",
  appId: "1:459027136575:web:f7cc2932d064a6cd39388a",
  measurementId: "G-5N6TPX9J6F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
