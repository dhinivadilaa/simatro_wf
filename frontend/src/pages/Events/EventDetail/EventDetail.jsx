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

    useEffect(() => {
        loadEvent();
    }, [id, navigate]); // Ditambahkan 'navigate' ke dependencies array

    const loadEvent = async () => {
        try {
            const res = await api.get(`/events/${id}`);
            setEvent(res.data.data);
        } catch (error) {
            console.error("Gagal memuat event:", error);
            // Anda bisa tambahkan navigasi ke halaman error atau daftar acara jika gagal
        }
    };

    if (!event) {
        return <p className="p-6">Loading...</p>;
    }

    // --- Fungsi Bantuan ---

    // ... (Fungsi getTagClass jika diperlukan) ...
    // ... (Fungsi format waktu jika diperlukan) ...


    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-10">
                <button className="text-sm text-blue-600 mb-4" onClick={() => navigate('/')}>← Kembali ke Daftar Acara</button>

                <div className="bg-white rounded-2xl p-8 shadow">
                    <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                    <div className="h-1 bg-yellow-400 w-full my-4 rounded"></div>

                    <h2 className="text-lg font-semibold text-gray-800 mt-4">Materi dan Informasi Acara</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-sm text-gray-600 flex items-center gap-2"><span>📅</span> Waktu Pelaksanaan</div>
                            <p className="font-semibold text-gray-800 mt-1">{event.date}</p>
                            <p className="text-sm text-gray-600">{event.time}</p>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-sm text-gray-600 flex items-center gap-2"><span>📍</span> Lokasi Acara</div>
                            <p className="font-semibold text-gray-800 mt-1">{event.location}</p>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-sm text-gray-600 flex items-center gap-2"><span>👥</span> Kuota Peserta</div>
                            <p className="font-semibold text-gray-800 mt-1">{event.registered} / {event.quota} <span className="text-green-600">({event.quota - event.registered} tersisa)</span></p>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-800 mt-6">Materi Acara</h2>
                    {event.materials && event.materials.length > 0 ? (
                        event.materials.map((item) => (
                            <div key={item.id} className="flex justify-between items-start bg-white border mt-3 p-4 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-800">{item.title}</p>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                    <span className="text-xs text-gray-500">Pratinjau Teks</span>
                                </div>

                                <a href={item.file_url} target="_blank" className="bg-[#122348] text-white px-3 py-2 rounded-md" rel="noreferrer">👁 Lihat</a>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-600 mt-3">Belum ada materi tersedia untuk acara ini.</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div onClick={() => navigate(`/events/${id}/register`)} className="p-4 rounded-xl bg-green-50 border border-green-200 cursor-pointer">
                            <h3 className="font-semibold">Pendaftaran</h3>
                            <p className="text-sm text-gray-600">Jika Berminat, Silahkan Daftar disini</p>
                            <button className="mt-3 w-full bg-green-600 text-white py-2 rounded">Daftar Sekarang</button>
                        </div>

                        <div onClick={() => navigate('/status')} className="p-4 rounded-xl bg-blue-50 border border-blue-200 cursor-pointer">
                            <h3 className="font-semibold">Absensi & Status</h3>
                            <p className="text-sm text-gray-600">Cek status absensi dan sertifikat</p>
                            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded">Cek Status & Absen</button>
                        </div>

                        <div onClick={() => navigate('/Riwayat')} className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 cursor-pointer">
                            <h3 className="font-semibold">Riwayat Event</h3>
                            <p className="text-sm text-gray-600">Lihat riwayat dan sertifikat</p>
                            <button className="mt-3 w-full bg-yellow-500 text-white py-2 rounded">Lihat Riwayat</button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}