import React from "react";

const AdminFeedbackDetail = ({ event, onNavigate }) => {
  // Ambil data feedback dari event, jika belum ada gunakan array kosong
  const feedbackList = event?.feedback || [];

  return (
    <div className="animate-fade-in-up pb-10 max-w-5xl mx-auto">
      
      {/* HEADER NAVIGASI */}
      <div className="bg-white p-6 rounded-t-xl border-b border-gray-200 mb-6">
        <button
          onClick={() => onNavigate("admin-event-detail", event)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-4 transition font-medium"
        >
          {/* Icon Panah Kiri */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Kelola Peserta & Sertifikat
        </button>
        
        <h1 className="text-3xl font-extrabold text-gray-900">Saran & Masukan Terbuka</h1>
        <p className="text-gray-500 mt-2 text-sm">
            Daftar masukan dari peserta untuk acara: <span className="font-semibold text-ft-blue">{event?.title}</span>
        </p>
      </div>

      {/* CONTAINER LIST FEEDBACK */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
        
        {/* JIKA TIDAK ADA DATA */}
        {feedbackList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            <p className="text-gray-500 font-medium">Belum ada saran yang masuk.</p>
            <p className="text-xs text-gray-400 mt-1">Saran dari peserta akan muncul di sini secara real-time.</p>
          </div>
        ) : (
          /* JIKA ADA DATA (LOOPING) */
          <div className="space-y-4">
            {feedbackList.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-gray-300 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
              >
                {/* Header Card: Nama & Tanggal */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                          {item.name || "Peserta Tanpa Nama"}
                      </h3>
                      {/* Menampilkan Rating Bintang Kecil */}
                      <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < item.score ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                          ))}
                          <span className="text-xs text-gray-400 ml-2">({item.category || "Umum"})</span>
                      </div>
                  </div>

                  <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                    {/* Menggunakan timestamp jika ada, atau dummy date */}
                    {item.timestamp ? new Date(item.timestamp).toLocaleString('id-ID') : "15/05/2025 12:00 WIB"}
                  </span>
                </div>
                
                {/* Garis Pemisah Tipis */}
                <hr className="border-gray-100 my-3"/>

                {/* Isi Pesan */}
                <p className="text-gray-700 leading-relaxed text-sm">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminFeedbackDetail;