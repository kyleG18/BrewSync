import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        dashboard: path.resolve(__dirname, "dashboard.html"),
        pos: path.resolve(__dirname, "pos.html"),
        orders: path.resolve(__dirname, "orders.html"),
        products: path.resolve(__dirname, "products.html"),
        reports: path.resolve(__dirname, "reports.html"),
        settings: path.resolve(__dirname, "settings.html"),
        login: path.resolve(__dirname, "login.html")
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
