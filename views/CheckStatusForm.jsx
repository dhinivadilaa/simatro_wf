// src/views/CheckStatusForm.jsx
import React, { useState } from 'react';

const CheckStatusForm = ({ event, onCheckStatus, onNavigate, cutoffDisplay }) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCheckStatus({ email, code });
    };

    if (!event) {
        return <div className="text-center p-8">Pilih acara terlebih dahulu dari halaman detail acara.</div>;
    }

    return (
        <div id="check-status-form" className="view max-w-lg mx-auto bg-white rounded-xl p-8 shadow-custom-lg">

            {/* TOMBOL BACK */}
            <button
                onClick={() => onNavigate('event-detail')}
                className="flex items-center gap-2 text-gray-700 hover:underline mb-6"
            >
                <span className="text-xl">←</span>
                <span className="text-base font-medium">Kembali ke Detail Acara</span>
            </button>

            {/* JUDUL */}
            <h3 className="text-2xl font-bold text-ft-blue mb-3">Cek Status & Absensi Mandiri</h3>

            {/* BATAS WAKTU */}
            <p className="text-sm text-red-600 font-semibold mb-6">
                Batas waktu absensi adalah hari ini pukul {cutoffDisplay}. 
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="check-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Aktif (Terdaftar)
                    </label>
                    <input
                        type="email"
                        id="check-email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ft-blue focus:ring-ft-blue p-3 border"
                    />
                </div>

                <div>
                    <label htmlFor="check-code" className="block text-sm font-medium text-gray-700 mb-1">
                        Kode Absensi Unik
                    </label>
                    <input
                        type="text"
                        id="check-code"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-ft-blue focus:ring-ft-blue p-3 border"
                    />
                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    className="w-full mt-6 bg-ft-blue text-white py-3 rounded-lg font-semibold hover:bg-ft-accent text-lg shadow-md"
                >
                    Cek Status & Absen
                </button>
            </form>
        </div>
    );
};

export default CheckStatusForm;
