// src/pages/Domains/MedBank/MedBank.jsx
import React, { useState } from 'react';
import ExamTypeSelector from './components/ExamTypeSelector';
import ExamConfigContainer from './components/StandardExamConfig/ExamConfigContainer';
import StandardExamConfig from './components/StandardExamConfig/StandardExamConfig';
import PdfExamConfig from './components/PdfExamConfig/PdfExamConfig'; // Nueva importación
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
                case 1: // Banco de Preguntas Estándar
                    console.log('📚 Cargando configuración para Banco de Preguntas Estándar');
                    /**
                     * TODO: Crear endpoint para obtener áreas, categorías, tipos y universidades
                     * GET /api/exam-config/standard
                     * Respuesta esperada: {
                     *   areas: [...],
                     *   categories: [...],
                     *   tipos: [...],
                     *   universities: [...]
                     * }
                     */
                    const standardResult = await get('medbank/areas?type=standard');
                    if (standardResult.success) {
                        setExamConfigData(standardResult.data);
                    }
                    break;

                case 2: // Examen Por IA
                    console.log('🤖 Cargando configuración para Examen Por IA');
                    /**
                     * TODO: Crear endpoint para obtener temas disponibles para IA
                     * GET /api/exam-config/ai-topics
                     * Respuesta esperada: {
                     *   topics: [...],
                     *   max_questions: 50,
                     *   available_models: [...]
                     * }
                     */
                    const aiResult = await get('/api/exam-config/ai-topics');
                    if (aiResult.success) {
                        setExamConfigData(aiResult.data);
                    }
                    break;

                case 3: // Examen desde PDF
                    console.log('📄 Cargando configuración para Examen desde PDF');
                    /**
                     * TODO: Crear endpoint para obtener configuración de PDF
                     * GET /api/exam-config/pdf-settings
                     * Respuesta esperada: {
                     *   max_file_size: 10485760,
                     *   allowed_formats: ['pdf'],
                     *   max_questions: 50,
                     *   processing_time_estimate: '2-5 minutos'
                     * }
                     */
                    console.log('📄 Cargando configuración para Examen desde PDF');
                    // Para PDF no necesitamos cargar datos adicionales
                    // El componente PdfExamConfig manejará sus propias llamadas API
                    setExamConfigData({ type: 'pdf' });
                    break;

                case 4: // Preguntas Más Falladas por Ti
                    console.log('🎯 Cargando preguntas más falladas por el usuario');
                    /**
                     * TODO: Crear endpoint para obtener estadísticas personales del usuario
                     * GET /api/exam-config/personal-failed-questions
                     * Respuesta esperada: {
                     *   failed_areas: [...],
                     *   failed_categories: [...],
                     *   total_failed_questions: 150,
                     *   recommendations: [...]
                     * }
                     */
                    const personalResult = await get('/api/exam-config/personal-failed-questions');
                    if (personalResult.success) {
                        setExamConfigData(personalResult.data);
                    }
                    break;

                case 5: // Preguntas Más Falladas por la Comunidad
                    console.log('👥 Cargando preguntas más falladas por la comunidad');
                    /**
                     * TODO: Crear endpoint para obtener estadísticas de la comunidad
                     * GET /api/exam-config/community-failed-questions
                     * Respuesta esperada: {
                     *   community_failed_areas: [...],
                     *   community_failed_categories: [...],
                     *   total_users_data: 1250,
                     *   trending_topics: [...]
                     * }
                     */
                    const communityResult = await get('/api/exam-config/community-failed-questions');
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

    // Tu renderizado existente para otros tipos de examen
    if (selectedExamType && examConfigData) {
        return (
            <ExamConfigContainer
                examType={selectedExamType}
                configData={examConfigData}
                onBack={handleBackToSelection}
            />
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
                    <ExamTypeSelector onExamTypeSelect={handleExamTypeSelect} />
                ) : (
                    <ExamConfigContainer
                        examType={selectedExamType}
                        examConfigData={examConfigData}
                        onBackToSelection={handleBackToSelection}
                    />
                )}
            </div>
        </div>
    );
};

export default MedBank;
