// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Pastikan ini ada dan mengarah ke file CSS Anda
import App from './App.jsx'; // Pastikan mengarah ke App.jsx

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);