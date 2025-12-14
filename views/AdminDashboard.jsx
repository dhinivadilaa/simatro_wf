// src/views/AdminDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewEventForm from "./NewEventForm.jsx";

const AdminDashboard = ({ events = [], setEvents, onNavigate, onCreateNewEvent }) => {
    const [showNewEventForm, setShowNewEventForm] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="view bg-white rounded-xl p-10 shadow-custom-lg max-w-6xl mx-auto">

            {/* HEADER */}
            <div className="flex justify-start items-center mb-6 border-b-4 border-ft-gold pb-3">
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Dashboard Event Manager SIMATRO
                </h2>
            </div>

            {/* MANAGEMENT CARD */}
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-ft-blue mb-1">Manajemen Acara</h3>
                <p className="text-gray-600 text-sm mb-4">
                    Mulai acara baru, atur konfigurasi batas waktu absensi, dan kelola daftar acara yang sedang aktif.
                </p>

                <button
                    onClick={() => setShowNewEventForm(true)}
                    className="flex items-center gap-2 bg-ft-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-ft-accent transition-all"
                >
                    ➕ Tambah Acara Baru
                </button>
            </div>

            {/* EVENT LIST */}
            <h3 className="text-xl font-bold text-ft-blue mb-4">Daftar Acara Aktif</h3>

            {(events.length === 0) && (
                <p className="text-center text-gray-500 italic mb-6">
                    Belum ada acara terdaftar.
                </p>
            )}

            {events.map((event) => (
                <div
                    key={event.id}
                    className="border border-gray-300 rounded-xl p-5 mb-6 hover:shadow-md transition-all"
                >
                    <div className="flex justify-between items-start">
                        <span className="bg-ft-blue text-white text-xs font-bold rounded-full px-3 py-1 mb-2">
                            {event.id}
                        </span>

                        <p className="text-sm font-semibold text-gray-700">
                            {event.attendance ?? 0} / {event.total ?? 0}
                            <span className="text-xs text-gray-500 ml-1">Hadir / Total Peserta</span>
                        </p>
                    </div>

                    <h4 className="text-lg font-semibold">{event.title}</h4>
                    <p className="text-sm text-gray-600">Tanggal: {event.date || "-"}</p>

                    {event.cutoff && (
                        <p className="text-sm text-gray-600">
                            Batas Waktu Absensi: <span className="text-red-600">{event.cutoff}</span>
                        </p>
                    )}

                    <p className="text-sm font-bold text-green-700 mt-1">{event.status || "Aktif"}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
                        <button
                            onClick={() => onNavigate("admin-event-detail", event)}
                            className="bg-ft-blue text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-ft-accent transition-all"
                    >
                            Kelola Peserta & Sertifikat
                    </button>

                    <button
                        onClick={() => onNavigate("upload-material", event)}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all"
            >
                        Kelola Materi & Upload
            </button>

                <button
                    className="bg-ft-gold text-ft-blue py-2 px-4 rounded-lg text-sm font-semibold hover:bg-yellow-500 transition-all"
                >
                    Ubah Batas Waktu Absensi
                </button>

                <button
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-400 transition-all"
                >
                    Nonaktifkan Acara
                </button>
             </div>
           </div>
            ))}

            {/* STATISTIK */}
            <h3 className="text-xl font-bold text-ft-blue mt-8 mb-4">Statistik Acara</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-ft-blue text-white p-5 rounded-xl text-center shadow">
                    <p className="text-sm">Total Acara Aktif</p>
                    <p className="text-3xl font-extrabold mt-1">
                        {events.length}
                    </p>
                </div>

                <div className="bg-green-100 text-green-800 p-5 rounded-xl text-center shadow border">
                    <p className="text-sm">Total Peserta Terdaftar</p>
                    <p className="text-3xl font-extrabold mt-1">
                        {events.reduce((acc, e) => acc + (e.total ?? 0), 0)}
                    </p>
                </div>

                <div className="bg-yellow-600 text-white p-5 rounded-xl text-center shadow">
                    <p className="text-sm">Total Hadir</p>
                    <p className="text-3xl font-extrabold mt-1">
                        {events.reduce((acc, e) => acc + (e.attendance ?? 0), 0)}
                    </p>
                </div>

                <div className="bg-gray-700 text-white p-5 rounded-xl text-center shadow">
                    <p className="text-sm">Sertifikat Diterbitkan</p>
                    <p className="text-3xl font-extrabold mt-1">
                        {events.reduce((acc, e) => acc + (e.certificates ?? 0), 0)}
                    </p>
                </div>
            </div>

            {/* POPUP ONLY WHEN TRIGGERED */}
            {showNewEventForm && (
                <NewEventForm
                    onClose={() => setShowNewEventForm(false)}
                    onCreateNewEvent={(newEvent) => {
                        setEvents((prev) => [...prev, newEvent]);
                        setShowNewEventForm(false);
                    }}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
