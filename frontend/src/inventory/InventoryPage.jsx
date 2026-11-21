import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import { API_BASE_URL, getAuthHeaders } from "../services/authService";
import "./InventoryPage.css";

const DEFAULT_INVENTORY = [
  { id: 1, itemName: "Tapioca Boba Pearls", category: "Toppings", quantity: 18.5, unit: "kg", reorderLevel: 10, status: "In Stock" },
  { id: 2, itemName: "Brown Sugar Syrup", category: "Syrups", quantity: 6.2, unit: "L", reorderLevel: 10, status: "Low Stock" },
  { id: 3, itemName: "Ceylon Black Tea Leaves", category: "Tea & Leaves", quantity: 24.0, unit: "kg", reorderLevel: 5, status: "In Stock" },
  { id: 4, itemName: "Jasmine Green Tea Leaves", category: "Tea & Leaves", quantity: 16.5, unit: "kg", reorderLevel: 5, status: "In Stock" },
  { id: 5, itemName: "Fresh Whole Milk", category: "Dairy", quantity: 32.0, unit: "L", reorderLevel: 15, status: "In Stock" },
  { id: 6, itemName: "Premium Taro Powder", category: "Powders", quantity: 4.0, unit: "kg", reorderLevel: 6, status: "Low Stock" },
  { id: 7, itemName: "Japanese Matcha Powder", category: "Powders", quantity: 3.5, unit: "kg", reorderLevel: 2, status: "In Stock" },
  { id: 8, itemName: "Cheese Foam Powder", category: "Powders", quantity: 5.5, unit: "kg", reorderLevel: 3, status: "In Stock" },
  { id: 9, itemName: "16oz PP Boba Cups", category: "Packaging", quantity: 1450, unit: "pcs", reorderLevel: 500, status: "In Stock" },
  { id: 10, itemName: "22oz PP Boba Cups", category: "Packaging", quantity: 820, unit: "pcs", reorderLevel: 500, status: "In Stock" },
  { id: 11, itemName: "Individually Wrapped Boba Straws", category: "Packaging", quantity: 2400, unit: "pcs", reorderLevel: 800, status: "In Stock" },
  { id: 12, itemName: "Cup Sealing Film Rolls", category: "Packaging", quantity: 2, unit: "rolls", reorderLevel: 5, status: "Low Stock" },
  { id: 13, itemName: "Popping Boba (Mango)", category: "Toppings", quantity: 8.0, unit: "kg", reorderLevel: 4, status: "In Stock" },
  { id: 14, itemName: "Herbal Grass Jelly", category: "Toppings", quantity: 12.0, unit: "kg", reorderLevel: 5, status: "In Stock" }
];

const STORAGE_KEY = "brewsync_inventory_v1";

