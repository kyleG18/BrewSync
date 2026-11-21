import React from "react";
import ReactDOM from "react-dom/client";
import "./login/Login.css";
import "./components/ui/Button.css";
import "./components/ui/Input.css";
import "./components/ui/Select.css";
import "./components/ui/Badge.css";
import "./components/ui/Card.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("SW error:", err);
    });
  });
}
