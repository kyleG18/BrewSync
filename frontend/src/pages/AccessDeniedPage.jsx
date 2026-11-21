import React from "react";
import { Link } from "react-router-dom";

const AccessDeniedPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F6F4F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <div
        className="card text-center p-4 p-md-5"
        style={{ maxWidth: 440, width: "100%", borderRadius: "12px", borderColor: "#E6E2DC" }}
      >
        <div
          className="mx-auto mb-3 d-flex align-items-center justify-content-center"
          style={{
            width: 56,
            height: 56,
            borderRadius: "12px",
            backgroundColor: "rgba(201, 59, 59, 0.1)",
            color: "#C93B3B",
            fontSize: "1.5rem"
          }}
        >
          <i className="bi bi-shield-x"></i>
        </div>
        <h2 className="fw-bold mb-2" style={{ color: "#181512" }}>Access Denied</h2>
        <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
          Your account role does not have permission to view this page. Contact an administrator if you need elevated access.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
