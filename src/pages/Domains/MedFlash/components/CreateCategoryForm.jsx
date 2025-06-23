// src/pages/Domains/MedFlash/components/CreateCategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../../../../hooks/useApi';
import { usePremiumAccess } from '../../../../hooks/usePremiumAccess';
import { useTypewriter } from '../../../../hooks/useTypewriter';
import PremiumModal from '../../../../components/PremiumModal';

function CreateCategoryForm({ showCreateForm, setShowCreateForm, onRefreshData }) {
    const [categoryName, setCategoryName] = useState('');
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // ✅ ESTADOS PARA IA
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [premiumFeature, setPremiumFeature] = useState('');
    const [generatingCategory, setGeneratingCategory] = useState(false);
    const [generatedCategoryText, setGeneratedCategoryText] = useState('');

    // ✅ HOOKS PREMIUM Y TYPEWRITER
    const { isPremium } = usePremiumAccess();
    const { displayedText: categoryTypewriter, isTyping: categoryTyping } = useTypewriter(generatedCategoryText, 50);

    const { post } = useApi();

    // Auto-limpiar alertas
    useEffect(() => {
        if (createSuccess || createError) {
            const timer = setTimeout(() => {
                setCreateSuccess('');
                setCreateError('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [createSuccess, createError]);

    // ✅ EFECTO PARA ACTUALIZAR EL INPUT CON EL TEXTO GENERADO
    useEffect(() => {
        if (categoryTypewriter && !categoryTyping) {
            setCategoryName(categoryTypewriter);
            setGeneratedCategoryText('');
        }
    }, [categoryTypewriter, categoryTyping]);

    // ✅ FUNCIÓN PARA MANEJAR ACCIONES PREMIUM
    const handlePremiumAction = (action, featureName) => {
        if (!isPremium) {
            setPremiumFeature(featureName);
            setShowPremiumModal(true);
            return;
        }
        action();
    };

    // ✅ FUNCIÓN PARA GENERAR CATEGORÍA CON IA
    const handleGenerateCategory = () => {
        handlePremiumAction(async () => {
            setGeneratingCategory(true);
            setCreateError('');

            try {
                const prompt = categoryName.trim() || 'medicina general';

                const response = await post('medflash/ai-generate', {
                    type: 'pregunta',
                    prompt: `Genera un nombre de categoría médica basado en: ${prompt}. Solo responde con el nombre de la categoría, máximo 3 palabras.`,
                    current_text: categoryName.trim()
                });

                console.log('Response:', response);

                if (response.success) {
                    // ✅ USAR LA ESTRUCTURA CORRECTA
                    const cleanText = response.data.data.generated_text
                        .replace(/['"]/g, '')
                        .trim()
                        .split('\n')[0]
                        .substring(0, 50);

                    setGeneratedCategoryText(cleanText);
                    setCreateSuccess('Nombre de categoría generado con IA exitosamente');
                } else {
                    setCreateError('Error al generar nombre de categoría con IA');
                }
            } catch (error) {
                console.error('Error generando categoría:', error);
                setCreateError('Error de conexión al generar nombre de categoría');
            } finally {
                setGeneratingCategory(false);
            }
        }, 'generar nombres de categorías con IA');
    };

    const toggleCreateForm = () => {
        setShowCreateForm(!showCreateForm);
        if (showCreateForm) {
            setCategoryName('');
            setCreateError('');
            setCreateSuccess('');
            setProgress(0);
            setGeneratedCategoryText('');
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccess('');
        setProgress(0);

        if (!categoryName.trim()) {
            setCreateError('El nombre de la categoría es requerido');
            return;
        }

        if (categoryName.trim().length < 2) {
            setCreateError('El nombre debe tener al menos 2 caracteres');
            return;
        }

        setCreateLoading(true);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 100);

        try {
            const response = await post('medflash/category', {
                name: categoryName.trim()
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (response.success) {
                setTimeout(() => {
                    setCreateSuccess(`Categoría "${categoryName.trim()}" creada exitosamente!`);
                    setCategoryName('');
                    setProgress(0);
                    onRefreshData();
                }, 300);
            } else {
                handleCreateApiError(response);
                setProgress(0);
            }
        } catch (error) {
            clearInterval(progressInterval);
            console.error('Error al crear categoría:', error);
            setCreateError('Error de conexión. Verifica tu internet.');
            setProgress(0);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCreateApiError = (response) => {
        let errorMessage = 'Error al procesar la solicitud';

        if (response.status === 422) {
            errorMessage = 'Los datos enviados no son válidos';
        } else if (response.status === 409) {
            errorMessage = 'Ya existe una categoría con ese nombre';
        } else if (response.status === 401) {
            errorMessage = 'No tienes permisos para realizar esta acción';
        } else if (response.error) {
            errorMessage = response.error;
        }

        setCreateError(errorMessage);
    };

    const handleInputChange = (e) => {
        if (!categoryTyping) {
            setCategoryName(e.target.value);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div
                className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={toggleCreateForm}
                style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Crear Categoría</h2>
                        <p className="text-gray-600 mt-1">Agrega nuevas categorías para organizar tus flashcards</p>
                    </div>
                    <svg
                        className={`w-6 h-6 text-gray-500 transition-transform ${showCreateForm ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {showCreateForm && (
                <div className="p-8">
                    {/* Loading */}
                    {createLoading && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <p className="text-blue-800 font-medium">Creando categoría...</p>
                                <div className="ml-auto text-blue-600 font-bold">{progress}%</div>
                            </div>
                        </div>
                    )}

                    {/* Alertas */}
                    {createSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between animate-fade-in">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-green-800">{createSuccess}</p>
                            </div>
                            <button
                                onClick={() => setCreateSuccess('')}
                                className="text-green-600 hover:text-green-800 ml-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {createError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between animate-fade-in">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-800">{createError}</p>
                            </div>
                            <button
                                onClick={() => setCreateError('')}
                                className="text-red-600 hover:text-red-800 ml-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleCategorySubmit} className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre de la Categoría <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleGenerateCategory}
                                    disabled={generatingCategory || categoryTyping}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        isPremium
                                            ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    title={isPremium ? 'Generar nombre con IA' : 'Función Premium - Generar con IA'}
                                >
                                    {generatingCategory ? (
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
                            <input
                                type="text"
                                value={categoryTyping ? categoryTypewriter : categoryName}
                                onChange={handleInputChange}
                                placeholder="Ej: Cardiología, Neurología, Anatomía... o usa IA para generar"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                    createError ? 'border-red-500' : 'border-gray-300'
                                } ${createLoading || categoryTyping ? 'opacity-60' : ''}`}
                                required
                                disabled={createLoading || categoryTyping}
                                maxLength={255}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500">
                                    {(categoryTyping ? (categoryTypewriter || '') : (categoryName || '')).length}/255 caracteres
                                </p>
                                {categoryTyping && (
                                    <p className="text-sm text-indigo-600 font-medium">
                                        ✨ Generando con IA...
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={createLoading || !categoryName.trim() || categoryTyping}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            {createLoading ? 'Creando Categoría...' : 'Crear Categoría'}
                        </button>
                    </form>
                </div>
            )}

            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                featureName={premiumFeature}
            />
        </div>
    );
}

export default CreateCategoryForm
