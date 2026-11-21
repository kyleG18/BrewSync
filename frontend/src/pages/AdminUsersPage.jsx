import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { listAllUsers, updateUserRole } from "../services/authService";

const AdminUsersPage = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const list = await listAllUsers();
        setUsers(list);
      } catch (err) {
        setError("Could not load Firestore users. Ensure Firestore rules allow admin reads.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRoleChange = async (uid, nextRole) => {
    try {
      await updateUserRole(uid, nextRole);
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: nextRole } : u)));
    } catch (err) {
      alert("Failed to update role: " + err.message);
    }
  };

  return (
    <Navbar user={user} onLogout={onLogout}>
      <div className="page-header">
        <h1 className="page-title">User Role Management</h1>
        <p className="page-subtitle">Admin-only view to assign staff and administrator roles.</p>
      </div>

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive-container">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No users recorded in Firestore yet. Sign in with Google to create a profile.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.uid}>
                  <td className="fw-semibold">{u.displayName || "User"}</td>
                  <td>{u.email || "—"}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "bg-dark" : "bg-secondary"} text-uppercase`}>
                      {u.role || "staff"}
                    </span>
                  </td>
                  <td className="text-end">
                    <select
                      className="form-select form-select-sm d-inline-block w-auto"
                      value={u.role || "staff"}
                      onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                    >
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Navbar>
  );
};

export default AdminUsersPage;
