import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import ChangePinDialog from '../../components/ChangePinDialog';

export default function ParticipantManagement() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [attendancePin, setAttendancePin] = useState('');
    const [showChangePinDialog, setShowChangePinDialog] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackStats, setFeedbackStats] = useState({});

    useEffect(() => {
        fetchEventData();
        fetchParticipants();
        fetchAttendancePin();
        fetchFeedbacks();
    }, [eventId]);

    const fetchEventData = async () => {
        try {
            const response = await api.get(`/events/${eventId}`);
            setEvent(response.data.data);
        } catch (error) {
            console.error("Error fetching event:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipants = async () => {
        try {
            const response = await api.get(`/admin/events/${eventId}/participants`);
            setParticipants(response.data.data || []);
        } catch (error) {
            console.error("Error fetching participants:", error);
        }
    };

    const fetchAttendancePin = async () => {
        try {
            const response = await api.get(`/admin/events/${eventId}/attendance-pin`);
            setAttendancePin(response.data.pin || '');
        } catch (error) {
            console.error("Error fetching attendance PIN:", error);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const response = await api.get(`/admin/events/${eventId}/feedbacks`);
            const feedbackData = response.data.data || [];
            setFeedbacks(feedbackData);
            
            // Calculate feedback statistics
            const stats = {
                totalResponses: feedbackData.length,
                averageRating: feedbackData.length > 0 ? 
                    (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1) : 0,
                ratingDistribution: {
                    1: feedbackData.filter(f => f.rating === 1).length,
                    2: feedbackData.filter(f => f.rating === 2).length,
                    3: feedbackData.filter(f => f.rating === 3).length,
                    4: feedbackData.filter(f => f.rating === 4).length,
                    5: feedbackData.filter(f => f.rating === 5).length
                }
            };
            setFeedbackStats(stats);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    };

    const handleChangePin = async (newPin) => {
        try {
            await api.put(`/admin/events/${eventId}/attendance-pin`, { pin: newPin });
            setAttendancePin(newPin);
            setShowChangePinDialog(false);
            alert('PIN berhasil diubah!');
        } catch (error) {
            console.error('Error changing PIN:', error);
            alert('Gagal mengubah PIN');
        }
    };

    const generateCertificatesForAttendees = async () => {
        const attendedParticipants = participants.filter(p => p.attendance_status === 'present');
        
        if (attendedParticipants.length === 0) {
            alert('Tidak ada peserta yang hadir untuk dibuatkan sertifikat');
            return;
        }

        if (window.confirm(`Generate sertifikat untuk ${attendedParticipants.length} peserta yang hadir?`)) {
            try {
                await api.post(`/events/${eventId}/certificates/generate-all`);
                alert(`Sertifikat berhasil dibuat untuk ${attendedParticipants.length} peserta!`);
                fetchParticipants(); // Refresh data
            } catch (error) {
                console.error('Error generating certificates:', error);
                alert('Gagal membuat sertifikat. Pastikan template sudah diupload.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Acara tidak ditemukan</p>
                    <Link to="/admin/dashboard" className="text-blue-600 hover:underline">Kembali ke Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <div className="text-xl font-semibold">SIMATRO ADMIN <span className="text-sm font-light text-gray-400">UNIVERSITAS LAMPUNG</span></div>
                <div className="space-x-4">
                    <button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="hover:text-blue-300"
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => {
                            localStorage.removeItem("adminAuthToken");
                            delete api.defaults.headers.common["Authorization"];
                            navigate("/admin/login");
                        }}
                        className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto p-8">
                {/* Header */}
                <header className="mb-8">
                    <Link 
                        to={`/admin/events/${eventId}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center mb-2"
                    >
                        <span className="text-lg mr-2">&larr;</span> Kembali ke Dashboard Acara
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Pengelolaan Detail Acara: {event.title}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Data Real-Time Peserta, Absensi, dan Analisis Feedback.
                    </p>
                </header>

                {/* PIN & Deadline Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md col-span-2">
                        <p className="font-semibold">
                            Batas Waktu Absensi Acara: {event.absent_deadline ? 
                                new Date(event.absent_deadline).toLocaleString('id-ID') : 
                                'Belum ditentukan'
                            }
                        </p>
                        <p className="text-sm">Absensi mandiri otomatis ditolak setelah waktu ini.</p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow flex items-center justify-between col-span-1">
                        <div>
                            <p className="text-sm text-gray-500">PIN Absensi</p>
                            <p className="text-xl font-bold text-gray-800">{attendancePin || 'Belum dibuat'}</p>
                        </div>
                        <button 
                            onClick={() => setShowChangePinDialog(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            UBAH PIN
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white p-4 rounded-md shadow border-t-4 border-blue-500">
                        <p className="text-sm text-gray-500">Total Terdaftar</p>
                        <p className="text-3xl font-bold text-blue-600">{event.participants_count || 0}</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-md shadow border-t-4 border-green-500">
                        <p className="text-sm text-gray-500">Sudah Absen Real-Time</p>
                        <p className="text-3xl font-bold text-green-600">{event.attendances_count || 0}</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-md shadow border-t-4 border-yellow-600">
                        <p className="text-sm text-gray-500">Belum Absen</p>
                        <p className="text-3xl font-bold text-yellow-700">
                            {(event.participants_count || 0) - (event.attendances_count || 0)}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow border-t-4 border-gray-400">
                        <p className="text-sm text-gray-500">Sertifikat Diterbitkan</p>
                        <p className="text-3xl font-bold text-gray-800">{event.certificates_count || 0}</p>
                    </div>
                </div>

                {/* Certificate Management */}
                <div className="mb-10">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Manajemen Template & Validasi Sertifikat</h2>
                    <div className="flex space-x-3">
                        <button 
                            onClick={() => navigate(`/admin/events/${eventId}/certificate-template`)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            📄 Kelola Template
                        </button>
                        <button 
                            onClick={generateCertificatesForAttendees}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                            🎓 Generate Sertifikat Peserta Hadir
                        </button>
                        <button 
                            onClick={() => window.open(`${api.defaults.baseURL}/events/${eventId}/certificates/download-all`, '_blank')}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
                        >
                            📥 Download Semua Sertifikat
                        </button>
                    </div>
                </div>

                {/* Participants Table */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Daftar Peserta & Status Absensi (Real-Time)</h2>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="display-rows" className="text-sm text-gray-600">Tampilkan</label>
                            <select id="display-rows" className="border border-gray-300 rounded-md p-1 text-sm">
                                <option>5 Baris</option>
                                <option>10 Baris</option>
                                <option>25 Baris</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {["Nama", "Email/ID Peserta", "Kode Absensi", "Waktu Absensi", "Status Sertifikat", "Absensi"].map((header) => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {participants.map((participant) => (
                                    <tr key={participant.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{participant.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.attendance_code || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {participant.attendance_time ? 
                                                new Date(participant.attendance_time).toLocaleString('id-ID') : 
                                                '-'
                                            }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${participant.certificate_issued ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {participant.certificate_issued ? 'Diterbitkan' : 'Belum'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`font-semibold 
                                                ${participant.attendance_status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                                                {participant.attendance_status === 'present' ? 'Hadir' : 'Absen'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                        <p>Menampilkan 1-{Math.min(participants.length, 5)} dari {participants.length} peserta</p>
                        <div className="space-x-2">
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                                &lt; Sebelumnya
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Berikutnya &gt;
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Feedback Analysis */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Analisis Feedback</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Rata-rata Skor Feedback: <span className="font-semibold text-blue-600">{feedbackStats.averageRating || 0}/5.0</span> 
                        (Total Responden: {feedbackStats.totalResponses || 0})
                    </p>

                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((rating) => {
                            const count = feedbackStats.ratingDistribution?.[rating] || 0;
                            const percentage = feedbackStats.totalResponses > 0 ? (count / feedbackStats.totalResponses) * 100 : 0;
                            const labels = {
                                1: "1 - Sangat Kurang",
                                2: "2 - Kurang", 
                                3: "3 - Cukup",
                                4: "4 - Baik",
                                5: "5 - Sangat Baik"
                            };
                            const colors = {
                                1: "bg-red-500",
                                2: "bg-orange-500", 
                                3: "bg-yellow-500",
                                4: "bg-blue-500",
                                5: "bg-green-500"
                            };
                            
                            return (
                                <div key={rating}>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-gray-700 w-32">{labels[rating]}</span>
                                        <div className="flex-grow bg-gray-200 rounded-full h-2.5 mx-4">
                                            <div 
                                                className={`h-2.5 rounded-full ${colors[rating]}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="font-semibold text-gray-800 w-16 text-right">{count} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <h3 className="text-md font-semibold text-gray-800 mt-8 mb-4 border-t pt-4">Saran & Masukan Terbuka</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {feedbacks.filter(f => f.comments).map((feedback, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                                <p className="text-sm text-gray-700">"{feedback.comments}"</p>
                                <p className="text-xs text-gray-500 mt-1">Rating: {feedback.rating}/5</p>
                            </div>
                        ))}
                        {feedbacks.filter(f => f.comments).length === 0 && (
                            <p className="text-gray-500 text-sm">Belum ada saran atau masukan.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-400 text-center p-4 text-sm">
                © 2025 SIMATRO Universitas Lampung. Admin Panel.
            </footer>

            {/* Change PIN Dialog */}
            {showChangePinDialog && (
                <ChangePinDialog
                    currentPin={attendancePin}
                    onClose={() => setShowChangePinDialog(false)}
                    onSave={handleChangePin}
                />
            )}
        </div>
    );
}