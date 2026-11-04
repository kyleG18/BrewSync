import React, { useState, useEffect } from "react";
import "./InventoryPage.css";

const InventoryPage = ({ user, onLogout }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory");
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setInventory((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const updatedPayload = {
      itemName: formData.get("itemName"),
      category: formData.get("category"),
      quantity: parseFloat(formData.get("quantity")),
      unit: formData.get("unit"),
      reorderLevel: parseFloat(formData.get("reorderLevel")),
      status: formData.get("status")
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/${editingItem.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPayload)
        }
      );

      if (response.ok) {
        const updatedItem = await response.json();
        setInventory((prev) =>
          prev.map((item) => (item.id === editingItem.id ? updatedItem : item))
        );
        setEditingItem(null);
      } else {
        alert("Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item.");
    }
  };

  if (loading) {
    return (
      <div className="inventory-loading">
        <div className="loader-spinner"></div>
        <p className="loading-text">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <div 
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar" role="navigation" aria-label="Main navigation">
        <div className="sidebar-brand">
          <a href="/dashboard.html" className="brand-link">
            <div className="brand-icon">
              <i className="bi bi-cup-hot"></i>
              <span className="boba-dots"><span></span><span></span><span></span></span>
            </div>
            <span className="brand-text">BrewSync POS</span>
          </a>
          <button 
            className="sidebar-toggle d-lg-none" 
            id="sidebarToggle" 
            aria-label="Toggle navigation" 
            aria-expanded={sidebarOpen}
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
                <span className="badge bg-warning text-dark ms-auto">{inventory.length}</span>
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
                <span>Logout</span>
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
                style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="user-avatar">
                {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : "JD"}
              </div>
            )}
            <div className="user-details">
              <span className="user-name">{user?.displayName || "John Doe"}</span>
              <span className="user-role">{user?.email || "Inventory Manager"}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <button 
            className="sidebar-toggle d-lg-none me-3" 
            id="mobileSidebarToggle" 
            aria-label="Open navigation" 
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <i className="bi bi-list"></i>
          </button>
          <div className="topbar-actions">
            <button className="btn btn-icon position-relative" aria-label="Notifications">
              <i className="bi bi-bell"></i>
              <span className="notification-badge">3</span>
            </button>
            <div className="dropdown">
              <button className="btn btn-icon dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown" aria-expanded="false">
                <div className="user-avatar-sm">JD</div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <h6 className="dropdown-header">Account</h6>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-person me-2"></i> Profile
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item text-danger" href="#">
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </header>

        <main className="content" role="main">
          <div className="page-header">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <h1 className="page-title">Inventory Management</h1>
                <p className="page-subtitle">
                  Track raw materials, stock levels, and reorder alerts
                </p>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 50 }}>ID</th>
                  <th className="d-none d-md-table-cell">Item Name</th>
                  <th>Category</th>
                  <th className="d-none d-sm-table-cell">Stock Quantity</th>
                  <th>Unit</th>
                  <th className="d-none d-md-table-cell">Reorder Level</th>
                  <th className="d-none d-lg-table-cell">Status</th>
                  <th style={{ width: 130 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong></td>
                    <td className="d-none d-md-table-cell">
                      <span className="item-name">{item.itemName}</span>
                    </td>
                    <td>{item.category}</td>
                    <td className="d-none d-sm-table-cell">{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td className="d-none d-md-table-cell">{item.reorderLevel}</td>
                    <td className="d-none d-lg-table-cell">
                      <span
                        className={`status-badge ${item.status === "Low Stock" ? "danger" : "success"}`}
                      >
                        <span className="badge-dot" aria-hidden="true"></span>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setEditingItem(item)}
                          title="Edit item"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                          title="Delete item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingItem && (
            <div className="edit-modal-overlay" onClick={() => setEditingItem(null)}>
              <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                <div className="edit-modal-header">
                  <h3>Edit Item</h3>
                  <button className="btn-close" onClick={() => setEditingItem(null)}>&times;</button>
                </div>
                <form onSubmit={handleUpdate} className="edit-form">
                  <div className="form-group">
                    <label>Item Name</label>
                    <input
                      type="text"
                      name="itemName"
                      defaultValue={editingItem.itemName}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={editingItem.category}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Stock Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        defaultValue={editingItem.quantity}
                        step="0.1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Unit</label>
                      <input
                        type="text"
                        name="unit"
                        defaultValue={editingItem.unit}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Reorder Level</label>
                      <input
                        type="number"
                        name="reorderLevel"
                        defaultValue={editingItem.reorderLevel}
                        step="0.1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select name="status" required>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setEditingItem(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <span className="text-muted small">BrewSync POS v1.0.0 • Offline-Ready System</span>
            <span className="text-muted small">Sync Status: <span className="text-success fw-bold">Online</span></span>
          </div>
        </footer>
      </div>

      <div className="sidebar-overlay d-lg-none" id="sidebarOverlay" aria-hidden="true"></div>
    </div>
  );
};

export default InventoryPage;
