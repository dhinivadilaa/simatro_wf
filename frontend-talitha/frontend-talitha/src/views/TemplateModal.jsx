import React, { useState } from 'react';

const TemplateModal = ({ onClose, onSave }) => {
    const [fileName, setFileName] = useState("Tidak ada berkas yang dipilih");
    const [selectedFile, setSelectedFile] = useState(null);

    // Fungsi saat file dipilih dari komputer
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileName(file.name);
            setSelectedFile(file);
        }
    };

    // Fungsi saat tombol Simpan diklik
    const handleSave = () => {
        if (onSave && selectedFile) {
            // Kita kirim file ini ke parent (AdminEventDetail) 
            // agar bisa mengubah tampilan Pratinjau
            onSave(selectedFile);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative transform transition-all scale-100">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Ubah Template Sertifikat</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Form Area */}
                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Upload Background Baru (PNG/JPEG)</label>
                        
                        {/* Wrapper Input File yang bisa diklik */}
                        {/* Menggunakan label agar seluruh area atau tombol di dalamnya memicu input file */}
                        <label className="flex items-center justify-between border border-gray-300 rounded-lg p-2 bg-white cursor-pointer hover:bg-gray-50 transition group">
                            
                            <div className="flex items-center overflow-hidden">
                                {/* Tombol Visual */}
                                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-semibold mr-3 group-hover:bg-gray-200 transition">
                                    Pilih Berkas
                                </span>
                                
                                {/* Teks Nama File */}
                                <span className={`text-sm truncate ${fileName !== "Tidak ada berkas yang dipilih" ? "text-[#1e293b] font-medium" : "text-gray-400"}`}>
                                    {fileName}
                                </span>
                            </div>

                            {/* Input Asli (Hidden) */}
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/jpg" 
                                onChange={handleFileChange} 
                            />
                        </label>
                        <p className="text-xs text-gray-400 mt-2">Disarankan ukuran A4 Landscape (297mm x 210mm).</p>
                    </div>
                </div>

                {/* Footer Action */}
                <button 
                    onClick={handleSave} 
                    className="w-full bg-[#1e293b] text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition shadow-lg"
                >
                    Simpan Perubahan
                </button>
            </div>
        </div>
    );
};

export default TemplateModal;