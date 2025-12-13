import React, { useState } from "react";

const UploadMaterial = ({ event, onUpload, onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setError("Harap isi judul dan pilih file");
      return;
    }
    
    setIsUploading(true);
    setError("");
    
    try {
      await onUpload(event.id, title.trim(), selectedFile);
      // Reset form setelah berhasil
      setSelectedFile(null);
      setTitle("");
      onNavigate("materials");
    } catch (err) {
      setError("Gagal mengupload materi. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="view max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-custom-lg">
      <button
        className="text-gray-700 hover:underline mb-6 flex items-center gap-2"
        onClick={() => onNavigate("admin-dashboard")}
      >
        ← Kembali
      </button>

      <h2 className="text-2xl font-bold text-ft-blue mb-4 border-b pb-2">
        Kelola Materi & Upload
      </h2>

      <p className="text-gray-600 mb-6">Upload file materi presentasi / acara.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Judul Materi"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setError("");
        }}
        className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={isUploading}
      />

      <input
        type="file"
        accept=".pdf,.ppt,.pptx,.doc,.docx"
        onChange={(e) => {
          setSelectedFile(e.target.files[0]);
          setError("");
        }}
        className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={isUploading}
      />

      {selectedFile && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg mb-4">
          File dipilih: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleFileUpload}
          disabled={isUploading || !selectedFile || !title.trim()}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Mengupload...
            </>
          ) : (
            "Upload Materi"
          )}
        </button>
        
        <button
          onClick={() => onNavigate("materials")}
          disabled={isUploading}
          className="bg-gray-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-600 disabled:bg-gray-400"
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export default UploadMaterial;
