import React, { useState } from "react";
import "./App/Main/LoginPage/LoginPage.css";

const Login = ({ onLogin, onGuestLogin, onEmailLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    if (!email || !password) {
      setEmailError("Please enter your email and password.");
      return;
    }
    try {
      await onEmailLogin(email, password);
    } catch (err) {
      setEmailError(err.message || "Login failed. Check your credentials.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A1614",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        color: "#F5EBE0",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(74, 46, 25, 0.45) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 40% at 100% 100%, rgba(232, 141, 57, 0.15) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div
        style={{
          background: "#241F1C",
          border: "1px solid #3D322B",
          borderRadius: "1.25rem",
          padding: "2.75rem 2.25rem",
          maxWidth: "440px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.5)",
          position: "relative",
          zIndex: 1
        }}
      >
        {/* Brand Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            background: "linear-gradient(135deg, #4A2E19, #E88D39)",
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
            boxShadow: "0 8px 20px rgba(232, 141, 57, 0.3)"
          }}
        >
          <i className="bi bi-cup-hot" style={{ fontSize: "2rem", color: "#F5EBE0" }}></i>
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 0.4rem 0", color: "#F5EBE0" }}>
          BrewSync POS
        </h1>
        <p style={{ color: "#D4C4B5", fontSize: "0.9rem", margin: "0 0 1.75rem 0", lineHeight: 1.5 }}>
          Point of Sale & Inventory Management System
        </p>

        <div
          style={{
            background: "rgba(74, 46, 25, 0.35)",
            border: "1px solid rgba(232, 141, 57, 0.25)",
            borderRadius: "0.75rem",
            padding: "1rem",
            marginBottom: "1.75rem",
            textAlign: "left"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <i className="bi bi-shield-lock" style={{ color: "#E88D39" }}></i>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#F5EBE0" }}>
              Secure Authentication
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#B8A99A", lineHeight: 1.4 }}>
            Sign in with your authorized Google Workspace or personal account to access the system.
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={onLogin}
          type="button"
          style={{
            width: "100%",
            padding: "0.9rem 1.25rem",
            backgroundColor: "#F5EBE0",
            color: "#4A2E19",
            border: "none",
            borderRadius: "0.75rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.85rem",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#F5EBE0";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {/* Official Google G SVG */}
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "1.25rem 0" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#3D322B" }}></div>
          <span style={{ padding: "0 0.75rem", color: "#9A8A7A", fontSize: "0.8rem" }}>or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#3D322B" }}></div>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleEmailSubmit} style={{ textAlign: "left", marginBottom: "1rem" }}>
          <div style={{ marginBottom: "0.85rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#D4C4B5", marginBottom: "0.4rem", fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "0.72rem 1rem",
                backgroundColor: "#1A1614",
                border: "1px solid #3D322B",
                borderRadius: "0.6rem",
                color: "#F5EBE0",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#E88D39")}
              onBlur={(e) => (e.target.style.borderColor = "#3D322B")}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#D4C4B5", marginBottom: "0.4rem", fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "0.72rem 2.8rem 0.72rem 1rem",
                  backgroundColor: "#1A1614",
                  border: "1px solid #3D322B",
                  borderRadius: "0.6rem",
                  color: "#F5EBE0",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => (e.target.style.borderColor = "#E88D39")}
                onBlur={(e) => (e.target.style.borderColor = "#3D322B")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#9A8A7A",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "1rem"
                }}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          {emailError && (
            <div style={{
              backgroundColor: "rgba(220, 53, 69, 0.15)",
              border: "1px solid rgba(220, 53, 69, 0.4)",
              borderRadius: "0.5rem",
              padding: "0.6rem 0.85rem",
              fontSize: "0.8rem",
              color: "#FF6B6B",
              marginBottom: "0.85rem"
            }}>
              <i className="bi bi-exclamation-circle me-1"></i> {emailError}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.85rem 1.25rem",
              background: "linear-gradient(135deg, #4A2E19, #E88D39)",
              color: "#F5EBE0",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
          </button>
        </form>

        {/* Divider before Guest */}
        <div style={{ display: "flex", alignItems: "center", margin: "1rem 0" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#3D322B" }}></div>
          <span style={{ padding: "0 0.75rem", color: "#9A8A7A", fontSize: "0.8rem" }}>or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#3D322B" }}></div>
        </div>

        {/* Continue as Guest Button */}
        <button
          onClick={onGuestLogin}
          type="button"
          style={{
            width: "100%",
            padding: "0.8rem 1.25rem",
            backgroundColor: "rgba(74, 46, 25, 0.45)",
            color: "#F5EBE0",
            border: "1px solid #4A3D33",
            borderRadius: "0.75rem",
            fontSize: "0.92rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(74, 46, 25, 0.8)";
            e.currentTarget.style.borderColor = "#E88D39";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(74, 46, 25, 0.45)";
            e.currentTarget.style.borderColor = "#4A3D33";
          }}
        >
          <i className="bi bi-person-badge" style={{ color: "#E88D39", fontSize: "1.1rem" }}></i>
          <span>Continue as Guest / Demo Mode</span>
        </button>

        {/* Quick Links to other stations */}
        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <a
            href="/dashboard.html"
            style={{
              fontSize: "0.78rem",
              padding: "0.3rem 0.65rem",
              borderRadius: "0.5rem",
              backgroundColor: "#1A1614",
              border: "1px solid #3D322B",
              color: "#D4C4B5",
              textDecoration: "none"
            }}
          >
            <i className="bi bi-speedometer2 me-1"></i> Dashboard
          </a>
          <a
            href="/pos.html"
            style={{
              fontSize: "0.78rem",
              padding: "0.3rem 0.65rem",
              borderRadius: "0.5rem",
              backgroundColor: "#1A1614",
              border: "1px solid #3D322B",
              color: "#D4C4B5",
              textDecoration: "none"
            }}
          >
            <i className="bi bi-cart3 me-1"></i> POS
          </a>
          <a
            href="/orders.html"
            style={{
              fontSize: "0.78rem",
              padding: "0.3rem 0.65rem",
              borderRadius: "0.5rem",
              backgroundColor: "#1A1614",
              border: "1px solid #3D322B",
              color: "#D4C4B5",
              textDecoration: "none"
            }}
          >
            <i className="bi bi-receipt me-1"></i> Orders
          </a>
        </div>

        <div style={{ marginTop: "2rem", borderTop: "1px solid #3D322B", paddingTop: "1.25rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.75rem",
              color: "#9A8A7A"
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#2A9D8F",
                borderRadius: "50%",
                display: "inline-block"
              }}
            ></span>
            Firebase Auth • CC 106 Integrated
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
