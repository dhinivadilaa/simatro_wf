import React, { useState } from 'react';

const ChangePinModal = ({ currentPin, onClose, onSave }) => {
    const [newPin, setNewPin] = useState(currentPin);

    const handleSave = () => {
        onSave(newPin);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative transform transition-all scale-100">
                
                {/* Header: Judul & Tombol Close */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Ubah PIN</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Input Field (Sesuai Desain: Besar & Center) */}
                <div className="mb-8">
                    <input 
                        type="text" 
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.toUpperCase())}
                        className="w-full border-2 border-gray-300 rounded-lg py-3 text-center text-2xl font-bold text-gray-800 focus:outline-none focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition tracking-wider uppercase"
                    />
                </div>

                {/* Tombol Simpan (Biru Dongker) */}
                <button 
                    onClick={handleSave}
                    className="w-full bg-[#1e293b] text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition shadow-lg"
                >
                    Simpan
                </button>
            </div>
        </div>
    );
};

export default ChangePinModal;