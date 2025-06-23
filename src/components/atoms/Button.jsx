// import React from 'react';
//
// const Button = ({
//                     type = 'button',
//                     variant = 'primary',
//                     children,
//                     onClick,
//                     disabled = false,
//                     className = '',
//                     ...props
//                 }) => {
//     const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
//
//     const variants = {
//         primary: 'bg-indigo-600 text-white hover:bg-indigo-700 boton-success-m',
//         secondary: 'bg-gray-600 text-white hover:bg-gray-700',
//         danger: 'bg-red-600 text-white hover:bg-red-700'
//     };
//
//     return (
//         <button
//             type={type}
//             onClick={onClick}
//             disabled={disabled}
//             className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
//             {...props}
//         >
//             {children}
//         </button>
//     );
// };
//
// export default Button;
import React from 'react';

const Button = ({
                    type = 'button',
                    variant = 'primary',
                    size = 'medium',
                    gameVariant = null, // Para variantes específicas del juego
                    children,
                    onClick,
                    disabled = false,
                    className = '',
                    ...props
                }) => {
    const baseClasses = 'font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variantes estándar
    const standardVariants = {
        primary: 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white focus:ring-indigo-300 transform hover:scale-105 shadow-md hover:shadow-lg',
        secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-300 transform hover:scale-105 shadow-md hover:shadow-lg',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-300 transform hover:scale-105 shadow-md hover:shadow-lg',
        success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:ring-green-300 transform hover:scale-105 shadow-md hover:shadow-lg'
    };

    // Variantes específicas del juego
    const gameVariants = {
        reveal: "bg-white rounded-[10px] text-[#195b81] font-extrabold uppercase tracking-wide transition-all duration-300 ease-in hover:opacity-80",
        correct: "bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 boton-success-m rounded-[10px] button-overlay",
        incorrect: "bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 button-incorrect rounded-[10px] button-overlay",
        restart: "bg-green-600 text-white rounded-lg hover:bg-green-700 boton-success-m font-medium transition-all duration-200 transform hover:scale-105",
        exit: "bg-blue-600 text-white rounded-lg hover:bg-blue-700 boton-success-m font-medium transition-all duration-200 transform hover:scale-105"
    };

    const sizes = {
        small: 'px-3 py-1.5 text-xs',
        medium: 'px-4 py-2 text-sm',
        large: 'px-6 py-3 text-base',
        game: 'py-[15px] w-full', // Para botones del juego
        gameAction: 'px-4 py-3 w-full' // Para botones de acción del juego
    };

    // Determinar qué variante usar
    const variantClasses = gameVariant ? gameVariants[gameVariant] : standardVariants[variant];
    const sizeClasses = gameVariant ? sizes.game : sizes[size];

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
