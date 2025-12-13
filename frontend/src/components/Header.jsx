import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-blue-900 px-6 md:px-16 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-white text-xl md:text-2xl font-extrabold">
          <span className="text-yellow-400 mr-2">⚡ SIMATRO</span>
          <span className="font-semibold">UNIVERSITAS LAMPUNG</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/events" className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Daftar Acara</Link>
        <Link to="/admin" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Admin Panel</Link>
      </div>
    </header>
  );
}
