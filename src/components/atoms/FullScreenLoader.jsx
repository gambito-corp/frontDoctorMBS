import React from 'react';

const FullScreenLoader = ({ show, message = 'Cargando...', subMessage = 'Por favor espera' }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-lg p-8 text-center shadow-2xl max-w-sm mx-4">
                <div className="relative">
                    {/* Spinner principal */}
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-tema1 mx-auto mb-6"></div>

                    {/* Spinner secundario */}
                    <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-r-4 border-tema2 mx-auto" style={{animationDuration: '3s'}}></div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
                <p className="text-sm text-gray-600 mb-4">{subMessage}</p>

                {/* Barra de progreso animada */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-tema1 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                </div>
            </div>
        </div>
    );
};

export default FullScreenLoader;