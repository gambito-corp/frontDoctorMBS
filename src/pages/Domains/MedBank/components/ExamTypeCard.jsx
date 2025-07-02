// src/pages/Domains/MedBank/components/ExamTypeCard.jsx
import React from 'react';

const ExamTypeCard = ({ examType, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(examType)}
            className="relative p-6 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-gray-200 bg-white"
        >
            <div className="flex items-center mb-4">
                <div className={`w-16 h-16 rounded-full ${examType.color} ${examType.hoverColor} flex items-center justify-center text-2xl text-white mr-4 transition-colors duration-300`}>
                    {examType.icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {examType.title}
                    </h3>
                </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
                {examType.description}
            </p>

            <button className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${examType.color} ${examType.hoverColor} hover:shadow-md focus:outline-none focus:ring-4 focus:ring-opacity-50`}>
                Configurar Examen
            </button>
        </div>
    );
};

export default ExamTypeCard;
