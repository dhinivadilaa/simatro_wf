// src/views/AdminEventDetail.jsx
import React from "react";

const AdminEventDetail = ({ event, participants, onNavigate }) => {
  if (!event) return <p className="text-center text-gray-500">Event tidak ditemukan.</p>;

  // ======== PESERTA ========
  const eventParticipants = Object.values(participants).flatMap((p) =>
    p.events
      .filter((ev) => ev.id === event.id)
      .map((ev) => ({
        ...ev,
        name: p.name,
        email: p.email,
      }))
  );

  const hadir = eventParticipants.filter((p) => p.status.includes("HADIR")).length;
  const belum = eventParticipants.filter((p) => p.status === "TERDAFTAR").length;
  const sertifikat = eventParticipants.filter((p) => p.cert === "DITERBITKAN").length;

  // ======== FEEDBACK REALTIME ========
  const feedbackData = event.feedback ?? [];

  const avgScore =
    feedbackData.length > 0
      ? (feedbackData.reduce((acc, f) => acc + f.score, 0) / feedbackData.length).toFixed(1)
      : 0;

  const categories = ["Sangat Baik", "Baik", "Cukup", "Kurang"];

  const groupedFeedback = categories.map((cat) => {
    const items = feedbackData.filter((f) => f.category === cat);
    const score =
      items.length > 0
        ? (items.reduce((acc, i) => acc + i.score, 0) / items.length).toFixed(1)
        : 0;

    return { title: cat, score: parseFloat(score), count: items.length };
  });

  return (
    <div className="bg-white rounded-2xl p-10 shadow-custom-lg max-w-7xl mx-auto mt-6">

      {/* ==== BACK BUTTON ==== */}
      <button
        onClick={() => onNavigate("admin-dashboard")}
        className="flex items-center gap-2 text-ft-blue font-semibold mb-8 hover:underline"
      >
        ← Kembali ke Dashboard Acara
      </button>

      {/* ==== HEADER ==== */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
        Pengelolaan Detail Acara: {event.title}
      </h2>
      <p className="text-gray-600 mb-10">Data Real-Time Peserta, Absensi, dan Analisis Feedback.</p>

      {/* ==== CUT OFF TIME ==== */}
      <div className="w-full text-center rounded-xl p-4 mb-12 bg-red-50 border border-red-300 text-red-600 font-bold text-lg">
        Batas Waktu Absensi Acara: {event.cutoff ?? "••:•• WIB"}
      </div>

      {/* ==== STATISTIK ==== */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-14">
        <div className="p-6 rounded-2xl bg-ft-blue text-white text-center shadow-md">
          <p className="text-sm opacity-90">Total Terdaftar</p>
          <h3 className="text-4xl font-extrabold mt-1">{eventParticipants.length}</h3>
        </div>

        <div className="p-6 rounded-2xl bg-green-100 text-green-700 text-center shadow-md border border-green-400">
          <p className="text-sm">Sudah Absen Real-Time</p>
          <h3 className="text-4xl font-extrabold mt-1">{hadir}</h3>
        </div>

        <div className="p-6 rounded-2xl bg-yellow-500 text-white text-center shadow-md">
          <p className="text-sm">Belum Absen</p>
          <h3 className="text-4xl font-extrabold mt-1">{belum}</h3>
        </div>

        <div className="p-6 rounded-2xl bg-gray-800 text-white text-center shadow-md">
          <p className="text-sm">Sertifikat Diterbitkan</p>
          <h3 className="text-4xl font-extrabold mt-1">{sertifikat}</h3>
        </div>
      </div>

      {/* ==== TOMBOL TEMPLATE ==== */}
      <h3 className="text-2xl font-bold text-ft-blue mb-6">
        Manajemen Template & Validasi Sertifikat
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center mb-16 w-full">
        <button className="w-64 bg-ft-blue text-white py-3 rounded-xl font-semibold text-sm hover:bg-ft-accent transition-all shadow-md">
          Ubah Template Desain
        </button>
        <button className="w-64 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-300 transition-all shadow-md">
          Lihat Template
        </button>
        <button className="w-64 bg-yellow-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-yellow-600 transition-all shadow-md">
          Cetak Semua Dokumen
        </button>
      </div>

      {/* ==== PESERTA TABLE ==== */}
      <h3 className="text-2xl font-bold text-ft-blue mb-5">
        Daftar Peserta & Status Absensi (Real-Time)
      </h3>

      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 mb-16">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="py-4 px-4 font-semibold">Nama</th>
              <th className="py-4 px-4 font-semibold">Email/ID Peserta</th>
              <th className="py-4 px-4 font-semibold">Kode Absensi</th>
              <th className="py-4 px-4 font-semibold">Waktu Absensi</th>
              <th className="py-4 px-4 font-semibold">Status Sertifikat</th>
              <th className="py-4 px-4 font-semibold">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {eventParticipants.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500 italic">
                  Belum ada peserta terdaftar pada acara ini.
                </td>
              </tr>
            ) : (
              eventParticipants.map((p, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">
                  <td className="py-4 px-4">{p.name}</td>
                  <td className="py-4 px-4">{p.email}</td>
                  <td className="py-4 px-4 font-bold">{p.code}</td>
                  <td className="py-4 px-4">{p.time || "-"}</td>
                  <td
                    className={`py-4 px-4 font-bold ${
                      p.cert === "DITERBITKAN" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {p.cert}
                  </td>
                  <td className="py-4 px-4">
                    <button className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-4 rounded-lg text-xs font-semibold">
                      Absensi Manual
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ==== FEEDBACK REALTIME ==== */}
      <h3 className="text-2xl font-bold text-ft-blue mb-4">Feedback Materi</h3>

      <p className="font-semibold text-green-700 mb-6 text-lg">
        Rata-rata Skor Feedback Materi: <span className="text-green-800">{avgScore}/5.0</span>
        <span className="text-gray-500 text-sm ml-2">(Total Responder: {feedbackData.length})</span>
      </p>

      <div className="space-y-5 mb-10">
        {groupedFeedback.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{item.title} ({item.count})</span>
              <span className="font-bold text-ft-blue">{item.score}/5.0</span>
            </div>

            <div className="w-full bg-gray-200 h-6 rounded-lg overflow-hidden">
              <div
                className="bg-ft-blue h-6 transition-all duration-300"
                style={{ width: `${(item.score / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== LIST FEEDBACK TEXT ===== */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Daftar Feedback Peserta</h3>

      <div className="space-y-4 mb-12">
        {feedbackData.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada feedback masuk.</p>
        ) : (
          feedbackData.map((f, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-xl border border-gray-300 shadow-sm">
              <p className="text-sm font-bold text-ft-blue mb-1">
                Rating: {f.score}/5 — {f.name} ({f.email})
              </p>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{f.message}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AdminEventDetail;
