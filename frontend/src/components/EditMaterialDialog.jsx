import React, { useState } from 'react';

const EditMaterialDialog = ({ materialTitle, onClose, onSave }) => {
  const [materialName, setMaterialName] = useState(materialTitle);
  const [selectedFile, setSelectedFile] = useState(null);

  // Mengelola perubahan pada input Nama Materi
  const handleNameChange = (e) => {
    setMaterialName(e.target.value);
  };

  // Mengelola perubahan file yang dipilih
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Mengelola aksi simpan
  const handleSave = () => {
    onSave({
      newName: materialName,
      newFile: selectedFile,
    });
  };

  const fileNameDisplay = selectedFile ? selectedFile.name : 'Tidak ada berkas yang dipilih';

  return (
    // Backdrop (Latar Belakang Buram)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      
      {/* Dialog Box (Kotak Biru) */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden 
                    border-4 border-blue-600"> 
        
        {/* Header (Judul dan Tombol Tutup) */}
        <div className="flex justify-between items-start p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 pr-4">
            Edit Materi: {materialTitle}
          </h2>
          {/* Tombol Tutup (X) */}
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
            aria-label="Tutup"
          >
            &times; 
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          
          {/* Input Nama Materi */}
          <div>
            <label htmlFor="material-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Materi
            </label>
            <input
              id="material-name"
              type="text"
              value={materialName}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nama materi baru"
            />
          </div>

          {/* Input Ganti File (Opsional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ganti File (Opsional)
            </label>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              {/* Tombol Pilih Berkas */}
              <label 
                htmlFor="file-upload"
                className="cursor-pointer bg-gray-100 text-gray-700 font-medium px-4 py-2 
                           hover:bg-gray-200 transition-colors border-r border-gray-300"
              >
                Pilih Berkas
                {/* Input file disembunyikan */}
                <input 
                  id="file-upload"
                  type="file" 
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={handleFileChange} 
                  className="hidden"
                />
              </label>
              
              {/* Nama File Display */}
              <div className="flex-grow p-2 text-gray-500 text-sm truncate bg-white">
                {fileNameDisplay}
              </div>
            </div>
          </div>

        </div>

        {/* Footer (Tombol Simpan) */}
        <div className="flex justify-center p-5 border-t border-gray-200">
          {/* Tombol Simpan Perubahan (Kuning Emas) */}
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 text-white font-semibold rounded-lg transition-colors
                       bg-amber-600 hover:bg-amber-700 shadow-md max-w-xs"
          >
            Simpan Perubahan
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditMaterialDialog;