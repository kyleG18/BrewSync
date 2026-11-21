import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "frontend"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend/src")
    }
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "frontend/index.html"),
        dashboard: path.resolve(__dirname, "frontend/dashboard.html"),
        pos: path.resolve(__dirname, "frontend/pos.html"),
        orders: path.resolve(__dirname, "frontend/orders.html"),
        products: path.resolve(__dirname, "frontend/products.html"),
        reports: path.resolve(__dirname, "frontend/reports.html"),
        settings: path.resolve(__dirname, "frontend/settings.html"),
        login: path.resolve(__dirname, "frontend/login.html")
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});
