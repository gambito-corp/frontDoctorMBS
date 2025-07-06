// src/pages/Domains/MedBank/MedBank.jsx
import React, { useState } from 'react';
import MedBankTypeSelector from './components/MedBankTypeSelector';
import StandardExamConfig from './ExamTypes/StandardExamConfig';
import AIExamConfig from './ExamTypes/AIExamConfig';
import PdfExamConfig from './ExamTypes/PdfExamConfig'; // Nueva importación
import PersonalFailedExamConfig from './ExamTypes/PersonalFailedExamConfig'; // Nueva importación
import GlobalFailedExamConfig from './ExamTypes/GlobalFailedExamConfig'; // Nueva importación
import { useApi } from '../../../hooks/useApi';

const MedBank = () => {
    const [selectedExamType, setSelectedExamType] = useState(null);
    const [examConfigData, setExamConfigData] = useState(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);

    const { get, loading, error } = useApi();

    const handleExamTypeSelect = async (examType) => {
        console.log('🔵 Tipo de examen seleccionado:', examType);

        // Establecer el tipo seleccionado inmediatamente
        setSelectedExamType(examType);
        setIsLoadingConfig(true);

        // Llamada fetch según el tipo de examen seleccionado
        await fetchExamConfigData(examType);

        setIsLoadingConfig(false);
    };

    const fetchExamConfigData = async (examType) => {
        try {
            switch(examType.id) {
                case 1:
                    const standardResult = await get('medbank/areas?type=standard');
                    if (standardResult.success) {
                        setExamConfigData(standardResult.data);
                    }
                    break;
                case 2:
                    const aiResult = await get('medbank/areas?type=ai');
                    if (aiResult.success) {
                        setExamConfigData(aiResult.data);
                    }
                    break;

                case 3:
                    setExamConfigData({ type: 'pdf' });
                    break;

                case 4:
                    const personalResult = await get('medbank/areas?type=personal-failed');
                    if (personalResult.success) {
                        setExamConfigData(personalResult.data);
                    }
                    break;

                case 5:
                    const communityResult = await get('medbank/areas?type=global-failed');
                    if (communityResult.success) {
                        setExamConfigData(communityResult.data);
                    }
                    break;

                default:
                    console.log('❌ Tipo de examen no reconocido');
                    setExamConfigData(null);
            }
        } catch (err) {
            console.error('Error al cargar configuración del examen:', err);
            setExamConfigData(null);
        }
    };

    const handleBackToSelection = () => {
        setSelectedExamType(null);
    };

    // Pantalla de carga mientras se obtienen los datos
    if (selectedExamType && (isLoadingConfig || loading)) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <div className={`w-16 h-16 rounded-full ${selectedExamType.color} flex items-center justify-center text-2xl text-white mb-4`}>
                            {selectedExamType.icon}
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Cargando {selectedExamType.title}
                        </h2>
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-gray-600">Obteniendo configuración...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (selectedExamType && selectedExamType.id === 1 && examConfigData) {
        return (
            <StandardExamConfig
                examType={selectedExamType}
                onBack={handleBackToSelection}
            />
        );
    }
    if (selectedExamType && selectedExamType.id === 2 && examConfigData) {
        return (
            <AIExamConfig
                onBack={handleBackToSelection}
            />
        );
    }
    if (selectedExamType && selectedExamType.id === 3 && examConfigData) {
        return (
            <PdfExamConfig
                onBack={handleBackToSelection}
            />
        );
    }
    if (selectedExamType && selectedExamType.id === 4 && examConfigData) {
        return (
            <PersonalFailedExamConfig
                onBack={handleBackToSelection}
            />
        );
    }
    if (selectedExamType && selectedExamType.id === 5 && examConfigData) {
        return (
            <GlobalFailedExamConfig
                onBack={handleBackToSelection}
            />
        );
    }

    // Tu renderizado existente para otros tipos de examen
    if (selectedExamType && examConfigData) {
        return (
            <>INVALIDOOOOOOOO</>
        );
    }

    // Pantalla de error si hay algún problema
    if (selectedExamType && error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-2xl text-white mb-4">
                            ❌
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Error al cargar configuración
                        </h2>
                        <p className="text-gray-600 mb-6 text-center max-w-md">
                            {error}
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => fetchExamConfigData(selectedExamType)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Reintentar
                            </button>
                            <button
                                onClick={handleBackToSelection}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {!selectedExamType ? (
                    <MedBankTypeSelector onExamTypeSelect={handleExamTypeSelect} />
                ):(<></>)}
            </div>
        </div>
    );
};

export default MedBank;
