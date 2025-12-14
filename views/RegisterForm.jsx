// src/views/RegisterForm.jsx
import React, { useState } from 'react';

const RegisterForm = ({ event, onRegisterSuccess, onNavigate, loggedInParticipantId }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const dummyCode = `${event.id.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`;
        onRegisterSuccess({ name, email, phone, eventId: event.id, eventTitle: event.title, code: dummyCode });
    };

    return (
        <div className="view max-w-lg mx-auto bg-white rounded-xl p-8 shadow-custom-lg">

            {/* TOMBOL KEMBALI */}
            <button
                onClick={() => onNavigate('event-detail')}
                className="flex items-center gap-2 text-gray-700 hover:underline mb-6"
            >
                <span className="text-xl">←</span>
                <span className="text-base font-medium">Kembali ke Detail Acara</span>
            </button>

            {/* JUDUL FORM */}
            <h3 className="text-2xl font-bold text-ft-blue mb-4">Form Pendaftaran</h3>

            {/* INFO EVENT */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Mendaftar untuk:</p>
                <p className="font-bold text-gray-800">{event.title}</p>
            </div>

            {/* FORM INPUT */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-ft-blue focus:ring-ft-blue p-3 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Aktif</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-ft-blue focus:ring-ft-blue p-3 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                    <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-ft-blue focus:ring-ft-blue p-3 border"
                    />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    className="w-full mt-6 bg-ft-success text-white py-3 rounded-lg font-semibold hover:bg-green-700 animated-btn text-lg shadow-md"
                >
                    Daftar & Dapatkan Kode
                </button>
            </form>

            {/* NAVIGASI USER KE DASHBOARD SETELAH LOGIN */}
            {loggedInParticipantId && (
                <div className="mt-6 text-center border-t pt-4">
                    <button
                        onClick={() => onNavigate('user-dashboard')}
                        className="text-ft-blue text-sm font-semibold hover:underline"
                    >
                        Sudah mendaftar? Kembali ke Dashboard Saya
                    </button>
                </div>
            )}
        </div>
    );
};

export default RegisterForm;
