// src/pages/Domains/MedFlash/Game.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';

const Game = () => {
    const navigate = useNavigate();
    const { get, post } = useApi(); // ✅ USAR useApi CORRECTAMENTE

    // Estados del juego
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [slideDirection, setSlideDirection] = useState(null);
    const [startX, setStartX] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const threshold = 50;

    useEffect(() => {
        loadGameData();
    }, []);

    const loadGameData = async () => {
        try {
            setLoading(true);
            setError('');

            // ✅ CORREGIR RUTA: usar medflash en lugar de flashcard
            const result = await get('medflash/game');

            if (result.success) {
                const actualGameData = result.data.data || result.data;
                setGameData(actualGameData);
                console.log('✅ Datos del juego cargados:', actualGameData);
            } else {
                setError(result.error || 'Error al cargar el juego');
            }
        } catch (error) {
            console.error('💥 Error de conexión:', error);
            setError('Error de conexión. No se pudo cargar el juego.');
        } finally {
            setLoading(false);
        }
    };

    // Gestos táctiles
    // ✅ CORREGIR: Mejorar los eventos táctiles
    const handleTouchStart = (e) => {
        if (!showAnswer || isProcessing) return;

        // ✅ NO INTERFERIR SI ES UN BOTÓN
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }

        setStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (!showAnswer || isProcessing) return;

        // ✅ NO INTERFERIR SI ES UN BOTÓN
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }

        const diff = e.changedTouches[0].clientX - startX;

        if (diff < -threshold) {
            setSlideDirection('left');
            setIsProcessing(true);
            setTimeout(() => {
                markCorrect();
                setSlideDirection(null);
                setIsProcessing(false);
            }, 400);
        } else if (diff > threshold) {
            setSlideDirection('right');
            setIsProcessing(true);
            setTimeout(() => {
                markIncorrect();
                setSlideDirection(null);
                setIsProcessing(false);
            }, 400);
        }
    };

    const revealAnswer = (e) => {
        e.stopPropagation(); // ✅ EVITAR PROPAGACIÓN
        setShowAnswer(true);
        console.log('✅ Revelar respuesta clickeado'); // ✅ DEBUG
    };

    // ✅ CORREGIR: Mejorar markCorrect y markIncorrect
    const markCorrect = async (e) => {
        if (e) e.stopPropagation(); // ✅ EVITAR PROPAGACIÓN
        if (isProcessing) return;
        setIsProcessing(true);
        const newCorrectCount = correctCount + 1;
        setCorrectCount(newCorrectCount);
        setShowAnswer(false);
        await nextCard(newCorrectCount);
        setIsProcessing(false);
    };

    const markIncorrect = async (e) => {
        if (e) e.stopPropagation(); // ✅ EVITAR PROPAGACIÓN
        if (isProcessing) return;
        setIsProcessing(true);
        const currentCard = gameData.flashcards[currentIndex];

        try {
            await post(`medflash/${currentCard.id}/increment-error`);
        } catch (error) {
            console.error('Error al incrementar errores:', error);
        }

        setShowAnswer(false);
        await nextCard(correctCount);
        setIsProcessing(false);
    };


    const nextCard = async (currentCorrectCount = correctCount) => {
        const nextIndex = currentIndex + 1;
        const totalCards = gameData.flashcards.length;

        if (nextIndex >= totalCards) {
            await finishGame(currentCorrectCount);
        } else {
            setCurrentIndex(nextIndex);
        }
    };

    const finishGame = async (finalCorrectCount = correctCount) => {
        const totalCards = gameData.flashcards.length;
        const incorrectCount = totalCards - finalCorrectCount;
        const gameResults = {
            correct: finalCorrectCount,
            incorrect: incorrectCount,
            total: totalCards
        };

        try {
            // ✅ CORREGIR RUTA: usar medflash en lugar de flashcard
            await post('medflash/game/finish', {
                correct: finalCorrectCount,
                incorrect: incorrectCount,
                total: totalCards,
                flashcard_ids: gameData.flashcards.map(card => card.id)
            });
        } catch (error) {
            console.error('Error al finalizar juego:', error);
        }

        // ✅ CORREGIR RUTA DE NAVEGACIÓN
        navigate('/medflash/finish', {
            state: { results: gameResults },
            replace: true
        });
    };

    const exitGame = () => {
        // ✅ VOLVER A MEDFLASH
        navigate('/medflash');
    };

    // Estados de loading y error
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-800 font-medium">Cargando juego...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">❌ Error</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={loadGameData}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                🔄 Reintentar
                            </button>
                            <button
                                onClick={exitGame}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                📚 Volver a MedFlash
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!gameData?.flashcards || gameData.flashcards.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin flashcards</h3>
                        <p className="text-gray-600 mb-6">No hay flashcards disponibles para el juego.</p>
                        <button
                            onClick={exitGame}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            📚 Volver a MedFlash
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentCard = gameData.flashcards[currentIndex];
    const totalCards = gameData.flashcards.length;
    const isLastCard = currentIndex === totalCards - 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            {/* Barra de progreso */}
            <div className="w-full bg-white shadow-sm p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Pregunta {currentIndex + 1} de {totalCards}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                            ✓ {correctCount} correctas
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    {/* ✅ FLASHCARD CORREGIDA */}
                    <div
                        className={`relative bg-white rounded-xl shadow-xl transition-all duration-400 ${
                            slideDirection === 'left' ? 'transform -translate-x-full opacity-0' :
                                slideDirection === 'right' ? 'transform translate-x-full opacity-0' : ''
                        }`}
                        style={{ minHeight: '400px' }}
                    >
                        {/* ✅ CARA FRONTAL (PREGUNTA) - SIN EVENTOS TÁCTILES EN EL CONTENEDOR */}
                        <div className={`p-8 transition-all duration-500 ${showAnswer ? 'opacity-0 absolute inset-0' : 'opacity-100'}`}>
                            <div className="text-center h-full flex flex-col justify-center">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    {currentCard.pregunta}
                                </h2>

                                {currentCard.imagen && (
                                    <div className="mb-6">
                                        <img
                                            src={currentCard.imagen}
                                            alt="Imagen de la pregunta"
                                            className="max-w-full max-h-48 object-contain mx-auto rounded-lg"
                                            onError={(e) => {
                                                console.error('Error cargando imagen:', currentCard.imagen);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                {!showAnswer && (
                                    <button
                                        onClick={revealAnswer}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors mx-auto relative z-10"
                                        style={{
                                            pointerEvents: 'auto',
                                            touchAction: 'manipulation' // ✅ MEJORAR TOUCH
                                        }}
                                    >
                                        Revelar Respuesta
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ✅ CARA TRASERA (RESPUESTA) - CON EVENTOS TÁCTILES */}
                        <div
                            className={`p-8 transition-all duration-500 ${showAnswer ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div className="text-center h-full flex flex-col justify-center">
                                <h3 className="text-lg font-semibold text-gray-600 mb-4">Respuesta:</h3>
                                <p className="text-xl text-gray-800 mb-6">
                                    {currentCard.respuesta}
                                </p>

                                {currentCard.imagen_respuesta && (
                                    <div className="mb-6">
                                        <img
                                            src={currentCard.imagen_respuesta}
                                            alt="Imagen de la respuesta"
                                            className="max-w-full max-h-48 object-contain mx-auto rounded-lg"
                                            onError={(e) => {
                                                console.error('Error cargando imagen respuesta:', currentCard.imagen_respuesta);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                {showAnswer && (
                                    <div className="flex justify-center space-x-4">
                                        <button
                                            onClick={markCorrect}
                                            disabled={isProcessing}
                                            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 relative z-10"
                                            style={{
                                                pointerEvents: 'auto',
                                                touchAction: 'manipulation' // ✅ MEJORAR TOUCH
                                            }}
                                        >
                                            <span>✓ Correcto</span>
                                        </button>
                                        <button
                                            onClick={markIncorrect}
                                            disabled={isProcessing}
                                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 relative z-10"
                                            style={{
                                                pointerEvents: 'auto',
                                                touchAction: 'manipulation' // ✅ MEJORAR TOUCH
                                            }}
                                        >
                                            <span>✗ Incorrecto</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Instrucciones de gestos */}
                    {showAnswer && (
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                💡 Desliza izquierda para ✓ Correcto, derecha para ✗ Incorrecto
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Botón salir */}
            <div className="p-4">
                <div className="max-w-4xl mx-auto text-center">
                    <button
                        onClick={exitGame}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        🚪 Salir del Juego
                    </button>
                </div>
            </div>

            {/* Overlay de procesamiento */}
            {isProcessing && isLastCard && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-800 font-medium">Calculando resultados...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;
