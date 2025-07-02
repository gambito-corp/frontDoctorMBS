// src/pages/Domains/MedBank/components/StandardExamConfig/common/ExamHeader.jsx
import React from 'react';

const ExamHeader = ({ examType }) => {
    return (
        <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-full ${examType.color} flex items-center justify-center text-xl text-white mr-4`}>
                {examType.icon}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
                {examType.title}
            </h1>
        </div>
    );
};

export default ExamHeader;
