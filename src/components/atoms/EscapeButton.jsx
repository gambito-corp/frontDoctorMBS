import React from 'react';

const EscapeButton = ({
                          onClick,
                          size = 'medium',
                          className = '',
                          ...props
                      }) => {
    const sizes = {
        small: 'w-4 h-4',
        medium: 'w-6 h-6',
        large: 'w-8 h-8'
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-gray-400 hover:text-gray-600 focus:outline-none transition-colors ${className}`}
            {...props}
        >
            <svg
                className={sizes[size]}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    );
};

export default EscapeButton;
