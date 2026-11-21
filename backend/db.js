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
}
