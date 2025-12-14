import React, { useState } from 'react';

const Header = ({ onNavigate }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleToggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavLinkClick = (viewId) => {
        onNavigate(viewId);
        setIsMobileMenuOpen(false); 
    };

    return (
        <header className="bg-ft-blue text-white shadow-custom-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight flex items-center">
                    <span className="text-ft-gold mr-1 text-3xl font-extrabold"></span> SIMATRO <span className="text-ft-gold text-sm font-light ml-2 pt-1 hidden md:block">TEKNIK ELEKTRO</span>
                </h1>
                <nav className="space-x-4 text-sm font-medium hidden md:flex">
                    <button onClick={() => handleNavLinkClick('event-list')} className="hover:text-ft-gold transition px-3 py-1 rounded">Daftar Acara</button>
                    <button onClick={() => handleNavLinkClick('admin-login')} className="hover:text-ft-gold transition px-3 py-1 rounded bg-ft-accent hover:bg-ft-gold hover:text-ft-blue font-bold">Admin Panel</button>
                </nav>
                <button id="menu-toggle" className="md:hidden text-white" onClick={handleToggleMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>
            {isMobileMenuOpen && (
                <div id="mobile-menu" className="md:hidden bg-ft-accent">
                    <button onClick={() => handleNavLinkClick('event-list')} className="block w-full text-left p-3 hover:bg-ft-blue transition text-sm">Daftar Acara</button>
                    <button onClick={() => handleNavLinkClick('admin-login')} className="block w-full text-left p-3 hover:bg-ft-blue transition text-sm bg-ft-gold text-ft-blue font-bold">Admin Panel</button>
                </div>
            )}
        </header>
    );
};

export default Header;