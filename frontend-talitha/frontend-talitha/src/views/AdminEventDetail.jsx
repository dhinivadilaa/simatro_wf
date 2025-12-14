import React, { useState, useMemo } from 'react';

// Ikon SVG Inline
const Icons = {
  ArrowLeft: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>),
  ChevronDown: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>),
  X: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>),
};

const AdminEventDetail = ({ event, participants, onNavigate, onManualPresence }) => {
  // State untuk Modal
  const [activeModal, setActiveModal] = useState(null); 
  const [showFeedbackPage, setShowFeedbackPage] = useState(false);

  // --- LOGIKA DATA ---
  const eventRegistrations = useMemo(() => {
    const registrations = [];
    if (participants && event) {
      Object.values(participants).forEach(user => {
        const userEventData = user.events?.find(e => e.id === event.id);
        if (userEventData) {
          registrations.push({
            id: userEventData.userId || Object.keys(participants).find(key => participants[key] === user),
            name: user.name,
            email: user.email,
            code: userEventData.code || "-",
            time: userEventData.status === 'HADIR' ? (userEventData.time || "Hadir") : "Belum Absen",
            rawStatus: userEventData.status, 
            certStatus: userEventData.cert === 'DITERBITKAN' ? "Diterbitkan" : "Belum",
            action: userEventData.status === 'HADIR' ? "Tervalidasi" : "Manual"
          });
        }
      });
    } 
    return registrations;
  }, [participants, event]);

  const stats = useMemo(() => {
    return {
      registered: eventRegistrations.length,
      present: eventRegistrations.filter(r => r.rawStatus === 'HADIR').length,
      absent: eventRegistrations.filter(r => r.rawStatus !== 'HADIR').length,
      certificates: eventRegistrations.filter(r => r.certStatus === 'Diterbitkan').length
    };
  }, [eventRegistrations]);

  // --- FEEDBACK: derive from participants' input ---
  const feedbackData = useMemo(() => {
    const entries = [];
    if (participants && event) {
      Object.values(participants).forEach(user => {
        const ue = user.events?.find(e => e.id === event.id);
        if (!ue) return;

        // Feedback may be stored as a number, or an object { rating, comment, date }
        const fbRaw = ue.feedback ?? ue.rating ?? ue.feedbackEntry;
        let rating = null;
        let comment = "";
        let date = ue.feedbackDate || ue.ratingDate || null;

        if (typeof fbRaw === 'number') {
          rating = fbRaw;
        } else if (fbRaw && typeof fbRaw === 'object') {
          rating = fbRaw.rating ?? fbRaw.score ?? null;
          comment = fbRaw.comment ?? fbRaw.text ?? comment;
          date = fbRaw.date ?? date;
        } else {
          // fallback if rating stored directly on ue
          rating = ue.rating ?? null;
          comment = ue.comment ?? comment;
        }

        if (rating != null) {
          entries.push({
            id: user.id ?? user.email,
            name: user.name,
            email: user.email,
            rating: Number(rating),
            comment: comment || "",
            date
          });
        }
      });
    }
    return entries;
  }, [participants, event]);

  const totalFeedback = feedbackData.length;
  const avgFeedbackScore = totalFeedback ? Number((feedbackData.reduce((s, f) => s + (f.rating || 0), 0) / totalFeedback).toFixed(2)) : 0;

  const ratingLabels = {
    1: 'Buruk',
    2: 'Kurang',
    3: 'Cukup',
    4: 'Baik',
    5: 'Sangat Baik'
  };

  const ratingColors = {
    1: 'bg-slate-800',
    2: 'bg-red-500',
    3: 'bg-yellow-600',
    4: 'bg-blue-600',
    5: 'bg-green-600'
  };

  const feedbackStats = [1, 2, 3, 4, 5].map(r => {
    const count = feedbackData.filter(f => f.rating === r).length;
    return {
      rating: r,
      label: `${r} - ${ratingLabels[r]}`,
      count,
      color: ratingColors[r]
    };
  });

  const [pin, setPin] = useState(event?.pin || 'EEA-2025');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const eventMeta = {
    title: event?.title || 'Seminar EEA 2025',
    pin,
    cutoffTime: '15:00 WIB',
    feedbackScore: avgFeedbackScore,
    totalFeedback
  };

  // --- HALAMAN FEEDBACK ---
  if (showFeedbackPage) {
    const comments = feedbackData.filter(f => f.comment && f.comment.trim() !== '');
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-slate-800">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-sm min-h-[80vh]">
          <button 
            onClick={() => setShowFeedbackPage(false)}
            className="flex items-center text-slate-900 font-medium hover:underline mb-6 transition-colors"
          >
            <span className="mr-2"><Icons.ArrowLeft /></span>
            Kembali ke Kelola Peserta & Sertifikat
          </button>
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Saran & Masukan Terbuka</h1>
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((item, idx) => (
                <div key={idx} className="border border-slate-300 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <span className="text-xs text-slate-500">{item.date || '-'}</span>
                  </div>
                  <p className="text-slate-700">{item.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500 italic">Belum ada saran dari peserta.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- HALAMAN UTAMA ADMIN EVENT DETAIL ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-slate-800 relative">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        
        {/* Header Navigation */}
        <button 
          onClick={() => onNavigate('admin-dashboard')}
          className="flex items-center text-slate-900 font-medium hover:underline mb-6 transition-colors"
        >
          <span className="mr-2"><Icons.ArrowLeft /></span>
          Kembali ke Dashboard Acara
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Pengelolaan Detail Acara: {eventMeta.title}
        </h1>
        <p className="text-slate-500 mb-8 text-sm">Data Real-Time Peserta, Absensi, dan Analisis Feedback.</p>

        {/* Top Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col justify-center">
            <h3 className="text-red-600 font-bold text-lg mb-1">
              Batas Waktu Absensi Acara: {eventMeta.cutoffTime}
            </h3>
            <p className="text-red-500 text-sm">
              Absensi mandiri otomatis ditolak setelah waktu ini.
            </p>
          </div>
            <div className="bg-gray-100 border border-gray-200 rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-slate-600 font-bold mb-1 text-sm">PIN Absensi</p>
              <p className="text-3xl font-extrabold text-slate-800">{eventMeta.pin}</p>
            </div>
            <button onClick={() => setActiveModal('pin')} className="bg-slate-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors active:scale-95 transform">
              Ubah PIN
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#1e293b] text-white rounded-lg p-6 shadow-sm min-h-[140px] flex flex-col justify-between">
            <p className="text-white text-base font-medium">Total Terdaftar</p>
            <p className="text-4xl font-bold">{stats.registered}</p>
          </div>
          <div className="bg-white border-2 border-green-400 text-green-700 rounded-lg p-6 shadow-sm min-h-[140px] flex flex-col justify-between">
            <p className="font-semibold text-base">Sudah Absen Real-Time</p>
            <p className="text-4xl font-bold">{stats.present}</p>
          </div>
          <div className="bg-[#d97706] text-white rounded-lg p-6 shadow-sm min-h-[140px] flex flex-col justify-between">
            <p className="text-white text-base font-medium">Belum Absen</p>
            <p className="text-4xl font-bold">{stats.absent}</p>
          </div>
          <div className="bg-[#334155] text-white rounded-lg p-6 shadow-sm min-h-[140px] flex flex-col justify-between">
            <p className="text-white text-base font-medium">Sertifikat Diterbitkan</p>
            <p className="text-4xl font-bold">{stats.certificates}</p>
          </div>
        </div>

        {/* Buttons Templates */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Manajemen Template & Validasi Sertifikat</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setActiveModal('template')}
              className="bg-[#1e293b] text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-slate-900 transition-all active:scale-95 transform cursor-pointer"
            >
              Ubah Template Desain
            </button>
            <button 
              onClick={() => setActiveModal('preview')}
              className="bg-[#94a3b8] text-white px-12 py-3 rounded-md font-bold text-sm hover:bg-slate-500 transition-all active:scale-95 transform cursor-pointer"
            >
              Lihat Template
            </button>
            <button 
              onClick={() => setActiveModal('print')}
              className="bg-[#d97706] text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-yellow-700 transition-all active:scale-95 transform cursor-pointer"
            >
              Cetak Semua Dokumen
            </button>
          </div>
        </div>

        {/* Participant Table */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Daftar Peserta & Status Absensi (Real-Time)</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Tampilkan:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    const v = e.target.value === 'all' ? 'all' : Number(e.target.value);
                    setRowsPerPage(v);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                >
                  <option value={5}>5 Baris</option>
                  <option value={25}>25 Baris</option>
                  <option value={50}>50 Baris</option>
                  <option value={100}>100 Baris</option>
                  <option value={'all'}>Semua</option>
                </select>
              </div>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-gray-300">
                <tr>
                  <th className="px-6 py-4 font-medium text-center">Nama</th>
                  <th className="px-6 py-4 font-medium text-center">Email/ID Peserta</th>
                  <th className="px-6 py-4 font-medium text-center">Kode Absensi</th>
                  <th className="px-6 py-4 font-medium text-center">Waktu Absensi</th>
                  <th className="px-6 py-4 font-medium text-center">Status Sertifikat</th>
                  <th className="px-6 py-4 font-medium text-center">Aksi (Audit Trail)</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 bg-white divide-y divide-gray-200">
                {eventRegistrations.length > 0 ? (
                  (() => {
                    // compute displayed slice depending on rowsPerPage/currentPage
                    const total = eventRegistrations.length;
                    const per = rowsPerPage === 'all' ? total : Number(rowsPerPage);
                    const totalPages = per === 0 ? 1 : Math.max(1, Math.ceil(total / per));
                    const page = Math.min(currentPage, totalPages);
                    const start = per === total ? 0 : (page - 1) * per;
                    const end = per === total ? total : Math.min(total, start + per);
                    const displayed = eventRegistrations.slice(start, end);

                    // expose values for rendering below via closure
                    return displayed.map((p, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-center">{p.name}</td>
                          <td className="px-6 py-4 text-center">{p.email}</td>
                          <td className="px-6 py-4 text-center">{p.code}</td>
                          <td className={`px-6 py-4 text-center ${p.time === 'Belum Absen' ? 'text-red-500 italic' : ''}`}>{p.time}</td>
                          <td className="px-6 py-4 text-center">
                        {p.certStatus === 'Diterbitkan' ? (
                          <span className="px-4 py-1 rounded-full text-xs font-bold text-white bg-[#15803d]">Diterbitkan</span>
                        ) : (
                          <span className="px-4 py-1 rounded-full text-xs font-bold text-white bg-[#facc15] text-yellow-800">Belum</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {/* TOMBOL ABSENSI MANUAL YANG SUDAH DIPERBAIKI */}
                        {p.action === 'Manual' ? (
                          <button 
                            onClick={() => {
                                if (onManualPresence) {
                                    onManualPresence(event.id, p.email);
                                } else {
                                    alert("Hubungan ke database gagal. Pastikan file App.jsx sudah diperbarui.");
                                }
                            }}
                            className="bg-[#dc2626] text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700 w-full shadow-sm cursor-pointer active:scale-95 transform transition-transform"
                          >
                            Absensi Manual
                          </button>
                        ) : (
                          <span className="text-[#16a34a] text-xs font-medium">{p.action}</span>
                        )}
                        </td>
                      </tr>
                    ))
                  })()
                ) : (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">Belum ada peserta.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-slate-600">
              {(() => {
                const total = eventRegistrations.length;
                if (total === 0) return 'Menampilkan 0 dari 0 peserta';
                const per = rowsPerPage === 'all' ? total : Number(rowsPerPage);
                const totalPages = per === 0 ? 1 : Math.max(1, Math.ceil(total / per));
                const page = Math.min(currentPage, totalPages);
                const start = per === total ? 1 : (page - 1) * per + 1;
                const end = per === total ? total : Math.min(total, start + per - 1);
                return `Menampilkan ${start}-${end} dari ${total} peserta`;
              })()}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-gray-100 border text-sm"
              >Sebelumnya</button>
              <button
                onClick={() => {
                  const total = eventRegistrations.length;
                  const per = rowsPerPage === 'all' ? total : Number(rowsPerPage);
                  const totalPages = per === 0 ? 1 : Math.max(1, Math.ceil(total / per));
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                }}
                className="px-3 py-1 rounded bg-[#1e293b] text-white text-sm"
              >Berikutnya</button>
            </div>
          </div>
        </div>

        {/* Feedback Stats */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Analisis Feedback</h2>
          <p className="text-sm text-slate-500 mb-6">
            Rata-rata Skor Feedback: <span className="text-[#16a34a] font-bold">{eventMeta.feedbackScore}/5.0</span> (Total Responden: {eventMeta.totalFeedback})
          </p>
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            {feedbackStats.map((stat, idx) => {
              const pct = totalFeedback ? Math.round((stat.count / totalFeedback) * 100) : 0;
              return (
                <div key={idx} className="flex items-center">
                  <span className="w-32 text-sm font-medium text-slate-700">{stat.label}</span>
                  <div className="flex-grow bg-gray-200 rounded-full h-7 overflow-hidden relative ml-4">
                    <div className={`${stat.color} h-full rounded-r-full flex items-center justify-end pr-3 text-xs text-white font-bold`} style={{ width: `${pct}%` }}>
                      {stat.count}/{totalFeedback}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Button */}
        <div className="flex justify-end">
          <button 
            onClick={() => setShowFeedbackPage(true)}
            className="bg-[#1e293b] text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-slate-900 transition-all active:scale-95 transform cursor-pointer"
          >
            Lihat Semua Saran
          </button>
        </div>

      </div>

      {/* --- MODALS (POP-UPS) --- */}

      {/* 1. Modal Cetak */}
      {activeModal === 'print' && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Cetak Semua Dokumen</h3>
              <button onClick={() => setActiveModal(null)}><Icons.X /></button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-6 text-sm">
                Fitur ini memungkinkan penggabungan semua sertifikat yang sudah berstatus 'DITERBITKAN' menjadi satu file ZIP atau PDF besar.
              </p>
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg mb-6 text-center">
                <p className="font-bold text-indigo-800">Dokumen Siap Cetak: {stats.certificates} Sertifikat</p>
              </div>
              <button className="w-full bg-[#d97706] text-white font-bold py-3 rounded-lg hover:bg-yellow-700 transition-colors active:scale-95 transform">
                Cetak Semua (.zip)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Lihat Template */}
      {activeModal === 'preview' && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Pratinjau Template Sertifikat</h3>
              <button onClick={() => setActiveModal(null)}><Icons.X /></button>
            </div>
            <div className="p-8 flex justify-center bg-gray-100">
              <div className="bg-white border-4 border-double border-yellow-500 p-10 w-[600px] h-[400px] relative shadow-lg text-center flex flex-col justify-center items-center">
                <h1 className="text-4xl font-serif text-slate-900 mb-2 font-bold">SERTIFIKAT</h1>
                <p className="text-sm text-slate-500 mb-6">Diberikan kepada:</p>
                <h2 className="text-5xl font-script text-[#1e293b] mb-4" style={{ fontFamily: 'cursive' }}>Talitha Dhini Intan</h2>
                <p className="text-sm text-slate-600 mb-2">Atas peran dan partisipasinya sebagai:</p>
                <h3 className="text-xl font-bold text-slate-800">Peserta Seminar Nasional</h3>
              </div>
            </div>
            <div className="p-4 bg-gray-50 text-right">
              <button onClick={() => setActiveModal(null)} className="bg-slate-600 text-white px-6 py-2 rounded font-bold hover:bg-slate-700">Tutup Pratinjau</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Ubah Template */}
      {activeModal === 'template' && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Ubah Template Sertifikat</h3>
              <button onClick={() => setActiveModal(null)}><Icons.X /></button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">Ganti background desain atau atur posisi elemen untuk sertifikat acara ini.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Background Baru (PNG/JPEG)</label>
                <div className="flex items-center border rounded-lg p-2">
                  <button className="bg-gray-100 text-slate-700 px-3 py-1 rounded text-xs font-bold border mr-2">Pilih Berkas</button>
                  <span className="text-xs text-slate-400">Tidak ada berkas yang dipilih</span>
                </div>
              </div>
              <button className="w-full bg-[#1e293b] text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors active:scale-95 transform">
                Ubah Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Ubah PIN */}
      {activeModal === 'pin' && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Ubah PIN Absensi</h3>
              <button onClick={() => setActiveModal(null)}><Icons.X /></button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">PIN Baru</label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded border">Batal</button>
                <button onClick={() => { setActiveModal(null); }} className="px-4 py-2 rounded bg-[#1e293b] text-white">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEventDetail;