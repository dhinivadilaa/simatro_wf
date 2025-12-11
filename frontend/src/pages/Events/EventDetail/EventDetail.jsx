// --- File: src/pages/Events/EventDetail/EventDetail.jsx ---

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../api/axios";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "./EventDetail.css";

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        loadEvent();
    }, [id, navigate]); // Ditambahkan 'navigate' ke dependencies array

    const loadEvent = async () => {
        try {
            const res = await api.get(`/events/${id}`);
            setEvent(res.data.data);
        } catch (error) {
            console.error("Gagal memuat event:", error);
            // Anda bisa tambahkan navigasi ke halaman error atau daftar acara jika gagal
        }
    };

    if (!event) {
        return <p className="loading-text">Loading...</p>;
    }

    // --- Fungsi Bantuan ---

    // ... (Fungsi getTagClass jika diperlukan) ...
    // ... (Fungsi format waktu jika diperlukan) ...


    return (
        <div className="event-detail-page">

            <Header />

            <div className="content-wrapper">

                {/* Tombol Kembali */}
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Kembali ke Daftar Acara
                </button>

                {/* Event Card */}
                <div className="event-card">

                    <h1 className="event-title">{event.title}</h1>

                    <div className="divider"></div>

                    <h2 className="section-title">Materi dan Informasi Acara</h2>

                    {/* INFO GRID (Tidak ada perubahan) */}
                    <div className="info-grid">
                        {/* ... (Waktu Pelaksanaan, Lokasi Acara, Kuota Peserta) ... */}
                        
                        <div className="info-box">
                            <span className="info-label">
                                {/* Ikon Waktu */}
                                <i className="fas fa-calendar-alt"></i> Waktu Pelaksanaan
                            </span>
                            <p className="info-value">{event.date}</p>
                            <p className="info-sub">{event.time}</p>
                        </div>

                        <div className="info-box">
                            <span className="info-label">
                                {/* Ikon Lokasi */}
                                <i className="fas fa-map-marker-alt"></i> Lokasi Acara
                            </span>
                            <p className="info-value">{event.location}</p>
                        </div>

                        <div className="info-box">
                            <span className="info-label">
                                {/* Ikon Kuota */}
                                <i className="fas fa-users"></i> Kuota Peserta
                            </span>
                            <p className="info-value">
                                {event.registered} / {event.quota}
                                <span className="info-green">
                                    {" "}
                                    ({event.quota - event.registered} tersisa)
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* MATERIALS (Tidak ada perubahan) */}
                    <h2 className="section-title">Materi Acara</h2>
                    {event.materials && event.materials.length > 0 ? (
                        event.materials.map((item) => (
                            <div key={item.id} className="material-item">
                                <div className="material-content">
                                    <div>
                                        <p className="material-title">{item.title}</p>
                                        <p className="material-desc">{item.description}</p>
                                        <span className="material-preview">Pratinjau Teks</span>
                                    </div>
                                </div>

                                <a href={item.file_url} target="_blank" className="btn-view" rel="noreferrer">
                                    👁 Lihat
                                </a>
                            </div>
                        ))
                    ) : (
                        <p className="no-material">Belum ada materi tersedia untuk acara ini.</p>
                    )}


                    {/* ACTION GRID */}
                    <div className="action-grid">

                        {/* Pendaftaran (Tidak ada perubahan) */}
                        <div className="action-box green-box" 
                            onClick={() => navigate(`/events/${id}/register`)}>
                            <h3>Pendaftaran</h3>
                            <p>Jika Berminat, Silahkan Daftar disini</p>
                            <button
                                className="btn-green"
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    navigate(`/events/${id}/register`);
                                }}
                            >
                                Daftar Sekarang
                            </button>
                        </div>

                        {/* Absensi & Status (Asumsi menuju halaman Cek Status) */}
                        <div className="action-box blue-box"
                            onClick={() => navigate("/status")}>
                            <h3>Absensi & Status</h3>
                            <p>Cek status absensi dan sertifikat</p>
                            <button 
                                className="btn-blue"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/status");
                                }}
                            >
                                Cek Status & Absen
                            </button>
                        </div>

                        {/* Riwayat Event (PERBAIKAN: Mengarah ke /riwayat) */}
                        <div className="action-box yellow-box"
                            onClick={() => navigate("/Riwayat")}> {/* ⬅️ UBAH DARI /history KE /riwayat */}
                            <h3>Riwayat Event</h3>
                            <p>Lihat riwayat dan sertifikat</p>
                            <button 
                                className="btn-yellow"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/Riwayat"); // ⬅️ UBAH DARI /history KE /riwayat
                                }}
                            >
                                Lihat Riwayat
                            </button>
                        </div>

                    </div>

                </div>
            </div>

            {/* FOOTER DARI KOMPONEN */}
            <Footer />
            
        </div>
    );
}