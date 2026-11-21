import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import {
  listAllUsers,
  createUserProfile,
  updateUserProfile,
  updateUserRole,
  deleteUserProfile
} from "../services/authService";
import "./AdminUsersPage.css";

const AdminUsersPage = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPasswords, setShowPasswords] = useState(false);

  // Modals state
  const [addingUser, setAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    role: "staff",
    status: "Active",
    password: ""
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const list = await listAllUsers();
      setUsers(list);
    } catch (err) {
      console.warn("Error loading users:", err);
      showToast("Operating with local storage users", "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered and searched users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      const matchQuery =
        !q ||
        (u.displayName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q) ||
        (u.uid || "").toLowerCase().includes(q);

      const matchRole =
        roleFilter === "all" ||
        (roleFilter === "admin" && u.role === "admin") ||
        (roleFilter === "staff" && u.role !== "admin");

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "Active" && (u.status || "Active") === "Active") ||
        (statusFilter === "Inactive" && u.status === "Inactive");

      return matchQuery && matchRole && matchStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Statistics
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const staffCount = users.filter((u) => u.role !== "admin").length;
  const inactiveCount = users.filter((u) => u.status === "Inactive").length;
  const activeCount = totalCount - inactiveCount;

  // Handle Role Change
  const handleRoleChange = async (targetUid, nextRole) => {
    try {
      await updateUserRole(targetUid, nextRole);
      setUsers((prev) =>
        prev.map((u) => (u.uid === targetUid ? { ...u, role: nextRole } : u))
      );
      showToast(`User role updated to ${nextRole === "admin" ? "Administrator" : "Staff"}`);
    } catch (err) {
      alert("Failed to update role: " + err.message);
    }
  };

  // Toggle Active/Inactive status
  const handleToggleStatus = async (targetUser) => {
    const currentStatus = targetUser.status || "Active";
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";

    // Prevent deactivating own account
    if (targetUser.uid === user?.uid || targetUser.email === user?.email) {
      alert("You cannot deactivate your own currently active administrator account.");
      return;
    }

    try {
      await updateUserProfile(targetUser.uid, { status: nextStatus });
      setUsers((prev) =>
        prev.map((u) => (u.uid === targetUser.uid ? { ...u, status: nextStatus } : u))
      );
      showToast(
        `${targetUser.displayName || targetUser.email} is now ${nextStatus}`,
        nextStatus === "Active" ? "success" : "warning"
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      displayName: "",
      email: "",
      role: "staff",
      status: "Active",
      password: "staff" + Math.floor(100 + Math.random() * 900)
    });
    setFormError("");
    setAddingUser(true);
  };

  // Open Edit Modal
  const openEditModal = (targetUser) => {
    setFormData({
      displayName: targetUser.displayName || "",
      email: targetUser.email || "",
      role: targetUser.role || "staff",
      status: targetUser.status || "Active",
      password: targetUser.password || ""
    });
    setFormError("");
    setEditingUser(targetUser);
  };

  // Submit Add User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.displayName.trim()) {
      setFormError("Full Name is required.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("A valid email address is required.");
      return;
    }

    // Check email uniqueness
    const exists = users.some(
      (u) => u.email.toLowerCase() === formData.email.trim().toLowerCase()
    );
    if (exists) {
      setFormError("A user with this email address already exists.");
      return;
    }

    try {
      setSaving(true);
      const created = await createUserProfile({
        displayName: formData.displayName,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        password: formData.password || "staff123"
      });

      setUsers((prev) => [created, ...prev]);
      setAddingUser(false);
      showToast(`User ${created.displayName} created successfully!`);
    } catch (err) {
      setFormError("Failed to create user: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Submit Edit User
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError("");

    if (!formData.displayName.trim()) {
      setFormError("Full Name is required.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("A valid email address is required.");
      return;
    }

    // Check duplicate email against other users
    const exists = users.some(
      (u) =>
        u.uid !== editingUser.uid &&
        u.email.toLowerCase() === formData.email.trim().toLowerCase()
    );
    if (exists) {
      setFormError("Another account is already using this email address.");
      return;
    }

    try {
      setSaving(true);
      const updates = {
        displayName: formData.displayName.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        status: formData.status
      };
      if (formData.password.trim()) {
        updates.password = formData.password.trim();
      }

      await updateUserProfile(editingUser.uid, updates);
      setUsers((prev) =>
        prev.map((u) => (u.uid === editingUser.uid ? { ...u, ...updates } : u))
      );
      setEditingUser(null);
      showToast(`User ${formData.displayName} updated successfully!`);
    } catch (err) {
      setFormError("Failed to update user: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Submit Delete User
  const confirmDeleteUser = async () => {
    if (!deletingUser) return;

    if (deletingUser.uid === user?.uid || deletingUser.email === user?.email) {
      alert("You cannot delete your own active administrator account.");
      setDeletingUser(null);
      return;
    }

    try {
      setSaving(true);
      await deleteUserProfile(deletingUser.uid);
      setUsers((prev) => prev.filter((u) => u.uid !== deletingUser.uid));
      showToast(`User ${deletingUser.displayName || deletingUser.email} has been deleted.`, "warning");
      setDeletingUser(null);
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Export Users CSV
  const handleExportCSV = () => {
    const headers = ["UID", "Name", "Email", "Role", "Status", "Password_PIN", "Created_At", "Last_Login"];
    const rows = users.map((u) => [
      `"${u.uid || ""}"`,
      `"${(u.displayName || "").replace(/"/g, '""')}"`,
      `"${(u.email || "").replace(/"/g, '""')}"`,
      `"${u.role || "staff"}"`,
      `"${u.status || "Active"}"`,
      `"${u.password || "••••••"}"`,
      `"${u.createdAt || ""}"`,
      `"${u.lastLogin || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `brewsync_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("User roster exported to CSV");
  };

  // Copy text to clipboard
  const handleCopy = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard!`);
    }
  };

  return (
    <Navbar user={user} onLogout={onLogout}>
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i
            className={`bi ${
              toast.type === "success"
                ? "bi-check-circle-fill text-teal"
                : toast.type === "warning"
                ? "bi-exclamation-triangle-fill text-warning"
                : "bi-info-circle-fill"
            }`}
          ></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="page-title mb-0">User &amp; Staff Management</h1>
            <span className="sync-status-pill">
              <span className="pulse-dot"></span> Local &amp; Cloud Synced
            </span>
          </div>
          <p className="page-subtitle mb-0">
            Provision cashier credentials, assign administrator access, and monitor staff terminal status.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={handleExportCSV}
            title="Export roster as CSV"
          >
            <i className="bi bi-download"></i>
            <span>Export Roster</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            onClick={openAddModal}
          >
            <i className="bi bi-person-plus-fill"></i>
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-row mb-4">
        <div className="stat-card">
          <div className="stat-icon bg-info-subtle text-info">
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Accounts</span>
            <h3 className="stat-value">{totalCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-success-subtle text-success">
            <i className="bi bi-person-badge"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Staff</span>
            <h3 className="stat-value">{staffCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-dark-subtle text-dark">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Administrators</span>
            <h3 className="stat-value">{adminCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-warning-subtle text-warning">
            <i className="bi bi-pause-circle-fill"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Inactive / Paused</span>
            <h3 className={`stat-value ${inactiveCount > 0 ? "text-warning" : ""}`}>
              {inactiveCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="user-filter-bar">
        <div className="user-search-wrap">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="user-search-input"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="user-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <i className="bi bi-x-circle-fill"></i>
            </button>
          )}
        </div>

        <div className="user-filter-controls">
          <select
            className="user-select-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            aria-label="Filter by role"
          >
            <option value="all">All Roles ({totalCount})</option>
            <option value="admin">Admins Only ({adminCount})</option>
            <option value="staff">Staff Only ({staffCount})</option>
          </select>

          <select
            className="user-select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active ({activeCount})</option>
            <option value="Inactive">Inactive ({inactiveCount})</option>
          </select>

          <button
            type="button"
            className={`btn btn-sm ${showPasswords ? "btn-secondary" : "btn-outline-secondary"} d-flex align-items-center gap-1`}
            onClick={() => setShowPasswords(!showPasswords)}
            title="Toggle showing terminal PINs/passwords"
          >
            <i className={`bi ${showPasswords ? "bi-eye-slash" : "bi-eye"}`}></i>
            <span className="d-none d-md-inline">{showPasswords ? "Hide PINs" : "Show PINs"}</span>
          </button>

          {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
              title="Reset all filters"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
            </button>
          )}
        </div>
      </div>

      {/* Users Table Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
          <span className="fw-semibold text-secondary small text-uppercase letter-spacing">
            Accounts &amp; Credentials ({filteredUsers.length} of {totalCount})
          </span>
          <span className="text-muted small">
            Tip: Click a status badge to quickly toggle active/paused access.
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "240px" }}>Staff Member</th>
                <th>Email Address</th>
                <th style={{ width: "150px" }}>Role</th>
                <th style={{ width: "120px" }}>Status</th>
                <th style={{ width: "160px" }}>Terminal PIN</th>
                <th className="d-none d-lg-table-cell" style={{ width: "140px" }}>Last Activity</th>
                <th className="text-end" style={{ width: "140px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading registered users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <i className="bi bi-person-x fs-1 d-block mb-2 text-secondary"></i>
                    No users match your active search or filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.uid === user?.uid || u.email === user?.email;
                  const isAdminRole = u.role === "admin";
                  const isActive = (u.status || "Active") === "Active";
                  const initials = (u.displayName || u.email || "U")
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={u.uid}>
                      {/* Name & Avatar */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className={`user-avatar-circle ${isAdminRole ? "role-admin" : "role-staff"}`}
                            title={`${u.displayName} (${u.role})`}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="user-meta-name">
                              <span>{u.displayName || "Counter Operator"}</span>
                              {isCurrent && (
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-1 py-0" style={{ fontSize: "0.68rem" }}>
                                  You
                                </span>
                              )}
                            </div>
                            <span className="user-meta-sub">{u.uid}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <span className="text-secondary">{u.email || "—"}</span>
                          {u.email && (
                            <button
                              type="button"
                              className="btn-icon-copy"
                              onClick={() => handleCopy(u.email, "email")}
                              title="Copy email address"
                            >
                              <i className="bi bi-clipboard"></i>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* System Role */}
                      <td>
                        <select
                          className={`user-role-select ${isAdminRole ? "is-admin" : "is-staff"}`}
                          value={u.role || "staff"}
                          onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                          aria-label={`Change role for ${u.displayName}`}
                        >
                          <option value="staff">Staff (POS &amp; Orders)</option>
                          <option value="admin">Administrator (Full Access)</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td>
                        <button
                          type="button"
                          className={`status-pill-btn ${isActive ? "active" : "inactive"}`}
                          onClick={() => handleToggleStatus(u)}
                          title={`Click to ${isActive ? "deactivate" : "activate"} user`}
                        >
                          <span className="status-dot"></span>
                          <span>{isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Terminal PIN */}
                      <td>
                        <div className="pin-code-badge">
                          <span>
                            {showPasswords
                              ? u.password || "staff123"
                              : "••••••••"}
                          </span>
                          <button
                            type="button"
                            className="btn-icon-copy"
                            onClick={() => handleCopy(u.password || "staff123", "password")}
                            title="Copy PIN / Password"
                          >
                            <i className="bi bi-copy"></i>
                          </button>
                        </div>
                      </td>

                      {/* Last Activity */}
                      <td className="d-none d-lg-table-cell">
                        <span className="text-muted small">
                          {u.lastLogin || "Never"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => openEditModal(u)}
                            title="Edit user details"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            type="button"
                            className={`btn ${isActive ? "btn-outline-warning" : "btn-outline-success"}`}
                            onClick={() => handleToggleStatus(u)}
                            title={isActive ? "Deactivate account" : "Activate account"}
                            disabled={isCurrent}
                          >
                            <i className={`bi ${isActive ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => setDeletingUser(u)}
                            disabled={isCurrent}
                            title={isCurrent ? "Cannot delete your own account" : "Delete account"}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL */}
      {addingUser && (
        <div className="admin-modal-overlay" onClick={() => setAddingUser(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <i className="bi bi-person-plus-fill text-primary"></i>
                Add New Staff / Admin
              </h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setAddingUser(false)}
                aria-label="Close modal"
              ></button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="admin-modal-body">
                {formError && (
                  <div className="alert alert-danger py-2 small mb-3" role="alert">
                    <i className="bi bi-exclamation-circle me-1"></i> {formError}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Maria Clara Santos"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. maria@brewsync.ph"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <div className="form-text small">
                    This email is used to log in at the POS and Admin stations.
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">
                      System Role <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="staff">Staff / Cashier</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">
                      Account Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active (Permitted)</option>
                      <option value="Inactive">Inactive (Suspended)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Access Password / Terminal PIN <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control font-monospace"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="e.g. staff123"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          password: "bs" + Math.floor(1000 + Math.random() * 9000)
                        })
                      }
                      title="Generate random PIN"
                    >
                      <i className="bi bi-shuffle"></i>
                    </button>
                  </div>
                  <div className="form-text small">
                    Default is ready for immediate counter checkout sign-in.
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setAddingUser(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg"></i>
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="admin-modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <i className="bi bi-pencil-square text-primary"></i>
                Edit Account: {editingUser.displayName || editingUser.email}
              </h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setEditingUser(null)}
                aria-label="Close modal"
              ></button>
            </div>

            <form onSubmit={handleUpdateUser}>
              <div className="admin-modal-body">
                {formError && (
                  <div className="alert alert-danger py-2 small mb-3" role="alert">
                    <i className="bi bi-exclamation-circle me-1"></i> {formError}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="staff">Staff / Cashier</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      disabled={editingUser.uid === user?.uid}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive (Suspended)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Reset Password / Terminal PIN
                  </label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave unchanged or enter new PIN"
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-1"></i>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="admin-modal-overlay" onClick={() => setDeletingUser(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header border-danger-subtle">
              <h3 className="admin-modal-title text-danger">
                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                Confirm User Deletion
              </h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setDeletingUser(null)}
                aria-label="Close modal"
              ></button>
            </div>

            <div className="admin-modal-body">
              <p className="mb-2">
                Are you sure you want to permanently delete user account:
              </p>
              <div className="p-3 bg-light rounded-3 border mb-3">
                <div className="fw-bold">{deletingUser.displayName || "User"}</div>
                <div className="text-secondary small">{deletingUser.email}</div>
                <div className="badge bg-secondary-subtle text-secondary text-uppercase mt-1">
                  {deletingUser.role || "staff"}
                </div>
              </div>
              <p className="text-danger small mb-0">
                This will revoke all counter terminal access and delete the user credentials.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDeletingUser(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                onClick={confirmDeleteUser}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash me-1"></i>
                    <span>Delete User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Navbar>
  );
};

export default AdminUsersPage;
