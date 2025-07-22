// src/pages/Domains/MedBank/components/PdfExamConfig/PdfExamConfig.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../../hooks/useApi';
import DifficultySelect from '../components/common/DifficultySelect/DifficultySelect';
import '../MedBank.css';

const PdfExamConfig = ({ onBack }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfContent, setPdfContent] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedDifficultyData, setSelectedDifficultyData] = useState(null);
    const [numQuestions, setNumQuestions] = useState(10); // Nuevo estado
    const [isProcessing, setIsProcessing] = useState(false);
    const [duration, setDuration] = useState(60);

    const { post, loading, error } = useApi();
    const navigate = useNavigate();

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Validar que sea un PDF
        if (file.type !== 'application/pdf') {
            alert('Por favor, selecciona un archivo PDF válido');
            return;
        }

        // Validar tamaño (máximo 10MB)
        if (file.size > 10485760) {
            alert('El archivo es demasiado grande. Máximo 10MB permitido');
            return;
        }

        setSelectedFile(file);
        setIsProcessing(true);
        setPdfContent('');

        try {
            const formData = new FormData();
            formData.append('pdf', file);

            console.log('📤 Enviando PDF al servidor...');

            const result = await post('medbank/process-pdf', formData);

            console.log('📥 Respuesta completa del servidor:', result);

            if (result?.success) {
                const summary = result.data?.data?.summary || 'No se pudo extraer contenido del PDF';
                setPdfContent(summary);
            } else {
                throw new Error(result?.message || 'Error al procesar PDF');
            }
        } catch (err) {
            console.error('❌ Error al procesar PDF:', err);
            alert('Error al procesar el archivo PDF: ' + err.message);
            setSelectedFile(null);
            setPdfContent('');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDifficultyChange = (event, difficultyData) => {
        const value = event?.target?.value || '';
        setSelectedDifficulty(value);
        setSelectedDifficultyData(difficultyData || null);
        console.log('🎯 Dificultad seleccionada:', difficultyData);
    };

    const handleNumQuestionsChange = (event) => {
        const value = parseInt(event.target.value) || 1;
        // Asegurar que esté en el rango permitido
        const clampedValue = Math.min(Math.max(value, 1), 200);
        setNumQuestions(clampedValue);
    };

    const handleGenerateExam = async () => {
        if (!selectedFile || !selectedDifficulty || !pdfContent) {
            alert('Por favor, completa todos los campos requeridos');
            return;
        }

        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('pdf_file', selectedFile);
            formData.append('difficulty', selectedDifficulty);
            formData.append('num_questions', numQuestions.toString());
            formData.append('pdf_content', pdfContent);
            formData.append('duration', 60); // Duración en minutos, puedes ajustar esto según tus necesidades

            const result = await post('medbank/generate-exam/pdf', formData, {
                headers: {
                    'Content-Type': false
                }
            });

            if (result?.success) {
                const examId = result.data.data.exam_id;
                navigate(`/medbank/${examId}`);
            } else {
                throw new Error(result?.message || 'Error al generar examen');
            }
        } catch (err) {
            console.error('❌ Error al generar examen:', err);
            alert('Error al generar el examen: ' + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="pdf-exam-config">
            <div className="config-header">
                <button onClick={onBack} className="back-button">
                    ← Volver a Selección de Exámenes
                </button>
                <h2>📄 Examen desde PDF</h2>
                <p>Sube un PDF y nuestra IA personalizará un examen basado en el contenido</p>
            </div>

            <div className="pdf-config-container">
                {/* Input File para PDF */}
                <div className="file-upload-section">
                    <label htmlFor="pdf-upload" className="file-upload-label">
                        Seleccionar archivo PDF
                    </label>
                    <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                    {selectedFile && (
                        <div className="file-info">
                            <span>📄 {selectedFile.name}</span>
                            <span className="file-size">
                                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                        </div>
                    )}
                </div>

                {/* Input para número de preguntas */}
                <div className="exam-config-row">
                    <div className="form-group">
                        <label htmlFor="num-questions">
                            Número de preguntas <span className="required">*</span>
                        </label>
                        <input
                            id="num-questions"
                            type="number"
                            min="1"
                            max="200"
                            value={numQuestions}
                            onChange={handleNumQuestionsChange}
                            className="num-questions-input"
                            disabled={loading || isProcessing}
                        />
                        <small className="input-help">
                            Mínimo 1, máximo 200 preguntas
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="exam-duration">
                            Duración del examen (minutos) <span className="required">*</span>
                        </label>
                        <input
                            id="exam-duration"
                            type="number"
                            min="1"
                            max="300"
                            value={duration}
                            onChange={e => {
                                const value = parseInt(e.target.value) || 1;
                                setDuration(Math.min(Math.max(value, 1), 300));
                            }}
                            className="duration-input"
                            disabled={loading || isProcessing}
                        />
                        <small className="input-help">
                            Mínimo 1, máximo 300 minutos
                        </small>
                    </div>
                </div>


                {/* Componente Select de Dificultades */}
                <DifficultySelect
                    value={selectedDifficulty}
                    onChange={handleDifficultyChange}
                    disabled={loading || isProcessing}
                    placeholder="Elige el nivel de desafío"
                    showDescriptions={true}
                    required={true}
                    className="pdf-difficulty-section"
                />
                {/* Textarea para mostrar contenido del PDF */}
                <div className="pdf-content-section">
                    <label htmlFor="pdf-content">
                        Contenido extraído del PDF
                        <small>(puedes modificar algo o agregar para que se incluya en el examen)</small>
                    </label>
                    <textarea
                        id="pdf-content"
                        value={pdfContent || ''}
                        onChange={(e) => setPdfContent(e.target.value || '')}
                        placeholder={
                            isProcessing
                                ? "Procesando PDF, por favor espera..."
                                : "El contenido del PDF aparecerá aquí una vez procesado"
                        }
                        rows={15}
                        className="pdf-content-textarea"
                        disabled={isProcessing}
                    />
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        Caracteres: {(pdfContent || '').length}
                    </div>
                </div>

                {/* Botón para generar examen */}
                <div className="generate-section">
                    <button
                        onClick={handleGenerateExam}
                        disabled={!selectedFile || !selectedDifficulty || !pdfContent || isProcessing}
                        className="generate-exam-button"
                    >
                        {isProcessing ? 'Generando Examen...' :
                            `Generar ${numQuestions} Pregunta${numQuestions !== 1 ? 's' : ''} ${selectedDifficultyData?.name || ''} (${duration} min)`}
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        Error: {error}
                    </div>
                )}
            </div>
            {isProcessing && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center
                      bg-black/60 backdrop-blur-sm text-white">
                    <div className="h-16 w-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <p className="mt-4 text-lg font-medium">Procesando PDF…</p>
                </div>
            )}
        </div>
    );
};

export default PdfExamConfig;
