import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool = null;

export function getPool() {
  if (pool) return pool;

  if (process.env.DATABASE_URL) {
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined
    });
  } else {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "brewsync_db",
      waitForConnections: true,
      connectionLimit: 10,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined
    });
  }

  return pool;
}

export async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    const dbName = process.env.DB_NAME || "brewsync_db";
    try {
      const tempConn = await mysql.createConnection({
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined
      });
      await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      await tempConn.end();
    } catch (e) {
      console.warn("Could not auto-create database (it may already exist or MySQL not ready):", e.message);
    }
  }

  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      item_id INT AUTO_INCREMENT PRIMARY KEY,
      item_name VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      quantity DECIMAL(10, 2) NOT NULL,
      unit VARCHAR(20) NOT NULL,
      reorder_level DECIMAL(10, 2) NOT NULL,
      status VARCHAR(30) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  try {
    const [rows] = await db.query("SELECT COUNT(*) AS cnt FROM inventory_items");
    if (rows[0].cnt === 0) {
      await db.query(`
        INSERT INTO inventory_items (item_name, category, quantity, unit, reorder_level, status) VALUES
        ('Premium Black Tea Leaves', 'Tea Leaves', 12.50, 'kg', 5.00, 'In Stock'),
        ('Fresh Milk (Full Cream)', 'Dairy/Syrup', 8.00, 'liters', 10.00, 'Low Stock'),
        ('Tapioca Pearls (Black)', 'Toppings', 2.50, 'kg', 5.00, 'Low Stock'),
        ('Brown Sugar Syrup', 'Dairy/Syrup', 1.20, 'liters', 3.00, 'Low Stock'),
        ('Cream Cheese Powder', 'Tea Leaves', 150.00, 'g', 200.00, 'Low Stock')
      `);
      console.log("Seeded initial inventory items into database");
    }
  } catch (seedErr) {
    console.warn("Could not check/seed inventory items:", seedErr.message);
  }
}
