import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "./services/firebase";
import { fetchUserProfile, getStoredUsers, setStoredUsers } from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./login/Login";
import DashboardPage from "./dashboard/DashboardPage";
import InventoryPage from "./inventory/InventoryPage";
import ProfilePage from "./pages/ProfilePage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check locally stored credential session first
    const saved = localStorage.getItem("brewsync_auth_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          setUser(parsed);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Failed to parse saved credentials", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const profile = await fetchUserProfile(currentUser);
        localStorage.setItem("brewsync_auth_user", JSON.stringify(profile));
        setUser(profile);
      } else {
        const localSaved = localStorage.getItem("brewsync_auth_user");
        if (!localSaved) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleEmailLogin = async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    // Check dynamically managed users from local/Firestore sync
    const storedUsers = getStoredUsers();
    const matchedUser = storedUsers.find(
      (u) =>
        u.email?.toLowerCase() === cleanEmail ||
        (cleanEmail === "admin" && u.role === "admin") ||
        (cleanEmail === "staff" && u.role === "staff")
    );

    if (matchedUser) {
      if (matchedUser.status === "Inactive") {
        throw new Error("This account has been deactivated by an administrator.");
      }
      const isPasswordValid =
        matchedUser.password === cleanPassword ||
        (matchedUser.role === "admin" && cleanPassword === "admin123") ||
        (matchedUser.role === "staff" && cleanPassword === "staff123");

      if (isPasswordValid) {
        const profile = {
          uid: matchedUser.uid,
          displayName: matchedUser.displayName || "User",
          email: matchedUser.email,
          photoURL: null,
          role: matchedUser.role || "staff"
        };
        // Update last login
        const updatedUsers = storedUsers.map((u) =>
          u.uid === matchedUser.uid ? { ...u, lastLogin: "Just now" } : u
        );
        setStoredUsers(updatedUsers);
        localStorage.setItem("brewsync_auth_user", JSON.stringify(profile));
        sessionStorage.setItem("brewsync_user_role", profile.role);
        setUser(profile);
        return;
      }
    }

    // Admin role built-in credential fallback
    if (
      (cleanEmail === "admin@brewsync.ph" ||
        cleanEmail === "admin@brewsync.pos" ||
        cleanEmail === "admin") &&
      cleanPassword === "admin123"
    ) {
      const adminProfile = {
        uid: "admin-user-01",
        displayName: "Store Admin",
        email: "admin@brewsync.ph",
        photoURL: null,
        role: "admin"
      };
      localStorage.setItem("brewsync_auth_user", JSON.stringify(adminProfile));
      sessionStorage.setItem("brewsync_user_role", "admin");
      setUser(adminProfile);
      return;
    }

    // Staff role built-in credential fallback
    if (
      (cleanEmail === "staff@brewsync.ph" ||
        cleanEmail === "staff@brewsync.pos" ||
        cleanEmail === "staff") &&
      cleanPassword === "staff123"
    ) {
      const staffProfile = {
        uid: "staff-user-01",
        displayName: "Staff Member",
        email: "staff@brewsync.ph",
        photoURL: null,
        role: "staff"
      };
      localStorage.setItem("brewsync_auth_user", JSON.stringify(staffProfile));
      sessionStorage.setItem("brewsync_user_role", "staff");
      setUser(staffProfile);
      return;
    }

    // Attempt Firebase sign-in if credentials don't match built-in roles
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    } catch (err) {
      throw new Error("Invalid email or password. Use your Admin or Staff credentials.");
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("brewsync_auth_user");
      sessionStorage.removeItem("brewsync_guest");
      sessionStorage.removeItem("brewsync_demo_role");
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F6F4F0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#181512",
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ width: "2.25rem", height: "2.25rem", color: "#B85D19", marginBottom: "0.85rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ color: "#5C544D", fontSize: "0.9rem", fontWeight: 500 }}>Loading BrewSync POS...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login
                onLogin={handleLogin}
                onEmailLogin={handleEmailLogin}
              />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute user={user}>
              <InventoryPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage
                user={user}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminUsersPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
