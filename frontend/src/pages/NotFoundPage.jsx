import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
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
          className="fw-bold mb-2"
          style={{ fontSize: "3rem", color: "#B85D19", lineHeight: 1 }}
        >
          404
        </div>
        <h3 className="fw-bold mb-2" style={{ color: "#181512" }}>Page Not Found</h3>
        <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
          The page you requested does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
