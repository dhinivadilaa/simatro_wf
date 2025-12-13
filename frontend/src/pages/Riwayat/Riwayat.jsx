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
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState(''); // Akan diisi dari API
    const [error, setError] = useState(null);

    // Email confirmation flow
    const [email, setEmail] = useState('');
    const [verified, setVerified] = useState(false);
    const [participantId, setParticipantId] = useState(null);
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        // Fetch riwayat only when participant is verified
        if (!verified || !email) return;

        const fetchRiwayat = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch participant history
                if (participantId) {
                    const response = await api.get(`/participants/${participantId}/riwayat`);
                    if (response && response.data) {
                        console.log('Riwayat data:', response.data);
                        setUserName(response.data.participant?.name || 'Peserta');
                        setRiwayatEvents(response.data.riwayat || []);
                    }
                }
                

            } catch (err) {
                console.error('Gagal mengambil data:', err);
                setError('Gagal memuat data dari server.');
                setRiwayatEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRiwayat();
    }, [verified, participantId, email]);

    const handleBack = () => {
        // Asumsi kembali ke halaman detail acara terakhir atau Home
        navigate('/'); 
    }
    
    const handleSertifikatClick = (certificate) => {
        console.log('Certificate object:', certificate);
        if (certificate && certificate.id) {
            navigate(`/certificate/${certificate.id}`);
        } else {
            alert('Sertifikat tidak tersedia atau sedang diproses');
        }
    }
    
    const downloadCertificate = (certificateId) => {
        window.open(`${api.defaults.baseURL}/certificates/${certificateId}/download-public`, '_blank');
    }

    // Email verification handlers
    const handleEmailSubmit = async (e) => {
        e && e.preventDefault && e.preventDefault();
        setError(null);
        if (!email) return setError('Masukkan email terlebih dahulu.');

        setLoading(true);
        try {
            // Try common endpoints: /participants/by-email or /participants?email=
            let res = null;
            try {
                res = await api.get(`/participants/by-email`, { params: { email } });
            } catch (err) {
                // fallback
                res = await api.get(`/participants`, { params: { email } });
            }

            // Expect either single participant or array
            let participant = null;
            if (res && res.data) {
                if (Array.isArray(res.data)) participant = res.data[0];
                else if (res.data.participant) participant = res.data.participant;
                else participant = res.data;
            }

            if (participant && participant.id) {
                setParticipantId(participant.id);
                setVerified(true);
                setUserName(participant.name || 'Peserta');
            } else {
                setError('Email belum terdaftar sebagai peserta. Pastikan Anda mendaftar terlebih dahulu.');
            }
        } catch (err) {
            console.error('Gagal memeriksa email:', err);
            setError('Terjadi kesalahan saat memeriksa email. Coba lagi.');
        } finally {
            setLoading(false);
        }
    }

    const handleResetEmail = () => {
        setEmail('');
        setVerified(false);
        setParticipantId(null);
        setRiwayatEvents([]);
        setUserName('');
        setError(null);
        setCertificates([]);
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="mb-6">
                    <button onClick={handleBack} className="text-sm text-gray-500 hover:text-gray-700 mb-3">&larr; Kembali ke Detail Acara</button>
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard Peserta SIMATRO</h1>
                    {!verified ? (
                        <p className="text-gray-600">Silakan konfirmasi dengan memasukkan email yang Anda gunakan saat mendaftar.</p>
                    ) : (
                        <p className="text-gray-600">Selamat datang, <span className="font-medium">{userName}</span>. Riwayat partisipasi Anda:</p>
                    )}
                </div>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                {!verified ? (
                    <form onSubmit={handleEmailSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email peserta</label>
                        <div className="flex gap-2">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" className="flex-1 border rounded px-3 py-2" />
                            <button type="submit" className="bg-[#112d4e] text-white px-4 py-2 rounded">Konfirmasi</button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">Jika email terdaftar, riwayat acara Anda akan ditampilkan.</p>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <button onClick={handleResetEmail} className="text-sm text-gray-500 hover:text-gray-700">Ubah Email</button>
                        </div>



                        {loading ? (
                            <p>Memuat riwayat acara...</p>
                        ) : (
                            riwayatEvents.length === 0 ? (
                                <p className="text-gray-600">Belum ada riwayat acara ditemukan untuk email ini.</p>
                            ) : (
                                riwayatEvents.map((item) => {
                                    // Normalize fields from backend Participant record
                                    const ev = item.event || {};
                                    const nama = ev.title || ev.topic || 'Untitled Event';
                                    const tipe = ev.category || ev.topic || 'Acara';
                                    const kode_registrasi = item.pin || `REG-${item.id}`;

                                    // attendance may be an array (attendances) — take the first
                                    const attendanceObj = (item.attendances && item.attendances.length > 0) ? item.attendances[0] : null;
                                    const normalized = {
                                        attendance: attendanceObj,
                                        certificate: item.certificate || null,
                                    };
                                    
                                    console.log('Item certificate:', item.certificate);
                                    console.log('Normalized certificate:', normalized.certificate);

                                    const status = getEventStatus(normalized);

                                    return (
                                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
                                            <div className="flex-1 pr-4">
                                                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold mb-2 ${tipe && tipe.toLowerCase().includes('seminar') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{tipe}</span>
                                                <h2 className="text-lg font-semibold text-gray-900">{nama}</h2>
                                                <p className="text-sm text-gray-500">Kode Registrasi: {kode_registrasi}</p>
                                            </div>

                                            <div className="flex flex-col items-end gap-3">
                                                <div className="text-sm text-gray-600">Status Kehadiran</div>
                                                <div className={`text-base font-bold ${status.isHadir ? 'text-green-600' : 'text-orange-600'}`}>
                                                    {status.statusKehadiran}{status.checkInTime !== 'N/A' && ` (${status.checkInTime} WIB)`}
                                                </div>

                                                <div>
                                                    {status.sertifikatAksi === 'Lihat Sertifikat' && normalized.certificate?.id ? (
                                                        <button onClick={() => handleSertifikatClick(normalized.certificate)} className="bg-[#112d4e] text-white px-3 py-2 rounded-md text-sm">{status.sertifikatAksi}</button>
                                                    ) : status.isHadir ? (
                                                        <button onClick={() => alert('Sertifikat sedang diproses oleh admin. Silakan coba lagi nanti.')} className="bg-gray-500 text-white px-3 py-2 rounded-md text-sm">Sertifikat Belum Tersedia</button>
                                                    ) : (
                                                        <span className="text-sm text-gray-600">{status.sertifikatAksi}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}