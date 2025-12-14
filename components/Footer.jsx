import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-ft-blue text-white py-6 mt-12 shadow-inner-top">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} SIMATRO - Jurusan Teknik Elektro. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;