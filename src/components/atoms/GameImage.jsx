import React from 'react';

const GameImage = ({
                       src,
                       alt,
                       isResponse = false,
                       className = '',
                       ...props
                   }) => {
    const baseClasses = isResponse
        ? "img-answer img-answer-response cursor-pointer max-w-32 max-h-32 object-cover rounded"
        : "img-answer cursor-pointer max-w-32 max-h-32 object-cover rounded";

    if (!src) return null;

    return (
        <img
            className={`${baseClasses} ${className}`}
            src={src}
            alt={alt}
            onClick={() => window.open(src, '_blank')}
            {...props}
        />
    );
};

export default GameImage;
