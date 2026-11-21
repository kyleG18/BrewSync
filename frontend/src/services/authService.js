import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchUserProfile(firebaseUser) {
  if (!firebaseUser) return null;

  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || snap.data().displayName || "User",
        photoURL: firebaseUser.photoURL || null,
        role: snap.data().role || "staff"
      };
    }

    const defaultRole =
      firebaseUser.email === "kyle12182003@gmail.com" ? "admin" : "staff";

    await setDoc(userRef, {
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
      role: defaultRole,
      createdAt: new Date().toISOString()
    });

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || "User",
      photoURL: firebaseUser.photoURL || null,
      role: defaultRole
    };
  } catch (err) {
    console.warn("Firestore role lookup failed, using default role:", err.message);
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || "User",
      photoURL: firebaseUser.photoURL || null,
      role: firebaseUser.email === "kyle12182003@gmail.com" ? "admin" : "staff"
    };
  }
}

export async function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      headers.Authorization = `Bearer ${token}`;
      return headers;
    } catch (_) {}
  }

  const saved = localStorage.getItem("brewsync_auth_user");
  if (saved) {
    try {
      const user = JSON.parse(saved);
      if (user.role === "admin") {
        headers.Authorization = "Bearer admin-token";
      } else {
        headers.Authorization = "Bearer staff-token";
      }
      return headers;
    } catch (_) {}
  }

  return headers;
}

export async function listAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export async function updateUserRole(uid, role) {
  await updateDoc(doc(db, "users", uid), { role });
}
