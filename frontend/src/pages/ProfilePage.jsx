import React from "react";
import Navbar from "../components/Navbar";

const ProfilePage = ({ user, onLogout }) => {
  return (
    <Navbar user={user} onLogout={onLogout}>
      <div className="page-header">
        <h1 className="page-title">User Profile</h1>
        <p className="page-subtitle">Account details and assigned role permissions.</p>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-7 col-lg-6">
          <div className="card" style={{ borderColor: "#E6E2DC", borderRadius: "12px" }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      backgroundColor: "#B85D19",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.35rem",
                      fontWeight: 700
                    }}
                  >
                    {(user?.displayName || "BS").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="mb-1 fw-bold">{user?.displayName || "Operator"}</h4>
                  <span className="badge bg-dark text-uppercase">{user?.role || "staff"}</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Email</label>
                <div className="fw-medium">{user?.email || "—"}</div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">User ID</label>
                <div className="small font-monospace text-secondary">{user?.uid || "demo-session"}</div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small">Permissions</label>
                <div className="small text-secondary">
                  {user?.role === "admin"
                    ? "Full access: Create, Edit, and Delete inventory, plus User Role Management."
                    : "Standard staff access: View POS, Orders, and update existing stock counts. Admin routes restricted."}
                </div>
              </div>

              <button type="button" className="btn btn-outline-danger btn-sm" onClick={onLogout}>
                <i className="bi bi-box-arrow-right me-1"></i> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ProfilePage;
