import React from "react";

const FeedbackSuccess = ({ onNavigate }) => {
    return (
        <div className="view max-w-4xl mx-auto bg-white rounded-xl p-10 shadow-custom-lg text-center">
            
            <h2 className="text-3xl font-extrabold text-ft-blue mb-3">
                Terima Kasih! 
            </h2>

            <p className="text-gray-700 mb-6 text-lg">
                Feedback Anda telah berhasil dikirim dan sangat berarti bagi kami.
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
};

export default FeedbackSuccess;
