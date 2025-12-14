import React from 'react';

const PreviewModal = ({ onClose, event, bgImage }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-6 relative overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Pratinjau Template Sertifikat</h2>
                
                {/* Container Sertifikat */}
                <div className="w-full aspect-[1.414/1] relative flex items-center justify-center shadow-inner overflow-hidden border-2 border-gray-200">
                    
                    {/* LOGIKA TAMPILAN */}
                    {bgImage ? (
                        // JIKA ADA GAMBAR BACKGROUND YANG DIUPLOAD
                        <div 
                            className="absolute inset-0 bg-contain bg-center bg-no-repeat w-full h-full"
                            style={{ backgroundImage: `url(${bgImage})` }}
                        >
                            {/* Overlay Text (Tetap Tampil di Atas Gambar) */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
                                <h2 className="text-3xl font-cursive text-gray-800 mb-2 mt-10">Nama Peserta</h2>
                                <h3 className="text-xl font-bold text-ft-blue mt-4">{event.title}</h3>
                            </div>
                        </div>
                    ) : (
                        // JIKA BELUM ADA GAMBAR (DESAIN DEFAULT)
                        <div className="w-full h-full bg-white border-4 border-double border-ft-gold relative flex flex-col items-center justify-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 transform rotate-45 translate-x-32 -translate-y-32 opacity-20"></div>
                            <div className="text-center z-10">
                                <h1 className="text-5xl font-serif text-ft-gold mb-4">SERTIFIKAT</h1>
                                <p className="text-gray-500 italic mb-4 text-lg">Diberikan kepada:</p>
                                <h2 className="text-4xl font-cursive text-gray-800 mb-4">Nama Peserta</h2>
                                <p className="text-gray-600">Sebagai Peserta dalam acara:</p>
                                <h3 className="text-2xl font-bold text-ft-blue mt-2">{event.title}</h3>
                            </div>
                        </div>
                    )}

                </div>
                <button onClick={onClose} className="w-full mt-6 bg-[#5c6b7f] text-white font-bold py-3 rounded-lg hover:bg-slate-600 shadow-md">Tutup Pratinjau</button>
            </div>
        </div>
    );
};

export default PreviewModal;