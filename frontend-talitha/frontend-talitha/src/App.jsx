import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Notification from './components/Notification.jsx';
import Modal from './components/Modal.jsx';

// ================== VIEWS IMPORT (USER) ==================
import EventList from './views/EventList.jsx';
import EventDetail from './views/EventDetail.jsx';
import RegisterForm from './views/RegisterForm.jsx';
import CheckStatusForm from './views/CheckStatusForm.jsx';
import CertificatePreview from './views/CertificatePreview.jsx';
import UserDashboard from './views/UserDashboard.jsx';
import FeedbackSuccess from "./views/FeedbackSuccess.jsx";

// ================== VIEWS IMPORT (ADMIN) ==================
import AdminLogin from './views/AdminLogin.jsx';
import AdminDashboard from './views/AdminDashboard.jsx';
import AdminEventDetail from "./views/AdminEventDetail.jsx";     // View Dashboard Detail Acara
import AdminFeedbackDetail from "./views/AdminFeedbackDetail.jsx"; // View List Saran/Feedback
import UploadMaterial from "./views/UploadMaterial.jsx";

// ================== KONFIGURASI ==================
const CUTOFF_HOUR = 23;
const CUTOFF_MINUTE = 59;
const CUTOFF_DISPLAY = `${CUTOFF_HOUR.toString().padStart(2, '0')}:${CUTOFF_MINUTE.toString().padStart(2, '0')} WIB`;

const initialParticipants = {}; 

