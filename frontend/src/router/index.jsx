// --- File: src/index.jsx (Router) ---

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import Home from "../pages/Home/Home";
import EventDetail from "../pages/Events/EventDetail/EventDetail";
import PendaftaranEvent from "../pages/Events/PendaftaranEvent/PendaftaranEvent"; 
import LoginAdmin from "../pages/Admin/LoginAdmin";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import CreateEvent from "../pages/Admin/CreateEvent";
import EventManagement from "../pages/Admin/EventManagement";
import CertificateTemplate from "../pages/Admin/CertificateTemplate";
import CertificatePage from "../pages/Certificate/CertificatePage";
import Riwayat from "../pages/Riwayat/Riwayat";
import StatusPage from "../pages/Status/StatusPage";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Halaman utama */}
                <Route path="/" element={<Home />} />

                {/* Detail Event */}
                <Route path="/events/:id" element={<ErrorBoundary><EventDetail /></ErrorBoundary>} />

                {/* Halaman Pendaftaran Event */}
                <Route path="/events/:id/register" element={<PendaftaranEvent />} /> 
                
                {/* 🔑 RUTE RIWAYAT PESERTA */}
                <Route path="/riwayat" element={<Riwayat />} />
                
                {/* Status & Absensi */}
                <Route path="/status" element={<StatusPage />} />

                {/* --- Rute Admin --- */}
                
                {/* Redirect /admin ke /admin/login */}
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

                {/* Halaman Login Admin */}
                <Route path="/admin/login" element={<LoginAdmin />} />

                {/* Halaman Dashboard Admin (Perlu Proteksi di App Nyata) */}
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />

                {/* Halaman Tambah Acara Baru */}
                <Route path="/admin/events/new" element={<CreateEvent />} />

                {/* Halaman Kelola Acara */}
                <Route path="/admin/events/:eventId/manage" element={<EventManagement />} />

                {/* Halaman Template Sertifikat */}
                <Route path="/admin/events/:eventId/certificate-template" element={<CertificateTemplate />} />
                
                {/* Halaman Sertifikat Peserta */}
                <Route path="/certificate/:certificateId" element={<CertificatePage />} />

                {/* Tambahkan rute admin lainnya di sini */}

            </Routes>
        </BrowserRouter>
    );
}