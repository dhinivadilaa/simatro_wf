// src/views/UploadMaterial.jsx
import React, { useState } from "react";

const UploadMaterial = ({ event, onUpload, onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const materials = event.materials || [];

  const handleFileUpload = () => {
    if (!selectedFile) return;
    const fileObject = {
      name: selectedFile.name,
      url: URL.createObjectURL(selectedFile),
      uploadedAt: new Date().toLocaleString("id-ID"),
    };
    onUpload(event.id, fileObject);
    setSelectedFile(null);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-custom-lg">

      {/* Back Button */}
      <button
        className="text-gray-700 hover:underline mb-6 flex items-center gap-2"
        onClick={() => onNavigate("admin-event-detail", event)}

      >
        ← Kembali ke Dashboard Acara
      </button>

      <h2 className="text-3xl font-bold text-ft-blue mb-8">Kelola & Upload Materi</h2>

      {/* ===== Upload File Section ===== */}
      <div className="border rounded-xl p-6 mb-10">
        <h3 className="font-bold text-lg mb-2">Upload Materi Baru</h3>
        <p className="text-sm text-gray-600 mb-4">File Materi (Hanya PDF/PPTX)</p>

        <input
          type="file"
          accept=".pdf,.ppt,.pptx"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <button
          onClick={handleFileUpload}
          className="bg-ft-blue text-white w-full py-3 rounded-lg font-semibold hover:bg-ft-accent"
        >
          Upload Materi
        </button>
      </div>

      {/* ===== Preview Materi Terpilih ===== */}
      <div className="border rounded-xl p-6 mb-10">
        <h3 className="font-bold text-lg mb-4">Pratinjau Materi Terpilih</h3>
        <div className="flex items-center justify-center border-2 border-dashed rounded-xl p-10 text-center text-gray-500">
          {!selectedFile ? (
            <p>Silakan pilih file PDF atau PPTX untuk melihat pratinjau</p>
          ) : (
            <p className="font-semibold">{selectedFile.name}</p>
          )}
        </div>
      </div>

      {/* ===== Daftar Materi ===== */}
      <div className="border rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Daftar Materi yang Tersedia</h3>

        {materials.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada materi tersedia.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-4 font-semibold">Nama Materi</th>
                <th className="py-3 px-4 font-semibold">Tipe File</th>
                <th className="py-3 px-4 font-semibold">Kelola</th>
              </tr>
            </thead>

            <tbody>
              {materials.map((file, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3 px-4">{file.name}</td>
                  <td className="py-3 px-4">{file.name.split(".").pop().toUpperCase()}</td>
                  <td className="py-3 px-4">
                    <button className="text-ft-blue font-semibold mr-4 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-600 font-semibold hover:underline">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default UploadMaterial;
