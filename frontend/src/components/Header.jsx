import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="header-logo">
          <span className="simatro">⚡ SIMATRO</span> TEKNIK ELEKTRO
        </h1>
      </div>

      <div className="header-right">
        <Link to="/events" className="btn-event">Daftar Acara</Link>
        <Link to="/admin" className="btn-admin">Admin Panel</Link>
      </div>
    </header>
  );
}
