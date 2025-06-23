import React from 'react';

const GameButton = ({
                        children,
                        variant = 'reveal',
                        onClick,
                        disabled = false,
                        className = '',
                        ...props
                    }) => {
    const variants = {
        reveal: "bg-white rounded-[10px] text-[#195b81] font-extrabold uppercase tracking-wide py-[15px] w-full transition-all duration-300 ease-in hover:opacity-80 disabled:opacity-50",
        correct: "w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 boton-success-m py-[15px] rounded-[10px] button-overlay disabled:opacity-50",
        incorrect: "w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 button-incorrect py-[15px] rounded-[10px] button-overlay disabled:opacity-50"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default GameButton;
