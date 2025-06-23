import React, { useState, useEffect } from 'react';

const ImagePreview = ({
                          src,
                          onRemove,
                          className = '',
                          alt = 'Preview'
                      }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
    }, [src]);

    const handleImageLoad = () => {
        setImageLoaded(true);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(false);
    };

    if (!src) return null;

    return (
        <div className={`relative inline-block ${className}`}>
            <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tema1"></div>
                    </div>
                )}

                {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                        Error al cargar imagen
                    </div>
                )}

                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-200 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />

                {/* Botón X para eliminar */}
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    title="Eliminar imagen"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ImagePreview;
