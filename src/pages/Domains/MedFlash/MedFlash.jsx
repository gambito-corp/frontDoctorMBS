// src/pages/Domains/MedFlash/MedFlash.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ AGREGAR NAVEGACIÓN
import { useApi } from '../../../hooks/useApi';
import CreateCardForm from './components/CreateCardForm';
import CardsList from './components/CardsList';
import CreateCategoryForm from './components/CreateCategoryForm';
import CategoriesManagement from './components/CategoriesManagement';

function MedFlash() {
    // Estados existentes...
    const [categories, setCategories] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [categoriesWithCount, setCategoriesWithCount] = useState([]);
    const [showCreateCard, setShowCreateCard] = useState(false);
    const [showCardsList, setShowCardsList] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCategoriesList, setShowCategoriesList] = useState(false);
    const [selectedCardIds, setSelectedCardIds] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);

    // ✅ NUEVOS ESTADOS PARA EL JUEGO
    const [gameLoading, setGameLoading] = useState(false);
    const [gameError, setGameError] = useState('');

    const { get, post } = useApi();
    const navigate = useNavigate(); // ✅ HOOK DE NAVEGACIÓN

    // Funciones existentes...
    const refreshAllData = async () => {
        await Promise.all([
            loadFlashcards(),
            loadCategoriesWithCount(),
            loadAllCategories()
        ]);
    };

    const loadFlashcards = async () => {
        try {
            const response = await get('medflash?page=1&per_page=16');
            if (response.success) {
                setFlashcards(response.data.data.data);
            }
        } catch (error) {
            console.error('Error al cargar flashcards:', error);
        }
    };

    const loadCategoriesWithCount = async () => {
        try {
            const response = await get('medflash/categories/count');
            if (response.success) {
                console.log(response)
                setCategoriesWithCount(response.data.data);
            }
        } catch (error) {
            console.error('Error al cargar categorías con conteo:', error);
        }
    };

    const loadAllCategories = async () => {
        try {
            const response = await get('medflash/categories?per_page=100&page=1');
            if (response.success) {
                setCategories(response.data.data.data);
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const handleToggleSelection = (cardId) => {
        console.log('handleToggleSelection called with:', cardId);
        setSelectedCardIds(prevSelected => {
            if (prevSelected.includes(cardId)) {
                return prevSelected.filter(id => id !== cardId);
            } else {
                return [...prevSelected, cardId];
            }
        });
    };

    const handleToggleSelectionMode = () => {
        console.log('Cambiando modo selección de', selectionMode, 'a', !selectionMode);
        setSelectionMode(!selectionMode);
        if (selectionMode) {
            setSelectedCardIds([]);
        }
    };

    const handleSelectAll = () => {
        if (selectedCardIds.length === flashcards.length) {
            setSelectedCardIds([]);
        } else {
            setSelectedCardIds(flashcards.map(card => card.id));
        }
    };

    const handleClearSelection = () => {
        setSelectedCardIds([]);
    };

    // ✅ FUNCIÓN PARA INICIAR EL JUEGO
    const handleStartGame = async () => {
        if (selectedCardIds.length === 0) {
            setGameError('Debes seleccionar al menos una flashcard para jugar');
            return;
        }

        setGameLoading(true);
        setGameError('');

        try {
            const gameData = {
                flashcard_ids: selectedCardIds,
                total_selected: selectedCardIds.length
            };

            const response = await post('medflash/start-game', gameData);

            if (response.success) {
                console.log('✅ Juego iniciado:', response.data);
                // Navegar al juego
                navigate('/medflash/game');
            } else {
                setGameError(response.error || 'Error al iniciar el juego');
            }

        } catch (error) {
            console.error('Error iniciando juego:', error);
            setGameError('Error de conexión al iniciar el juego');
        } finally {
            setGameLoading(false);
        }
    };

    // Efectos existentes...
    useEffect(() => {
        refreshAllData();
    }, []);

    useEffect(() => {
        console.log('Cards seleccionadas:', selectedCardIds);
        console.log('Modo selección:', selectionMode);
    }, [selectedCardIds, selectionMode]);

    // ✅ LIMPIAR ERROR DE JUEGO DESPUÉS DE 5 SEGUNDOS
    useEffect(() => {
        if (gameError) {
            const timer = setTimeout(() => {
                setGameError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [gameError]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Panel de control de selección */}
                {selectionMode && (
                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-lg font-semibold text-gray-900">
                                    Modo Selección Activo
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {selectedCardIds.length} seleccionadas
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleSelectAll}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {selectedCardIds.length === flashcards.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                                </button>

                                <button
                                    onClick={handleClearSelection}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    disabled={selectedCardIds.length === 0}
                                >
                                    Limpiar Selección
                                </button>

                                {/* ✅ BOTÓN EMPEZAR MEDFLASH */}
                                <button
                                    onClick={handleStartGame}
                                    disabled={selectedCardIds.length === 0 || gameLoading}
                                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                                >
                                    {gameLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Iniciando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 5a9 9 0 1118 0 9 9 0 01-18 0z" />
                                            </svg>
                                            <span>Empezar MedFlash</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleToggleSelectionMode}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Salir del Modo Selección
                                </button>
                            </div>
                        </div>

                        {/* ✅ ERROR DE JUEGO */}
                        {gameError && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-red-800 text-sm">{gameError}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Botón para activar modo selección */}
                {!selectionMode && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleToggleSelectionMode}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Modo Selección</span>
                        </button>
                    </div>
                )}

                {/* Componentes existentes */}
                <CardsList
                    showCardsList={showCardsList}
                    setShowCardsList={setShowCardsList}
                    flashcards={flashcards}
                    categoriesWithCount={categoriesWithCount}
                    onRefreshData={refreshAllData}
                    selectedCardIds={selectedCardIds}
                    selectionMode={selectionMode}
                    onToggleSelection={handleToggleSelection}
                />

                <CreateCardForm
                    showCreateCard={showCreateCard}
                    setShowCreateCard={setShowCreateCard}
                    categories={categoriesWithCount}
                    onRefreshData={refreshAllData}
                />

                <CreateCategoryForm
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    onRefreshData={refreshAllData}
                />

                <CategoriesManagement
                    showCategoriesList={showCategoriesList}
                    setShowCategoriesList={setShowCategoriesList}
                    onRefreshData={refreshAllData}
                    categoriesWithCount={categoriesWithCount}
                />
            </div>
        </div>
    );
}

export default MedFlash;
