// src/views/EventDetail.jsx
import React from "react";

const EventDetail = ({ event, onNavigate, onSubmitFeedback }) => {
  if (!event) {
    return <div className="text-center p-8">Pilih acara untuk melihat detail.</div>;
  }

  // Gunakan materials real dari data event
  const materials = event.materials || [];

  return (
    <div className="max-w-6xl w-full mx-auto mt-10 mb-12 bg-white p-10 rounded-2xl shadow-md">

      {/* BACK */}
      <button
        className="flex items-center gap-2 text-gray-700 mb-6 hover:underline"
        onClick={() => onNavigate("event-list")}
      >
        ← Kembali ke Daftar Acara
      </button>

      {/* TITLE */}
      <h2 className="text-3xl font-extrabold text-[#0A2A43] leading-snug">
        {event.title}
      </h2>
      <div className="h-1 w-52 bg-yellow-500 mt-3 mb-6"></div>

      {/* MATERI */}
      <h3 className="text-2xl font-bold text-[#0A2A43] mt-10 mb-4">Materi & Informasi Acara</h3>
      <div className="space-y-4">
        {materials.length === 0 ? (
          <p className="text-gray-600 italic p-4 bg-gray-50 rounded-lg">
            Belum ada materi untuk acara ini.
          </p>
        ) : (
          materials.map((file, index) => (
            <div key={index} className="flex justify-between items-center p-4 border rounded-lg bg-[#FDFDFD]">
              <div>
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {file.name.split(".").pop().toUpperCase()} File — {file.uploadedAt}
                </p>
              </div>

              <a
                href={file.url}
                download={file.name}
                className="bg-[#0A2A43] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
              >
                Download
              </a>
            </div>
          ))
        )}
      </div>

      {/* Aksi Peserta */}
      <h3 className="text-2xl font-bold text-[#0A2A43] mt-12 mb-6">
        Aksi Peserta
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card Pendaftaran */}
        <div className="border-2 border-green-400 bg-green-50 rounded-2xl p-6 shadow-sm">
          <h4 className="text-lg font-bold text-green-700 mb-2">Pendaftaran</h4>
          <p className="text-sm text-gray-600 mb-4">Jika Berminat, Silahkan Daftar disini</p>
          <button
            onClick={() => onNavigate("pendaftaran-form")}
            className="bg-green-600 text-white w-full py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Daftar Sekarang
          </button>
        </div>

        {/* Card Absensi */}
        <div className="border-2 border-[#0A2A43]/40 bg-blue-50 rounded-2xl p-6 shadow-sm">
          <h4 className="text-lg font-bold text-[#0A2A43] mb-2">Absensi & Status</h4>
          <p className="text-sm text-gray-600 mb-4">Absensi Mandiri saat acara dan cek status penerbitan sertifikat.</p>
          <button
            onClick={() => onNavigate("cek-sertifikat-form")}
            className="bg-[#0A2A43] text-white w-full py-2 rounded-lg font-semibold hover:bg-blue-900 transition"
          >
            Cek Status & Absen
          </button>
        </div>

        {/* Card Riwayat */}
        <div className="border-2 border-yellow-400 bg-yellow-50 rounded-2xl p-6 shadow-sm">
          <h4 className="text-lg font-bold text-yellow-800 mb-2">Riwayat Event</h4>
          <p className="text-sm text-gray-600 mb-4">Lihat riwayat partisipasi dan unduh semua sertifikat yang telah diterbitkan.</p>
          <button
            onClick={() => onNavigate("user-dashboard")}
            className="bg-yellow-600 text-white w-full py-2 rounded-lg font-semibold hover:bg-yellow-700 transition"
          >
            Lihat Riwayat
          </button>
        </div>

      </div>

    </div>
  );
};

export default EventDetail;
