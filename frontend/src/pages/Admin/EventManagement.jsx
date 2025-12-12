import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function EventManagement() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [participants, setParticipants] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [attendancePin, setAttendancePin] = useState('');
    const [newPin, setNewPin] = useState('');

    useEffect(() => {
        fetchEventData();
        fetchParticipants();
        fetchMaterials();
        fetchAttendancePin();
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

    const fetchMaterials = async () => {
        try {
            const response = await api.get(`/admin/events/${eventId}/materials`);
            setMaterials(response.data.data || []);
        } catch (error) {
            console.error("Error fetching materials:", error);
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

    const generateNewPin = async () => {
        try {
            const response = await api.post(`/admin/events/${eventId}/generate-pin`);
            setAttendancePin(response.data.pin);
            alert("PIN absensi berhasil dibuat!");
        } catch (error) {
            console.error("Error generating PIN:", error);
            alert("Gagal membuat PIN absensi");
        }
    };

    const updateAttendanceDeadline = async (newDeadline) => {
        try {
            await api.put(`/admin/events/${eventId}`, { absent_deadline: newDeadline });
            setEvent({ ...event, absent_deadline: newDeadline });
            alert("Batas waktu absensi berhasil diubah!");
        } catch (error) {
            console.error("Error updating deadline:", error);
            alert("Gagal mengubah batas waktu absensi");
        }
    };

    const toggleEventStatus = async () => {
        try {
            const newStatus = !event.registration_open;
            await api.put(`/admin/events/${eventId}`, { registration_open: newStatus });
            setEvent({ ...event, registration_open: newStatus });
            alert(`Acara ${newStatus ? 'dibuka' : 'ditutup'} untuk pendaftaran!`);
        } catch (error) {
            console.error("Error toggling event status:", error);
            alert("Gagal mengubah status acara");
        }
    };

    const deleteEvent = async () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus acara ini? Semua data terkait akan hilang.")) {
            try {
                await api.delete(`/events/${eventId}`);
                alert("Acara berhasil dihapus!");
                navigate("/admin/dashboard");
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Gagal menghapus acara");
            }
        }
    };

    const publishEvent = async () => {
        try {
            await api.put(`/admin/events/${eventId}`, { status: 'published' });
            setEvent({ ...event, status: 'published' });
            alert("Acara berhasil dipublikasikan!");
        } catch (error) {
            console.error("Error publishing event:", error);
            alert("Gagal mempublikasikan acara");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Memuat data acara...</p>
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
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header Navigation */}
            <header className="bg-blue-900 text-white px-6 py-4 shadow-lg">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold">
                        <span className="text-yellow-400">⚡SIMATRO ADMIN</span> <span className="text-sm">TEKNIK ELEKTRO</span>
                    </h1>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-sm font-semibold transition"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem("adminAuthToken");
                                delete api.defaults.headers.common["Authorization"];
                                navigate("/admin/login");
                            }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 md:px-12 py-8">
                {/* Event Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                            <p className="text-gray-600 mt-1">{event.category} • {event.date}</p>
                        </div>
                        <div className="flex gap-2">
                            {event.status === 'draft' && (
                                <button
                                    onClick={publishEvent}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition"
                                >
                                    Publikasikan Acara
                                </button>
                            )}
                            <button
                                onClick={toggleEventStatus}
                                className={`px-4 py-2 text-white text-sm font-semibold rounded transition ${
                                    event.registration_open
                                        ? 'bg-orange-600 hover:bg-orange-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {event.registration_open ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
                            </button>
                            <button
                                onClick={deleteEvent}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition"
                            >
                                Hapus Acara
                            </button>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${
                            event.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {event.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${
                            event.registration_open
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}>
                            {event.registration_open ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
                        </span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            {[
                                { id: 'overview', label: 'Ringkasan' },
                                { id: 'participants', label: 'Peserta & Sertifikat' },
                                { id: 'materials', label: 'Materi' },
                                { id: 'settings', label: 'Pengaturan' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {activeTab === 'overview' && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Acara</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                                    <p className="text-sm text-gray-600">Total Peserta</p>
                                    <p className="text-3xl font-bold text-blue-600">{participants.length}</p>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                                    <p className="text-sm text-gray-600">Hadir</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {participants.filter(p => p.attendance_status === 'present').length}
                                    </p>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded p-4 text-center">
                                    <p className="text-sm text-gray-600">Sertifikat</p>
                                    <p className="text-3xl font-bold text-amber-600">
                                        {participants.filter(p => p.certificate_issued).length}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-900 mb-2">PIN Absensi</h4>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-mono font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded">
                                        {attendancePin || 'Belum dibuat'}
                                    </span>
                                    <button
                                        onClick={generateNewPin}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition"
                                    >
                                        {attendancePin ? 'Buat PIN Baru' : 'Buat PIN'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'participants' && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Kelola Peserta & Sertifikat</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-2">Nama</th>
                                            <th className="text-left py-2">Email</th>
                                            <th className="text-center py-2">Status Kehadiran</th>
                                            <th className="text-center py-2">Sertifikat</th>
                                            <th className="text-center py-2">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participants.map(participant => (
                                            <tr key={participant.id} className="border-b border-gray-100">
                                                <td className="py-3">{participant.name}</td>
                                                <td className="py-3">{participant.email}</td>
                                                <td className="py-3 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        participant.attendance_status === 'present'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {participant.attendance_status === 'present' ? 'Hadir' : 'Belum Hadir'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-center">
                                                    {participant.certificate_issued ? (
                                                        <span className="text-green-600">✓</span>
                                                    ) : (
                                                        <span className="text-gray-400">✗</span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-center">
                                                    <button className="text-blue-600 hover:underline text-xs">
                                                        Kelola
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'materials' && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Kelola & Upload Materi</h3>
                            <div className="mb-4">
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition">
                                    Upload Materi Baru
                                </button>
                            </div>
                            <div className="space-y-3">
                                {materials.map(material => (
                                    <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div>
                                            <p className="font-medium">{material.title}</p>
                                            <p className="text-sm text-gray-600">{material.filename}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:underline text-sm">Download</button>
                                            <button className="text-red-600 hover:underline text-sm">Hapus</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Acara</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Batas Waktu Absensi
                                    </label>
                                    <input
                                        type="time"
                                        value={event.absent_deadline || ''}
                                        onChange={(e) => updateAttendanceDeadline(e.target.value)}
                                        className="border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kapasitas Peserta
                                    </label>
                                    <input
                                        type="number"
                                        value={event.capacity || ''}
                                        onChange={(e) => setEvent({ ...event, capacity: e.target.value })}
                                        className="border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="registration_open"
                                        checked={event.registration_open}
                                        onChange={toggleEventStatus}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="registration_open" className="ml-2 block text-sm text-gray-900">
                                        Buka pendaftaran acara
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-blue-900 text-white text-center py-4 text-sm">
                © 2025 SIMATRO Jurusan Teknik Elektro. Admin Panel.
            </footer>
        </div>
    );
}
