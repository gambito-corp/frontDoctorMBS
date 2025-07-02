// src/pages/Domains/MedBank/components/StandardExamConfig/ConfigurationPanel.jsx
import React from 'react';
import { universities } from '../data/examConfigData';

const ConfigurationPanel = ({
                                selectedUniversity,
                                questionCount,
                                onUniversityChange,
                                onQuestionCountChange,
                                onAddCombination
                            }) => {
    return (
        <div className="space-y-6">
            {/* Universidad */}
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Universidad
                </label>
                <select
                    value={selectedUniversity}
                    onChange={(e) => onUniversityChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">Todas las universidades</option>
                    {universities.map(university => (
                        <option key={university.id} value={university.id}>
                            {university.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Preguntas disponibles */}
            <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                    <strong>Preguntas Disponibles:</strong> 1,250 preguntas
                </p>
            </div>

            {/* Número de preguntas */}
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Número de preguntas a utilizar
                </label>
                <input
                    type="number"
                    value={questionCount}
                    onChange={(e) => onQuestionCountChange(e.target.value)}
                    min="1"
                    max="200"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Ingrese el número de preguntas"
                />
            </div>

            {/* Botón agregar combinación */}
            <button
                onClick={onAddCombination}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
                Agregar Combinación
            </button>
        </div>
    );
};

export default ConfigurationPanel;
