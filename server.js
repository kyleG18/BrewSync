import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let inventoryItems = [
  {
    id: 1,
    itemName: "Premium Black Tea Leaves",
    category: "Tea Leaves",
    quantity: 12.5,
    unit: "kg",
    reorderLevel: 5.0,
    status: "In Stock"
  },
  {
    id: 2,
    itemName: "Fresh Milk (Full Cream)",
    category: "Dairy/Syrup",
    quantity: 8.0,
    unit: "liters",
    reorderLevel: 10.0,
    status: "Low Stock"
  },
  {
    id: 3,
    itemName: "Brown Sugar Syrup",
    category: "Dairy/Syrup",
    quantity: 1.2,
    unit: "liters",
    reorderLevel: 3.0,
    status: "Low Stock"
  },
  {
    id: 4,
    itemName: "Tapioca Pearls (Black)",
    category: "Toppings",
    quantity: 2.5,
    unit: "kg",
    reorderLevel: 5.0,
    status: "Low Stock"
  },
  {
    id: 5,
    itemName: "Matcha Powder (Premium)",
    category: "Tea Leaves",
    quantity: 150,
    unit: "g",
    reorderLevel: 200,
    status: "Low Stock"
  },
  {
    id: 6,
    itemName: "Taro Powder",
    category: "Tea Leaves",
    quantity: 3.2,
    unit: "kg",
    reorderLevel: 1.0,
    status: "In Stock"
  },
  {
    id: 7,
    itemName: "Strawberry Syrup",
    category: "Dairy/Syrup",
    quantity: 2.1,
    unit: "liters",
    reorderLevel: 3.0,
    status: "Low Stock"
  },
  {
    id: 8,
    itemName: "Plastic Cups (16oz)",
    category: "Packaging",
    quantity: 4,
    unit: "packs",
    reorderLevel: 5,
    status: "Low Stock"
  },
  {
    id: 9,
    itemName: "Boba Straws (12mm)",
    category: "Packaging",
    quantity: 12,
    unit: "packs",
    reorderLevel: 5,
    status: "In Stock"
  },
  {
    id: 10,
    itemName: "Jasmine Green Tea",
    category: "Tea Leaves",
    quantity: 4.8,
    unit: "kg",
    reorderLevel: 2.0,
    status: "In Stock"
  }
];

app.get("/api/inventory", (req, res) => {
  res.json(inventoryItems);
});

app.put("/api/inventory/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = inventoryItems.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  const updatedItem = {
    ...inventoryItems[itemIndex],
    ...req.body,
    id: id
  };

  inventoryItems[itemIndex] = updatedItem;
  res.json(updatedItem);
});

app.delete("/api/inventory/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = inventoryItems.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  inventoryItems = inventoryItems.filter((item) => item.id !== id);
  res.json({ message: "Item deleted successfully", id: id });
});

app.listen(PORT, () => {
  console.log(`BrewSync POS server running on port ${PORT}`);
});
