// src/pages/Domains/MedBank/components/StandardExamConfig/PDFExamConfig.jsx
import React, { useState } from 'react';

const PDFExamConfig = ({ examType }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [examTitle, setExamTitle] = useState('');
    const [examTime, setExamTime] = useState('');
    const [questionCount, setQuestionCount] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Por favor selecciona un archivo PDF válido');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Configuración de Examen desde PDF</h2>

            <div className="space-y-6">
                {/* Subida de archivo */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Seleccionar archivo PDF
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="pdf-upload"
                        />
                        <label htmlFor="pdf-upload" className="cursor-pointer">
                            <div className="text-gray-600">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="mt-2 text-sm">
                                    <span className="font-medium text-blue-600">Haz clic para subir</span> o arrastra y suelta
                                </p>
                                <p className="text-xs text-gray-500">Solo archivos PDF (máx. 10MB)</p>
                            </div>
                        </label>
                    </div>
                    {selectedFile && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-green-800 text-sm">
                                <strong>Archivo seleccionado:</strong> {selectedFile.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* Número de preguntas */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Número de preguntas a generar
                    </label>
                    <input
                        type="number"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(e.target.value)}
                        min="1"
                        max="50"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Máximo 50 preguntas"
                    />
                </div>

                {/* Título del examen */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Título del Examen
                    </label>
                    <input
                        type="text"
                        value={examTitle}
                        onChange={(e) => setExamTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ingrese el título del examen"
                    />
                </div>

                {/* Tiempo del examen */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Tiempo del Examen (minutos)
                    </label>
                    <input
                        type="number"
                        value={examTime}
                        onChange={(e) => setExamTime(e.target.value)}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ingrese el tiempo en minutos"
                    />
                </div>

                {/* Información de IA */}
                <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="text-purple-600 mr-3">🤖</div>
                        <div>
                            <h3 className="text-purple-800 font-semibold">Procesamiento con IA</h3>
                            <p className="text-purple-700 text-sm">
                                Nuestra IA analizará el contenido de tu PDF y generará preguntas relevantes automáticamente.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botón de generar examen */}
                <button
                    disabled={!selectedFile || !questionCount || !examTitle || !examTime}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                    Generar Examen desde PDF
                </button>
            </div>
        </div>
    );
};

export default PDFExamConfig;
