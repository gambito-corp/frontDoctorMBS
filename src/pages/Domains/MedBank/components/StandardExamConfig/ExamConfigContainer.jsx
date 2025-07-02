// src/pages/Domains/MedBank/components/ExamConfigContainer.jsx
import React from 'react';
import StandardExamConfig from '../StandardExamConfig';
import PDFExamConfig from './PDFExamConfig';
import BackButton from './common/BackButton';
import ExamHeader from './common/ExamHeader';

const ExamConfigContainer = ({ examType, examConfigData, onBackToSelection }) => {
    console.log(examConfigData);
    return (
        <>
            <div className="mb-8">
                <BackButton onClick={onBackToSelection} />
                <ExamHeader examType={examType} />
            </div>

            {examType.configType === 'standard' ? (
                <StandardExamConfig examType={examType} />
            ) : (
                <PDFExamConfig examType={examType} />
            )}
        </>
    );
};

export default ExamConfigContainer;
