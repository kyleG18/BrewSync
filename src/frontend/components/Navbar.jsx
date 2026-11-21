import React, { useState } from "react";
import Footer from "./Footer";

const Navbar = ({ user, onLogout, itemCount = 0, onAddClick, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "BS";

  return (
    <div className="app-wrapper">
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        id="sidebar"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-brand">
          <a href="/dashboard.html" className="brand-link">
            <div className="brand-icon">
              <i className="bi bi-cup-hot"></i>
            </div>
            <span className="brand-text">BrewSync POS</span>
          </a>
          <button
            className="sidebar-toggle d-lg-none"
            id="sidebarToggle"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="sidebar-nav" id="sidebarNav">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link" href="/dashboard.html">
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/pos.html">
                <i className="bi bi-cart3"></i>
                <span>Point of Sale</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/" aria-current="page">
                <i className="bi bi-box-seam"></i>
                <span>Inventory</span>
                <span className="badge bg-warning text-dark ms-auto">{itemCount}</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/orders.html">
                <i className="bi bi-receipt"></i>
                <span>Orders</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/products.html">
                <i className="bi bi-cup-straw"></i>
                <span>Products</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/reports.html">
                <i className="bi bi-graph-up"></i>
                <span>Reports</span>
              </a>
            </li>
            <li className="nav-item mt-3">
              <hr className="sidebar-divider" />
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/settings.html">
                <i className="bi bi-gear"></i>
                <span>Settings</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-danger"
                href="/login.html"
                onClick={(e) => {
                  if (onLogout) {
                    e.preventDefault();
                    onLogout();
                  }
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Sign Out</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="user-avatar-img"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="user-avatar">{initials}</div>
            )}
            <div className="user-details">
              <span className="user-name">{user?.displayName || "Cashier / Admin"}</span>
              <span className="user-role">{user?.email || "BrewSync Station"}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="d-flex align-items-center gap-2">
            <button
              className="sidebar-toggle d-lg-none"
              id="mobileSidebarToggle"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <div className="d-none d-sm-flex align-items-center gap-2">
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                <span className="pulse-dot me-1"></span> System Active
              </span>
            </div>
          </div>

          <div className="topbar-actions">
            <a href="/pos.html" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
              <i className="bi bi-cart3"></i>
              <span className="d-none d-sm-inline">Open POS</span>
            </a>
            {onAddClick && (
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                onClick={onAddClick}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Add Item</span>
              </button>
            )}
            <button
              className="btn btn-icon text-danger"
              title="Sign Out"
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </header>

        <main className="content" role="main">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Navbar;
