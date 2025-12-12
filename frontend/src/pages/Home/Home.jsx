// --- File: src/pages/Home/Home.jsx ---

// Styling migrated to Tailwind — remove separate CSS file
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

// Import Header & Footer
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Home() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/events")
            .then((res) => {
                const list = Array.isArray(res.data.data)
                    ? res.data.data
                    : [];
                setEvents(list);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching events:", err);
                setLoading(false);
            });
    }, []);

    // Tag color handled inline with Tailwind classes

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header adminLink="/admin/login" />

            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-[#0d1b2a] mb-2">Daftar Acara Jurusan Teknik Elektro</h1>
                <p className="text-base text-gray-600 mb-6">Temukan Acara di Teknik Elektro hanya di SIMATRO</p>

                <div className="flex flex-wrap gap-6">
                    {events.map((event) => {
                        const isClosed = !event.registration_open;

                        const tagClasses = event.category && event.category.toLowerCase().includes('elektro')
                            ? 'bg-blue-100 text-blue-700'
                            : event.category && (event.category.toLowerCase().includes('workshop') || event.category.toLowerCase().includes('kolokium'))
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700';

                        return (
                            <Link
                                to={isClosed ? '#' : `/events/${event.id}`}
                                key={event.id}
                                className={`w-72 bg-white rounded-xl p-5 shadow hover:shadow-lg transform hover:-translate-y-1 transition-all ${isClosed ? 'opacity-80 cursor-not-allowed' : ''}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium mb-3 ${tagClasses}`}>{event.category}</span>

                                {event.thumbnail && (
                                    <img
                                        src={`http://localhost:8000/storage/${event.thumbnail}`}
                                        alt={event.title}
                                        className="w-full h-32 object-cover rounded-lg mb-3"
                                    />
                                )}

                                <h3 className="text-lg font-semibold text-[#0d1b2a] mb-2">{event.title}</h3>

                                {isClosed ? (
                                    <p className="text-sm text-gray-500 mb-4">Status: Pendaftaran Ditutup</p>
                                ) : (
                                    <p className="text-sm text-gray-500 mb-4">Topik: {event.topic}</p>
                                )}

                                {isClosed ? (
                                    <button className="w-full bg-gray-400 text-white py-2 rounded font-bold text-sm" disabled>Pendaftaran Ditutup</button>
                                ) : (
                                    <span className="w-full inline-block bg-yellow-400 text-[#0d1b2a] text-center py-2 rounded font-bold">Lihat Detail Acara</span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <Footer />
        </div>
    );
}