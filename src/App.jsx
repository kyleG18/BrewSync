import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import Login from "./Login";
import Header from "./Components/Header";
import InventoryPage from "./App/Main/InventoryPage/InventoryPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle Google Popup Sign-In
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  // Handle Sign-Out
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  // Loading State while verifying session
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#1A1614",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#F5EBE0",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{ width: "3rem", height: "3rem", color: "#E88D39", marginBottom: "1rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ color: "#D4C4B5", fontSize: "0.95rem" }}>Verifying BrewSync POS session...</p>
      </div>
    );
  }

  // Handle Guest / Demo Login (for quick review or unapproved domains)
  const handleGuestLogin = () => {
    setUser({
      displayName: "Demo User",
      email: "demo@brewsync.pos",
      photoURL: null
    });
  };

  // Not Authenticated -> Show Login Page
  if (!user) {
    return <Login onLogin={handleLogin} onGuestLogin={handleGuestLogin} />;
  }

  // Authenticated -> Show App with Header and Main View
  return (
    <div className="brewsync-app">
      <Header user={user} onLogout={handleLogout} />
      <InventoryPage user={user} onLogout={handleLogout} />
    </div>
  );
}

export default App;
