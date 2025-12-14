import React, { useState } from 'react';
import api from '../api/axios';

export default function AbsensiForm({ eventId }) {
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [proofPhoto, setProofPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !pin) {
            setMessage('Harap isi email dan PIN absensi');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('event_id', eventId);
            formData.append('email', email);
            formData.append('pin', pin);
            if (proofPhoto) {
                formData.append('proof_photo', proofPhoto);
            }

            const response = await api.post('/attendance/check', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage('Absensi berhasil dicatat! ✅');
            setMessageType('success');
            setEmail('');
            setPin('');
            setProofPhoto(null);
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Gagal melakukan absensi';
            setMessage(errorMsg);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Peserta
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Absensi
                    </label>
                    <input
                        type="text"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Masukkan PIN dari panitia"
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bukti Foto di Tempat (Opsional)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofPhoto(e.target.files[0])}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Upload foto sebagai bukti kehadiran di tempat acara</p>
            </div>

            {message && (
                <div className={`p-3 rounded-lg text-sm ${
                    messageType === 'success' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Memproses...
                    </>
                ) : (
                    <>
                        📝 Absen Sekarang
                    </>
                )}
            </button>
        </form>
    );
}