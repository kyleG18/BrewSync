import React from "react";
import ReactDOM from "react-dom/client";
import "./App/Main/LoginPage/LoginPage.css";
import "./Components/ui/Button.css";
import "./Components/ui/Input.css";
import "./Components/ui/Select.css";
import "./Components/ui/Badge.css";
import "./Components/ui/Card.css";
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
