import React from 'react';

const ResultCard = ({
                        value,
                        label,
                        variant = 'default',
                        className = '',
                        ...props
                    }) => {
    const variants = {
        correct: "text-center bg-green-50 rounded-lg p-4",
        incorrect: "text-center bg-red-50 rounded-lg p-4",
        total: "text-center bg-blue-50 rounded-lg p-4",
        default: "text-center bg-gray-50 rounded-lg p-4"
    };

    const textColors = {
        correct: "text-green-600",
        incorrect: "text-red-600",
        total: "text-blue-600",
        default: "text-gray-600"
    };

    const labelColors = {
        correct: "text-green-700",
        incorrect: "text-red-700",
        total: "text-blue-700",
        default: "text-gray-700"
    };

    return (
        <div className={`${variants[variant]} ${className}`} {...props}>
            <div className={`text-2xl font-bold ${textColors[variant]}`}>
                {value}
            </div>
            <div className={`text-sm ${labelColors[variant]}`}>
                {label}
            </div>
        </div>
    );
};

export default ResultCard;
