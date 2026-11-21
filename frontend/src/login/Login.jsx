import React, { useState } from "react";
import "./Login.css";

const Login = ({ onLogin, onEmailLogin }) => {
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
    <div className="bs-login-shell">
      <aside className="bs-login-brand-panel">
        <div className="bs-brand-top">
          <div className="bs-brand-mark">
            <i className="bi bi-cup-hot"></i>
          </div>
          <span className="bs-brand-name">BrewSync</span>
        </div>

        <div className="bs-brand-copy">
          <h1>Store operations, unified.</h1>
          <p>
            Fast register checkout, real-time ingredient tracking, and shift reporting built for specialty tea and coffee counters.
          </p>
        </div>

      </aside>

      <main className="bs-login-form-panel">
        <div className="bs-login-card">
          <div className="bs-mobile-brand d-lg-none">
            <div className="bs-brand-mark small">
              <i className="bi bi-cup-hot"></i>
            </div>
            <span>BrewSync POS</span>
          </div>

          <div className="bs-login-header">
            <h2>Sign in to your station</h2>
            <p>Enter your credentials or continue with Google.</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="bs-email-form">
            <div className="bs-field">
              <label htmlFor="loginEmail">Email address</label>
              <input
                id="loginEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@brewsync.ph"
                autoComplete="email"
              />
            </div>

            <div className="bs-field">
              <label htmlFor="loginPassword">Password</label>
              <div className="bs-password-wrap">
                <input
                  id="loginPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="bs-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            {emailError && (
              <div className="bs-error-banner" role="alert">
                <i className="bi bi-exclamation-circle"></i>
                <span>{emailError}</span>
              </div>
            )}

            <button type="submit" className="bs-btn-submit">
              Sign in
            </button>
          </form>

          <div className="bs-divider">
            <span>or continue with</span>
          </div>

          <button
            onClick={onLogin}
            type="button"
            className="bs-btn-google"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
