// src/views/NewEventForm.jsx
import React, { useState } from "react";

const NewEventForm = ({ onClose, onCreateNewEvent }) => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    eventId: "",
    date: "",
    cutoff: "",
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: eventData.eventId || `EVT-${Date.now()}`,       // ID default jika kosong
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      cutoff: eventData.cutoff,
      attendance: 0,
      total: 0,
      type: "Teknik Elektro",
    };

    onCreateNewEvent(newEvent);  // kirim ke AdminDashboard -> App.jsx
    setEventData({ title: "", description: "", eventId: "", date: "", cutoff: "" }); // reset form
    onClose();  // tutup modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 relative animate-fadeIn max-h-[85vh] overflow-y-auto">

        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">Tambah Acara Baru</h2>
        <p className="text-gray-600 text-sm mb-6">
          Masukkan detail lengkap untuk acara Teknik Elektro yang baru.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="font-semibold text-sm">Nama Acara (Contoh: Kuliah Umum IoT)</label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 mt-1 focus:ring-ft-blue focus:border-ft-blue"
            />
          </div>

          <div>
            <label className="font-semibold text-sm">Deskripsi Singkat Acara (Untuk Halaman Publik)</label>
            <textarea
              name="description"
              rows="3"
              value={eventData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-ft-blue focus:border-ft-blue"
              placeholder="Jelaskan topik dan tujuan utama acara"
              maxLength={250}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Maksimal 250 karakter</p>
          </div>

          <div>
            <label className="font-semibold text-sm">ID Unik Acara (Contoh: KU-IOT-2025)</label>
            <input
              type="text"
              name="eventId"
              value={eventData.eventId}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-ft-blue focus:border-ft-blue"
              maxLength={15}
            />
            <p className="text-xs text-gray-500 mt-1">Maksimal 15 karakter</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm">Tanggal Acara</label>
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-ft-blue focus:border-ft-blue"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-sm">Batas Waktu Absensi (HH:MM)</label>
              <input
                type="time"
                name="cutoff"
                value={eventData.cutoff}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-ft-blue focus:border-ft-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-ft-blue text-white py-3 rounded-lg font-bold hover:bg-ft-accent transition-all"
          >
            Buat Acara
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewEventForm;
