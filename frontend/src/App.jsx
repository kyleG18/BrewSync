import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "./services/firebase";
import { fetchUserProfile } from "./services/authService";
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const profile = await fetchUserProfile(currentUser);
        setUser(profile);
      } else if (sessionStorage.getItem("brewsync_guest") === "true") {
        setUser({
          uid: "demo-session",
          displayName: "Demo User",
          email: "demo@brewsync.pos",
          photoURL: null,
          role: sessionStorage.getItem("brewsync_demo_role") || "admin"
        });
      } else {
        setUser(null);
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
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleGuestLogin = () => {
    sessionStorage.setItem("brewsync_guest", "true");
    sessionStorage.setItem("brewsync_demo_role", "admin");
    setUser({
      uid: "demo-session",
      displayName: "Demo User",
      email: "demo@brewsync.pos",
      photoURL: null,
      role: "admin"
    });
  };

  const handleSwitchDemoRole = (role) => {
    sessionStorage.setItem("brewsync_demo_role", role);
    setUser((prev) => (prev ? { ...prev, role } : prev));
  };

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("brewsync_guest");
      sessionStorage.removeItem("brewsync_demo_role");
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
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
                onGuestLogin={handleGuestLogin}
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
                onSwitchDemoRole={handleSwitchDemoRole}
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
