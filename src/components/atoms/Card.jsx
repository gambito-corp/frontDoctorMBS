import React from 'react';

const Card = ({
                  children,
                  variant = 'default',
                  size = 'medium',
                  selected = false,
                  disabled = false,
                  hoverable = true,
                  onClick,
                  className = '',
                  ...props
              }) => {
    const baseClasses = 'bg-white border rounded-lg transition-all duration-200 overflow-hidden';

    const variants = {
        default: 'border-gray-200 shadow-sm',
        outlined: 'border-gray-300 border-2 shadow-none',
        elevated: 'border-none shadow-lg',
        flat: 'bg-gray-50 border-none shadow-none'
    };

    const sizes = {
        small: 'p-3',
        medium: 'p-4',
        large: 'p-6'
    };

    const stateClasses = selected
        ? 'bg-blue-50 border-blue-500 border-2 shadow-blue-100'
        : variants[variant];

    const hoverClasses = hoverable && onClick && !disabled
        ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
        : '';

    const disabledClasses = disabled
        ? 'opacity-60 cursor-not-allowed pointer-events-none'
        : '';

    return (
        <div
            className={`${baseClasses} ${stateClasses} ${sizes[size]} ${hoverClasses} ${disabledClasses} ${className}`}
            onClick={!disabled ? onClick : undefined}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
