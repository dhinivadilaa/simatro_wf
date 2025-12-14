/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Tambahkan index.html jika Anda memiliki class Tailwind di dalamnya
    "./index.html", 
    // Ini penting agar Tailwind memindai semua file React/JS/JSX Anda
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      // --- PENAMBAHAN SCALE KUSTOM UNTUK FIX ERROR `scale-101` ---
      scale: {
        '101': '1.01', // Tambahkan scale 101%
        '98': '0.98',  // Tambahkan scale 98%
      },
      // -----------------------------------------------------------
      colors: {
        'ft-blue': '#003366', 
        'ft-light-blue': '#3071A9',
        'ft-dark-blue': '#001F3F', 
        'ft-gold': '#FFD700', 
        'ft-accent': '#60A5FA', 
        'ft-success': '#10B981', 
      },
      boxShadow: {
        'custom-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-top': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}