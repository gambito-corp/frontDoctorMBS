import React from 'react';

const MotivationalMessage = ({ percentage, className = '' }) => {
    const getMessage = () => {
        if (percentage >= 90) return '¡Increíble! Dominas perfectamente el tema.';
        if (percentage >= 80) return '¡Muy bien! Tienes un excelente conocimiento.';
        if (percentage >= 70) return '¡Buen trabajo! Vas por buen camino.';
        if (percentage >= 60) return 'Bien hecho, pero puedes mejorar un poco más.';
        return 'Sigue practicando, ¡cada intento te hace mejor!';
    };

    const getEmoji = () => {
        if (percentage >= 80) return '🎉';
        if (percentage >= 60) return '👍';
        return '📚';
    };

    const getTitle = () => {
        if (percentage >= 80) return '¡Excelente!';
        if (percentage >= 60) return '¡Bien hecho!';
        return '¡Sigue practicando!';
    };

    return (
        <div className={`text-center mb-6 ${className}`}>
            <div className="text-6xl mb-4">
                {getEmoji()}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {getTitle()}
            </h3>
            <p className="text-gray-600">
                {getMessage()}
            </p>
        </div>
    );
};

export default MotivationalMessage;
