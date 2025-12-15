import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { clearRedirectTimeout } from "../../api/axios";
import { getValidAdminToken, clearAdminAuth } from "../../utils/auth";
import UploadMaterial from "../../components/UploadMaterial";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import EditMaterialDialog from "../../components/EditMaterialDialog";
import ChangePinDialog from "../../components/ChangePinDialog";

function FeedbackContent({ eventId }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackStats, setFeedbackStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
    }, [eventId]);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/events/${eventId}/feedbacks`);
            const feedbackData = response.data.data || [];
            setFeedbacks(feedbackData);
            
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
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Memuat feedback...</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Feedback & Evaluasi Acara</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">{feedbackStats.totalResponses || 0}</div>
                    <p className="text-sm text-gray-600 mt-1">Total Feedback</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600">{feedbackStats.averageRating || 0}/5</div>
                    <p className="text-sm text-gray-600 mt-1">Rating Rata-rata</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600">{feedbacks.filter(f => f.comments).length}</div>
                    <p className="text-sm text-gray-600 mt-1">Komentar Tertulis</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-6">Distribusi Rating</h4>
                <div className="space-y-4">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = feedbackStats.ratingDistribution?.[rating] || 0;
                        const percentage = feedbackStats.totalResponses > 0 ? (count / feedbackStats.totalResponses) * 100 : 0;
                        const labels = {
                            5: "⭐⭐⭐⭐⭐ Sangat Baik",
                            4: "⭐⭐⭐⭐ Baik",
                            3: "⭐⭐⭐ Cukup",
                            2: "⭐⭐ Kurang",
                            1: "⭐ Sangat Kurang"
                        };
                        const colors = {
                            5: "bg-green-500",
                            4: "bg-blue-500",
                            3: "bg-yellow-500",
                            2: "bg-orange-500",
                            1: "bg-red-500"
                        };
                        
                        return (
                            <div key={rating} className="flex items-center gap-4">
                                <div className="w-40 text-sm font-medium text-gray-700">{labels[rating]}</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                    <div 
                                        className={`h-3 rounded-full ${colors[rating]} transition-all duration-300`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <div className="w-20 text-sm font-semibold text-gray-800 text-right">
                                    {count} ({percentage.toFixed(1)}%)
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
                
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Komentar & Saran</h4>
                {feedbacks.filter(f => f.comments).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">💬</div>
                        <p>Belum ada komentar dari peserta</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {feedbacks.filter(f => f.comments).map((feedback, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-600">{feedback.participant_email}</span>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-sm ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}>⭐</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(feedback.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">"{feedback.comments}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ParticipantManagementContent({ eventId, event, participants, attendancePin, setAttendancePin, fetchParticipants, certificateTemplates, showTemplatePreviewModal, fetchCertificateTemplates }) {
    const [showChangePinDialog, setShowChangePinDialog] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackStats, setFeedbackStats] = useState({});
    const [showTemplateUpload, setShowTemplateUpload] = useState(false);
    const [templateFile, setTemplateFile] = useState(null);
    const [templateTitle, setTemplateTitle] = useState('');
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, [eventId]);

    const fetchFeedbacks = async () => {
        try {
            const response = await api.get(`/admin/events/${eventId}/feedbacks`);
            const feedbackData = response.data.data || [];
            setFeedbacks(feedbackData);
            
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

        if (window.confirm(`Generate sertifikat untuk ${attendedParticipants.length} peserta yang hadir? Email akan otomatis dikirim.`)) {
            try {
                const response = await api.post(`/events/${eventId}/certificates/generate-all`);
                alert(`Sertifikat berhasil dibuat untuk ${attendedParticipants.length} peserta dan email telah dikirim!`);
                fetchParticipants();
            } catch (error) {
                console.error('Error generating certificates:', error);
                alert('Gagal membuat sertifikat. Pastikan template sudah diupload.');
            }
        }
    };

    const sendBulkCertificateEmail = async () => {
        if (window.confirm('Kirim email sertifikat ke semua peserta yang memiliki sertifikat?')) {
            try {
                const response = await api.post(`/events/${eventId}/certificates/send-bulk-email`);
                alert(response.data.message);
            } catch (error) {
                console.error('Error sending bulk email:', error);
                const errorMsg = error.response?.data?.message || 'Gagal mengirim email massal';
                alert(errorMsg);
            }
        }
    };

    const sendIndividualCertificateEmail = async (participantId, participantEmail) => {
        // Find certificate for this participant
        const participant = participants.find(p => p.id === participantId);
        if (!participant || !participant.certificate_issued) {
            alert('Peserta belum memiliki sertifikat');
            return;
        }

        if (window.confirm(`Kirim email sertifikat ke ${participantEmail}?`)) {
            try {
                // We need to get certificate ID first
                const certificatesResponse = await api.get(`/events/${eventId}/certificates`);
                const certificates = certificatesResponse.data.data || [];
                const certificate = certificates.find(c => c.participant_id === participantId);
                
                if (certificate) {
                    const response = await api.post(`/certificates/${certificate.id}/send-email`);
                    alert(response.data.message);
                } else {
                    alert('Sertifikat tidak ditemukan');
                }
            } catch (error) {
                console.error('Error sending email:', error);
                const errorMsg = error.response?.data?.message || 'Gagal mengirim email';
                alert(errorMsg);
            }
        }
    };

    const uploadTemplate = async () => {
        if (!templateFile || !templateTitle) {
            alert('Pilih file dan masukkan judul template');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('event_id', eventId);
            formData.append('title', templateTitle);
            formData.append('template_file', templateFile);

            await api.post('/certificate-templates', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Template sertifikat berhasil diupload!');
            setShowTemplateUpload(false);
            setTemplateFile(null);
            setTemplateTitle('');
            fetchCertificateTemplates();
        } catch (error) {
            console.error('Error uploading template:', error);
            alert('Gagal mengupload template');
        }
    };

    const exportToExcel = async () => {
        try {
            const response = await api.get(`/events/${eventId}/attendance/export`);
            const data = response.data.data;
            
            // Convert to CSV format
            const headers = ['Nama', 'Email', 'Status', 'Waktu Absensi', 'Bukti Foto'];
            const csvContent = [
                headers.join(','),
                ...data.participants.map(p => [
                    p.Nama,
                    p.Email,
                    p.Status,
                    p['Waktu Absensi'],
                    p['Bukti Foto']
                ].join(','))
            ].join('\n');
            
            // Download file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Peserta_${data.event_title}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting:', error);
            alert('Gagal export data');
        }
    };

    const viewProofPhoto = (photoPath) => {
        setSelectedPhoto(photoPath);
        setShowPhotoModal(true);
    };

    return (
        <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Kelola Peserta & Sertifikat</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md col-span-2">
                    <p className="font-semibold">
                        Batas Waktu Absensi Acara: {event.absent_deadline ? 
                            `${event.date} ${event.absent_deadline}` : 
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-white p-4 rounded-md shadow border-t-4 border-blue-500">
                    <p className="text-sm text-gray-500">Kuota Peserta</p>
                    <p className={`text-3xl font-bold ${
                        event.capacity && participants.length >= event.capacity 
                            ? 'text-red-600' 
                            : event.capacity && participants.length >= event.capacity * 0.8 
                            ? 'text-orange-600' 
                            : 'text-blue-600'
                    }`}>
                        {participants.length} / {event.capacity || '∞'}
                    </p>
                    {event.capacity && participants.length >= event.capacity && (
                        <p className="text-xs text-red-500 font-semibold">PENUH</p>
                    )}
                </div>
                <div className="bg-green-100 p-4 rounded-md shadow border-t-4 border-green-500">
                    <p className="text-sm text-gray-500">Sudah Absen Real-Time</p>
                    <p className="text-3xl font-bold text-green-600">{participants.filter(p => p.attendance_status === 'present').length}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-md shadow border-t-4 border-yellow-600">
                    <p className="text-sm text-gray-500">Belum Absen</p>
                    <p className="text-3xl font-bold text-yellow-700">
                        {participants.length - participants.filter(p => p.attendance_status === 'present').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-md shadow border-t-4 border-gray-400">
                    <p className="text-sm text-gray-500">Sertifikat Diterbitkan</p>
                    <p className="text-3xl font-bold text-gray-800">{participants.filter(p => p.certificate_issued).length}</p>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Manajemen Template & Validasi Sertifikat</h2>
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => setShowTemplateUpload(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Upload Template
                    </button>
                    <button 
                        onClick={generateCertificatesForAttendees}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                        Generate Sertifikat + Email
                    </button>
                    <button 
                        onClick={sendBulkCertificateEmail}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Kirim Email Massal
                    </button>
                    <button 
                        onClick={() => navigate(`/admin/events/${eventId}/certificates`)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Kelola Sertifikat
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Daftar Peserta & Status Absensi (Real-Time)</h2>
                    <button 
                        onClick={() => exportToExcel()}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        Export Excel
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {["Nama", "Email/ID Peserta", "Kode Absensi", "Waktu Absensi", "Status Sertifikat", "Bukti Foto", "Absensi"].map((header) => (
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
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${participant.certificate_issued ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {participant.certificate_issued ? 'Diterbitkan' : 'Belum'}
                                            </span>
                                            {participant.certificate_issued && participant.email && (
                                                <button
                                                    onClick={() => sendIndividualCertificateEmail(participant.id, participant.email)}
                                                    className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition"
                                                    title="Kirim email sertifikat"
                                                >
                                                    Kirim Email
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {participant.attendances && participant.attendances[0]?.proof_photo ? (
                                            <button 
                                                onClick={() => viewProofPhoto(participant.attendances[0].proof_photo)}
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                Lihat Foto
                                            </button>
                                        ) : (
                                            <span className="text-gray-500">Tidak ada</span>
                                        )}
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
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Template Sertifikat</h2>
                {certificateTemplates.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📄</div>
                        <p>Belum ada template sertifikat yang diupload</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {certificateTemplates.map((template) => (
                            <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                <div className="aspect-video bg-gray-100 rounded mb-3 overflow-hidden">
                                    {template.file_path ? (
                                        <img 
                                            key={template.file_path + Date.now()}
                                            src={`http://localhost:8000/storage/${template.file_path}?v=${Date.now()}`}
                                            alt={template.template_name}
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={() => showTemplatePreviewModal(template)}
                                            onError={(e) => {
                                                console.error('Template preview failed to load:', e.target.src);
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className="w-full h-full flex items-center justify-center text-gray-400" style={{display: template.file_path ? 'none' : 'flex'}}>
                                        <span>No Preview</span>
                                    </div>
                                </div>
                                <h3 className="font-medium text-gray-900 mb-2">{template.template_name}</h3>
                                <p className="text-xs text-gray-500 mb-3">
                                    Dibuat: {new Date(template.created_at).toLocaleDateString('id-ID')}
                                </p>
                                <button 
                                    onClick={() => showTemplatePreviewModal(template)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition"
                                >
                                    Lihat Preview
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
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

            {showTemplateUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Upload Template Sertifikat</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Judul Template</label>
                            <input
                                type="text"
                                value={templateTitle}
                                onChange={(e) => setTemplateTitle(e.target.value)}
                                className="w-full border rounded-lg p-3"
                                placeholder="Masukkan judul template"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">File Template</label>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setTemplateFile(e.target.files[0])}
                                className="w-full border rounded-lg p-3"
                            />
                            <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, PDF (Max: 10MB)</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowTemplateUpload(false);
                                    setTemplateFile(null);
                                    setTemplateTitle('');
                                }}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={uploadTemplate}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showChangePinDialog && (
                <ChangePinDialog
                    currentPin={attendancePin}
                    onClose={() => setShowChangePinDialog(false)}
                    onSave={handleChangePin}
                />
            )}

            {/* Photo Modal */}
            {showPhotoModal && selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Bukti Foto Absensi</h3>
                            <button
                                onClick={() => setShowPhotoModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="text-center">
                            <img 
                                src={`http://localhost:8000/storage/${selectedPhoto}?v=${Date.now()}`}
                                alt="Bukti Absensi"
                                className="max-w-full max-h-96 mx-auto rounded border"
                                onError={(e) => {
                                    console.error('Photo failed to load:', e.target.src);
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'block';
                                }}
                            />
                            <div className="text-center text-gray-500 py-8" style={{display: 'none'}}>
                                <p>Foto tidak dapat ditampilkan</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowPhotoModal(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function EventManagement() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [tokenChecked, setTokenChecked] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [attendancePin, setAttendancePin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [showUploadMaterial, setShowUploadMaterial] = useState(false);
    const [showThumbnailUpload, setShowThumbnailUpload] = useState(false);
    const [pinDeadline, setPinDeadline] = useState('');
    const [showCertificateTemplate, setShowCertificateTemplate] = useState(false);
    const [certificateTemplate, setCertificateTemplate] = useState({ title: '', content: '' });
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [showEditMaterial, setShowEditMaterial] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState(null);
    const [certificateTemplates, setCertificateTemplates] = useState([]);
    const [showTemplatePreview, setShowTemplatePreview] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState(null);

    useEffect(() => {
        if (tokenChecked) return;
        
        const token = localStorage.getItem('adminAuthToken');
        if (!token) {
            console.error('No admin token found');
            navigate('/admin/login');
            return;
        }
        
        setTokenChecked(true);
        fetchEventData();
        fetchParticipants();
        fetchMaterials();
        fetchAttendancePin();
        fetchCertificateTemplates();
    }, [eventId, tokenChecked, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchParticipants();
        }, 30000); // Refresh every 30 seconds
        
        return () => {
            clearInterval(interval);
            clearRedirectTimeout(); // Clear any pending redirects
        };
    }, [eventId]);

    const fetchEventData = async () => {
        try {
            setError(null); // Clear any previous errors
            console.log('Fetching event data for ID:', eventId);
            const response = await api.get(`/events/${eventId}`);
            console.log('Event data response:', response.data);
            console.log('Event thumbnail:', response.data.data?.thumbnail);
            setEvent(response.data.data);
        } catch (error) {
            console.error("Error fetching event:", error);
            // Don't handle 401 here, let axios interceptor handle it
            if (error.response?.status === 404) {
                setError('Acara tidak ditemukan');
            } else if (error.response?.status !== 401) {
                // Only set error for non-auth errors
                setError('Gagal memuat data acara');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipants = async () => {
        try {
            console.log('Fetching participants for event ID:', eventId);
            const response = await api.get(`/admin/events/${eventId}/participants`);
            console.log('Participants response:', response.data);
            console.log('Raw participants data:', response.data.data);
            const participantsData = response.data.data || [];
            
            // Map participants with attendance status from database
            const participantsWithAttendance = participantsData.map(participant => ({
                ...participant,
                attendance_status: participant.attendances && participant.attendances.length > 0 ? 'present' : 'absent',
                attendance_time: participant.attendances && participant.attendances.length > 0 ? participant.attendances[0].check_in_time : null,
                attendance_code: participant.attendances && participant.attendances.length > 0 ? participant.attendances[0].id : null
            }));
            
            console.log('Participants with attendance data:', participantsWithAttendance);
            setParticipants(participantsWithAttendance);
        } catch (error) {
            console.error("Error fetching participants:", error);
            // Don't handle 401 here, let axios interceptor handle it
        }
    };

    const fetchMaterials = async () => {
        try {
            const response = await api.get(`/events/${eventId}/materials`);
            setMaterials(response.data.data || []);
        } catch (error) {
            console.error("Error fetching materials:", error);
        }
    };

    const fetchAttendancePin = async () => {
        try {
            const response = await api.get(`/events/${eventId}`);
            setAttendancePin(response.data.data.attendance_pin || '');
        } catch (error) {
            console.error("Error fetching attendance PIN:", error);
        }
    };

    const fetchCertificateTemplates = async () => {
        try {
            console.log('Fetching templates for event:', eventId);
            const response = await api.get('/certificate-templates');
            console.log('All templates response:', response.data);
            const allTemplates = response.data || [];
            const eventTemplates = allTemplates.filter(t => t.event_id == eventId);
            console.log('Filtered templates for event:', eventTemplates);
            setCertificateTemplates(eventTemplates);
        } catch (error) {
            console.error("Error fetching certificate templates:", error);
        }
    };

    const showTemplatePreviewModal = (template) => {
        setPreviewTemplate(template);
        setShowTemplatePreview(true);
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

    const updateEventField = async (field, value) => {
        try {
            await api.put(`/events/${eventId}`, { [field]: value });
            setEvent({ ...event, [field]: value });
            alert(`${field === 'date' ? 'Tanggal' : field === 'capacity' ? 'Kapasitas' : 'Lokasi'} berhasil diubah!`);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            alert(`Gagal mengubah ${field}`);
        }
    };

    const updateAttendanceDeadline = async (newDeadline) => {
        try {
            await api.put(`/events/${eventId}`, { absent_deadline: newDeadline });
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
            await api.put(`/events/${eventId}`, { registration_open: newStatus });
            setEvent({ ...event, registration_open: newStatus });
            alert(`Pendaftaran ${newStatus ? 'dibuka' : 'ditutup'}!`);
            fetchEventData();
        } catch (error) {
            console.error("Error toggling event status:", error);
            alert("Gagal mengubah status pendaftaran");
        }
    };

    const deleteEvent = async () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus acara ini? Semua data terkait akan hilang.")) {
            try {
                console.log('Attempting to delete event with ID:', eventId);
                const response = await api.delete(`/events/${eventId}`);
                console.log('Delete response:', response.data);
                alert("Acara berhasil dihapus!");
                navigate("/admin/dashboard");
            } catch (error) {
                console.error("Error deleting event:", error);
                console.error("Error response:", error.response);
                console.error("Error status:", error.response?.status);
                console.error("Error data:", error.response?.data);
                const errorMsg = error.response?.data?.message || `Gagal menghapus acara (${error.response?.status || 'Unknown error'})`;
                alert(errorMsg);
            }
        }
    };

    const publishEvent = async () => {
        try {
            await api.put(`/events/${eventId}`, { status: 'published' });
            setEvent({ ...event, status: 'published' });
            alert("Acara berhasil dipublikasikan!");
            fetchEventData();
        } catch (error) {
            console.error("Error publishing event:", error);
            alert("Gagal mempublikasikan acara");
        }
    };

    const unpublishEvent = async () => {
        if (window.confirm("Yakin menjadikan acara ini draft? Acara tidak akan terlihat peserta.")) {
            try {
                await api.put(`/events/${eventId}`, { status: 'draft' });
                setEvent({ ...event, status: 'draft' });
                alert("Acara dijadikan draft!");
                fetchEventData();
            } catch (error) {
                console.error("Error unpublishing event:", error);
                alert("Gagal menjadikan draft");
            }
        }
    };

    const handleUploadMaterial = async (eventId, title, file) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        const response = await api.post(`/events/${eventId}/materials`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        alert("Materi berhasil diupload!");
        fetchMaterials(); // Refresh the materials list
        setShowUploadMaterial(false); // Hide upload form
        return response;
    };

    const handleUploadThumbnail = async (file) => {
        if (!file) {
            alert('Pilih file thumbnail terlebih dahulu');
            return;
        }
        
        try {
            console.log('Uploading thumbnail for event:', eventId);
            const formData = new FormData();
            formData.append('thumbnail', file);
            
            const response = await api.post(`/admin/events/${eventId}/thumbnail`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            console.log('Upload response:', response.data);
            alert('Thumbnail berhasil diupload!');
            
            // Update event state immediately
            if (response.data.data && response.data.data.thumbnail) {
                setEvent(prev => ({ ...prev, thumbnail: response.data.data.thumbnail }));
            }
            
            setShowThumbnailUpload(false);
            await fetchEventData();
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            console.error('Error response:', error.response?.data);
            alert('Gagal mengupload thumbnail: ' + (error.response?.data?.message || error.message));
        }
    };

    const showDeleteConfirmation = (material) => {
        setMaterialToDelete(material);
        setShowDeleteDialog(true);
    };

    const deleteMaterial = async () => {
        try {
            await api.delete(`/materials/${materialToDelete.id}`);
            alert('Materi berhasil dihapus!');
            fetchMaterials();
            setShowDeleteDialog(false);
            setMaterialToDelete(null);
        } catch (error) {
            console.error('Error deleting material:', error);
            alert('Gagal menghapus materi');
        }
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false);
        setMaterialToDelete(null);
    };

    const downloadMaterial = (materialId, filename) => {
        window.open(`${api.defaults.baseURL}/materials/${materialId}/download`, '_blank');
    };

    const editMaterial = (material) => {
        setEditingMaterial(material);
        setShowEditMaterial(true);
    };

    const updateMaterial = async (data) => {
        try {
            const formData = new FormData();
            formData.append('title', data.newName);
            if (data.newFile) {
                formData.append('file', data.newFile);
            }
            formData.append('_method', 'PUT');

            await api.post(`/materials/${editingMaterial.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Materi berhasil diperbarui!');
            fetchMaterials();
            setShowEditMaterial(false);
            setEditingMaterial(null);
        } catch (error) {
            console.error('Error updating material:', error);
            alert('Gagal memperbarui materi');
        }
    };

    const closeEditDialog = () => {
        setShowEditMaterial(false);
        setEditingMaterial(null);
    };

    const generatePinWithDeadline = async () => {
        if (!pinDeadline) {
            alert('Harap tentukan batas waktu absensi');
            return;
        }
        
        try {
            // Generate random 6-digit PIN
            const newPin = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Update event with new PIN and deadline
            await api.put(`/events/${eventId}`, {
                attendance_pin: newPin,
                absent_deadline: pinDeadline + ':00'
            });
            
            setAttendancePin(newPin);
            await fetchEventData();
            await fetchParticipants();
            setPinDeadline('');
            alert('PIN absensi berhasil dibuat!');
        } catch (error) {
            console.error('Error generating PIN:', error);
            const errorMsg = error.response?.data?.message || 'Gagal membuat PIN absensi';
            alert(errorMsg);
        }
    };

    const createCertificateTemplate = async () => {
        try {
            await api.post('/certificate-templates', {
                event_id: eventId,
                title: certificateTemplate.title,
                content: certificateTemplate.content
            });
            alert('Template sertifikat berhasil dibuat!');
            setShowCertificateTemplate(false);
            setCertificateTemplate({ title: '', content: '' });
        } catch (error) {
            console.error('Error creating certificate template:', error);
            alert('Gagal membuat template sertifikat');
        }
    };

    const handleNavigate = (tab) => {
        if (tab === 'materials') {
            setActiveTab('materials');
            setShowUploadMaterial(false);
        } else if (tab === 'admin-dashboard') {
            navigate('/admin/dashboard');
        } else {
            setActiveTab(tab);
            setShowUploadMaterial(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearRedirectTimeout();
        };
    }, []);

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

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <div className="space-x-4">
                        <button 
                            onClick={() => {
                                setError(null);
                                setLoading(true);
                                fetchEventData();
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Coba Lagi
                        </button>
                        <Link 
                            to="/admin/dashboard" 
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 inline-block"
                        >
                            Kembali ke Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!event && !loading) {
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
                        <span className="text-yellow-400">⚡SIMATRO ADMIN</span> <span className="text-sm">UNIVERSITAS LAMPUNG</span>
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
                                clearAdminAuth();
                                clearRedirectTimeout();
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
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    {/* Thumbnail Section */}
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                        {event.thumbnail ? (
                            <img 
                                key={event.thumbnail}
                                src={`http://localhost:8000/storage/${event.thumbnail}`} 
                                alt={event.title}
                                className="w-full h-full object-cover"
                                onLoad={() => console.log('Thumbnail loaded:', event.thumbnail)}
                                onError={(e) => {
                                    console.error('Thumbnail failed to load:', e.target.src);
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div className={`flex items-center justify-center h-full text-white ${event.thumbnail ? 'hidden' : 'flex'}`}>
                            <div className="text-center">
                                <div className="text-4xl mb-2">🎯</div>
                                <p className="text-lg font-semibold">{event.title}</p>
                                <p className="text-sm mt-2 opacity-75">Belum ada thumbnail</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowThumbnailUpload(true)}
                            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm hover:bg-opacity-70 transition"
                        >
                            📷 {event.thumbnail ? 'Ganti' : 'Upload'} Thumbnail
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                                <p className="text-gray-600 mt-1">{event.category} • {event.date}</p>
                            </div>
                            <div className="flex gap-2">
                                {event.status === 'draft' ? (
                                    <button
                                        onClick={publishEvent}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition"
                                    >
                                        📢 Publikasikan
                                    </button>
                                ) : (
                                    <button
                                        onClick={unpublishEvent}
                                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded transition"
                                    >
                                         Jadikan Draft
                                    </button>
                                )}
                                <button
                                    onClick={toggleEventStatus}
                                    className={`px-4 py-2 text-white text-sm font-semibold rounded transition ${
                                        event.registration_open
                                            ? 'bg-orange-600 hover:bg-orange-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {event.registration_open ? ' Tutup Pendaftaran' : ' Buka Pendaftaran'}
                                </button>
                                <button
                                    onClick={deleteEvent}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition"
                                >
                                    Hapus Acara
                                </button>
                            </div>
                    </div>

                        {/* Status Badges */}
                        <div className="flex gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                event.status === 'published'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {event.status === 'published' ? '' : ''}
                                {event.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                event.registration_open
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {event.registration_open ? '' : ''}
                                {event.registration_open ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
                            </span>
                        </div>
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
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Ringkasan Acara</h3>
                                <button
                                    onClick={() => {
                                        fetchEventData();
                                        fetchParticipants();
                                        fetchMaterials();
                                    }}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                                >
                                    Refresh Data
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                                    <p className="text-sm text-gray-600">Kuota Peserta</p>
                                    <p className={`text-3xl font-bold ${
                                        event.capacity && participants.length >= event.capacity 
                                            ? 'text-red-600' 
                                            : event.capacity && participants.length >= event.capacity * 0.8 
                                            ? 'text-orange-600' 
                                            : 'text-blue-600'
                                    }`}>
                                        {participants.length} / {event.capacity || '∞'}
                                    </p>
                                    {event.capacity && participants.length >= event.capacity && (
                                        <p className="text-xs text-red-500 font-semibold">PENUH</p>
                                    )}
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                                    <p className="text-sm text-gray-600">Hadir</p>
                                    <p className="text-3xl font-bold text-green-600">{participants.filter(p => p.attendance_status === 'present').length}</p>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded p-4 text-center">
                                    <p className="text-sm text-gray-600">Sertifikat</p>
                                    <p className="text-3xl font-bold text-amber-600">{participants.filter(p => p.certificate_issued).length}</p>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded p-4 text-center">
                                    <p className="text-sm text-gray-600">Materi</p>
                                    <p className="text-3xl font-bold text-purple-600">{materials.length}</p>
                                </div>
                            </div>


                        </div>
                    )}

                    {activeTab === 'participants' && (
                        <ParticipantManagementContent 
                            eventId={eventId}
                            event={event}
                            participants={participants}
                            attendancePin={attendancePin}
                            setAttendancePin={setAttendancePin}
                            fetchParticipants={fetchParticipants}
                            certificateTemplates={certificateTemplates}
                            showTemplatePreviewModal={showTemplatePreviewModal}
                            fetchCertificateTemplates={fetchCertificateTemplates}
                        />
                    )}

                    {activeTab === 'materials' && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Kelola & Upload Materi</h3>
                            <div className="mb-4">
                                <button
                                    onClick={() => setShowUploadMaterial(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition"
                                >
                                    Upload Materi Baru
                                </button>
                            </div>

                            {showUploadMaterial && (
                                <div className="mb-6">
                                    <UploadMaterial
                                        event={event}
                                        onUpload={handleUploadMaterial}
                                        onNavigate={handleNavigate}
                                    />
                                </div>
                            )}

                            <div className="space-y-3">
                                {materials.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="text-4xl mb-2">📁</div>
                                        <p>Belum ada materi yang diupload</p>
                                    </div>
                                ) : (
                                    materials.map(material => (
                                        <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{material.title}</p>
                                                <p className="text-sm text-gray-600">{material.filename}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Diupload: {new Date(material.created_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => downloadMaterial(material.id, material.filename)}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                                                >
                                                     Download
                                                </button>
                                                <button 
                                                    onClick={() => editMaterial(material)}
                                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
                                                >
                                                     Edit
                                                </button>
                                                <button 
                                                    onClick={() => showDeleteConfirmation(material)}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                                                >
                                                     Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}



                    {activeTab === 'settings' && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Acara</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Acara
                                    </label>
                                    <input
                                        type="date"
                                        value={event.date || ''}
                                        onChange={(e) => setEvent({ ...event, date: e.target.value })}
                                        onBlur={(e) => updateEventField('date', e.target.value)}
                                        className="border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Batas Waktu Absensi
                                    </label>
                                    <input
                                        type="time"
                                        value={event.absent_deadline || ''}
                                        onChange={(e) => setEvent({ ...event, absent_deadline: e.target.value })}
                                        onBlur={(e) => updateAttendanceDeadline(e.target.value)}
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
                                        onBlur={(e) => updateEventField('capacity', e.target.value)}
                                        className="border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lokasi Acara
                                    </label>
                                    <input
                                        type="text"
                                        value={event.location || ''}
                                        onChange={(e) => setEvent({ ...event, location: e.target.value })}
                                        onBlur={(e) => updateEventField('location', e.target.value)}
                                        className="border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Masukkan lokasi acara"
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
                © 2025 SIMATRO Universitas Lampung. Admin Panel.
            </footer>

            {/* Thumbnail Upload Modal */}
            {showThumbnailUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Upload Thumbnail Acara</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih File Gambar
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                id="thumbnailInput"
                                className="w-full border rounded-lg p-3"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Format: JPG, PNG, GIF (Max: 5MB)
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowThumbnailUpload(false)}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    const fileInput = document.getElementById('thumbnailInput');
                                    const file = fileInput.files[0];
                                    if (file) {
                                        handleUploadThumbnail(file);
                                    } else {
                                        alert('Pilih file terlebih dahulu');
                                    }
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Material Dialog */}
            {showEditMaterial && editingMaterial && (
                <EditMaterialDialog
                    materialTitle={editingMaterial.title}
                    onClose={closeEditDialog}
                    onSave={updateMaterial}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && materialToDelete && (
                <DeleteConfirmationDialog
                    materialName={materialToDelete.title}
                    onCancel={cancelDelete}
                    onDelete={deleteMaterial}
                />
            )}

            {/* Template Preview Modal */}
            {showTemplatePreview && previewTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Preview Template: {previewTemplate.template_name}</h3>
                                <button
                                    onClick={() => setShowTemplatePreview(false)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="text-center">
                                {previewTemplate.file_path ? (
                                    <img 
                                        key={previewTemplate.file_path + Date.now()}
                                        src={`http://localhost:8000/storage/${previewTemplate.file_path}?v=${Date.now()}`}
                                        alt={previewTemplate.template_name}
                                        className="max-w-full max-h-[70vh] mx-auto border rounded"
                                        onError={(e) => {
                                            console.error('Template modal preview failed to load:', e.target.src);
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'block';
                                        }}
                                    />
                                ) : null}
                                <div className="py-20 text-gray-500" style={{display: previewTemplate.file_path ? 'none' : 'block'}}>
                                    <p>Template tidak dapat ditampilkan</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setShowTemplatePreview(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
