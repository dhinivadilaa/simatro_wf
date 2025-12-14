// src/views/UserDashboard.jsx
import React from 'react';

const UserDashboard = ({ participantData, onNavigate, onDownloadCertificate }) => {

    if (!participantData || !participantData.events) {
        return (
            <div className="view max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-custom-lg text-center">
                <h3 className="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h3>
                <p className="text-gray-700 mb-6">Anda perlu mendaftar atau cek status untuk melihat dashboard Anda.</p>
                <button 
                    onClick={() => onNavigate('event-list')} 
                    className="bg-ft-blue text-white py-2 px-6 rounded-lg font-semibold hover:bg-ft-accent animated-btn"
                >
                    Kembali ke Daftar Acara
                </button>
            </div>
        );
    }

    return (
        <div id="user-dashboard" className="view max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-custom-lg">

            {/* TOMBOL BACK */}
            <button
                onClick={() => onNavigate('event-list')}
                className="flex items-center gap-2 text-gray-700 hover:underline mb-6"
            >
                <span className="text-xl">←</span>
                <span className="text-base font-medium">Kembali ke Daftar Acara</span>
            </button>

            {/* HEADER DASHBOARD */}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 border-b-4 border-ft-gold inline-block pb-1">
                Dashboard Peserta
            </h2>
            <p className="text-gray-600 mb-8 pb-4">
                Selamat datang, <span className="font-bold text-ft-blue">{participantData.name}</span>! 
                Berikut adalah riwayat partisipasi Anda.
            </p>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-ft-blue/50">
                    <h3 className="text-xl font-bold text-ft-blue mb-2">Total Partisipasi</h3>
                    <p className="text-4xl font-extrabold text-ft-blue">{participantData.events.length}</p>
                    <p className="text-gray-600">Acara yang Anda ikuti</p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-500/50">
                    <h3 className="text-xl font-bold text-green-700 mb-2">Sertifikat Tersedia</h3>
                    <p className="text-4xl font-extrabold text-green-700">
                        {participantData.events.filter(e => e.cert === 'DITERBITKAN').length}
                    </p>
                    <p className="text-gray-600">Sertifikat siap diunduh</p>
                </div>
            </div>

            {/* RIWAYAT */}
            <h3 className="text-2xl font-bold text-ft-blue mb-6 border-b-2 pb-2">Riwayat Acara Anda</h3>

            {/* TABLE */}
            <div className="overflow-x-auto shadow-custom-lg rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acara</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Absensi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Absensi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Absen</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sertifikat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {participantData.events.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 italic">
                                    Anda belum terdaftar di acara manapun.
                                </td>
                            </tr>
                        ) : (
                            participantData.events.map((event, index) => (
                                <tr key={event.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-ft-blue">{event.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            event.status.includes('HADIR') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.time || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            event.cert === 'DITERBITKAN' ? 'bg-ft-gold text-ft-blue' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {event.cert}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {event.cert === 'DITERBITKAN' ? (
                                            <button
                                                onClick={() => onDownloadCertificate(event)}
                                                className="text-ft-success hover:text-green-700 ml-2 px-3 py-1 rounded-md bg-green-100 text-xs font-semibold animated-btn"
                                            >
                                                Unduh Sertifikat
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">Menunggu</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserDashboard;
