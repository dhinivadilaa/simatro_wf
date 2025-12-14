import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function CertificateTemplate() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [template, setTemplate] = useState({ title: '', templateFile: null });
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [showUploadTemplate, setShowUploadTemplate] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [showCertificates, setShowCertificates] = useState(false);

    useEffect(() => {
        fetchEventData();
        fetchTemplates();
    }, [eventId]);

    const fetchEventData = async () => {
        try {
            const response = await api.get(`/events/${eventId}`);
            setEvent(response.data.data);
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await api.get('/certificate-templates');
            setTemplates(response.data.filter(t => t.event_id == eventId));
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const createTemplate = async () => {
        if (!template.title || !template.templateFile) {
            alert('Harap isi nama template dan pilih file!');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('event_id', eventId);
            formData.append('title', template.title);
            formData.append('template_file', template.templateFile);

            const response = await api.post('/certificate-templates', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            console.log('Upload response:', response.data);
            alert('Template sertifikat berhasil diupload!');
            setShowCreateForm(false);
            setTemplate({ title: '', templateFile: null });
            fetchTemplates();
        } catch (error) {
            console.error('Error creating template:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || 'Gagal mengupload template sertifikat';
            alert(errorMsg);
        }
    };

    const deleteTemplate = async (id) => {
        if (window.confirm('Yakin ingin menghapus template ini?')) {
            try {
                await api.delete(`/certificate-templates/${id}`);
                alert('Template berhasil dihapus!');
                fetchTemplates();
            } catch (error) {
                console.error('Error deleting template:', error);
                alert('Gagal menghapus template');
            }
        }
    };

    const startEdit = (tmpl) => {
        setEditingTemplate(tmpl);
        setTemplate({ title: tmpl.template_name, templateFile: null });
        setShowCreateForm(true);
    };

    const updateTemplate = async () => {
        try {
            const formData = new FormData();
            formData.append('title', template.title);
            formData.append('_method', 'PUT');
            if (template.templateFile) {
                formData.append('template_file', template.templateFile);
            }

            await api.post(`/certificate-templates/${editingTemplate.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Template berhasil diperbarui!');
            setEditingTemplate(null);
            setShowCreateForm(false);
            setTemplate({ title: '', templateFile: null });
            fetchTemplates();
        } catch (error) {
            console.error('Error updating template:', error);
            alert('Gagal memperbarui template');
        }
    };

    const cancelEdit = () => {
        setEditingTemplate(null);
        setShowCreateForm(false);
        setTemplate({ title: '', templateFile: null });
    };

    const previewCertificate = (tmpl) => {
        setPreviewTemplate(tmpl);
    };

    const generateCertificates = async (templateId) => {
        if (!window.confirm('Generate sertifikat untuk semua peserta yang hadir? Sertifikat akan dibuat dengan nama peserta, tanggal event, dan judul event.')) {
            return;
        }
        
        try {
            const response = await api.post(`/certificate-templates/${templateId}/generate`);
            alert(response.data.message);
            fetchCertificates();
        } catch (error) {
            console.error('Error generating certificates:', error);
            const errorMsg = error.response?.data?.message || 'Gagal generate sertifikat';
            alert(errorMsg);
        }
    };

    const fetchCertificates = async () => {
        try {
            const response = await api.get(`/events/${eventId}/certificates`);
            setCertificates(response.data.data || []);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        }
    };

    const viewCertificates = () => {
        fetchCertificates();
        setShowCertificates(true);
    };

    const downloadCertificate = async (certificateId) => {
        try {
            const response = await api.get(`/certificates/${certificateId}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sertifikat_${certificateId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading certificate:', error);
            alert('Gagal mendownload sertifikat');
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

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-900 text-white px-6 py-4 shadow-lg">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold">
                        <span className="text-yellow-400">⚡SIMATRO ADMIN</span> <span className="text-sm">UNIVERSITAS LAMPUNG</span>
                    </h1>
                    <button
                        onClick={() => navigate(`/admin/events/${eventId}/manage`)}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-sm font-semibold transition"
                    >
                        Kembali ke Event
                    </button>
                </div>
            </header>

            <main className="px-6 md:px-12 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Template Sertifikat</h2>
                            <p className="text-gray-600">{event?.title}</p>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
                        >
                        Upload Template Sertifikat
                        </button>
                    </div>

                    {showCreateForm && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold mb-4">
                                Upload Template Sertifikat dari Desain
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Template
                                        </label>
                                        <input
                                            type="text"
                                            value={template.title}
                                            onChange={(e) => setTemplate({...template, title: e.target.value})}
                                            placeholder="Contoh: Template Sertifikat EEA 2025"
                                            className="w-full border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload File Template
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => setTemplate({...template, templateFile: e.target.files[0]})}
                                            className="w-full border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <div className="mt-2 text-xs text-gray-500">
                                            <p className="font-medium mb-1">Format yang didukung:</p>
                                            <p>• JPG, PNG, PDF dari Canva atau desain lainnya</p>
                                            <p className="text-orange-600 font-medium mt-1">Template akan digunakan untuk semua peserta yang hadir</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={editingTemplate ? updateTemplate : createTemplate}
                                            disabled={!template.title || (!template.templateFile && !editingTemplate)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded transition"
                                        >
                                            {editingTemplate ? 'Perbarui Template' : 'Upload Template'}
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded transition"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                                
                                {/* File Preview */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preview File
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white min-h-[300px] flex items-center justify-center">
                                        {template.templateFile ? (
                                            <div className="text-center">
                                                <p className="font-medium">{template.templateFile.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {(template.templateFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                <p>Upload file template sertifikat</p>
                                                <p className="text-sm">dari Canva atau desain lainnya</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <h3 className="text-lg font-medium mb-2">Belum ada template sertifikat</h3>
                                <p>Buat template pertama Anda untuk mulai mengeluarkan sertifikat!</p>
                            </div>
                        ) : (
                            templates.map(tmpl => (
                                <div key={tmpl.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-semibold text-gray-900 text-lg">{tmpl.template_name}</h4>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Aktif</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Template file: {tmpl.file_path ? tmpl.file_path.split('/').pop() : 'Tidak ada file'}
                                    </p>
                                    {tmpl.file_path && (
                                        <p className="text-xs text-gray-400 mb-2">
                                            Path: {tmpl.file_path}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <button 
                                            onClick={() => previewCertificate(tmpl)}
                                            className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-sm font-medium"
                                        >
                                        Preview
                                        </button>
                                        <button 
                                            onClick={() => generateCertificates(tmpl.id)}
                                            className="text-purple-600 hover:bg-purple-50 px-2 py-1 rounded text-sm font-medium"
                                        >
                                        Generate Sertifikat
                                        </button>
                                        <button 
                                            onClick={() => viewCertificates()}
                                            className="text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded text-sm font-medium"
                                        >
                                        Daftar Peserta
                                        </button>
                                        <button 
                                            onClick={() => startEdit(tmpl)}
                                            className="text-green-600 hover:bg-green-50 px-2 py-1 rounded text-sm font-medium"
                                        >
                                        Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteTemplate(tmpl.id)}
                                            className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm font-medium"
                                        >
                                        Hapus
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Preview Modal */}
                    {previewTemplate && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Preview: {previewTemplate.template_name}</h3>
                                        <button 
                                            onClick={() => setPreviewTemplate(null)}
                                            className="text-gray-500 hover:text-gray-700 text-xl"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="flex justify-center">
                                        {previewTemplate.file_path ? (
                                            <div className="text-center">
                                                <img 
                                                    src={`http://localhost:8000/storage/${previewTemplate.file_path}`}
                                                    alt={previewTemplate.template_name}
                                                    className="max-w-full max-h-[70vh] object-contain border rounded-lg shadow-lg"
                                                    onLoad={(e) => console.log('Image loaded:', e.target.src)}
                                                    onError={(e) => {
                                                        console.error('Image failed to load:', e.target.src);
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'block';
                                                    }}
                                                />
                                                <div className="text-center text-gray-500 hidden">
                                                    <p>Template tidak dapat ditampilkan</p>
                                                    <p className="text-sm mt-2">Path: {previewTemplate.file_path}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                <p>Tidak ada file template</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button 
                                            onClick={() => setPreviewTemplate(null)}
                                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Certificates List Modal */}
                    {showCertificates && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Sertifikat yang Telah Dibuat</h3>
                                        <button 
                                            onClick={() => setShowCertificates(false)}
                                            className="text-gray-500 hover:text-gray-700 text-xl"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    
                                    {certificates.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Belum ada sertifikat yang dibuat</p>
                                            <p className="text-sm">Generate sertifikat terlebih dahulu</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {certificates.map(cert => (
                                                <div key={cert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-lg text-gray-900">{cert.participant_name || cert.participant?.name}</h4>
                                                            <div className="mt-2 space-y-1">
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-medium">Event:</span> {cert.event_title || cert.event?.title}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-medium">Tanggal:</span> {cert.event_date || new Date(cert.event?.date).toLocaleDateString('id-ID')}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-medium">No. Sertifikat:</span> {cert.certificate_number}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Template: {cert.template_name || cert.template?.template_name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <button
                                                                onClick={() => downloadCertificate(cert.id)}
                                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
                                                            >
                                                            Download
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="mt-6 flex justify-end">
                                        <button 
                                            onClick={() => setShowCertificates(false)}
                                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}