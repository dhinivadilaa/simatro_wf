import React, { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, content, size = 'max-w-xl' }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Mencegah scrolling body saat modal terbuka
        } else {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[9998] animate-fade-in"
            onClick={handleClickOutside}
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-lg p-6 shadow-xl w-full ${size} transform scale-95 animate-zoom-in`}
                onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div>
                    {content}
                </div>
            </div>
        </div>
    );
};

export default Modal;