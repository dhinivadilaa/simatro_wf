// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Notification from './components/Notification.jsx';
import Modal from './components/Modal.jsx';

// Views
import EventList from './views/EventList.jsx';
import EventDetail from './views/EventDetail.jsx';
import RegisterForm from './views/RegisterForm.jsx';
import CheckStatusForm from './views/CheckStatusForm.jsx';
import AdminLogin from './views/AdminLogin.jsx';
import AdminDashboard from './views/AdminDashboard.jsx';
import CertificatePreview from './views/CertificatePreview.jsx';
import UserDashboard from './views/UserDashboard.jsx';
import AdminEventDetail from "./views/AdminEventDetail.jsx";
import UploadMaterial from "./views/UploadMaterial.jsx";
import FeedbackSuccess from "./views/FeedbackSuccess.jsx";

// ... (BAGIAN DATA DUMMY & KONSTANTA TETAP SAMA SEPERTI SEBELUMNYA) ...
const CUTOFF_HOUR = 23;
const CUTOFF_MINUTE = 59;
const CUTOFF_DISPLAY = `${CUTOFF_HOUR.toString().padStart(2, '0')}:${CUTOFF_MINUTE.toString().padStart(2, '0')} WIB`;

const initialParticipants = {};

function App() {
    // ... (STATE & UTILITY HANDLERS TETAP SAMA) ...
    const [currentView, setCurrentView] = useState('event-list');
    const [activeEvent, setActiveEvent] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, type: '', data: null, title: '', content: '', size: 'max-w-xl' });
    const [participants, setParticipants] = useState(initialParticipants);
    const [loggedInParticipantId, setLoggedInParticipantId] = useState(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [certificateEventData, setCertificateEventData] = useState(null);
    const [feedbackStatus, setFeedbackStatus] = useState(false);
    const [events, setEvents] = useState([]);   // mulai dari kosong
    const [showNewEventForm, setShowNewEventForm] = useState(false); // <<< NEW
    
    // ... (Code showNotification, removeNotification, showModal, closeModal TETAP SAMA) ...
    const showNotification = (type, message) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const showModal = (type, data = null, title = '', content = '', size = 'max-w-xl') => {
        setModal({ isOpen: true, type, data, title, content, size });
    };

    const closeModal = () => {
        setModal({ isOpen: false, type: '', data: null, title: '', content: '', size: 'max-w-xl' });
    };

    // ... (Code handleNavigate, handleRegisterSuccess, handleCheckStatus, dll TETAP SAMA) ...
    const handleNavigate = (viewId, eventData = null) => {
        if (viewId === 'admin-dashboard' && !isAdminLoggedIn) {
            return;
        }
        if (viewId === 'event-list') {
            setActiveEvent(null);
        }
        if (eventData) {
            setActiveEvent(eventData);
        }
        setCurrentView(viewId);
        setCertificateEventData(null);
        window.scrollTo(0, 0); 
    };

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
            id: eventId, title: eventTitle, code: code, status: 'TERDAFTAR', cert: 'BELUM SYARAT', time: null
        });

        setEvents(prevEvents =>
        prevEvents.map(ev =>
        ev.id === eventId
            ? { ...ev, total: (ev.total ?? 0) + 1 }
        : ev
            )
        );
        setParticipants(newParticipants);
        setEvents(prevEvents =>
        prevEvents.map(ev =>
            ev.id === activeEvent.id
            ? { ...ev, attendance: (ev.attendance ?? 0) + 1 }
        : ev
        )
        );
        setLoggedInParticipantId(participantKey);
        showModal('code-confirmation', { code, eventTitle });
        showNotification('success', 'Pendaftaran berhasil!');
    };

    const handleCheckStatus = ({ email, code }) => {
        const now = new Date();
        const cutoffDate = new Date(now);
        cutoffDate.setHours(CUTOFF_HOUR, CUTOFF_MINUTE, 0, 0);
        const participantKey = Object.keys(participants).find(key => participants[key].email.toLowerCase() === email.toLowerCase());

        if (!participantKey) { showNotification('error', 'Data Tidak Ditemukan.'); return; }

        const participant = participants[participantKey];
        const eventData = participant.events.find(e => e.id === activeEvent.id && e.code.toUpperCase() === code.toUpperCase());

        if (!eventData) { showNotification('error', 'Kode Unik tidak cocok.'); return; }

        setLoggedInParticipantId(participantKey);

        if (eventData.status.includes('HADIR')) {
            showNotification('info', `Anda sudah hadir pada ${eventData.time}.`);
        } else {
            if (now > cutoffDate) { showNotification('error', 'Gagal Absensi. Waktu habis.'); return; }
            const currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
            const updatedParticipants = { ...participants };
            const eventIndex = updatedParticipants[participantKey].events.findIndex(e => e.id === activeEvent.id);
            updatedParticipants[participantKey].events[eventIndex] = { ...updatedParticipants[participantKey].events[eventIndex], status: 'HADIR', cert: 'DITERBITKAN', time: currentTime };
            setParticipants(updatedParticipants);
            showNotification('success', 'Absensi Berhasil!');
        }
        handleNavigate('user-dashboard');
    };

    const handleAdminLogin = ({ email, password }) => {
        if ((email === 'panitia@simatro.com' && password === 'pass123') || (email === 'admin@ft.com' && password === 'superpass')) {
            setIsAdminLoggedIn(true);
            handleNavigate('admin-dashboard');
            showNotification('success', 'Login Berhasil!');
        } else {
            showNotification('error', 'Login Gagal.');
        }
    };

    const handleAdminLogout = () => {
        setIsAdminLoggedIn(false);
        showNotification('info', 'Logout berhasil.');
        handleNavigate('admin-login');
    };

    const handleCreateNewEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
    setShowNewEventForm(false);
    showNotification("success", "Acara Baru Berhasil Dibuat!");
    };

    
    const handleSubmitFeedback = ({ eventId, score, category, message, name, email }) => {
    setEvents(prevEvents =>
        prevEvents.map(ev =>
            ev.id === eventId
                ? {
                    ...ev,
                    feedback: [
                        ...(ev.feedback || []),
                        { name, email, score, category, message }
                    ]
                }
                : ev
        )
    );

    showNotification("success", "Feedback berhasil terkirim!");
    setCurrentView("feedback-success");
};



    const handleOverrideAbsensi = (nimKey, eventId, reason) => {
        if (!isAdminLoggedIn) return;
        const updatedParticipants = { ...participants };
        const participant = updatedParticipants[nimKey];``
        const eventIndex = participant.events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
            participant.events[eventIndex] = { ...participant.events[eventIndex], status: 'HADIR (OVERRIDE)', cert: 'DITERBITKAN', time: `Manual: ${currentTime} - ${reason}` };
            setParticipants(updatedParticipants);
            showNotification('info', `Override berhasil.`);
        }
    };

    const handleDownloadCertificate = (event) => {
    if (!loggedInParticipantId) return;
    setEvents(prevEvents =>
    prevEvents.map(ev =>
      ev.id === event.id
        ? { ...ev, certCount: (ev.certCount ?? 0) + 1 }
        : ev
     )
   );
    setCertificateEventData(event);
    setCurrentView('certificate-preview'); // BUKAN modal!
    };

    const handleUploadMaterial = (eventId, materialFile) => {
    setEvents(prev =>
        prev.map(ev =>
            ev.id === eventId
                ? { ...ev, materials: [...(ev.materials || []), materialFile] }
                : ev
        )
    );
    showNotification("success", "Materi berhasil diupload!");
    };


    const renderModalContent = () => {
        if (modal.type === 'code-confirmation') {
            return (
                <div className="text-center p-4">
                    <p className="text- text-gray-600 mb-3 font-semibold">Pendaftaran Berhasil! Simpan Kode Registrasi Anda</p>
                    <div className="bg-gray-100 border border-dashed border-ft-blue p-3 rounded-lg font-mono text-2xl font-bold text-ft-blue mb-4 select-all">{modal.data.code}</div>
                    <p className="text-sm text-red-600 mb-3 font-semibold">Kode ini adalah ID Pendaftaran Anda. Kode untuk Absensi Acara akan dibagikan oleh Panitia di lokasi saat event berlangsung.</p>
                    <button onClick={() => { navigator.clipboard.writeText(modal.data.code); showNotification('success', 'Disalin!'); }} className="w-full bg-ft-gold text-ft-blue py-2 rounded-lg font-bold hover:bg-yellow-500 mb-3 animated-btn">Salin Kode</button>
                    <button onClick={closeModal} className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 animated-btn">Tutup</button>
                </div>
            );
        }
        if (modal.type === 'certificate-preview' && loggedInParticipantId && certificateEventData) {
            return <CertificatePreview participant={participants[loggedInParticipantId]} event={certificateEventData} onClose={closeModal} />;
        }
        return modal.content;
    };

