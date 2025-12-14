import React, { useEffect, useState } from 'react';

const Notification = ({ id, type, message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true); // Mulai dengan notifikasi terlihat
        const timer = setTimeout(() => {
            setIsVisible(false); // Sembunyikan setelah beberapa waktu
            // Beri sedikit waktu untuk animasi fade out sebelum dihapus dari DOM
            setTimeout(() => onClose(id), 500);
        }, 4500); // Tampil selama 4.5 detik

        return () => clearTimeout(timer);
    }, [id, onClose]);

    let bgColorClass = '';
    let icon = '';
    let iconColor = '';

    switch (type) {
        case 'success':
            bgColorClass = 'bg-green-100 border-green-400';
            icon = (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            );
            iconColor = 'text-green-600';
            break;
        case 'error':
            bgColorClass = 'bg-red-100 border-red-400';
            icon = (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            );
            iconColor = 'text-red-600';
            break;
        case 'info':
        default:
            bgColorClass = 'bg-blue-100 border-blue-400';
            icon = (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path></svg>
            );
            iconColor = 'text-blue-600';
            break;
    }

    return (
        <div className={`fixed bottom-4 right-4 z-[9999] p-4 rounded-lg shadow-lg border-l-4 ${bgColorClass} transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <div className="flex items-center">
                <div className={`flex-shrink-0 ${iconColor}`}>
                    {icon}
                </div>
                <div className="ml-3 text-sm font-medium text-gray-800">
                    {message}
                </div>
                <button onClick={() => onClose(id)} className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-500 rounded-lg p-1.5 hover:bg-gray-200 inline-flex h-8 w-8">
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </div>
        </div>
    );
};

export default Notification;