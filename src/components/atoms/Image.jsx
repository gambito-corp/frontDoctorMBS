import React from 'react';

const Image = ({
                   src,
                   alt,
                   variant = 'default',
                   gameType = null, // Para imágenes específicas del juego
                   onClick,
                   className = '',
                   ...props
               }) => {
    const variants = {
        default: 'object-cover rounded',
        preview: 'max-w-full h-auto rounded-lg shadow-md',
        thumbnail: 'w-16 h-16 object-cover rounded',
        avatar: 'w-10 h-10 object-cover rounded-full'
    };

    const gameVariants = {
        question: 'img-answer cursor-pointer max-w-32 max-h-32 object-cover rounded',
        answer: 'img-answer img-answer-response cursor-pointer max-w-32 max-h-32 object-cover rounded'
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (gameType) {
            window.open(src, '_blank');
        }
    };

    if (!src) return null;

    const variantClasses = gameType ? gameVariants[gameType] : variants[variant];
    const isClickable = onClick || gameType;

    return (
        <img
            src={src}
            alt={alt}
            onClick={isClickable ? handleClick : undefined}
            className={`${variantClasses} ${isClickable ? 'cursor-pointer' : ''} ${className}`}
            {...props}
        />
    );
};

export default Image;
