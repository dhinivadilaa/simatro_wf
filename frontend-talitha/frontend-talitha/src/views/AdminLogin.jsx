import React, { useState } from 'react';

const AdminLogin = ({ onAdminLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdminLogin({ email, password });
    };

    return (
        <div id="admin-login" className="view max-w-md mx-auto bg-white rounded-xl p-8 shadow-custom-lg">
            <h3 className="text-2xl font-bold text-ft-blue mb-6 text-center">Login Admin SIMATRO</h3>
            <p className="text-red-600 text-sm mb-6 text-center">Akses hanya untuk Koordinator Acara atau Super Admin Jurusan.</p>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700">Email Admin</label>
                        <input type="email" id="admin-email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ft-blue focus:ring-ft-blue p-3 border" />
                    </div>
                    <div>
                        <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="admin-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ft-blue focus:ring-ft-blue p-3 border" />
                    </div>
                </div>
                <button type="submit" className="w-full mt-6 bg-ft-blue text-white py-3 rounded-lg font-semibold hover:bg-ft-accent animated-btn text-lg">Login</button>
            </form>
            <button onClick={() => onNavigate('event-list')} className="w-full mt-4 text-ft-blue text-sm hover:underline">Kembali ke Beranda</button>
        </div>
    );
};

export default AdminLogin;