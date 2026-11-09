import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import Login from "./Login";
import Header from "./Components/Header";
import InventoryPage from "./App/Main/InventoryPage/InventoryPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('brewsync_guest');
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
        <p style={{ color: "#D4C4B5", fontSize: "0.95rem" }}>Loading BrewSync POS...</p>
      </div>
    );
  }

  const handleEmailLogin = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleGuestLogin = () => {
    sessionStorage.setItem('brewsync_guest', 'true');
    setUser({
      displayName: "Demo User",
      email: "demo@brewsync.pos",
      photoURL: null
    });
  };

  if (!user) {
    return <Login onLogin={handleLogin} onGuestLogin={handleGuestLogin} onEmailLogin={handleEmailLogin} />;
  }

  return (
    <div className="brewsync-app">
      <Header user={user} onLogout={handleLogout} />
      <InventoryPage user={user} onLogout={handleLogout} />
    </div>
  );
}

export default App;
