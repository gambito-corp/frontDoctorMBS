// src/pages/Domains/MedFlash/components/CreateCardForm.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../../../../hooks/useApi';
import { usePremiumAccess } from '../../../../hooks/usePremiumAccess';
import { useTypewriter } from '../../../../hooks/useTypewriter';
import PremiumModal from '../../../../components/PremiumModal';

function CreateCardForm({ showCreateCard, setShowCreateCard, categories, onRefreshData }) {
    // Estados del formulario existentes
    const [pregunta, setPregunta] = useState('');
    const [respuesta, setRespuesta] = useState('');
    const [preguntaImageType, setPreguntaImageType] = useState('none');
    const [respuestaImageType, setRespuestaImageType] = useState('none');
    const [preguntaUrl, setPreguntaUrl] = useState('');
    const [respuestaUrl, setRespuestaUrl] = useState('');
    const [preguntaFile, setPreguntaFile] = useState(null);
    const [respuestaFile, setRespuestaFile] = useState(null);
    const [preguntaPreview, setPreguntaPreview] = useState('');
    const [respuestaPreview, setRespuestaPreview] = useState('');
    const [selectedCategoriesCard, setSelectedCategoriesCard] = useState([]);

    // Estados de UI existentes
    const [cardError, setCardError] = useState('');
    const [cardSuccess, setCardSuccess] = useState('');
    const [cardLoading, setCardLoading] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // ✅ NUEVOS ESTADOS PARA IA
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [premiumFeature, setPremiumFeature] = useState('');
    const [generatingPregunta, setGeneratingPregunta] = useState(false);
    const [generatingRespuesta, setGeneratingRespuesta] = useState(false);
    const [generatedPreguntaText, setGeneratedPreguntaText] = useState('');
    const [generatedRespuestaText, setGeneratedRespuestaText] = useState('');

    // ✅ HOOKS PREMIUM Y TYPEWRITER
    const { isPremium } = usePremiumAccess();
    const { displayedText: preguntaTypewriter, isTyping: preguntaTyping } = useTypewriter(generatedPreguntaText, 30, 0);
    const { displayedText: respuestaTypewriter, isTyping: respuestaTyping } = useTypewriter(generatedRespuestaText, 30, 0);

    const { post } = useApi();

    // Auto-limpiar alertas
    useEffect(() => {
        if (cardSuccess || cardError) {
            const timer = setTimeout(() => {
                setCardSuccess('');
                setCardError('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [cardSuccess, cardError]);

    // ✅ EFECTO PARA ACTUALIZAR EL TEXTAREA CON EL TEXTO GENERADO
    useEffect(() => {
        if (preguntaTypewriter && !preguntaTyping) {
            console.log('Setting pregunta to:', preguntaTypewriter);
            setPregunta(preguntaTypewriter);
            setGeneratedPreguntaText('');
        }
    }, [preguntaTypewriter, preguntaTyping]);

    useEffect(() => {
        if (respuestaTypewriter && !respuestaTyping) {
            setRespuesta(respuestaTypewriter);
            setGeneratedRespuestaText('');
        }
    }, [respuestaTypewriter, respuestaTyping]);

    // ✅ FUNCIÓN PARA MANEJAR ACCIONES PREMIUM
    const handlePremiumAction = (action, featureName) => {
        if (!isPremium) {
            setPremiumFeature(featureName);
            setShowPremiumModal(true);
            return;
        }
        action();
    };

    // ✅ FUNCIÓN PARA GENERAR PREGUNTA CON IA - ESTRUCTURA CORRECTA
    const handleGeneratePregunta = () => {
        handlePremiumAction(async () => {
            setGeneratingPregunta(true);
            setCardError('');

            try {
                const prompt = pregunta.trim() || 'medicina general';

                const response = await post('medflash/ai-generate', {
                    type: 'pregunta',
                    prompt: `Genera una pregunta médica sobre: ${prompt}`,
                    current_text: pregunta.trim()
                });

                if (response.success) {
                    setGeneratedPreguntaText(response.data.data.generated_text);
                    setCardSuccess('Pregunta generada con IA exitosamente');
                } else {
                    setCardError('Error al generar pregunta con IA');
                }
            } catch (error) {
                console.error('Error generando pregunta:', error);
                setCardError('Error de conexión al generar pregunta');
            } finally {
                setGeneratingPregunta(false);
            }
        }, 'generar preguntas con IA');
    };

// ✅ FUNCIÓN PARA GENERAR RESPUESTA CON IA - ESTRUCTURA CORRECTA
    const handleGenerateRespuesta = () => {
        handlePremiumAction(async () => {
            if (!pregunta.trim()) {
                setCardError('Necesitas escribir una pregunta primero para generar la respuesta');
                return;
            }

            setGeneratingRespuesta(true);
            setCardError('');

            try {
                const response = await post('medflash/ai-generate', {
                    type: 'respuesta',
                    prompt: `Genera una respuesta médica para la pregunta: ${pregunta.trim()} dicha respuesta debe ser concisa y corta ya que es para una flashcard`,
                    current_text: respuesta.trim()
                });

                console.log('Response:', response);

                if (response.success) {
                    // ✅ USAR LA ESTRUCTURA CORRECTA
                    setGeneratedRespuestaText(response.data.data.generated_text);
                    setCardSuccess('Respuesta generada con IA exitosamente');
                } else {
                    setCardError('Error al generar respuesta con IA');
                }
            } catch (error) {
                console.error('Error generando respuesta:', error);
                setCardError('Error de conexión al generar respuesta');
            } finally {
                setGeneratingRespuesta(false);
            }
        }, 'generar respuestas con IA');
    };


    // Resto de funciones existentes...
    const toggleCreateCard = () => {
        setShowCreateCard(!showCreateCard);
        if (showCreateCard) {
            resetCardForm();
        }
    };

    const resetCardForm = () => {
        setPregunta('');
        setRespuesta('');
        setPreguntaImageType('none');
        setRespuestaImageType('none');
        setPreguntaUrl('');
        setRespuestaUrl('');
        setPreguntaFile(null);
        setRespuestaFile(null);
        setPreguntaPreview('');
        setRespuestaPreview('');
        setSelectedCategoriesCard([]);
        setCardError('');
        setCardSuccess('');
        // ✅ LIMPIAR ESTADOS DE IA
        setGeneratedPreguntaText('');
        setGeneratedRespuestaText('');
    };

    const postFormData = async (url, formData) => {
        try {
            const token = localStorage.getItem('sanctum_token');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${url}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData
            });

            const result = await response.json();
            return {
                success: response.ok,
                data: result,
                status: response.status,
                errors: result.errors || {}
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: 500
            };
        }
    };

    const handleCardSubmit = async (e) => {
        e.preventDefault();
        setCardError('');

        if (!pregunta.trim() || !respuesta.trim()) {
            setCardError('La pregunta y respuesta son requeridas');
            return;
        }

        if (pregunta.trim().length < 5 || respuesta.trim().length < 5) {
            setCardError('La pregunta y respuesta deben tener al menos 5 caracteres');
            return;
        }

        setCardLoading(true);

        try {
            const formData = new FormData();
            formData.append('pregunta', pregunta.trim());
            formData.append('respuesta', respuesta.trim());

            if (selectedCategoriesCard.length > 0) {
                formData.append('categorias', JSON.stringify(selectedCategoriesCard));
            }

            if (preguntaImageType === 'url' && preguntaUrl.trim()) {
                formData.append('url', preguntaUrl.trim());
            } else if (preguntaImageType === 'file' && preguntaFile) {
                formData.append('imagen', preguntaFile);
            }

            if (respuestaImageType === 'url' && respuestaUrl.trim()) {
                formData.append('url_respuesta', respuestaUrl.trim());
            } else if (respuestaImageType === 'file' && respuestaFile) {
                formData.append('imagen_respuesta', respuestaFile);
            }

            const response = await postFormData('medflash', formData);

            if (response.success) {
                setCardSuccess('Flashcard creada exitosamente!');
                resetCardForm();
                onRefreshData();
            } else {
                if (response.status === 422 && response.errors) {
                    const errorMessages = Object.values(response.errors).flat();
                    setCardError(errorMessages.join(', '));
                } else {
                    setCardError('Error al crear la flashcard');
                }
            }
        } catch (error) {
            console.error('Error al crear flashcard:', error);
            setCardError('Error de conexión. Verifica tu internet.');
        } finally {
            setCardLoading(false);
        }
    };

    const createNewCategory = async () => {
        if (!newCategoryName.trim()) {
            setCardError('El nombre de la categoría es requerido');
            return;
        }

        try {
            const response = await post('medflash/category', {
                name: newCategoryName.trim()
            });

            if (response.success) {
                setNewCategoryName('');
                setShowCategoryModal(false);
                setCardSuccess('Categoría creada exitosamente');
                onRefreshData();
            } else {
                setCardError('Error al crear la categoría');
            }
        } catch (error) {
            setCardError('Error al crear la categoría');
        }
    };

    const handleImageTypeChange = (type, imageType) => {
        if (type === 'pregunta') {
            setPreguntaImageType(imageType);
            setPreguntaUrl('');
            setPreguntaFile(null);
            setPreguntaPreview('');
        } else {
            setRespuestaImageType(imageType);
            setRespuestaUrl('');
            setRespuestaFile(null);
            setRespuestaPreview('');
        }
    };

    const handleFileChange = (type, file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (type === 'pregunta') {
                    setPreguntaFile(file);
                    setPreguntaPreview(e.target.result);
                } else {
                    setRespuestaFile(file);
                    setRespuestaPreview(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (type, url) => {
        if (type === 'pregunta') {
            setPreguntaUrl(url);
            setPreguntaPreview(url);
        } else {
            setRespuestaUrl(url);
            setRespuestaPreview(url);
        }
    };

    const toggleCategorySelection = (categoryId) => {
        setSelectedCategoriesCard(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div
                className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={toggleCreateCard}
                style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Crear MedFlash</h2>
                        <p className="text-gray-600 mt-1">Crea nuevas flashcards médicas con preguntas y respuestas</p>
                    </div>
                    <svg
                        className={`w-6 h-6 text-gray-500 transition-transform ${showCreateCard ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {showCreateCard && (
                <div className="p-8">
                    {/* Loading */}
                    {cardLoading && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <p className="text-blue-800 font-medium">Creando flashcard...</p>
                            </div>
                        </div>
                    )}

                    {/* Alertas */}
                    {cardSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between animate-fade-in">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-green-800">{cardSuccess}</p>
                            </div>
                            <button
                                onClick={() => setCardSuccess('')}
                                className="text-green-600 hover:text-green-800 ml-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {cardError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between animate-fade-in">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-800">{cardError}</p>
                            </div>
                            <button
                                onClick={() => setCardError('')}
                                className="text-red-600 hover:text-red-800 ml-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleCardSubmit} className="space-y-8">
                        {/* ✅ PREGUNTA CON BOTÓN IA */}
                        <div>

                            {/* Selección de Categorías - código existente... */}
                            <div className={'mb-8'}>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Categorías (Opcional)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryModal(true)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        + Crear nueva categoría
                                    </button>
                                </div>

                                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                                    {categories.length > 0 ? (
                                        <div className="space-y-2">
                                            {categories.map((category) => (
                                                <label key={category.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategoriesCard.includes(category.id)}
                                                        onChange={() => toggleCategorySelection(category.id)}
                                                        className="mr-3"
                                                    />
                                                    <span className="text-gray-700">{category.nombre}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            No hay categorías disponibles. Crea una nueva categoría.
                                        </p>
                                    )}
                                </div>

                                {selectedCategoriesCard.length > 0 && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        {selectedCategoriesCard.length} categoría{selectedCategoriesCard.length !== 1 ? 's' : ''} seleccionada{selectedCategoriesCard.length !== 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Pregunta <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleGeneratePregunta}
                                    disabled={generatingPregunta || preguntaTyping}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        isPremium
                                            ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    title={isPremium ? 'Generar pregunta con IA' : 'Función Premium - Generar con IA'}
                                >
                                    {generatingPregunta ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Generando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Generar con IA</span>
                                            {!isPremium && (
                                                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea
                                value={preguntaTyping ? preguntaTypewriter : pregunta}
                                onChange={(e) => !preguntaTyping && setPregunta(e.target.value)}
                                placeholder="Escribe tu pregunta médica aquí... o usa IA para generar una"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
                                    cardError ? 'border-red-500' : 'border-gray-300'
                                } ${cardLoading || preguntaTyping ? 'opacity-60' : ''}`}
                                rows={4}
                                required
                                disabled={cardLoading || preguntaTyping}
                                maxLength={2000}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500">
                                    {(preguntaTyping ? (preguntaTypewriter || '') : (pregunta || '')).length}/2000 caracteres
                                </p>
                                {preguntaTyping && (
                                    <p className="text-sm text-purple-600 font-medium">
                                        ✨ Generando con IA...
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Imagen para Pregunta - código existente... */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Imagen para Pregunta (Opcional)
                            </label>
                            <div className="space-y-4">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="preguntaImageType"
                                            value="none"
                                            checked={preguntaImageType === 'none'}
                                            onChange={() => handleImageTypeChange('pregunta', 'none')}
                                            className="mr-2"
                                        />
                                        Sin imagen
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="preguntaImageType"
                                            value="url"
                                            checked={preguntaImageType === 'url'}
                                            onChange={() => handleImageTypeChange('pregunta', 'url')}
                                            className="mr-2"
                                        />
                                        URL
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="preguntaImageType"
                                            value="file"
                                            checked={preguntaImageType === 'file'}
                                            onChange={() => handleImageTypeChange('pregunta', 'file')}
                                            className="mr-2"
                                        />
                                        Subir archivo
                                    </label>
                                </div>

                                {preguntaImageType === 'url' && (
                                    <input
                                        type="url"
                                        value={preguntaUrl}
                                        onChange={(e) => handleUrlChange('pregunta', e.target.value)}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                )}

                                {preguntaImageType === 'file' && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('pregunta', e.target.files[0])}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                )}

                                {preguntaPreview && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                                        <img
                                            src={preguntaPreview}
                                            alt="Preview pregunta"
                                            className="max-w-xs max-h-48 object-contain border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ✅ RESPUESTA CON BOTÓN IA */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Respuesta <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleGenerateRespuesta}
                                    disabled={generatingRespuesta || respuestaTyping || !pregunta.trim()}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        isPremium && pregunta.trim()
                                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    title={
                                        !pregunta.trim()
                                            ? 'Escribe una pregunta primero'
                                            : isPremium
                                                ? 'Generar respuesta con IA'
                                                : 'Función Premium - Generar con IA'
                                    }
                                >
                                    {generatingRespuesta ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Generando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Generar con IA</span>
                                            {!isPremium && (
                                                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea
                                value={respuestaTyping ? respuestaTypewriter : respuesta}
                                onChange={(e) => !respuestaTyping && setRespuesta(e.target.value)}
                                placeholder="Escribe la respuesta aquí... o usa IA para generar una basada en la pregunta"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
                                    cardError ? 'border-red-500' : 'border-gray-300'
                                } ${cardLoading || respuestaTyping ? 'opacity-60' : ''}`}
                                rows={4}
                                required
                                disabled={cardLoading || respuestaTyping}
                                maxLength={2000}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500">
                                    {(respuestaTyping ? (respuestaTypewriter || '') : (respuesta || '')).length}/2000 caracteres
                                </p>
                                {respuestaTyping && (
                                    <p className="text-sm text-emerald-600 font-medium">
                                        ✨ Generando con IA...
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Resto del formulario - imagen para respuesta, categorías, etc. - código existente... */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Imagen para Respuesta (Opcional)
                            </label>
                            <div className="space-y-4">
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="respuestaImageType"
                                            value="none"
                                            checked={respuestaImageType === 'none'}
                                            onChange={() => handleImageTypeChange('respuesta', 'none')}
                                            className="mr-2"
                                        />
                                        Sin imagen
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="respuestaImageType"
                                            value="url"
                                            checked={respuestaImageType === 'url'}
                                            onChange={() => handleImageTypeChange('respuesta', 'url')}
                                            className="mr-2"
                                        />
                                        URL
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="respuestaImageType"
                                            value="file"
                                            checked={respuestaImageType === 'file'}
                                            onChange={() => handleImageTypeChange('respuesta', 'file')}
                                            className="mr-2"
                                        />
                                        Subir archivo
                                    </label>
                                </div>

                                {respuestaImageType === 'url' && (
                                    <input
                                        type="url"
                                        value={respuestaUrl}
                                        onChange={(e) => handleUrlChange('respuesta', e.target.value)}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                )}

                                {respuestaImageType === 'file' && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('respuesta', e.target.files[0])}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                )}

                                {respuestaPreview && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                                        <img
                                            src={respuestaPreview}
                                            alt="Preview respuesta"
                                            className="max-w-xs max-h-48 object-contain border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={cardLoading || !pregunta.trim() || !respuesta.trim() || preguntaTyping || respuestaTyping}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            {cardLoading ? 'Creando Flashcard...' : 'Crear Flashcard'}
                        </button>
                    </form>
                </div>
            )}

            {/* Modal para crear nueva categoría - código existente... */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Crear Nueva Categoría</h3>
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nombre de la categoría"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4"
                            maxLength={50}
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={createNewCategory}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Crear
                            </button>
                            <button
                                onClick={() => {
                                    setShowCategoryModal(false);
                                    setNewCategoryName('');
                                }}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ MODAL PREMIUM */}
            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                featureName={premiumFeature}
            />
        </div>
    );
}

export default CreateCardForm;
