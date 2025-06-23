import React from 'react';

const GameActionButton = ({
                              children,
                              variant = 'primary',
                              onClick,
                              disabled = false,
                              className = '',
                              ...props
                          }) => {
    const variants = {
        restart: "px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 boton-success-m w-full font-medium transition-all duration-200 transform hover:scale-105",
        exit: "px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 boton-success-m w-full font-medium transition-all duration-200 transform hover:scale-105"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default GameActionButton;
