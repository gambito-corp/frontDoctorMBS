import React from 'react';

const ToggleButton = ({
                          id,
                          value,
                          checked = false,
                          onChange,
                          children,
                          className = '',
                          disabled = false
                      }) => {
    const baseClasses = "px-4 py-2 border rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tema1 focus:ring-offset-2";
    const selectedClasses = "bg-tema1 text-white border-tema1 shadow-md";
    const unselectedClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400";
    const disabledClasses = "opacity-50 cursor-not-allowed";

    return (
        <button
            type="button"
            id={id}
            value={value}
            onClick={() => !disabled && onChange(value)}
            disabled={disabled}
            aria-pressed={checked}
            className={`
                ${baseClasses} 
                ${checked ? selectedClasses : unselectedClasses}
                ${disabled ? disabledClasses : ''}
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export default ToggleButton;
