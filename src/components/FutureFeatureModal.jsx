// src/components/FutureFeatureModal.jsx
import React from 'react';
import { X, Sparkles, Zap } from 'lucide-react';

const FutureFeatureModal = ({ isOpen, onClose, featureType = 'attachment' }) => {
    const getFeatureInfo = () => {
        switch (featureType) {
            case 'attachment':
                return {
                    icon: '📎',
                    title: 'Adjuntar Archivos',
                    description: 'Pronto podrás adjuntar imágenes, PDFs y documentos médicos para un análisis más completo.',
                    features: [
                        'Análisis de imágenes médicas',
                        'Revisión de informes en PDF',
                        'Interpretación de resultados de laboratorio',
                        'Análisis de radiografías y resonancias'
                    ]
                };
            case 'voice':
                return {
                    icon: '🎤',
                    title: 'Mensajes de Voz',
                    description: 'Próximamente podrás enviar mensajes de voz para consultas más naturales y rápidas.',
                    features: [
                        'Reconocimiento de voz médico especializado',
                        'Respuestas en audio',
                        'Consultas manos libres',
                        'Soporte multiidioma'
                    ]
                };
            default:
                return {
                    icon: '✨',
                    title: 'Nueva Funcionalidad',
                    description: 'Esta característica estará disponible próximamente.',
                    features: []
                };
        }
    };

    const featureInfo = getFeatureInfo();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="text-center">
                        <div className="text-4xl mb-2">{featureInfo.icon}</div>
                        <h2 className="text-xl font-bold mb-2">{featureInfo.title}</h2>
                        <div className="flex items-center justify-center space-x-1">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm opacity-90">Próximamente</span>
                            <Sparkles className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 mb-4 text-center">
                        {featureInfo.description}
                    </p>

                    {featureInfo.features.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                                Características incluidas:
                            </h3>
                            <ul className="space-y-2">
                                {featureInfo.features.map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-800 text-center">
                            <strong>¡Mantente atento!</strong> Te notificaremos cuando esta función esté disponible.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FutureFeatureModal;
