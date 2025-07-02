// src/pages/Domains/MedBank/components/StandardExamConfig/common/BackButton.jsx
import React from 'react';

const BackButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Selección de Exámenes
        </button>
    );
};

export default BackButton;
