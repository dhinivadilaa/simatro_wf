import React from 'react';

const DeleteConfirmationDialog = ({ materialName, onCancel, onDelete }) => {
  return (
    // Backdrop (Latar Belakang Buram)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      
      {/* Dialog Box (Kotak Biru) */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden 
                    border-4 border-blue-600"> 
        
        {/* Header dan Body */}
        <div className="p-6">
          
          {/* Header */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Konfirmasi Hapus Materi
          </h2>
          
          {/* Isi Pesan */}
          <p className="text-gray-700 leading-relaxed">
            Anda yakin ingin menghapus materi: <span className="font-semibold">{materialName}</span>? Aksi ini tidak dapat dibatalkan.
          </p>
          
        </div>

        {/* Tombol Aksi (Footer) */}
        <div className="flex justify-end p-4 border-t border-gray-100 space-x-3">
          
          {/* Tombol Batal (Abu-abu) */}
          <button
            onClick={onCancel}
            className="px-6 py-2 text-white font-semibold rounded-lg transition-colors
                       bg-gray-500 hover:bg-gray-600 shadow-md"
          >
            Batal
          </button>

          {/* Tombol Hapus (Merah) */}
          <button
            onClick={onDelete}
            className="px-6 py-2 text-white font-semibold rounded-lg transition-colors
                       bg-red-600 hover:bg-red-700 shadow-md"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;