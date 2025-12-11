// --- File: src/pages/Riwayat/Riwayat.jsx ---

import React, { useState, useEffect } from 'react';
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
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="mb-6">
                    <button onClick={handleBack} className="text-sm text-gray-500 hover:text-gray-700 mb-3">&larr; Kembali ke Detail Acara</button>
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard Peserta SIMATRO</h1>
                    <p className="text-gray-600">Selamat datang, <span className="font-medium">{userName}</span>. Riwayat partisipasi Anda:</p>
                </div>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                <div className="space-y-4">
                    {loading ? (
                        <p>Memuat riwayat acara...</p>
                    ) : (
                        riwayatEvents.map((event) => {
                            const status = getEventStatus(event);

                            return (
                                <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
                                    <div className="flex-1 pr-4">
                                        <span className={`inline-block px-3 py-1 rounded text-xs font-semibold mb-2 ${event.tipe && event.tipe.toLowerCase().includes('seminar') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{event.tipe}</span>
                                        <h2 className="text-lg font-semibold text-gray-900">{event.nama}</h2>
                                        <p className="text-sm text-gray-500">Kode Registrasi: {event.kode_registrasi}</p>
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        <div className="text-sm text-gray-600">Status Kehadiran</div>
                                        <div className={`text-base font-bold ${status.isHadir ? 'text-green-600' : 'text-orange-600'}`}>
                                            {status.statusKehadiran}{status.checkInTime !== 'N/A' && ` (${status.checkInTime} WIB)`}
                                        </div>

                                        <div>
                                            {status.sertifikatAksi === 'Lihat Sertifikat' ? (
                                                <button onClick={() => handleSertifikatClick(event.certificate.file_path)} className="bg-[#112d4e] text-white px-3 py-2 rounded-md text-sm">{status.sertifikatAksi}</button>
                                            ) : (
                                                <span className="text-sm text-gray-600">{status.sertifikatAksi}</span>
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