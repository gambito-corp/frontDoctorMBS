// src/pages/Domains/MedChat/components/ThinkingLoader.jsx
import React from 'react';

// Versión más elaborada del ThinkingLoader
const ThinkingLoader = () => {
    return (
        <div className="flex justify-start mb-4">
            <div className="flex max-w-4xl flex-row items-start space-x-3">

                {/* Avatar del sistema con animación */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 animate-pulse">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>

                {/* Mensaje de pensando mejorado */}
                <div className="flex flex-col max-w-3xl">
                    <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 text-gray-700 rounded-bl-md">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                                <span className="text-blue-600 font-medium">MedChat está pensando</span>
                            </div>
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs mt-1 px-2 text-gray-500 text-left">
                        Analizando consulta médica...
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ThinkingLoader;