return (
    <div className="min-h-screen bg-ft-gray font-sans text-gray-900 flex flex-col">
        <Header onNavigate={handleNavigate} loggedInParticipantId={loggedInParticipantId} isAdminLoggedIn={isAdminLoggedIn} onAdminLogout={handleAdminLogout} />

        <main className="flex-grow container mx-auto p-4 md:p-8">

            {/* ====== PERBAIKAN DISINI ====== */}
{currentView === "event-list" && (
  <EventList
    events={events}                                   
    onShowDetail={(title, id) => {
      const eventData = events.find(e => e.id === id);
      handleNavigate("event-detail", eventData);
    }}
  />
)}

            {/* ================================= */}

            {currentView === 'event-detail' && activeEvent && (
                <EventDetail
                    event={activeEvent}
                    onNavigate={handleNavigate}
                    loggedInParticipantId={loggedInParticipantId}
                    onSubmitFeedback={handleSubmitFeedback}   // <<< TAMBAH DI SINI
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
                    onSubmitFeedback={handleSubmitFeedback}   // TAMBAH INI
            />
            )}


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
                />
            )}
            {currentView === "admin-event-detail" && isAdminLoggedIn && activeEvent && (
              <AdminEventDetail
                    event={activeEvent}
                    participants={participants}
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


            {currentView === 'user-dashboard' && loggedInParticipantId && (
                <UserDashboard
                    participantData={participants[loggedInParticipantId]}
                    onNavigate={handleNavigate}
                    onDownloadCertificate={handleDownloadCertificate}
                />
            )}
        </main>

        <Footer />

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