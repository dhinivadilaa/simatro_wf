// src/views/EventList.jsx
import React from "react";
import EventCard from "../components/EventCard";

const EventList = ({ events, onShowDetail }) => {
  return (
    <div className="view">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
        Daftar Acara Jurusan Teknik Elektro
      </h2>

      <p className="text-gray-600 mb-8 border-b-2 border-ft-gold inline-block pb-1">
        Sistem Terpadu untuk Pendaftaran, Validasi Absensi, dan Penerbitan Sertifikat Instan.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="event-cards">
        {events && events.length > 0 ? (
    events.map((event) => (
        <EventCard
            key={event.id}
            event={event}
            onShowDetail={() => onShowDetail(event.title, event.id)}
        />
    ))
) : (
    <p className="text-gray-500 col-span-full text-center">Belum ada acara.</p>
)}

      </div>
    </div>
  );
};

export default EventList;
