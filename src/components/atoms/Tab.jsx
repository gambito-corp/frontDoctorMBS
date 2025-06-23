import React from 'react';

const Tab = ({
                 children,
                 active = false,
                 disabled = false,
                 onClick,
                 className = '',
                 ...props
             }) => {
    const baseClasses = 'px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 cursor-pointer relative min-w-max';

    const activeClasses = active
        ? 'text-blue-600 border-blue-600 bg-blue-50'
        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300';

    const disabledClasses = disabled
        ? 'opacity-50 cursor-not-allowed pointer-events-none'
        : '';

    return (
        <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                active
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Tab;
