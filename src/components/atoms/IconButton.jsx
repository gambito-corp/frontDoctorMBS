import React from 'react';

const IconButton = ({
                        icon,
                        variant = 'default',
                        size = 'medium',
                        disabled = false,
                        onClick,
                        title,
                        className = '',
                        ...props
                    }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        default: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        primary: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:ring-blue-500',
        danger: 'text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-500',
        success: 'text-green-600 hover:text-green-700 hover:bg-green-50 focus:ring-green-500'
    };

    const sizes = {
        small: 'w-6 h-6 text-sm',
        medium: 'w-8 h-8 text-base',
        large: 'w-10 h-10 text-lg'
    };

    const disabledClasses = disabled
        ? 'opacity-50 cursor-not-allowed pointer-events-none'
        : 'cursor-pointer';

    return (
        <button
            type="button"
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            title={title}
            {...props}
        >
            {icon}
        </button>
    );
};

export default IconButton;
