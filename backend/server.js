import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPool, initDatabase } from "./db.js";
import { verifyToken, requireRole } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
  : "*";

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

function mapRow(row) {
  return {
    id: row.item_id,
    itemName: row.item_name,
    category: row.category,
    quantity: Number(row.quantity),
    unit: row.unit,
    reorderLevel: Number(row.reorder_level),
    status: row.status
  };
}

app.get("/api/health", async (req, res) => {
  try {
    const db = getPool();
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected", timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: "degraded", database: "disconnected", error: err.message });
  }
});

app.get("/api/inventory", async (req, res, next) => {
  try {
    const db = getPool();
    const [rows] = await db.query("SELECT * FROM inventory_items ORDER BY item_id DESC");
    res.json(rows.map(mapRow));
  } catch (err) {
    next(err);
  }
});

app.post("/api/inventory", verifyToken, requireRole("admin"), async (req, res, next) => {
  try {
    const { itemName, category, quantity, unit, reorderLevel, status } = req.body;
    if (!itemName || !category || quantity === undefined || !unit) {
      return res.status(400).json({ error: "itemName, category, quantity, and unit are required." });
    }

    const qty = Number(quantity) || 0;
    const reorder = Number(reorderLevel) || 0;
    const computedStatus = status || (qty <= reorder ? "Low Stock" : "In Stock");

    const db = getPool();
    const [result] = await db.query(
      "INSERT INTO inventory_items (item_name, category, quantity, unit, reorder_level, status) VALUES (?, ?, ?, ?, ?, ?)",
      [itemName.trim(), category.trim(), qty, unit.trim(), reorder, computedStatus]
    );

    const [created] = await db.query("SELECT * FROM inventory_items WHERE item_id = ?", [result.insertId]);
    res.status(201).json(mapRow(created[0]));
  } catch (err) {
    next(err);
  }
});

app.put("/api/inventory/:id", verifyToken, requireRole("admin", "staff"), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { itemName, category, quantity, unit, reorderLevel, status } = req.body;

    const db = getPool();
    const [existing] = await db.query("SELECT * FROM inventory_items WHERE item_id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Item not found." });
    }

    const cur = existing[0];
    const nextName = itemName ? itemName.trim() : cur.item_name;
    const nextCat = category ? category.trim() : cur.category;
    const nextQty = quantity !== undefined ? Number(quantity) : Number(cur.quantity);
    const nextUnit = unit ? unit.trim() : cur.unit;
    const nextReorder = reorderLevel !== undefined ? Number(reorderLevel) : Number(cur.reorder_level);
    const nextStatus = status || (nextQty <= nextReorder ? "Low Stock" : "In Stock");

    await db.query(
      "UPDATE inventory_items SET item_name = ?, category = ?, quantity = ?, unit = ?, reorder_level = ?, status = ? WHERE item_id = ?",
      [nextName, nextCat, nextQty, nextUnit, nextReorder, nextStatus, id]
    );

    const [updated] = await db.query("SELECT * FROM inventory_items WHERE item_id = ?", [id]);
    res.json(mapRow(updated[0]));
  } catch (err) {
    next(err);
  }
});

app.delete("/api/inventory/:id", verifyToken, requireRole("admin"), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const db = getPool();
    const [result] = await db.query("DELETE FROM inventory_items WHERE item_id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found." });
    }
    res.json({ message: "Item deleted successfully", id });
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "API route not found." });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

initDatabase()
  .then(() => console.log("MySQL schema verified"))
  .catch((err) => console.warn("MySQL init skipped:", err.message));

app.listen(PORT, () => {
  console.log(`BrewSync API server running on port ${PORT}`);
});
