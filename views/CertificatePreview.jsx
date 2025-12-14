// src/views/CertificatePreview.jsx
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CertificatePreview = ({ participant, event, onNavigate, onSubmitFeedback }) => {
  const certificateRef = useRef();
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [rating, setRating] = useState(4);
  const [feedbackText, setFeedbackText] = useState("");

  const categoryMap = {
    4: "Sangat Baik",
    3: "Baik",
    2: "Cukup",
    1: "Kurang",
  };

  const downloadCertificate = async () => {
    const input = certificateRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${participant.name}-${event.title}-Certificate.pdf`);
  };

  const handleSendFeedback = () => {
    if (onSubmitFeedback) {
      onSubmitFeedback({
        eventId: event.id,
        score: Number(rating),
        category: categoryMap[rating],
        message: feedbackText.trim(),
        name: participant.name,
        email: participant.email,
      });
    }

    setFeedbackSent(true);
  };

  // -----------------------------------------------------
  // FEEDBACK SUCCESS SCREEN
  // -----------------------------------------------------
  if (feedbackSent) {
    return (
      <div className="view max-w-3xl mx-auto bg-white rounded-xl p-10 shadow-custom-lg text-center">
        <h2 className="text-3xl font-extrabold text-ft-blue mb-4">Terima Kasih! 🎉</h2>

        <p className="text-gray-700 mb-6 text-lg">
          Feedback Anda telah berhasil dikirim dan sangat berarti bagi kami untuk meningkatkan kualitas acara berikutnya.
        </p>

        <div className="bg-green-100 border border-green-300 text-green-800 py-3 rounded-lg font-semibold mb-8">
          ✔ Feedback Berhasil Dikirim
        </div>

        <button
          onClick={() => onNavigate("user-dashboard")}
          className="bg-ft-blue text-white py-3 px-8 rounded-lg font-semibold hover:bg-ft-accent transition-all"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  // -----------------------------------------------------
  // NORMAL CERTIFICATE PREVIEW SCREEN
  // -----------------------------------------------------
  return (
    <div className="view max-w-5xl mx-auto bg-white rounded-xl p-10 shadow-custom-lg">

      {/* BACK BUTTON */}
      <button
        onClick={() => onNavigate("user-dashboard")}
        className="flex items-center gap-2 text-gray-700 hover:underline mb-6"
      >
        <span className="text-xl">←</span>
        <span className="text-base font-medium">Kembali ke Dashboard Peserta</span>
      </button>

      <h3 className="text-2xl font-bold text-ft-blue mb-1">Sertifikat</h3>
      <p className="text-sm font-semibold text-green-700 mb-4">
        Status Kehadiran: HADIR (Validasi Real-Time Berhasil)
      </p>

      <div className="bg-green-100 text-green-800 border border-green-300 rounded-lg p-3 mb-6 text-sm font-medium">
        Sertifikat telah dibuat instan di server. Unduh segera.
      </div>

      {/* CERTIFICATE */}
      <div className="bg-gray-50 p-6 rounded-xl border mb-8">
        <h4 className="text-lg font-bold text-ft-blue mb-4 border-b pb-2">
          Pratinjau Sertifikat Digital
        </h4>

        <div className="flex justify-center">
          <div
            ref={certificateRef}
            className="certificate-template max-w-3xl w-full aspect-[3/2] bg-white border-4 border-ft-blue shadow-xl p-8 relative overflow-hidden"
          >
            <img
              src="https://via.placeholder.com/150x50/003366/FFFFFF?text=Logo+Jurusan"
              className="absolute top-6 left-6 h-14 opacity-90"
            />
            <img
              src="https://via.placeholder.com/100x100/FFD700/000000?text=Badge"
              className="absolute top-6 right-6 h-16 opacity-90"
            />

            <div className="text-center">
              <p className="text-lg text-gray-700 mb-1">Dengan hormat kami menyatakan bahwa</p>
              <h2 className="text-5xl font-extrabold text-ft-blue mb-3 tracking-wide">
                {participant.name.toUpperCase()}
              </h2>
              <p className="text-lg text-gray-700 mb-4">Telah berpartisipasi sebagai peserta dalam</p>
              <h3 className="text-4xl font-bold text-ft-gold mb-8 leading-snug">
                {event.title.toUpperCase()}
              </h3>

              <p className="text-base text-gray-600 mb-2">
                yang diselenggarakan oleh Jurusan Teknik Elektro.
              </p>
              <p className="text-sm text-gray-500">
                Bandar Lampung, {new Date().toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>

              <p className="text-xs text-gray-400 mt-5">
                ID Sertifikat: {event.id}-{participant.email.substring(0, 3).toUpperCase()}-{Math.floor(Math.random() * 1000)}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={downloadCertificate}
            className="bg-ft-success text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 shadow-md"
          >
            Unduh Sertifikat PDF
          </button>
        </div>
      </div>

      {/* FEEDBACK FORM */}
      <div className="bg-gray-50 p-6 rounded-xl border mb-4">
        <h4 className="text-lg font-bold text-ft-blue mb-4 border-b pb-2">Feedback Sesi (Opsional)</h4>

        <label className="block mb-2 text-sm font-medium text-gray-700">Rating Materi (1-4)</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="4">4 - Sangat Baik</option>
          <option value="3">3 - Baik</option>
          <option value="2">2 - Cukup</option>
          <option value="1">1 - Kurang</option>
        </select>

        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="w-full p-3 border rounded-lg h-28"
          placeholder="Masukkan feedback Anda di sini..."
        ></textarea>

        <button
          onClick={handleSendFeedback}
          className="bg-ft-blue text-white py-2 px-6 rounded-lg font-semibold mt-4 hover:bg-ft-accent"
        >
          Kirim Feedback
        </button>
      </div>
    </div>
  );
};

export default CertificatePreview;
