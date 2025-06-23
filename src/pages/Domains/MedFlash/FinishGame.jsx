// src/pages/Domains/MedFlash/FinishGame.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FinishGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState(null);

    useEffect(() => {
        const gameResults = location.state?.results;
        if (gameResults) {
            setResults(gameResults);
            console.log('✅ Resultados recibidos:', gameResults);
        } else {
            console.error('❌ No se recibieron resultados del juego');
            // ✅ REDIRIGIR A MEDFLASH SI NO HAY DATOS
            navigate('/medflash', { replace: true });
        }
    }, [location.state, navigate]);

    const restartGame = () => {
        // ✅ VOLVER A MEDFLASH PARA SELECCIONAR CARDS
        navigate('/medflash');
    };

    const exitGame = () => {
        // ✅ VOLVER A MEDFLASH
        navigate('/medflash');
    };

    if (!results) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-800 font-medium">Cargando resultados...</p>
                </div>
            </div>
        );
    }

    const percentage = results.total > 0 ? ((results.correct / results.total) * 100).toFixed(1) : 0;

    // Mensaje motivacional basado en el porcentaje
    const getMotivationalMessage = () => {
        if (percentage >= 90) return "¡Excelente! 🏆 Dominas el tema perfectamente";
        if (percentage >= 80) return "¡Muy bien! 🎉 Tienes un buen conocimiento";
        if (percentage >= 70) return "¡Bien hecho! 👍 Vas por buen camino";
        if (percentage >= 60) return "¡Sigue practicando! 📚 Estás mejorando";
        return "¡No te rindas! 💪 La práctica hace al maestro";
    };

    const getPercentageColor = () => {
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
                <div className="text-center">
                    {/* Título */}
                    <div className="mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            ¡Juego Completado!
                        </h1>
                        <p className="text-gray-600">
                            Has terminado tu sesión de MedFlash
                        </p>
                    </div>

                    {/* Mensaje motivacional */}
                    <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                        <p className="text-lg font-medium text-gray-800">
                            {getMotivationalMessage()}
                        </p>
                    </div>

                    {/* Resultados */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Correctas */}
                        <div className="bg-green-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {results.correct}
                            </div>
                            <div className="text-sm font-medium text-green-700">
                                Correctas
                            </div>
                        </div>

                        {/* Incorrectas */}
                        <div className="bg-red-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-red-600 mb-2">
                                {results.incorrect}
                            </div>
                            <div className="text-sm font-medium text-red-700">
                                Incorrectas
                            </div>
                        </div>

                        {/* Total */}
                        <div className="bg-blue-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {results.total}
                            </div>
                            <div className="text-sm font-medium text-blue-700">
                                Total
                            </div>
                        </div>
                    </div>

                    {/* Porcentaje de acierto */}
                    <div className="mb-8">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="text-sm font-medium text-gray-600 mb-2">
                                Porcentaje de Acierto
                            </div>
                            <div className={`text-5xl font-bold ${getPercentageColor()}`}>
                                {percentage}%
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={restartGame}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Seleccionar Nuevas Cards</span>
                        </button>
                        <button
                            onClick={exitGame}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            </svg>
                            <span>Volver a MedFlash</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinishGame;
