import React from 'react';

const BarChart = ({ labels, data, total }) => {
    if (!labels || labels.length === 0) {
        return <div className="text-center text-gray-500 p-4">Tidak ada data untuk ditampilkan.</div>;
    }

    const maxDataValue = Math.max(...total); // Gunakan total sebagai basis maksimum untuk skala

    return (
        <div className="relative h-64 w-full p-4 bg-white rounded-lg shadow-inner flex flex-col justify-end">
            {labels.map((label, index) => {
                const percentage = total[index] > 0 ? (data[index] / total[index]) * 100 : 0;
                const barHeight = total[index] > 0 ? (total[index] / maxDataValue) * 90 : 0; // Skala tinggi batang
                const attendanceHeight = total[index] > 0 ? (data[index] / total[index]) * barHeight : 0;

                return (
                    <div key={label} className="flex flex-col items-center absolute bottom-0"
                         style={{ left: `${(index / labels.length) * 100}%`, width: `${(1 / labels.length) * 100}%` }}>
                        <div className="relative w-2/3 flex flex-col justify-end items-center mb-1">
                            {/* Total Bar */}
                            <div
                                className="bg-gray-200 rounded-t-sm w-full absolute bottom-0"
                                style={{ height: `${barHeight}%` }}
                            ></div>
                            {/* Attendance Bar */}
                            <div
                                className="bg-ft-blue rounded-t-sm w-full absolute bottom-0"
                                style={{ height: `${attendanceHeight}%` }}
                            ></div>
                            <span className="text-xs font-semibold text-gray-800 z-10 -mt-5 block">
                                {data[index]}/{total[index]}
                            </span>
                        </div>
                        <span className="text-xs text-gray-600 w-full text-center mt-1 truncate">{label.split(':')[0]}</span> {/* Hanya tampilkan nama acara */}
                    </div>
                );
            })}
        </div>
    );
};

export default BarChart;