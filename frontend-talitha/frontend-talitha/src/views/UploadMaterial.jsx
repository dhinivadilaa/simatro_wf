import React, { useState } from "react";

// Catatan: Saya menganggap Anda memiliki class CSS seperti 'view', 'shadow-custom-lg', 'text-ft-blue',
// 'bg-ft-blue', dan 'hover:bg-ft-accent' yang didefinisikan di file CSS atau framework Anda (misal: Tailwind CSS).
// Saya akan pertahankan struktur class yang ada untuk mempertahankan gaya visual.

const UploadMaterial = ({ event, onUpload, onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = () => {
    if (!selectedFile) return;
    // Logika unggah Anda (simulasi)
    const fileObject = {
      name: selectedFile.name,
      url: URL.createObjectURL(selectedFile),
      uploadedAt: new Date().toLocaleString("id-ID"),
    };
    onUpload(event.id, fileObject);
    onNavigate("admin-dashboard");
  };

  // Menangani perubahan pada input file
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    // Menggunakan div dengan class yang sama untuk tata letak dan bayangan
    <div className="view max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-custom-lg">
      {/* Tombol Kembali - Sesuai dengan Gambar 2 */}
      <button
        className="text-gray-700 hover:underline mb-6 flex items-center gap-2"
        onClick={() => onNavigate("admin-dashboard")}
      >
        ← Kembali
      </button>

      {/* Judul - Sesuai dengan Gambar 2 */}
      <h2 className="text-2xl font-bold text-ft-blue mb-4 border-b pb-2">
        Kelola Materi & Upload
      </h2>

      {/* Deskripsi - Sesuai dengan Gambar 2 */}
      <p className="text-gray-600 mb-6">Upload file materi presentasi / acara.</p>

      {/* Input File yang Lebih Sederhana seperti di Gambar 2 */}
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf,.ppt,.pptx,.doc,.docx"
          onChange={handleFileChange}
          // Hapus class styling input sebelumnya, dan biarkan browser default
          // atau gunakan style yang lebih minimal. Saya kembalikan ke style awal:
          // className="w-full border rounded-lg p-3" // Anda bisa menggunakan ini jika ingin styling yang lebih jelas
        />
        {/* Catatan: Tampilan "Choose File | No file chosen" yang persis seperti di Gambar 2 
           memerlukan kustomisasi styling pada input type="file" atau menggunakan komponen kustom.
           Kode ini menggunakan input standar agar fungsionalitas tetap berjalan. */}
      </div>

      {/* Tombol Unggah - Sesuai dengan Gambar 2 */}
      <button
        onClick={handleFileUpload}
        disabled={!selectedFile} // Nonaktifkan jika belum ada file yang dipilih
        className={`
          bg-ft-blue text-white py-2 px-6 rounded-lg font-semibold 
          ${selectedFile ? "hover:bg-ft-accent" : "opacity-50 cursor-not-allowed"}
        `}
      >
        Upload Materi
      </button>
    </div>
  );
};

export default UploadMaterial;