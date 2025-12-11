import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-[#112d4e] px-6 md:px-16 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-white text-xl md:text-2xl font-extrabold">
          <span className="text-[#f6c344] mr-2">⚡ SIMATRO</span>
          <span className="font-semibold">TEKNIK ELEKTRO</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/events" className="bg-[#4f657e] hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium">Daftar Acara</Link>
        <Link to="/admin" className="bg-[#d62828] hover:bg-[#b81f1f] text-white px-4 py-2 rounded-lg text-sm font-medium">Admin Panel</Link>
      </div>
    </header>
  );
}
