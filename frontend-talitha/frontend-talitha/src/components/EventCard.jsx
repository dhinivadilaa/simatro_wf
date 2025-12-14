// src/components/EventCard.jsx
import React from "react";

const EventCard = ({ event, onShowDetail }) => {
  const { id, title, description, status } = event;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all">
      {/* EVENT ID TAG */}
      <span className="inline-block bg-ft-blue text-white font-semibold text-xs px-3 py-1 rounded-full mb-3">
        {id}
      </span>

      {/* TITLE */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      {/* BUTTON */}
      <button
        onClick={onShowDetail}
        className="w-full bg-ft-gold text-ft-blue py-3 rounded-lg font-semibold text-sm hover:bg-yellow-500 transition-all"
      >
        Lihat Detail & Aksi
      </button>
    </div>
  );
};

export default EventCard;
