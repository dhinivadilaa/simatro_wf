import React, { useState, useEffect } from 'react';

const ChangeCutoffModal = ({ event, onClose, onSave }) => {
    // Ambil jam saja dari string "15:00 WIB" -> "15:00"
    const [newTime, setNewTime] = useState("");

    useEffect(() => {
        if (event && event.cutoff) {
            // Ambil kata pertama (jam) sebelum spasi agar formatnya HH:MM
            const cleanTime = event.cutoff.split(" ")[0]; 
            setNewTime(cleanTime);
        }
    }, [event]);

    const handleSave = () => {
        if (!newTime) return;
        onSave(event.id, newTime);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative transform transition-all scale-100">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 leading-tight">
                        Ubah Batas Waktu Absensi <br/>
                        <span className="text-sm font-normal text-gray-500">({event.id})</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="mb-4 text-sm text-gray-600">
                    Atur ulang batas waktu absensi. Peserta tidak dapat melakukan absensi mandiri setelah jam ini.
                </div>

                {/* Input Time */}
                <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2">Batas Waktu Baru (HH:MM)</label>
                    <div className="relative">
                        <input 
                            type="time" 
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 text-xl font-bold text-gray-800 focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition text-center"
                        />
                        {/* Ikon Jam duplikat sudah DIHAPUS di sini */}
                    </div>
                </div>

                {/* Tombol Simpan */}
                <button 
                    onClick={handleSave}
                    className="w-full bg-[#d97706] text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition shadow-lg"
                >
                    Simpan Batas Waktu Baru
                </button>
            </div>
        </div>
    );
};

export default ChangeCutoffModal;