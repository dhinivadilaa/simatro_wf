// --- File: src/pages/Admin/LoginAdmin.jsx ---

import React, { useState } from "react"; // Hapus useEffect yang tidak terpakai
import { useNavigate, Link } from 'react-router-dom'; // ⬅️ PERBAIKAN: Impor Link
import api from "../../api/axios";

export default function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading/submit
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // --- Logika Autentikasi Admin menggunakan API ---
        try {
            // Asumsi endpoint API login adalah /admin/login (sesuai route yang kita buat)
            const response = await api.post('/admin/login', {
                email,
                password,
            });

            // Asumsi server mengembalikan token atau data user yang valid saat sukses
            if (response.data && response.data.token) { 
                // Simpan token atau informasi user di localStorage (contoh)
                localStorage.setItem('adminAuthToken', response.data.token); 
                
                // Redirect ke Dashboard Admin
                navigate('/admin/dashboard'); 
            } else {
                // Jika server merespons 200 OK tetapi tidak ada token
                setError('Akses ditolak. Periksa kredensial Anda.');
            }
        } catch (err) {
            console.error("Login Error:", err);
            
            // Tangani error spesifik dari API (misal: 401 Unauthorized)
            if (err.response && err.response.status === 401) {
                 setError('Kombinasi Email dan Password salah.');
            } else {
                 setError('Gagal terhubung ke server. Coba lagi nanti.');
            }
        } finally {
            setIsSubmitting(false);
        }

        /*
        // --- SIMULASI LOGIN (Hapus jika menggunakan API di atas) ---
        if (email === 'panitia@simatro.com' && password === '123456') {
             navigate('/admin/dashboard'); 
        } else {
             setError('Kombinasi Email dan Password salah atau akses ditolak.');
        }
        setIsSubmitting(false);
        // --------------------------------------------------------
        */
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <nav className="bg-[#0e2a47] text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="text-lg font-bold">SIMATRO ADMIN <span className="text-[#ffcc00] font-medium">TEKNIK ELEKTRO</span></div>
                <Link to="/" className="bg-[#d9534f] hover:bg-[#c9302c] text-white px-3 py-2 rounded-md font-semibold text-sm">Daftar Acara</Link>
            </nav>

            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
                    <h1 className="text-2xl font-bold text-[#0e2a47] text-center mb-4">Login Panitia SIMATRO</h1>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded mb-4 text-center">{error}</p>
                    )}

                    <p className="text-sm text-red-600 text-center font-medium mb-4">Akses hanya untuk Koordinator Acara atau Super Admin Jurusan.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="panitia@simatro.com"
                                required
                                disabled={isSubmitting}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                                required
                                disabled={isSubmitting}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#103a6f] hover:bg-[#0a2442] text-white py-3 rounded-md font-semibold disabled:opacity-60"
                        >
                            {isSubmitting ? 'Loading...' : 'Login ke Dashboard'}
                        </button>
                    </form>
                </div>
            </div>

            <footer className="bg-[#0e2a47] text-white text-center py-3">© 2025 SIMATRO Jurusan Teknik Elektro. Admin Panel.</footer>
        </div>
    );
}