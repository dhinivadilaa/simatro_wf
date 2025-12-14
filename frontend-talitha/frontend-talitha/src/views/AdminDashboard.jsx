import React, { useState } from "react";
import NewEventForm from "./NewEventForm.jsx";
import ChangeCutoffModal from "./ChangeCutoffModal.jsx"; 

const AdminDashboard = ({ events = [], onNavigate, onCreateNewEvent, onUpdateEvent, onDeleteEvent }) => { // Tambah onDeleteEvent di props
    const [showNewEventForm, setShowNewEventForm] = useState(false);
    const [showCutoffModal, setShowCutoffModal] = useState(false);
    const [selectedEventForCutoff, setSelectedEventForCutoff] = useState(null);

    const handleCreateEvent = (newEvent) => {
        onCreateNewEvent(newEvent);
        setShowNewEventForm(false);
    };

    const openCutoffModal = (event) => {
        setSelectedEventForCutoff(event);
        setShowCutoffModal(true);
    };

    const handleSaveCutoff = (eventId, newTime) => {
        onUpdateEvent(eventId, { cutoff: `${newTime} WIB` });
        setShowCutoffModal(false);
    };

    // --- LOGIKA TOGGLE STATUS (AKTIF <-> NONAKTIF) ---
    const handleToggleStatus = (event) => {
        const isCurrentlyActive = event.status !== "Nonaktif";
        const newStatus = isCurrentlyActive ? "Nonaktif" : "Aktif & Publik";
        
        const confirmMessage = isCurrentlyActive 
            ? "Yakin ingin menonaktifkan acara ini? Peserta tidak akan bisa melihatnya." 
            : "Aktifkan kembali acara ini?";

        if (window.confirm(confirmMessage)) {
            onUpdateEvent(event.id, { status: newStatus });
        }
    };

    // --- LOGIKA HAPUS ACARA ---
    // Pastikan App.jsx juga punya handler onDeleteEvent jika ingin fitur ini jalan
    const handleDelete = (eventId) => {
        if (window.confirm("PERINGATAN: Menghapus acara bersifat permanen! Semua data peserta dan feedback akan hilang. Lanjutkan?")) {
            // Kita asumsikan onUpdateEvent bisa handle hapus, atau idealnya ada prop onDeleteEvent
            // Jika belum ada prop onDelete, kita bisa filter di App.jsx
            if(onDeleteEvent) onDeleteEvent(eventId); 
        }
    };

    return (
        <div className="view bg-white rounded-xl p-6 md:p-10 shadow-custom-lg max-w-6xl mx-auto animate-fade-in min-h-[80vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b-4 border-ft-gold pb-3">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Dashboard Event Manager SIMATRO</h2>
            </div>

            {/* Management Card */}
            <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-6 mb-8 shadow-sm">
                <h3 className="text-xl font-bold text-[#1e293b] mb-2">Manajemen Acara</h3>
                <p className="text-gray-500 text-sm mb-5">Mulai acara baru, atur konfigurasi batas waktu absensi, dan kelola daftar acara yang sedang aktif.</p>
                <button onClick={() => setShowNewEventForm(true)} className="flex items-center gap-2 bg-[#1e293b] text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-[#334155] transition-all shadow-md active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> Tambah Acara Baru
                </button>
            </div>

            <h3 className="text-xl font-bold text-[#1e293b] mb-4 flex items-center gap-2">Daftar Acara Aktif (Real-Time)</h3>

            {events.length === 0 && <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50"><p className="text-gray-400 text-lg font-medium">Belum ada acara yang dibuat.</p></div>}

            {events.map((event) => (
                <div key={event.id} className={`border border-gray-200 bg-white rounded-xl p-5 mb-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group ${event.status === "Nonaktif" ? "opacity-80 bg-gray-50" : ""}`}>
                    {/* Aksen warna kiri */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${event.status === "Nonaktif" ? "bg-gray-400" : "bg-[#1e293b] group-hover:bg-ft-gold"} transition-colors`}></div>
                    
                    {/* Tombol Hapus (Pojok Kanan Atas) */}
                    <button 
                        onClick={() => handleDelete(event.id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition p-1"
                        title="Hapus Acara Permanen"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start pl-3 pr-10">
                        <div className="mb-4 md:mb-0">
                            <span className={`text-white text-xs font-bold rounded px-2 py-1 mb-2 inline-block ${event.status === "Nonaktif" ? "bg-gray-500" : "bg-[#1e293b]"}`}>ID: {event.id}</span>
                            <h4 className="text-lg font-bold text-gray-800 mt-1">{event.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">Tanggal: <span className="font-medium">{event.date}</span> • Batas Absen: <span className="text-red-600 font-medium">{event.cutoff}</span></p>
                            
                            {/* Indikator Status */}
                            <p className={`text-xs font-bold mt-2 inline-block px-2 py-1 rounded border ${event.status === "Nonaktif" ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}>
                                ● {event.status || "Aktif & Publik"}
                            </p>
                        </div>
                        <div className="text-right mt-2 md:mt-0">
                             <p className="text-2xl font-bold text-gray-800">{event.attendance ?? 0} <span className="text-gray-400 text-lg font-normal">/ {event.total ?? 0}</span></p>
                            <p className="text-xs text-gray-500">Absen / Total Peserta</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-6 pl-3">
                        <button onClick={() => onNavigate("admin-event-detail", event)} className="bg-[#334155] text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-[#1e293b] transition-colors shadow-sm">Kelola Peserta & Sertifikat</button>
                        <button onClick={() => onNavigate("upload-material", event)} className="bg-[#4f86f7] text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">Kelola & Upload Materi</button>
                        <button onClick={() => openCutoffModal(event)} className="bg-[#d97706] text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors shadow-sm">Ubah Batas Waktu Absensi</button>
                        
                        {/* TOGGLE TOMBOL AKTIF/NONAKTIF */}
                        <button 
                            onClick={() => handleToggleStatus(event)} 
                            className={`py-2 px-3 rounded-lg text-sm font-semibold transition-colors shadow-sm text-white ${event.status === "Nonaktif" ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"}`}
                        >
                            {event.status === "Nonaktif" ? "Aktifkan Kembali" : "Nonaktifkan Acara"}
                        </button>
                    </div>
                </div>
            ))}

            {showNewEventForm && <NewEventForm onClose={() => setShowNewEventForm(false)} onCreateNewEvent={handleCreateEvent} />}
            {showCutoffModal && selectedEventForCutoff && <ChangeCutoffModal event={selectedEventForCutoff} onClose={() => setShowCutoffModal(false)} onSave={handleSaveCutoff} />}
        </div>
    );
};

export default AdminDashboard;