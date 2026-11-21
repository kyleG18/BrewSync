import React from "react";
import ReactDOM from "react-dom/client";
import "./frontend/login/Login.css";
import "./frontend/components/ui/Button.css";
import "./frontend/components/ui/Input.css";
import "./frontend/components/ui/Select.css";
import "./frontend/components/ui/Badge.css";
import "./frontend/components/ui/Card.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import App from "./frontend/App";

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
