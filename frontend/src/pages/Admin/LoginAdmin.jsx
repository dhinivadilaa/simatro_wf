// --- File: src/pages/Admin/LoginAdmin.jsx ---

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import api from "../../api/axios";
import { getValidAdminToken } from "../../utils/auth";

export default function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Check if already logged in
    useEffect(() => {
        const token = getValidAdminToken();
        if (token) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

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
                localStorage.setItem('adminAuthToken', response.data.token);
                // Set default Authorization header for future requests
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                
                // Redirect ke Dashboard Admin
                navigate('/admin/dashboard'); 
            } else {
                // Jika server merespons 200 OK tetapi tidak ada token
                setError('Akses ditolak. Periksa kredensial Anda.');
            }
        } catch (err) {
            console.error("Login Error:", err);
            
            // Fallback simulasi login untuk development
            if (email === 'panitia@simatro.com' && password === '123456') {
                console.log('Using fallback login simulation');
                // Buat mock JWT token yang valid
                const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
                const payload = btoa(JSON.stringify({ 
                    sub: 'admin', 
                    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
                    iat: Math.floor(Date.now() / 1000)
                }));
                const signature = btoa('mock-signature');
                const mockToken = `${header}.${payload}.${signature}`;
                
                localStorage.setItem('adminAuthToken', mockToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
                navigate('/admin/dashboard');
                return;
            }
            
            // Handle API errors
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.errors) {
                    const firstField = Object.keys(data.errors)[0];
                    setError(data.errors[firstField][0]);
                } else if (data.message) {
                    setError(data.message);
                } else {
                    setError('Kredensial salah atau akses ditolak.');
                }
            } else {
                setError('Gagal terhubung ke server. Coba gunakan: panitia@simatro.com / 123456');
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
            <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow">
                <div className="text-lg font-bold"><span className="text-yellow-400">⚡SIMATRO ADMIN</span> <span className="text-sm font-medium">UNIVERSITAS LAMPUNG</span></div>
                <Link to="/" className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md font-semibold text-sm">Daftar Acara</Link>
            </nav>

            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
                    <h1 className="text-2xl font-bold text-[#0e2a47] text-center mb-4">Login Admin SIMATRO</h1>

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

            <footer className="bg-blue-900 text-white text-center py-3">© 2025 SIMATRO Universitas Lampung. Admin Panel.</footer>
        </div>
    );
}