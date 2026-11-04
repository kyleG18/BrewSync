-- =============================================================================
-- BrewSync POS - Database Implementation Laboratory Activity
-- Database: brewsync_db
-- Purpose: Setup script for MySQL / Laragon (phpMyAdmin or HeidiSQL)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Task 2 — Database Creation
-- -----------------------------------------------------------------------------

-- Create the database if it does not already exist
CREATE DATABASE IF NOT EXISTS brewsync_db;

-- Select the database for subsequent operations
USE brewsync_db;

-- -----------------------------------------------------------------------------
-- Task 3 — Main Table Structure
-- -----------------------------------------------------------------------------

-- Drop table if it exists to ensure a clean setup (optional, for re-runs)
DROP TABLE IF EXISTS inventory_items;

-- Create the inventory_items table with the required schema
CREATE TABLE inventory_items (
    item_id       INT AUTO_INCREMENT PRIMARY KEY,
    item_name     VARCHAR(100) NOT NULL,
    category      VARCHAR(50) NOT NULL,
    quantity      DECIMAL(10, 2) NOT NULL,
    unit          VARCHAR(20) NOT NULL,
    reorder_level DECIMAL(10, 2) NOT NULL,
    status        VARCHAR(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Task 4 — INSERT Sample Data
-- -----------------------------------------------------------------------------

-- Insert 5 milktea raw material records
INSERT INTO inventory_items (item_name, category, quantity, unit, reorder_level, status) VALUES
('Premium Black Tea Leaves', 'Tea Leaves', 12.50, 'kg', 5.00, 'In Stock'),
('Fresh Milk (Full Cream)', 'Dairy/Syrup', 8.00, 'liters', 10.00, 'Low Stock'),
('Tapioca Pearls (Black)', 'Toppings', 2.50, 'kg', 5.00, 'Low Stock'),
('Brown Sugar Syrup', 'Dairy/Syrup', 1.20, 'liters', 3.00, 'Low Stock'),
('Cream Cheese Powder', 'Tea Leaves', 150.00, 'g', 200.00, 'Low Stock');

-- -----------------------------------------------------------------------------
-- Task 5 — SELECT Queries
-- -----------------------------------------------------------------------------

-- Query 1: Display all records
SELECT * FROM inventory_items;

-- Query 2: Display specific columns (item_name, quantity, unit)
SELECT item_name, quantity, unit FROM inventory_items;

-- Query 3: Search with WHERE condition for low stock (quantity <= reorder_level)
SELECT item_name, quantity, unit, reorder_level, status
FROM inventory_items
WHERE quantity <= reorder_level;

-- -----------------------------------------------------------------------------
-- Task 6 — UPDATE Operations
-- -----------------------------------------------------------------------------

-- Update 1: Restock Fresh Milk (item_id = 2)
UPDATE inventory_items
SET quantity = 25.00, status = 'In Stock'
WHERE item_id = 2;

-- Update 2: Adjust reorder level for Cream Cheese Powder (item_id = 5)
UPDATE inventory_items
SET reorder_level = 5.00
WHERE item_id = 5;

-- Verification SELECT query after updates
SELECT item_id, item_name, quantity, unit, reorder_level, status
FROM inventory_items
ORDER BY item_id;

-- -----------------------------------------------------------------------------
-- Task 7 — DELETE Operation
-- -----------------------------------------------------------------------------

-- Delete 1 record (item_id = 5, Cream Cheese Powder)
DELETE FROM inventory_items
WHERE item_id = 5;

-- Verification SELECT query after deletion
SELECT * FROM inventory_items
ORDER BY item_id;

-- =============================================================================
-- End of Setup Script
-- =============================================================================
