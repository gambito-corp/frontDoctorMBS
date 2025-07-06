// src/pages/Domains/MedBank/components/MedBankTypeSelector.jsx
import React from 'react';
import MedBankTypeCard from './MedBankTypeCard';
import { examTypesData } from './data/examTypes';

const MedBankTypeSelector = ({ onExamTypeSelect }) => {
    return (
        <>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    🏦 MedBank - Banco de Exámenes
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Selecciona el tipo de examen que mejor se adapte a tus necesidades de estudio.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {examTypesData.map(examType => (
                    <MedBankTypeCard
                        key={examType.id}
                        examType={examType}
                        onSelect={onExamTypeSelect}
                    />
                ))}
            </div>
        </>
    );
};

export default MedBankTypeSelector;