const InventoryPage = ({ user, onLogout }) => {
  const isAdmin = user?.role === "admin";
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [addingItem, setAddingItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/inventory`, {
          headers,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setInventory(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            setLoading(false);
            return;
          }
        }
      } catch (_) {
        // fallback to local cache when backend is offline
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInventory(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Failed to parse cached inventory:", e);
        }
      }

      setInventory(DEFAULT_INVENTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INVENTORY));
      setLoading(false);
    };

    loadData();
  }, []);

  const persistInventory = (updated) => {
    setInventory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    const target = inventory.find((i) => i.id === id);
    if (!window.confirm(`Delete "${target?.itemName || "this item"}" from inventory?`)) {
      return;
    }

    const updated = inventory.filter((item) => item.id !== id);
    persistInventory(updated);
    showToast(`Deleted ${target?.itemName || "item"} successfully.`);

    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/api/inventory/${id}`, { method: "DELETE", headers });
    } catch (_) {}
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const qty = parseFloat(formData.get("quantity")) || 0;
    const reorder = parseFloat(formData.get("reorderLevel")) || 0;
    const updatedPayload = {
      ...editingItem,
      itemName: formData.get("itemName").trim(),
      category: formData.get("category").trim(),
      quantity: qty,
      unit: formData.get("unit").trim(),
      reorderLevel: reorder,
      status: qty <= reorder ? "Low Stock" : formData.get("status")
    };

    const updated = inventory.map((item) =>
      item.id === editingItem.id ? updatedPayload : item
    );
    persistInventory(updated);
    setEditingItem(null);
    showToast(`Updated "${updatedPayload.itemName}"`);

    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/api/inventory/${editingItem.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedPayload)
      });
    } catch (_) {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const formData = new FormData(e.target);
    const qty = parseFloat(formData.get("quantity")) || 0;
    const reorder = parseFloat(formData.get("reorderLevel")) || 0;
    const newItem = {
      id: inventory.length ? Math.max(...inventory.map((i) => Number(i.id) || 0)) + 1 : 1,
      itemName: formData.get("itemName").trim(),
      category: formData.get("category").trim(),
      quantity: qty,
      unit: formData.get("unit").trim(),
      reorderLevel: reorder,
      status: qty <= reorder ? "Low Stock" : (formData.get("status") || "In Stock")
    };

    setAddingItem(false);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: "POST",
        headers,
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        const createdItem = await res.json();
        persistInventory([createdItem, ...inventory]);
        showToast(`Added "${createdItem.itemName}" to database!`);
        return;
      }
    } catch (_) {}

    persistInventory([newItem, ...inventory]);
    showToast(`Added "${newItem.itemName}" locally (offline mode).`);
  };

  const categories = useMemo(() => {
    const set = new Set(inventory.map((i) => i.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchSearch =
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchStatus = selectedStatus === "All" || item.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [inventory, searchQuery, selectedCategory, selectedStatus]);

  const stats = useMemo(() => {
    const total = inventory.length;
    const lowStock = inventory.filter((i) => i.status === "Low Stock" || i.quantity <= i.reorderLevel).length;
    const inStock = total - lowStock;
    const catCount = new Set(inventory.map((i) => i.category)).size;
    return { total, lowStock, inStock, catCount };
  }, [inventory]);

  if (loading) {
    return (
      <div className="inventory-loading">
        <div className="loader-spinner"></div>
        <p className="loading-text">Loading BrewSync inventory...</p>
      </div>
    );
  }

  return (
    <Navbar
      user={user}
      onLogout={onLogout}
      itemCount={inventory.length}
      onAddClick={() => setAddingItem(true)}
    >
      {toastMessage && (
        <div className="inventory-toast" role="alert">
          <i className="bi bi-check-circle-fill text-warning me-2"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">
            Track ingredients, tea leaves, syrups, and packaging supplies with real-time stock alerts.
          </p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon bg-warning-subtle text-warning">
            <i className="bi bi-box-seam"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Stock Items</span>
            <h3 className="stat-value">{stats.total}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-danger-subtle text-danger">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Low Stock Alerts</span>
            <h3 className="stat-value text-danger">{stats.lowStock}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-success-subtle text-success">
            <i className="bi bi-check2-circle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">In Stock Healthy</span>
            <h3 className="stat-value text-success">{stats.inStock}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-info-subtle text-info">
            <i className="bi bi-tags"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Categories</span>
            <h3 className="stat-value">{stats.catCount}</h3>
          </div>
        </div>
      </div>

      <div className="inventory-controls-card">
        <div className="controls-row">
          <div className="search-input-wrap">
            <i className="bi bi-search"></i>
            <input
              type="search"
              className="search-input"
              placeholder="Search raw materials, syrups, cups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                &times;
              </button>
            )}
          </div>

          <div className="filter-selects">
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock Alert</option>
            </select>

            <div className="view-mode-toggle d-none d-md-flex">
              <button
                className={`view-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
                title="Table View"
              >
                <i className="bi bi-list-ul"></i>
              </button>
              <button
                className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
                onClick={() => setViewMode("cards")}
                title="Grid Cards View"
              >
                <i className="bi bi-grid"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="category-chips-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-secondary small">
          Showing <strong>{filteredInventory.length}</strong> of {inventory.length} items
        </span>
        {(searchQuery || selectedCategory !== "All" || selectedStatus !== "All") && (
          <button
            className="btn btn-sm btn-link text-warning p-0 text-decoration-none"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedStatus("All");
            }}
          >
            Reset filters
          </button>
        )}
      </div>

      {filteredInventory.length === 0 ? (
        <div className="empty-state-card">
          <i className="bi bi-inbox fs-1 text-muted mb-2"></i>
          <h5 className="text-primary mb-1">No matching inventory items</h5>
          <p className="text-muted small mb-3">Try adjusting your search query or filters.</p>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedStatus("All");
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === "cards" ? (
        <div className="inventory-cards-grid">
          {filteredInventory.map((item) => (
            <div key={item.id} className="inv-card">
              <div className="inv-card-header">
                <div>
                  <span className="inv-card-category">{item.category}</span>
                  <h4 className="inv-card-title">{item.itemName}</h4>
                </div>
                <span className={`status-badge ${item.status === "Low Stock" ? "danger" : "success"}`}>
                  <span className="badge-dot"></span>
                  {item.status}
                </span>
              </div>
              <div className="inv-card-body">
                <div className="inv-metric">
                  <span className="inv-metric-label">Current Stock</span>
                  <span className="inv-metric-val">
                    {item.quantity} <small className="text-muted">{item.unit}</small>
                  </span>
                </div>
                <div className="inv-metric">
                  <span className="inv-metric-label">Reorder Level</span>
                  <span className="inv-metric-val">
                    {item.reorderLevel} <small className="text-muted">{item.unit}</small>
                  </span>
                </div>
              </div>
              <div className="inv-card-footer">
                <button
                  className="btn btn-outline-secondary btn-sm flex-fill"
                  onClick={() => setEditingItem(item)}
                >
                  <i className="bi bi-pencil me-1"></i> Edit
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-responsive-container">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Item & Category</th>
                <th className="text-center">Current Stock</th>
                <th className="d-none d-md-table-cell text-center">Reorder Level</th>
                <th>Status</th>
                <th className="text-end" style={{ minWidth: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="item-icon-circle">
                        <i className="bi bi-box"></i>
                      </div>
                      <div>
                        <div className="item-name-text">{item.itemName}</div>
                        <span className="item-cat-tag">{item.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="stock-qty-text">{item.quantity}</span>
                    <span className="stock-unit-text"> {item.unit}</span>
                  </td>
                  <td className="d-none d-md-table-cell text-center text-muted">
                    {item.reorderLevel} {item.unit}
                  </td>
                  <td>
                    <span className={`status-badge ${item.status === "Low Stock" ? "danger" : "success"}`}>
                      <span className="badge-dot" aria-hidden="true"></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-1">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setEditingItem(item)}
                        title="Edit item"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      {isAdmin && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                          title="Delete item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingItem && (
        <div className="edit-modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3>Edit Inventory Item</h3>
              <button className="btn-close" onClick={() => setEditingItem(null)}>&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="edit-form">
              <div className="form-group">
                <label>Item Name</label>
                <input type="text" name="itemName" defaultValue={editingItem.itemName} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input type="text" name="category" defaultValue={editingItem.category} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input type="number" name="quantity" defaultValue={editingItem.quantity} step="0.1" required />
                </div>
                <div className="form-group">
                  <label>Unit (kg, L, pcs, etc.)</label>
                  <input type="text" name="unit" defaultValue={editingItem.unit} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Reorder Alert Level</label>
                  <input type="number" name="reorderLevel" defaultValue={editingItem.reorderLevel} step="0.1" required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" defaultValue={editingItem.status}>
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

      {addingItem && (
        <div className="edit-modal-overlay" onClick={() => setAddingItem(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3>Add New Inventory Item</h3>
              <button className="btn-close" onClick={() => setAddingItem(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreate} className="edit-form">
              <div className="form-group">
                <label>Item Name</label>
                <input type="text" name="itemName" placeholder="e.g. Honey Peach Syrup" required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input type="text" name="category" placeholder="e.g. Syrups, Tea, Toppings" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Initial Stock Quantity</label>
                  <input type="number" name="quantity" placeholder="10" step="0.1" required />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input type="text" name="unit" placeholder="kg, L, pcs" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Reorder Alert Level</label>
                  <input type="number" name="reorderLevel" placeholder="5" step="0.1" required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status">
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setAddingItem(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Navbar>
  );
};

export default InventoryPage;
