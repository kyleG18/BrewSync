import React, { useState } from "react";
import {
  Card,
  Input,
  Select,
  Button,
  Badge
} from "@/Components/ui";
import "./LoginPage.css";

const roles = [
  { value: "cashier", label: "Cashier / Front Desk" },
  { value: "inventory", label: "Inventory Manager" },
  { value: "admin", label: "System Administrator" }
];

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stationRole, setStationRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
        break;
      case "password":
        setPassword(value);
        if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
        break;
      case "stationRole":
        setStationRole(value);
        if (errors.stationRole)
          setErrors((prev) => ({ ...prev, stationRole: "" }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username / Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!stationRole) newErrors.stationRole = "Please select a role / station";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Login Payload:", {
        username: username.trim(),
        password,
        stationRole
      });
      alert("Login attempted. Check browser console for payload.");
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="brand-badge" aria-hidden="true">
          <i className="bi bi-cup-hot"></i>
          <div className="boba-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <h1 className="brand-title text-center">BrewSync POS</h1>
        <p className="brand-subtitle text-center">
          Point of Sale & Inventory Management System
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-floating position-relative">
            <Input
              type="email"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="username@brewsync.com"
              label="Username / Email"
              icon="bi bi-person-fill"
              required
              error={errors.username}
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          <div className="form-floating position-relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="••••••••"
              label="Password"
              icon="bi bi-lock-fill"
              required
              error={errors.password}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              ariaPressed={showPassword}
            >
              <i
                className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}
                id="toggleIcon"
              ></i>
            </button>
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div className="form-floating">
            <Select
              label="Role / Station"
              name="stationRole"
              value={stationRole}
              onChange={handleChange}
              options={roles}
              error={errors.stationRole}
            />
            {errors.stationRole && (
              <div className="invalid-feedback">{errors.stationRole}</div>
            )}
          </div>

          <div className="form-check d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
                name="remember"
              />
              <label className="form-check-label mb-0" htmlFor="remember">
                Remember me
              </label>
            </div>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="btn-login"
          >
            Log In
          </Button>
        </form>

        <div className="text-center mt-4">
          <Badge text="Sync Status: Online" variant="success" dot />
          <p className="version-text">
            BrewSync v1.0 • Offline-Ready System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
