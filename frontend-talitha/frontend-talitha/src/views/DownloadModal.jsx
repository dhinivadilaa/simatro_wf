import React from 'react';

const DownloadModal = ({ total, onClose, onDownload }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative transform transition-all scale-100">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Cetak Semua Dokumen</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Deskripsi */}
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    Fitur ini memungkinkan penggabungan semua sertifikat yang sudah berstatus 'DITERBITKAN' menjadi satu file ZIP atau PDF besar.
                </p>

                {/* Info Box (Warna Biru sesuai gambar) */}
                <div className="bg-[#dae9fa] border border-[#bfdbfe] rounded-lg p-4 mb-6 text-[#1e40af] font-semibold text-lg flex items-center shadow-sm">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Dokumen Siap Cetak: {total} Sertifikat
                </div>

                {/* Tombol Aksi */}
                <button 
                    onClick={onDownload}
                    disabled={total === 0}
                    className={`w-full py-3.5 rounded-lg text-white font-bold text-lg shadow-md transition-all ${
                        total === 0 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-[#d97706] hover:bg-amber-600 active:scale-95"
                    }`}
                >
                    {total === 0 ? "Tidak Ada Dokumen" : "Cetak Semua (.zip)"}
                </button>
            </div>
        </div>
    );
};

export default DownloadModal;