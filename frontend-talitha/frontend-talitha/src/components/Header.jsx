import React, { useState } from 'react';

const Header = ({ onNavigate, isAdminLoggedIn, onAdminLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleToggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavLinkClick = (viewId) => {
        onNavigate(viewId);
        setIsMobileMenuOpen(false); 
    };

    const handleLogoutClick = () => {
        onAdminLogout();
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="bg-ft-blue text-white shadow-custom-sm sticky top-0 z-50 border-b border-ft-gold">
            <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
                {/* Logo Area */}
                <div 
                    className="cursor-pointer flex items-center" 
                    onClick={() => handleNavLinkClick(isAdminLoggedIn ? 'admin-dashboard' : 'event-list')}
                >
                    <h1 className="text-2xl font-bold tracking-tight flex items-center">
                        <span className="text-ft-gold mr-1 text-3xl font-extrabold">⚡</span> 
                        SIMATRO 
                        <span className="text-ft-gold text-sm font-light ml-2 pt-1 hidden md:block border-l border-gray-500 pl-2">
                            TEKNIK ELEKTRO
                        </span>
                    </h1>
                </div>

                {/* Desktop Nav */}
                <nav className="space-x-4 text-sm font-medium hidden md:flex items-center">
                    {/* Menu Peserta selalu muncul jika Admin belum login, atau opsional bisa dihilangkan saat admin login */}
                    {!isAdminLoggedIn && (
                        <button onClick={() => handleNavLinkClick('event-list')} className="hover:text-ft-gold transition px-3 py-1 rounded">
                            Daftar Acara
                        </button>
                    )}

                    {/* Logic Tombol Admin Panel vs Logout */}
                    {isAdminLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-300">Halo, Admin</span>
                            <button 
                                onClick={handleLogoutClick} 
                                className="bg-red-600 hover:bg-red-700 text-white transition px-4 py-2 rounded shadow-md font-bold text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleNavLinkClick('admin-login')} 
                            className="bg-ft-accent hover:bg-ft-gold hover:text-ft-blue text-white transition px-4 py-2 rounded shadow-md font-bold text-sm"
                        >
                            Admin Panel
                        </button>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button id="menu-toggle" className="md:hidden text-white focus:outline-none" onClick={handleToggleMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
                <div id="mobile-menu" className="md:hidden bg-[#16202e] border-t border-gray-700">
                    {!isAdminLoggedIn && (
                        <button onClick={() => handleNavLinkClick('event-list')} className="block w-full text-left p-4 hover:bg-ft-blue transition text-sm border-b border-gray-700">
                            Daftar Acara
                        </button>
                    )}
                    
                    {isAdminLoggedIn ? (
                        <button onClick={handleLogoutClick} className="block w-full text-left p-4 bg-red-600 text-white font-bold text-sm">
                            Logout Admin
                        </button>
                    ) : (
                        <button onClick={() => handleNavLinkClick('admin-login')} className="block w-full text-left p-4 bg-ft-gold text-ft-blue font-bold text-sm">
                            Masuk Admin Panel
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;