function App() {
    // ================== STATE UTAMA ==================
    // 1. Events: Menyimpan semua data acara (Database sementara)
    const [events, setEvents] = useState([]); 
    
    // 2. Participants: Menyimpan data user dan registrasi
    const [participants, setParticipants] = useState(initialParticipants);

    // ================== STATE UI & AUTH ==================
    const [currentView, setCurrentView] = useState('event-list');
    const [activeEvent, setActiveEvent] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, type: '', data: null, title: '', content: '', size: 'max-w-xl' });
    
    // Auth State
    const [loggedInParticipantId, setLoggedInParticipantId] = useState(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    
    // Temp Data State
    const [certificateEventData, setCertificateEventData] = useState(null);

    // ================== HANDLERS (CONTROLLER) ==================

    // --- 1. Notification System ---
    const showNotification = (type, message) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, type, message }]);
        setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 5000);
    };
    const removeNotification = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

    // --- 2. Modal System ---
    const showModal = (type, data = null, title = '', content = '', size = 'max-w-xl') => {
        setModal({ isOpen: true, type, data, title, content, size });
    };
    const closeModal = () => {
        setModal({ isOpen: false, type: '', data: null, title: '', content: '', size: 'max-w-xl' });
    };

    // --- 3. Navigation Controller ---
    const handleNavigate = (viewId, eventData = null) => {
        // Proteksi Halaman Admin
        if (viewId.startsWith('admin') && viewId !== 'admin-login' && !isAdminLoggedIn) {
            showNotification('error', 'Akses Ditolak. Silakan login sebagai Admin.');
            setCurrentView('admin-login');
            return;
        }

        if (viewId === 'event-list') setActiveEvent(null);
        if (eventData) setActiveEvent(eventData);
        
        setCurrentView(viewId);
        setCertificateEventData(null);
        window.scrollTo(0, 0); 
    };

    // --- 4. DATA LOGIC: UPDATE EVENT (Ubah PIN, Cutoff, Status Aktif/Nonaktif) ---
    const handleUpdateEvent = (eventId, updatedFields) => {
        // Update di Database Utama
        setEvents(prevEvents => 
            prevEvents.map(ev => 
                ev.id === eventId ? { ...ev, ...updatedFields } : ev
            )
        );
        // Update Active Event (agar UI detail langsung berubah)
        if (activeEvent && activeEvent.id === eventId) {
            setActiveEvent(prev => ({ ...prev, ...updatedFields }));
        }
        showNotification("success", "Data acara berhasil diperbarui!");
    };

    // --- 5. DATA LOGIC: HAPUS EVENT ---
    const handleDeleteEvent = (eventId) => {
        setEvents(prevEvents => prevEvents.filter(ev => ev.id !== eventId));
        showNotification("info", "Acara berhasil dihapus permanen.");
    };

    // --- 6. DATA LOGIC: PENDAFTARAN PESERTA ---
    const handleRegisterSuccess = ({ name, email, phone, eventId, eventTitle, code }) => {
        let participantKey = Object.keys(participants).find(key => participants[key].email.toLowerCase() === email.toLowerCase());
        const newParticipants = { ...participants };

        if (!participantKey) {
            participantKey = 'P' + Math.floor(Math.random() * 900000 + 100000).toString();
            newParticipants[participantKey] = { name, email, phone, events: [] };
        }
        
        const existingRegistration = newParticipants[participantKey].events.find(e => e.id === eventId);
        if (existingRegistration) {
            showNotification('info', `Anda sudah terdaftar. Kode: ${existingRegistration.code}`);
            showModal('code-confirmation', { code: existingRegistration.code, eventTitle });
            setLoggedInParticipantId(participantKey);
            return;
        }

        newParticipants[participantKey].events.push({
            id: eventId, 
            title: eventTitle, 
            code: code, 
            status: 'TERDAFTAR', 
            cert: 'BELUM SYARAT', 
            time: null 
        });

        // Update Counter Peserta
        setEvents(prevEvents =>
            prevEvents.map(ev =>
                ev.id === eventId ? { ...ev, total: (ev.total ?? 0) + 1 } : ev
            )
        );

        setParticipants(newParticipants);
        setLoggedInParticipantId(participantKey);
        
        showModal('code-confirmation', { code, eventTitle });
        showNotification('success', 'Pendaftaran berhasil! Data tersimpan.');
    };

    // --- 7. DATA LOGIC: ABSENSI PESERTA ---
    const handleCheckStatus = ({ email, code }) => {
        const now = new Date();
        const cutoffDate = new Date(now);
        cutoffDate.setHours(CUTOFF_HOUR, CUTOFF_MINUTE, 0, 0);
        
        const participantKey = Object.keys(participants).find(key => participants[key].email.toLowerCase() === email.toLowerCase());

        if (!participantKey) { showNotification('error', 'Data Tidak Ditemukan.'); return; }

        const participant = participants[participantKey];
        const eventIndex = participant.events.findIndex(e => e.id === activeEvent.id && e.code.toUpperCase() === code.toUpperCase());

        if (eventIndex === -1) { showNotification('error', 'Kode Unik atau Event tidak cocok.'); return; }

        const eventData = participant.events[eventIndex];
        setLoggedInParticipantId(participantKey);

        if (eventData.status.includes('HADIR')) {
            showNotification('info', `Anda sudah absen pada ${eventData.time}.`);
        } else {
            // Validasi Waktu
            if (now > cutoffDate) { showNotification('error', 'Gagal Absensi. Waktu habis.'); return; }
            
            const currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
            
            const updatedParticipants = { ...participants };
            updatedParticipants[participantKey].events[eventIndex] = { 
                ...eventData, 
                status: 'HADIR', 
                cert: 'DITERBITKAN', 
                time: currentTime 
            };
            setParticipants(updatedParticipants);

            // Update Counter Hadir
            setEvents(prevEvents =>
                prevEvents.map(ev =>
                    ev.id === activeEvent.id ? { ...ev, attendance: (ev.attendance ?? 0) + 1 } : ev
                )
            );

            showNotification('success', 'Absensi Berhasil! Status Admin terupdate.');
        }
        handleNavigate('user-dashboard');
    };

    // --- 8. LOGIC: ADMIN AUTH ---
    const handleAdminLogin = ({ email, password }) => {
        if ((email === 'panitia@simatro.com' && password === 'pass123') || (email === 'admin@ft.com' && password === 'superpass')) {
            setIsAdminLoggedIn(true);
            
            // Bypass Navigasi (Langsung ke Dashboard tanpa klik 2x)
            setCurrentView('admin-dashboard'); 
            window.scrollTo(0, 0);
            
            showNotification('success', 'Login Admin Berhasil!');
        } else {
            showNotification('error', 'Email atau Password salah.');
        }
    };

    const handleAdminLogout = () => {
        setIsAdminLoggedIn(false);
        showNotification('info', 'Anda telah logout.');
        handleNavigate('event-list'); 
    };

    // --- 9. LOGIC: EVENT MANAGEMENT (CREATE & UPLOAD) ---
    const handleCreateNewEvent = (newEvent) => {
        setEvents((prev) => [...prev, newEvent]);
        showNotification("success", "Acara Baru Berhasil Dibuat & Tampil di User!");
    };

    const handleUploadMaterial = (eventId, materialFile) => {
        setEvents(prev =>
            prev.map(ev =>
                ev.id === eventId ? { ...ev, materials: [...(ev.materials || []), materialFile] } : ev
            )
        );
        showNotification("success", "Materi berhasil diupload!");
    };

    // --- 10. LOGIC: FEEDBACK ---
    const handleSubmitFeedback = ({ eventId, score, category, message, name, email }) => {
        setEvents(prevEvents =>
            prevEvents.map(ev =>
                ev.id === eventId
                    ? {
                        ...ev,
                        feedback: [ ...(ev.feedback || []), { name, email, score, category, message } ]
                      }
                    : ev
            )
        );
        showNotification("success", "Feedback terkirim!");
        setCurrentView("feedback-success");
    };

    const handleDownloadCertificate = (event) => {
        if (!loggedInParticipantId) return;
        setEvents(prevEvents =>
           prevEvents.map(ev =>
             ev.id === event.id ? { ...ev, certCount: (ev.certCount ?? 0) + 1 } : ev
            )
        );
        setCertificateEventData(event);
        setCurrentView('certificate-preview'); 
    };

    // ================== RENDER HELPERS ==================
    const renderModalContent = () => {
        if (modal.type === 'code-confirmation') {
            return (
                <div className="text-center p-4">
                    <p className="text-gray-600 mb-3 font-semibold">Pendaftaran Berhasil!</p>
                    <div className="bg-gray-100 border border-dashed border-ft-blue p-3 rounded-lg font-mono text-2xl font-bold text-ft-blue mb-4 select-all">
                        {modal.data.code}
                    </div>
                    <p className="text-sm text-red-600 mb-3 font-semibold">Simpan kode ini untuk melakukan Absensi nanti.</p>
                    <button onClick={() => { navigator.clipboard.writeText(modal.data.code); showNotification('success', 'Disalin!'); }} className="w-full bg-ft-gold text-ft-blue py-2 rounded-lg font-bold hover:bg-yellow-500 mb-2">Salin Kode</button>
                    <button onClick={closeModal} className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400">Tutup</button>
                </div>
            );
        }
        return modal.content;
    };

    // --- LOGIC LIVE DATA ADMIN (PENTING) ---
    // Agar saat user absen/feedback, Admin langsung melihat perubahan tanpa refresh
    const liveActiveEvent = activeEvent ? events.find(e => e.id === activeEvent.id) || activeEvent : null;

    return (
        <div className="min-h-screen bg-ft-gray font-sans text-gray-900 flex flex-col">
            
            <Header 
                onNavigate={handleNavigate} 
                isAdminLoggedIn={isAdminLoggedIn} 
                onAdminLogout={handleAdminLogout} 
            />

            <main className="flex-grow container mx-auto p-4 md:p-8">
                
                {/* 1. PUBLIC VIEWS */}
                {currentView === "event-list" && (
                    <EventList
                        events={events}
                        onShowDetail={(title, id) => {
                            const eventData = events.find(e => e.id === id);
                            handleNavigate("event-detail", eventData);
                        }}
                    />
                )}

                {currentView === 'event-detail' && activeEvent && (
                    <EventDetail
                        event={activeEvent}
                        onNavigate={handleNavigate}
                        loggedInParticipantId={loggedInParticipantId}
                    />
                )}

                {currentView === 'pendaftaran-form' && activeEvent && (
                    <RegisterForm
                        event={activeEvent}
                        onRegisterSuccess={handleRegisterSuccess}
                        onNavigate={handleNavigate}
                        loggedInParticipantId={loggedInParticipantId}
                    />
                )}

                {currentView === 'cek-sertifikat-form' && activeEvent && (
                    <CheckStatusForm
                        event={activeEvent}
                        onCheckStatus={handleCheckStatus}
                        onNavigate={handleNavigate}
                        cutoffDisplay={CUTOFF_DISPLAY}
                        loggedInParticipantId={loggedInParticipantId}
                    />
                )}

                {currentView === 'feedback-success' && <FeedbackSuccess onNavigate={handleNavigate} />}

                {currentView === 'certificate-preview' && certificateEventData && (
                    <CertificatePreview
                        participant={participants[loggedInParticipantId]}
                        event={certificateEventData}
                        onNavigate={handleNavigate}
                        onSubmitFeedback={handleSubmitFeedback}
                    />
                )}

                {/* 2. ADMIN VIEWS */}

                {currentView === 'admin-login' && (
                    <AdminLogin
                        onAdminLogin={handleAdminLogin}
                        onNavigate={handleNavigate}
                    />
                )}

                {currentView === 'admin-dashboard' && isAdminLoggedIn && (
                    <AdminDashboard
                        events={events}
                        setEvents={setEvents}
                        onNavigate={handleNavigate}
                        onCreateNewEvent={handleCreateNewEvent}
                        onUpdateEvent={handleUpdateEvent} // Props untuk toggle status & cutoff
                        onDeleteEvent={handleDeleteEvent} // Props untuk hapus acara
                    />
                )}

                {/* VIEW DETAIL ACARA (Menggunakan liveActiveEvent & handleUpdateEvent) */}
                {currentView === "admin-event-detail" && isAdminLoggedIn && liveActiveEvent && (
                    <AdminEventDetail
                        event={liveActiveEvent} 
                        participants={participants}
                        onNavigate={handleNavigate}
                        onUpdateEvent={handleUpdateEvent} // Props untuk Ubah PIN
                    />
                )}

                {/* VIEW LIST FEEDBACK (Menggunakan liveActiveEvent) */}
                {currentView === "admin-feedback-detail" && isAdminLoggedIn && liveActiveEvent && (
                    <AdminFeedbackDetail
                        event={liveActiveEvent} 
                        onNavigate={handleNavigate}
                    />
                )}

                {currentView === "upload-material" && isAdminLoggedIn && activeEvent && (
                    <UploadMaterial
                        event={activeEvent}
                        onUpload={handleUploadMaterial}
                        onNavigate={handleNavigate}
                    />
                )}

                {/* 3. USER DASHBOARD */}
                {currentView === 'user-dashboard' && loggedInParticipantId && (
                    <UserDashboard
                        participantData={participants[loggedInParticipantId]}
                        onNavigate={handleNavigate}
                        onDownloadCertificate={handleDownloadCertificate}
                    />
                )}

            </main>

            <Footer />

            {/* GLOBAL COMPONENTS */}
            <div className="fixed bottom-4 right-4 z-[9999] space-y-2">
                {notifications.map((n) => (
                    <Notification key={n.id} id={n.id} type={n.type} message={n.message} onClose={removeNotification} />
                ))}
            </div>

            <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title} content={renderModalContent()} size={modal.size} />
        </div>
    );
}

export default App;