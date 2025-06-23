import React from 'react';

const Alert = ({ type = 'error', message, className = '' }) => {
    const types = {
        error: 'bg-red-100 border border-red-400 text-red-700',
        success: 'bg-green-100 border border-green-400 text-green-700',
        warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
        info: 'bg-blue-100 border border-blue-400 text-blue-700'
    };

    if (!message) return null;

    return (
        <div className={`mt-2 px-4 py-3 rounded font-semibold ${types[type]} ${className}`}>
            {message}
        </div>
    );
};

export default Alert;
