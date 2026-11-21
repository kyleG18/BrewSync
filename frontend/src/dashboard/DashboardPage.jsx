import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardPage = ({ user, onLogout }) => {
  const isAdmin = user?.role === "admin";
  const cachedInventory = (() => {
    try {
      return JSON.parse(localStorage.getItem("brewsync_inventory_v1") || "[]");
    } catch {
      return [];
    }
  })();

  const lowStockItems = cachedInventory.filter(
    (i) => i.status === "Low Stock" || Number(i.quantity) <= Number(i.reorderLevel)
  );

  return (
    <Navbar user={user} onLogout={onLogout} itemCount={cachedInventory.length || 14}>
      <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h1 className="page-title">
            {isAdmin ? "Admin Operations Dashboard" : "Staff Counter Dashboard"}
          </h1>
          <p className="page-subtitle">
            Welcome back, {user?.displayName || "Operator"}. Signed in as{" "}
            <strong className="text-uppercase">{user?.role || "staff"}</strong>.
          </p>
        </div>
        <div className="d-flex gap-2">
          <a href="/pos.html" className="btn btn-primary btn-sm">
            <i className="bi bi-cart3 me-1"></i> Launch POS
          </a>
          <Link to="/inventory" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-box-seam me-1"></i> Manage Stock
          </Link>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon bg-warning-subtle text-warning">
            <i className="bi bi-cash-stack"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Today's Sales</span>
            <h3 className="stat-value">₱14,250</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-success-subtle text-success">
            <i className="bi bi-receipt"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed Orders</span>
            <h3 className="stat-value">84</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-danger-subtle text-danger">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Low Stock Alerts</span>
            <h3 className="stat-value text-danger">{lowStockItems.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-info-subtle text-info">
            <i className="bi bi-shield-lock"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Access Level</span>
            <h3 className="stat-value text-uppercase">{user?.role || "staff"}</h3>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="card h-100" style={{ borderColor: "#E6E2DC", borderRadius: "12px" }}>
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Low Stock Ingredients</h5>
              <Link to="/inventory" className="btn btn-sm btn-link text-decoration-none">
                Open Inventory
              </Link>
            </div>
            <div className="card-body p-0">
              {lowStockItems.length === 0 ? (
                <p className="text-muted p-4 mb-0">All tracked ingredients are adequately stocked.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {lowStockItems.slice(0, 5).map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{item.itemName}</strong>
                        <div className="small text-muted">{item.category}</div>
                      </div>
                      <span className="status-badge danger">
                        <span className="badge-dot"></span>
                        {item.quantity} {item.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card h-100" style={{ borderColor: "#E6E2DC", borderRadius: "12px" }}>
            <div className="card-header bg-transparent">
              <h5 className="mb-0 fw-semibold">Quick Navigation</h5>
            </div>
            <div className="card-body d-flex flex-column gap-2">
              <Link to="/inventory" className="btn btn-outline-secondary text-start">
                <i className="bi bi-box-seam me-2"></i> Inventory CRUD Module
              </Link>
              <a href="/pos.html" className="btn btn-outline-secondary text-start">
                <i className="bi bi-cart3 me-2"></i> Cashier POS Register
              </a>
              <a href="/orders.html" className="btn btn-outline-secondary text-start">
                <i className="bi bi-receipt me-2"></i> Order History
              </a>
              <Link to="/profile" className="btn btn-outline-secondary text-start">
                <i className="bi bi-person-circle me-2"></i> Account &amp; Role Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className="btn btn-outline-secondary text-start">
                  <i className="bi bi-people me-2"></i> User &amp; Staff Management
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default DashboardPage;
