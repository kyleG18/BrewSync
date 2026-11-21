import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "https://jr-bresync.onrender.com"
    : "http://localhost:5000");
export const USERS_STORAGE_KEY = "brewsync_users";

export const DEFAULT_USERS = [
  {
    uid: "admin-user-01",
    displayName: "Store Administrator",
    email: "admin@brewsync.ph",
    role: "admin",
    status: "Active",
    password: "admin123",
    createdAt: "2026-10-01T08:00:00.000Z",
    lastLogin: "Just now"
  },
  {
    uid: "staff-user-01",
    displayName: "Counter Cashier",
    email: "staff@brewsync.ph",
    role: "staff",
    status: "Active",
    password: "staff123",
    createdAt: "2026-10-15T09:30:00.000Z",
    lastLogin: "2 hours ago"
  },
  {
    uid: "admin-user-02",
    displayName: "John Rich Montoya",
    email: "john@brewsync.com",
    role: "admin",
    status: "Active",
    password: "john123",
    createdAt: "2026-10-10T11:00:00.000Z",
    lastLogin: "Yesterday"
  },
  {
    uid: "staff-user-02",
    displayName: "Maria Santos",
    email: "maria@brewsync.com",
    role: "staff",
    status: "Active",
    password: "maria123",
    createdAt: "2026-10-20T14:15:00.000Z",
    lastLogin: "3 hours ago"
  },
  {
    uid: "staff-user-03",
    displayName: "Juan Dela Cruz",
    email: "juan@brewsync.com",
    role: "staff",
    status: "Active",
    password: "juan123",
    createdAt: "2026-10-25T16:00:00.000Z",
    lastLogin: "Yesterday"
  },
  {
    uid: "staff-user-04",
    displayName: "Anna Reyes",
    email: "anna@brewsync.com",
    role: "staff",
    status: "Inactive",
    password: "anna123",
    createdAt: "2026-11-01T10:00:00.000Z",
    lastLogin: "5 days ago"
  }
];

export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to parse stored users:", err);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function setStoredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn("Failed to save users to localStorage:", err);
  }
}

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
  const localList = getStoredUsers();
  try {
    const snap = await getDocs(collection(db, "users"));
    const firestoreUsers = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));

    if (firestoreUsers.length > 0) {
      const merged = [...localList];
      firestoreUsers.forEach((fu) => {
        const idx = merged.findIndex(
          (m) => m.uid === fu.uid || (fu.email && m.email?.toLowerCase() === fu.email?.toLowerCase())
        );
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], ...fu };
        } else {
          merged.push({
            uid: fu.uid,
            displayName: fu.displayName || fu.email?.split("@")[0] || "User",
            email: fu.email || "",
            role: fu.role || "staff",
            status: fu.status || "Active",
            password: fu.password || "staff123",
            createdAt: fu.createdAt || new Date().toISOString(),
            lastLogin: fu.lastLogin || "Never"
          });
        }
      });
      setStoredUsers(merged);
      return merged;
    }
  } catch (err) {
    console.info("Firestore users query unavailable, operating in local storage mode:", err.message);
  }
  return localList;
}

export async function createUserProfile(userData) {
  const localList = getStoredUsers();
  const uid = userData.uid || `user-${Date.now()}`;
  const newUser = {
    uid,
    displayName: (userData.displayName || "User").trim(),
    email: (userData.email || "").trim().toLowerCase(),
    role: userData.role || "staff",
    status: userData.status || "Active",
    password: userData.password ? userData.password.trim() : "staff123",
    createdAt: new Date().toISOString(),
    lastLogin: "Never"
  };

  const updated = [newUser, ...localList.filter((u) => u.uid !== uid && u.email !== newUser.email)];
  setStoredUsers(updated);

  try {
    await setDoc(doc(db, "users", uid), {
      displayName: newUser.displayName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt
    });
  } catch (err) {
    console.warn("Firestore sync skipped on user creation:", err.message);
  }

  return newUser;
}

export async function updateUserProfile(uid, partialData) {
  const localList = getStoredUsers();
  let updatedUser = null;
  const updated = localList.map((u) => {
    if (u.uid === uid) {
      updatedUser = { ...u, ...partialData };
      return updatedUser;
    }
    return u;
  });

  setStoredUsers(updated);

  try {
    const cleanUpdates = { ...partialData };
    delete cleanUpdates.password;
    await updateDoc(doc(db, "users", uid), cleanUpdates);
  } catch (err) {
    console.warn("Firestore sync skipped on user update:", err.message);
  }

  return updatedUser;
}

export async function updateUserRole(uid, role) {
  return updateUserProfile(uid, { role });
}

export async function deleteUserProfile(uid) {
  const localList = getStoredUsers();
  const updated = localList.filter((u) => u.uid !== uid);
  setStoredUsers(updated);

  try {
    await deleteDoc(doc(db, "users", uid));
  } catch (err) {
    console.warn("Firestore sync skipped on user deletion:", err.message);
  }

  return true;
}
