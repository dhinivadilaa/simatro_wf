import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function CreateEvent() {
    const [formData, setFormData] = useState({
        category: "",
        title: "",
        topic: "",
        description: "",
        date: "",
        absent_deadline: "",
        location: "",
        registration_open: false,
        capacity: "",
        thumbnail: null,
        status: "draft",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Always send all fields, even if empty (for proper validation)
            formDataToSend.append('category', formData.category || '');
            formDataToSend.append('title', formData.title || '');
            formDataToSend.append('topic', formData.topic || '');
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('date', formData.date || '');
            formDataToSend.append('location', formData.location || '');
            formDataToSend.append('absent_deadline', formData.absent_deadline || '');
            formDataToSend.append('capacity', formData.capacity || '');
            if (formData.thumbnail) formDataToSend.append('thumbnail', formData.thumbnail);

            // Always send registration_open as boolean
            formDataToSend.append('registration_open', formData.registration_open ? '1' : '0');

            await api.post("/events", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("Acara berhasil dibuat!");
            navigate("/admin/dashboard");
        } catch (error) {
            console.error("Error creating event:", error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = Object.values(error.response.data.errors).flat().join('\n');
                alert("Gagal membuat acara:\n" + errors);
            } else if (error.response && error.response.status === 401) {
                alert("Sesi login telah berakhir. Silakan login kembali.");
                navigate("/admin/login");
            } else {
                alert("Gagal membuat acara. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

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

            <main className="flex-1 px-6 md:px-12 py-8 flex justify-center items-start">
                <div className="w-full max-w-2xl">
                    {/* Page Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Tambah Acara Baru</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Masukkan detail lengkap untuk acara Teknik Elektro yang baru.
                    </p>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="font-semibold text-sm">Kategori Acara</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan kategori acara (contoh: Teknik Elektro)"
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-sm">Nama Acara (Contoh: Kuliah Umum IoT)</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan judul acara"
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-sm">Topik Acara</label>
                            <input
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan topik acara (opsional)"
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-sm">Deskripsi Singkat Acara (Untuk Halaman Publik)</label>
                            <textarea
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Jelaskan topik dan tujuan utama acara"
                                maxLength={250}
                            />
                            <p className="text-xs text-gray-500 mt-1">Maksimal 250 karakter</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-sm">Tanggal Acara</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-sm">Batas Waktu Absensi (HH:MM)</label>
                                <input
                                    type="time"
                                    name="absent_deadline"
                                    value={formData.absent_deadline}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="font-semibold text-sm">Lokasi Acara</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan lokasi acara"
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-sm">Kapasitas Peserta</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                min="1"
                                className="w-full border rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan kapasitas maksimal peserta"
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-sm">Thumbnail Acara</label>
                            <input
                                type="file"
                                name="thumbnail"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full border rounded-lg p-3 mt-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Format: JPEG, PNG, JPG, GIF. Maksimal 2MB</p>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="registration_open"
                                name="registration_open"
                                checked={formData.registration_open}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="registration_open" className="ml-2 block text-sm text-gray-900">
                                Buka pendaftaran acara
                            </label>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded transition disabled:opacity-50"
                            >
                                {loading ? "Menyimpan..." : "Buat Acara"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/admin/dashboard")}
                                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded transition"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-blue-900 text-white text-center py-4 text-sm">
                © 2025 SIMATRO Jurusan Teknik Elektro. Admin Panel.
            </footer>
        </div>
    );
}
