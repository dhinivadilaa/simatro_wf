// --- File: src/pages/Admin/LoginAdmin.jsx ---

import React, { useState } from "react"; // Hapus useEffect yang tidak terpakai
import './LoginAdmin.css';
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
        <div className="login-admin-page">
            
            {/* Navbar Minimal Sesuai Gambar */}
            <nav className="login-navbar">
                <div className="logo">
                    SIMATRO ADMIN <span className="logo-dept">TEKNIK ELEKTRO</span>
                </div>
                {/* Link ke halaman publik */}
                <Link to="/" className="btn-daftar-acara">
                    Daftar Acara
                </Link>
            </nav>

            <div className="login-content-wrapper">
                <div className="login-card">
                    <h1 className="login-title">Login Panitia SIMATRO</h1>

                    {error && <p className="login-error-message">{error}</p>}
                    
                    <p className="access-info">
                        Akses hanya untuk Koordinator Acara atau Super Admin Jurusan.
                    </p>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="panitia@simatro.com"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-login-dashboard"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Loading...' : 'Login ke Dashboard'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer Minimal Sesuai Gambar */}
            <footer className="login-footer">
                © 2025 SIMATRO Jurusan Teknik Elektro. Admin Panel.
            </footer>
        </div>
    );
}