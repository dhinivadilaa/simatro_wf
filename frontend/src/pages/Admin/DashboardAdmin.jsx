import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

// Component untuk satu kartu acara di Dashboard
    const EventCardAdmin = ({ event }) => {
    const isPublished = event.status === 'Aktif & Publik';
    const borderLeftClass = isPublished ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-yellow-400 bg-yellow-50';
    const statusText = isPublished ? event.status : `Draft (Publikasi Tertunda)`;

    return (
        <div className={`bg-white p-6 rounded-xl shadow flex flex-wrap items-center ${borderLeftClass}`}>
            <div className="w-full flex justify-between text-sm text-gray-500 mb-2">
                <span>ID: {event.id || 'N/A'}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{statusText}</span>
            </div>

            <h3 className="w-full text-lg font-bold text-[#10243e] mb-3">{event.title}</h3>

            <div className="w-full md:w-1/3 text-sm text-gray-600">
                <p>Tanggal: <strong className="text-gray-800">{event.date || 'N/A'}</strong></p>
                <p>Batas Waktu Absensi: <strong className="text-gray-800">{event.absent_deadline || 'N/A'} WIB</strong></p>
            </div>

            <div className="ml-auto text-right md:text-right md:w-1/5">
                <div className="text-2xl font-bold text-[#10243e]">{event.registered || 0} / {event.quota || '∞'}</div>
                <div className="text-xs text-gray-500">Absen/Total Peserta</div>
            </div>

            <div className="w-full mt-4 flex flex-wrap gap-3">
                <Link to={`/admin/events/${event.id}/manage`} className="px-4 py-2 bg-[#10243e] text-white rounded-md text-sm font-semibold">Kelola Peserta & Sertifikat</Link>

                {isPublished ? (
                    <>
                        <Link to={`/admin/events/${event.id}/upload-material`} className="px-4 py-2 bg-teal-500 text-white rounded-md text-sm font-semibold">Kelola & Upload Materi</Link>
                        <Link to={`/admin/events/${event.id}/edit-deadline`} className="px-4 py-2 bg-yellow-400 text-[#212529] rounded-md text-sm font-semibold">Ubah Batas Waktu Absensi</Link>
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-semibold">Nonaktifkan Acara</button>
                    </>
                ) : (
                    <>
                        <Link to={`/admin/events/${event.id}/publish`} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold">Publikasi Acara</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default function DashboardAdmin() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Asumsi API endpoint untuk admin dashboard events
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

    const activeEvents = events.filter(e => e.status === 'Aktif & Publik');
    const draftEvents = events.filter(e => e.status !== 'Aktif & Publik');

    if (loading) {
        return (
            <div className="loading-page">
                <Header />
                <p>Loading Events...</p>
                <Footer />
            </div>
        );
    }

    return (
        <div className="dashboard-admin-page">
            <Header />

            <div className="content-admin-wrapper">
                <h1 className="dashboard-title">Dashboard Event Manager SIMATRO</h1>

                {/* Manajemen Acara Section */}
                <div className="management-section">
                    <h2 className="section-title">Manajemen Acara</h2>
                    <p className="section-subtitle">Mulai acara baru, atur konfigurasi batas waktu absensi, dan kelola daftar acara yang sedang aktif.</p>
                    <Link to="/admin/events/new" className="btn-add-event">
                        <i className="fas fa-plus-circle"></i> Tambah Acara Baru
                    </Link>
                </div>

                {/* Daftar Acara Aktif (Real-Time) */}
                <div className="event-list-section">
                    <h2 className="section-title">Daftar Acara Aktif (Real-Time)</h2>
                    
                    {activeEvents.length > 0 ? (
                        <div className="event-list-container">
                            {activeEvents.map(event => (
                                <EventCardAdmin key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <p className="no-events">Tidak ada acara yang aktif saat ini.</p>
                    )}
                </div>

                {/* Daftar Acara Draft/Tertunda (Opsional, tapi baik untuk dipisah) */}
                {draftEvents.length > 0 && (
                    <div className="event-list-section draft-section">
                        <h2 className="section-title">Daftar Acara Draft/Tertunda</h2>
                        <div className="event-list-container">
                            {draftEvents.map(event => (
                                <EventCardAdmin key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}