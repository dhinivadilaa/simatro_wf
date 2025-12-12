import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";

// Event Card Component with Statistics
const EventCardAdmin = ({ event, onDelete }) => {
    // Calculate statistics from event data
    const totalParticipants = event.participants_count || 0;
    const attendedCount = event.attendances_count || 0;
    const certificateCount = event.certificates_count || 0;

    return (
        <div className="bg-white border-l-4 border-l-blue-500 rounded-lg shadow-md p-6 mb-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold mb-2">
                        ID: {event.id}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold">
                    Aktif & Publik
                </span>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200 text-sm">
                <div>
                    <p className="text-gray-600 font-medium">Tanggal</p>
                    <p className="text-gray-900 font-semibold">{event.date || '-'}</p>
                </div>
                <div>
                    <p className="text-gray-600 font-medium">Waktu Absensi</p>
                    <p className="text-red-600 font-semibold">{event.absent_deadline || '-'}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <p className="text-gray-600 font-medium">Peserta</p>
                    <p className="text-gray-900 font-bold text-lg">{attendedCount} / {totalParticipants}</p>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
                    <p className="text-xs text-gray-600">Total Peserta</p>
                    <p className="text-2xl font-bold text-blue-600">{totalParticipants}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
                    <p className="text-xs text-gray-600">Hadir</p>
                    <p className="text-2xl font-bold text-green-600">{attendedCount}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
                    <p className="text-xs text-gray-600">Sertifikat</p>
                    <p className="text-2xl font-bold text-amber-600">{certificateCount}</p>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded p-3 text-center">
                    <p className="text-xs text-gray-600">Tidak Hadir</p>
                    <p className="text-2xl font-bold text-gray-700">{Math.max(0, totalParticipants - attendedCount)}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                <Link to={`/admin/events/${event.id}/manage`} className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded transition">
                    Kelola Acara
                </Link>
            </div>
        </div>
    );
};

export default function DashboardAdmin() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Set Authorization header from localStorage if available
        const token = localStorage.getItem('adminAuthToken');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        api.get("/admin/events")
            .then((res) => {
                const list = Array.isArray(res.data.data) ? res.data.data : [];
                setEvents(list);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching admin events:", err);
                setLoading(false);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminAuthToken");
        delete api.defaults.headers.common["Authorization"];
        navigate("/admin/login");
    };

    const deleteEvent = async (eventId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus acara ini?")) {
            try {
                await api.delete(`/events/${eventId}`);
                setEvents(events.filter(event => event.id !== eventId));
                alert("Acara berhasil dihapus!");
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Gagal menghapus acara. Silakan coba lagi.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header Navigation */}
            <header className="bg-blue-900 text-white px-6 py-4 shadow-lg">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold">
                        <span className="text-yellow-400">⚡SIMATRO ADMIN</span> <span className="text-sm">TEKNIK ELEKTRO</span>
                    </h1>
                    <div className="flex gap-4 items-center">
                        <button className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-sm font-semibold transition">
                            Dashboard
                        </button>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold transition">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 md:px-12 py-8">
                {/* Page Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Event Manager SIMATRO</h2>

                {/* Manajemen Acara Section */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Manajemen Acara</h3>
                    <p className="text-gray-700 text-sm mb-4">
                        Mulai acara baru, atur konfigurasi batas waktu absensi, dan kelola daftar acara yang sedang aktif.
                    </p>
                    <Link to="/admin/events/new" className="inline-block px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded transition">
                        + Tambah Acara Baru
                    </Link>
                </div>

                {/* Active Events Section */}
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Acara Aktif (Real-Time)</h3>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Memuat acara...</p>
                    </div>
                ) : events.length > 0 ? (
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        {events.map(event => (
                            <EventCardAdmin key={event.id} event={event} onDelete={deleteEvent} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg p-8 text-center shadow-md">
                        <p className="text-gray-500">Tidak ada acara yang aktif saat ini</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-blue-900 text-white text-center py-4 text-sm">
                © 2025 SIMATRO Jurusan Teknik Elektro. Admin Panel.
            </footer>
        </div>
    );
}