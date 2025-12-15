import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function StatusPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [proofPhoto, setProofPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [error, setError] = useState('');
    const [eventData, setEventData] = useState(null);
    
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    
    useEffect(() => {
        if (eventId) {
            fetchEventData();
        }
    }, [eventId]);
    
    const fetchEventData = async () => {
        try {
            const response = await api.get(`/events/${eventId}`);
            setEventData(response.data.data);
        } catch (error) {
            console.error('Error fetching event data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !pin) {
            setError('Harap isi email dan kode absensi');
            return;
        }
        
        if (!eventId) {
            setError('Event ID tidak ditemukan');
            return;
        }

        setLoading(true);
        setError('');
        setAttendanceStatus(null);

        try {
            const formData = new FormData();
            formData.append('event_id', eventId);
            formData.append('email', email);
            formData.append('pin', pin);
            if (proofPhoto) {
                formData.append('proof_photo', proofPhoto);
            }

            const response = await api.post('/attendance/check', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setAttendanceStatus({
                success: true,
                message: 'Selamat, Anda sudah hadir!',
                time: new Date().toLocaleTimeString('id-ID')
            });
        } catch (error) {
            setError(error.response?.data?.error || 'Gagal melakukan absensi');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            padding: '20px',
            backgroundColor: 'white',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '500px',
            margin: '0 auto',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
        },
        backArrow: {
            fontSize: '24px',
            marginRight: '15px',
            cursor: 'pointer',
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
        },
        label: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px',
            display: 'block',
            marginTop: '15px',
        },
        input: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '16px',
            boxSizing: 'border-box',
        },
        exampleText: {
            fontSize: '12px',
            color: '#666',
            marginTop: '5px',
        },
        primaryButton: {
            width: '100%',
            padding: '15px',
            backgroundColor: '#002C6A',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '30px',
            transition: 'background-color 0.2s',
        },
        successBox: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px',
            backgroundColor: '#E6FFE6',
            border: '1px solid #00AA00',
            borderRadius: '8px',
            marginTop: '30px',
        },
        successText: {
            fontSize: '16px',
            color: '#006600',
            fontWeight: 'bold',
        },
        dashboardButton: {
            padding: '10px 15px',
            backgroundColor: '#002C6A',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
        },
        errorBox: {
            padding: '10px',
            backgroundColor: '#FFE6E6',
            border: '1px solid #FF0000',
            borderRadius: '8px',
            marginTop: '15px',
            color: '#CC0000',
            fontSize: '14px',
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <main className="flex-1 px-6 py-12">
                <div style={styles.container}>
                    <div style={styles.header}>
                        <span 
                            style={styles.backArrow}
                            onClick={() => eventId ? navigate(`/events/${eventId}`) : navigate('/')}
                        >
                            ←
                        </span>
                        <span 
                            style={{ fontSize: '16px', color: '#333', cursor: 'pointer' }}
                            onClick={() => eventId ? navigate(`/events/${eventId}`) : navigate('/')}
                        >
                            Kembali ke Detail Acara
                        </span>
                    </div>

                    <h1 style={styles.title}>Cek Status & Absensi Mandiri</h1>

                    <p style={{ 
                        color: 'red', 
                        fontWeight: 'bold', 
                        fontSize: '14px', 
                        marginTop: '15px', 
                        marginBottom: '5px' 
                    }}>
                        {eventData?.absent_deadline 
                            ? `Batas Absensi sampai ${new Date(eventData.absent_deadline).toLocaleString('id-ID')}. Absensi di luar waktu tersebut akan ditolak.`
                            : 'Batas waktu absensi belum ditentukan oleh panitia.'
                        }
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email" style={styles.label}>
                            Email Aktif (Terdaftar)
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Masukkan Email Anda"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />

                        <label htmlFor="kode" style={styles.label}>
                            Kode Absensi Acara (Diberikan Panitia)
                        </label>
                        <input
                            id="kode"
                            type="text"
                            placeholder="Contoh: ABSENSI-120925"
                            style={styles.input}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            disabled={loading}
                        />
                        <p style={styles.exampleText}>
                            Kode ini sama untuk semua peserta, dan hanya berlaku saat acara.
                        </p>

                        <label htmlFor="photo" style={styles.label}>
                            Upload Bukti Foto di Tempat (Opsional)
                        </label>
                        <input
                            id="photo"
                            type="file"
                            accept="image/*"
                            style={styles.input}
                            onChange={(e) => setProofPhoto(e.target.files[0])}
                            disabled={loading}
                        />
                        <p style={styles.exampleText}>
                            Upload foto sebagai bukti kehadiran Anda di tempat acara (format: JPG, PNG, max 5MB).
                        </p>

                        {error && (
                            <div style={styles.errorBox}>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            style={{
                                ...styles.primaryButton,
                                backgroundColor: loading ? '#ccc' : '#002C6A',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Memproses...' : 'Cek Status & Absen'}
                        </button>
                    </form>

                    {attendanceStatus && attendanceStatus.success && (
                        <div style={styles.successBox}>
                            <div>
                                <p style={styles.successText}>{attendanceStatus.message}</p>
                                <p style={{ fontSize: '14px', color: '#006600' }}>
                                    Absensi tervalidasi pada {attendanceStatus.time} WIB.
                                </p>
                            </div>
                            <button 
                                type="button" 
                                style={styles.dashboardButton}
                                onClick={() => navigate('/riwayat')}
                            >
                                Akses Dashboard & Sertifikat
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}