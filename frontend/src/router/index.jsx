// --- File: src/index.jsx (Router) ---

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import Home from "../pages/Home/Home";
import EventDetail from "../pages/Events/EventDetail/EventDetail";
import PendaftaranEvent from "../pages/Events/PendaftaranEvent/PendaftaranEvent"; 
import LoginAdmin from "../pages/Admin/LoginAdmin";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import Riwayat from "../pages/Riwayat/Riwayat"; // ⬅️ IMPORT KOMPONEN RIWAYAT

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Halaman utama */}
                <Route path="/" element={<Home />} />

                {/* Detail Event */}
                <Route path="/events/:id" element={<EventDetail />} />

                {/* Halaman Pendaftaran Event */}
                <Route path="/events/:id/register" element={<PendaftaranEvent />} /> 
                
                {/* 🔑 RUTE RIWAYAT PESERTA */}
                <Route path="/riwayat" element={<Riwayat />} />

                {/* --- Rute Admin --- */}
                
                {/* Redirect /admin ke /admin/login */}
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

                {/* Halaman Login Admin */}
                <Route path="/admin/login" element={<LoginAdmin />} />

                {/* Halaman Dashboard Admin (Perlu Proteksi di App Nyata) */}
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />

                {/* Tambahkan rute admin lainnya di sini */}

            </Routes>
        </BrowserRouter>
    );
}