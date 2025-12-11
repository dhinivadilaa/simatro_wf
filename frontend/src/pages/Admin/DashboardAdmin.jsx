import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./DashboardAdmin.css";
import { Link } from "react-router-dom";

// Component untuk satu kartu acara di Dashboard
const EventCardAdmin = ({ event }) => {
    // Tentukan status visual dan warna berdasarkan status pendaftaran
    const isPublished = event.status === 'Aktif & Publik';
    const cardClass = `event-admin-card ${isPublished ? 'published' : 'draft'}`;
    const statusText = isPublished ? event.status : `Draft (Publikasi Tertunda)`;
    const statusLabelClass = isPublished ? 'status-active' : 'status-draft';

    return (
        <div className={cardClass}>
            <div className="card-header-admin">
                <span className="event-id">ID: {event.id || 'N/A'}</span>
                <span className={`status-label ${statusLabelClass}`}>{statusText}</span>
            </div>
            
            <h3 className="event-title-admin">{event.title}</h3>
            
            <div className="event-info-admin">
                <p>Tanggal: <strong>{event.date || 'N/A'}</strong></p>
                <p>Batas Waktu Absensi: <strong>{event.absent_deadline || 'N/A'} WIB</strong></p>
            </div>
            
            <div className="participants-info">
                <span>
                    <strong>{event.registered || 0}</strong> / {event.quota || '∞'}
                </span>
                <p className="participants-label">Absen/Total Peserta</p>
            </div>
            
            <div className="admin-actions">
                {/* Tombol Kelola Peserta & Sertifikat - selalu ada */}
                <Link to={`/admin/events/${event.id}/manage`} className="btn-action btn-manage">
                    Kelola Peserta & Sertifikat
                </Link>

                {isPublished ? (
                    <>
                        {/* Tombol Khusus untuk Acara Aktif/Published */}
                        <Link to={`/admin/events/${event.id}/upload-material`} className="btn-action btn-upload">
                            Kelola & Upload Materi
                        </Link>
                        <Link to={`/admin/events/${event.id}/edit-deadline`} className="btn-action btn-edit-deadline">
                            Ubah Batas Waktu Absensi
                        </Link>
                        <button className="btn-action btn-deactivate">
                            Nonaktifkan Acara
                        </button>
                    </>
                ) : (
                    <>
                        {/* Tombol Khusus untuk Acara Draft */}
                        <Link to={`/admin/events/${event.id}/publish`} className="btn-action btn-publish">
                            Publikasi Acara
                        </Link>
                        {/* Tambahkan tombol edit draft jika diperlukan di sini */}
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