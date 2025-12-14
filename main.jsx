// src/main.jsx (Versi yang sudah disesuaikan)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Pastikan path ini benar
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App /> {/* Render komponen App utama kita di sini */}
  </React.StrictMode>
);