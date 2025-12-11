// --- File: src/pages/Home/Home.jsx ---

import "./Home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

// Import Header & Footer
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Home() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/events")
            .then((res) => {
                const list = Array.isArray(res.data.data)
                    ? res.data.data
                    : [];
                setEvents(list);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching events:", err);
                setLoading(false);
            });
    }, []);

    /**
     * Fungsi untuk mendapatkan kelas CSS spesifik (warna) untuk tag kategori.
     */
    const getTagClass = (category) => {
        // Gunakan lower case untuk penyesuaian yang lebih aman
        const lowerCategory = category ? category.toLowerCase() : '';
        if (lowerCategory.includes('elektro')) {
            return 'tag-elektro'; // Biru
        }
        if (lowerCategory.includes('workshop') || lowerCategory.includes('kolokium')) {
            return 'tag-workshop'; // Ungu
        }
        return '';
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="home-container">

            {/* HEADER DARI KOMPONEN (Asumsikan Header sudah dapat menampilkan link ke /admin/login) */}
            <Header adminLink="/admin/login" /> 

            <div className="content">
                <h1 className="title">Daftar Acara Jurusan Teknik Elektro</h1>
                <p className="subtitle">
                    Temukan Acara di Teknik Elektro hanya di SIMATRO
                </p>
                {/* Garis pemisah kuning telah diimplementasikan melalui CSS pseudo-element pada class .subtitle */}

                <div className="event-list">
                    {events.map((event) => {
                        const isClosed = !event.registration_open;
                        const cardClassName = `event-card ${isClosed ? 'card-closed' : ''}`;
                        const tagClassName = `event-tag ${getTagClass(event.category)}`;

                        return (
                            <Link 
                                to={isClosed ? '#' : `/events/${event.id}`} 
                                key={event.id} 
                                className={cardClassName}
                                style={{ pointerEvents: isClosed ? 'none' : 'auto', textDecoration: 'none' }}
                            >
                                <span className={tagClassName}>{event.category}</span>

                                <h3 className="event-title">{event.title}</h3>
                                
                                {isClosed ? (
                                    // Tampilkan status "Pendaftaran Ditutup" sebagai topik/status jika ditutup
                                    <p className="event-topic">Status: Pendaftaran Ditutup</p>
                                ) : (
                                    // Tampilkan topik normal jika terbuka
                                    <p className="event-topic">Topik: {event.topic}</p>
                                )}

                                {isClosed ? (
                                    <button className="btn-closed" disabled>
                                        Pendaftaran Ditutup
                                    </button>
                                ) : (
                                    <span className="btn-detail">
                                        Lihat Detail Acara
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* FOOTER DARI KOMPONEN */}
            <Footer />
        </div>
    );
}