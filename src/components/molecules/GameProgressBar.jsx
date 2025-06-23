import React from 'react';
import Badge from '../atoms/Badge';

const GameProgressBar = ({
                             currentIndex,
                             totalCards,
                             correctCount,
                             className = ''
                         }) => {
    const progress = ((currentIndex + 1) / totalCards) * 100;

    return (
        <div className={`mb-6 ${className}`}>
            <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary" size="small">
                    Progreso: {currentIndex + 1} de {totalCards}
                </Badge>
                <Badge variant="success" size="small">
                    Correctas: {correctCount}
                </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default GameProgressBar;
