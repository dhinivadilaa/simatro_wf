// --- File: src/pages/Events/EventDetail/EventDetail.jsx ---

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../api/axios";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMaterials, setLoadingMaterials] = useState(true);
    const [previewMaterial, setPreviewMaterial] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (id) {
            loadEvent();
            loadMaterials();
        }
    }, [id]);

    const loadEvent = async () => {
        try {
            const res = await api.get(`/events/${id}`);
            setEvent(res.data.data || res.data);
        } catch (error) {
            console.error("Gagal memuat event:", error);
            setEvent(null);
        } finally {
            setLoading(false);
        }
    };

    const loadMaterials = async () => {
        try {
            const res = await api.get(`/events/${id}/materials`);
            setMaterials(res.data.data || res.data || []);
        } catch (error) {
            console.error("Gagal memuat materi:", error);
            setMaterials([]);
        } finally {
            setLoadingMaterials(false);
        }
    };

    const handleDownloadMaterial = async (materialId, filename) => {
        try {
            const response = await api.get(`/materials/${materialId}/download`, {
                responseType: 'blob'
            });
            
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading material:', error);
            alert('Gagal mendownload materi');
        }
    };

    const getFileIcon = (filename) => {
        if (!filename) return ;
        const extension = filename.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf': return ;
            case 'ppt': case 'pptx': return ;
            case 'doc': case 'docx': return ;
            default: return ;
        }
    };

    const handlePreviewMaterial = (material) => {
        setPreviewMaterial(material);
        setShowPreview(true);
    };

    const getPreviewUrl = (material) => {
        return `${api.defaults.baseURL}/materials/${material.id}/download?preview=true`;
    };

    // Error boundary untuk menangani error
    if (!event && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Event tidak ditemukan</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    // --- Fungsi Bantuan ---

    // ... (Fungsi getTagClass jika diperlukan) ...
    // ... (Fungsi format waktu jika diperlukan) ...


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="w-full px-6 md:px-12 py-12 flex-1">
                <button className="text-sm text-blue-600 mb-4" onClick={() => navigate('/')}>← Kembali ke Daftar Acara</button>

                <div className="bg-white rounded-2xl p-8 shadow w-full">
                    <h1 className="text-2xl font-bold text-gray-900">{event?.title || 'Loading...'}</h1>
                    <div className="h-1 bg-yellow-400 w-full my-4 rounded"></div>

                    <h2 className="text-lg font-semibold text-gray-800 mt-4">Materi dan Informasi Acara</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-sm text-gray-600 flex items-center gap-2">Waktu Pelaksanaan</div>
                            <p className="font-semibold text-gray-800 mt-1">{event?.date || 'Belum ditentukan'}</p>
                            <p className="text-sm text-gray-600">{event?.time || ''}</p>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-sm text-gray-600 flex items-center gap-2"> Lokasi Acara</div>
                            <p className="font-semibold text-gray-800 mt-1">{event?.location || 'Belum ditentukan'}</p>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-sm text-gray-600 flex items-center gap-2">Kuota Peserta</div>
                            <p className="font-semibold text-gray-800 mt-1">{event?.registered || 0} / {event?.capacity || 'Unlimited'}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <h2 className="text-lg font-semibold text-gray-800">Materi Acara</h2>
                        {!loadingMaterials && (
                            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {materials.length} materi tersedia
                            </span>
                        )}
                    </div>
                    {loadingMaterials ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Memuat materi...</span>
                        </div>
                    ) : materials.length > 0 ? (
                        <div className="space-y-3 mt-4">
                            {materials.map((material) => (
                                <div key={material.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getFileIcon(material.filename)}</span>
                                        <div>
                                            <p className="font-semibold text-gray-800">{material?.title || 'Untitled'}</p>
                                            <p className="text-sm text-gray-600">{material?.filename || 'Unknown file'}</p>
                                            <p className="text-xs text-gray-500">
                                                Diupload: {material?.created_at ? new Date(material.created_at).toLocaleDateString('id-ID') : 'Unknown'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePreviewMaterial(material)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                        Lihat
                                        </button>
                                        <button
                                            onClick={() => handleDownloadMaterial(material.id, material.filename)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                        Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center mt-4">
                            <p className="text-gray-600">Belum ada materi tersedia untuk acara ini.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div onClick={() => navigate(`/events/${id}/register`)} className="p-4 rounded-xl bg-green-50 border border-green-200 cursor-pointer hover:shadow-md transition-shadow">
                            <h3 className="font-semibold flex items-center gap-2">
                            Pendaftaran
                            </h3>
                            <p className="text-sm text-gray-600">Jika Berminat, Silahkan Daftar disini</p>
                            <button className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">Daftar Sekarang</button>
                        </div>

                        <div onClick={() => navigate(`/status?eventId=${id}`)} className="p-4 rounded-xl bg-blue-50 border border-blue-200 cursor-pointer hover:shadow-md transition-shadow">
                            <h3 className="font-semibold flex items-center gap-2">
                            Status & Sertifikat
                            </h3>
                            <p className="text-sm text-gray-600">Cek status absensi dan sertifikat</p>
                            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">Cek Status</button>
                        </div>

                        <div onClick={() => navigate('/riwayat')} className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 cursor-pointer hover:shadow-md transition-shadow">
                            <h3 className="font-semibold flex items-center gap-2">
                            Riwayat Event
                            </h3>
                            <p className="text-sm text-gray-600">Lihat riwayat dan sertifikat</p>
                            <button className="mt-3 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors">Lihat Riwayat</button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Preview Modal */}
            {showPreview && previewMaterial && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">{previewMaterial.title}</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex-1 p-4">
                            <iframe
                                src={getPreviewUrl(previewMaterial)}
                                className="w-full h-full border rounded"
                                title={previewMaterial.title}
                            />
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2">
                            <button
                                onClick={() => handleDownloadMaterial(previewMaterial.id, previewMaterial.filename)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Download
                            </button>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
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