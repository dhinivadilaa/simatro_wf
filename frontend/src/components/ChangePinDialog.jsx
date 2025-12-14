import React, { useState } from 'react';

const ChangePinDialog = ({ currentPin, onClose, onSave }) => {
  const [newPin, setNewPin] = useState(currentPin);

  const handleSave = () => {
    onSave(newPin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden"> 
        <div className="flex justify-between items-start p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Ubah PIN
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
            aria-label="Tutup"
          >
            &times; 
          </button>
        </div>

        <div className="p-6">
          <input
            type="text"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 text-lg text-center border border-gray-400 rounded-lg shadow-inner
                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-semibold tracking-wider"
            maxLength={10}
          />
        </div>

        <div className="p-0">
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 text-white font-semibold transition-colors
                       bg-blue-900 hover:bg-blue-800"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePinDialog;