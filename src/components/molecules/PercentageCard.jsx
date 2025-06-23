import React from 'react';

const PercentageCard = ({
                            percentage,
                            className = '',
                            ...props
                        }) => {
    return (
        <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 text-center ${className}`} {...props}>
            <div className="text-4xl font-bold text-indigo-600 mb-2">
                {percentage}%
            </div>
            <div className="text-lg text-indigo-700 font-medium">
                Porcentaje de acierto
            </div>

            {/* ✅ BARRA DE PROGRESO */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default PercentageCard;
