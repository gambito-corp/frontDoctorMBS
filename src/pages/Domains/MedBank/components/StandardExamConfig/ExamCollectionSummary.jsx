// src/pages/Domains/MedBank/components/StandardExamConfig/ExamCollectionSummary.jsx
import React from 'react';

const ExamCollectionSummary = ({
                                   examCollection,
                                   examTitle,
                                   examTime,
                                   onTitleChange,
                                   onTimeChange
                               }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Combinaciones Agregadas</h2>
            <div className="space-y-3">
                {examCollection.map((exam, index) => (
                    <div key={index} className="border-b border-gray-200 pb-3">
                        <p className="text-gray-700">
                            <strong>Área:</strong> {exam.area_name},
                            <strong> Categoría:</strong> {exam.category_name},
                            <strong> Tipo:</strong> {exam.tipo_name},
                            <strong> Universidad:</strong> {exam.university_id},
                            <strong> Preguntas:</strong> {exam.question_count}
                        </p>
                    </div>
                ))}
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-800 font-semibold">
                        Total de preguntas: {examCollection.reduce((sum, exam) => sum + exam.question_count, 0)}
                    </p>
                </div>
            </div>

            {/* Configuración final del examen */}
            <div className="mt-6 space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Título del Examen
                    </label>
                    <input
                        type="text"
                        value={examTitle}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ingrese el título del examen"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Tiempo del Examen (minutos)
                    </label>
                    <input
                        type="number"
                        value={examTime}
                        onChange={(e) => onTimeChange(e.target.value)}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ingrese el tiempo en minutos"
                    />
                </div>

                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    Realizar Examen
                </button>
            </div>
        </div>
    );
};

export default ExamCollectionSummary;
