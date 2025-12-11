// --- File: src/pages/Riwayat/Riwayat.jsx ---

import React, { useState, useEffect } from 'react';
import './Riwayat.css';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import api from '../../api/axios';

// Fungsi bantuan untuk menentukan status & aksi
const getEventStatus = (eventData) => {
    let statusKehadiran = 'TERDAFTAR';
    let checkInTime = null;
    let sertifikatAksi = 'Absen di Menu Cek Status';
    let isHadir = false;

    // 1. Cek Kehadiran (dari tabel attendances)
    if (eventData.attendance && eventData.attendance.check_in_time) {
        statusKehadiran = 'HADIR';
        checkInTime = eventData.attendance.check_in_time.substring(11, 19); // Ambil waktu saja
        isHadir = true;
    } else {
        checkInTime = 'N/A';
    }

    // 2. Tentukan Aksi/Tombol
    if (isHadir) {
        if (eventData.certificate && eventData.certificate.file_path) {
            // Jika HADIR dan ada data di tabel certificates
            sertifikatAksi = 'Lihat Sertifikat';
        } else {
            // Jika HADIR tetapi belum ada data di tabel certificates
            sertifikatAksi = 'Sertifikat Sedang Diproses';
        }
    } else {
        // Jika BELUM HADIR
        sertifikatAksi = 'Belum Melakukan Absensi'; 
    }

    return { statusKehadiran, checkInTime, sertifikatAksi, isHadir };
};


export default function Riwayat() {
    const navigate = useNavigate();
    const [riwayatEvents, setRiwayatEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState(''); // Akan diisi dari API
    const [error, setError] = useState(null);

    // DUMMY PARTICIPANT ID (GANTI DENGAN ID PESERTA AKTUAL/DATA DARI SESSION)
    const dummyParticipantId = 1; 

    useEffect(() => {
        const fetchRiwayat = async () => {
            setLoading(true);
            setError(null);
            
            // ASUMSI API CALL (Ganti ini dengan API yang SESUAI):
            // Di API Laravel, Anda harus membuat route baru, misalnya:
            // Route::get('participants/{participant}/riwayat', [ParticipantController::class, 'getRiwayat']);
            const API_ENDPOINT = `/participants/${dummyParticipantId}/riwayat`;

            try {
                // Hapus baris ini dan ganti dengan panggilan API sebenarnya jika route sudah dibuat
                // const response = await api.get(API_ENDPOINT); 
                // setUserName(response.data.participant.name);
                // setRiwayatEvents(response.data.riwayat);

                // DATA SIMULASI (Mengikuti struktur relasi event, attendance, certificate)
                const mockApiResponse = {
                    name: "Talitha Dhini Intan",
                    riwayat: [
                        {
                            id: 1,
                            nama: 'Seminar Nasional : EEA 2025',
                            tipe: 'Seminar Nasional',
                            kode_registrasi: 'REG-13520001',
                            attendance: { check_in_time: '2025-01-20 09:05:12' }, 
                            certificate: { file_path: '/sertif/eea-001.pdf' } 
                        },
                        {
                            id: 2,
                            nama: 'Kuliah Umum: Transformasi Energi Terbarukan',
                            tipe: 'Kuliah Umum',
                            kode_registrasi: 'REG-13520002',
                            attendance: null, // Belum absen
                            certificate: null // Belum dapat sertifikat
                        }
                    ]
                };

                setUserName(mockApiResponse.name);
                setRiwayatEvents(mockApiResponse.riwayat);

            } catch (err) {
                console.error("Gagal mengambil riwayat:", err);
                setError("Gagal memuat data riwayat dari server atau data peserta tidak ditemukan.");
            } finally {
                setLoading(false);
            }
        };

        fetchRiwayat();
    }, [navigate, dummyParticipantId]); 

    const handleBack = () => {
        // Asumsi kembali ke halaman detail acara terakhir atau Home
        navigate('/'); 
    }
    
    const handleSertifikatClick = (filePath) => {
        // Logika untuk mendownload/melihat sertifikat
        if (filePath) {
            window.open(filePath, '_blank');
        }
    }


    return (
        <div className="riwayat-page">
            <Header /> 
            
            <div className="riwayat-container">
                <div className="riwayat-header-info">
                    <button onClick={handleBack} className="back-link">
                        &larr; Kembali ke Detail Acara
                    </button>
                    
                    <h1 className="riwayat-title">Dashboard Peserta SIMATRO</h1>
                    <p className="user-greeting">
                        Selamat datang, **{userName}**. Riwayat partisipasi Anda:
                    </p>
                </div>

                {error && <p className="riwayat-error">{error}</p>}
                
                <div className="riwayat-list">
                    {loading ? (
                        <p>Memuat riwayat acara...</p>
                    ) : (
                        riwayatEvents.map((event) => {
                            const status = getEventStatus(event);

                            return (
                                <div key={event.id} className="event-card">
                                    <div className="event-info">
                                        <span className={`event-tipe event-tipe-${event.tipe.toLowerCase().replace(/\s/g, '-')}`}>
                                            {event.tipe}
                                        </span>
                                        <h2 className="event-name">{event.nama}</h2>
                                        <p className="event-kode">Kode Registrasi: {event.kode_registrasi}</p>
                                    </div>
                                    
                                    <div className="event-status">
                                        <div className="status-kehadiran">
                                            <p className="status-label">Status Kehadiran</p>
                                            {/* STATUS KEHADIRAN BERDASARKAN attendance_id */}
                                            <span className={`status-badge status-${status.statusKehadiran.toLowerCase()}`}>
                                                {status.statusKehadiran} 
                                                {status.checkInTime !== 'N/A' && ` (${status.checkInTime} WIB)`}
                                            </span>
                                        </div>
                                        
                                        <div className="event-actions">
                                            {status.sertifikatAksi === 'Lihat Sertifikat' ? (
                                                <button 
                                                    className="btn-lihat-sertifikat"
                                                    onClick={() => handleSertifikatClick(event.certificate.file_path)}
                                                >
                                                    {status.sertifikatAksi}
                                                </button>
                                            ) : (
                                                <span className={`status-keterangan status-${status.sertifikatAksi.replace(/\s/g, '-').toLowerCase()}`}>
                                                    {status.sertifikatAksi}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
}