import React, { useEffect } from 'react';
import Overlay from '../../atoms/Overlay';
import EscapeButton from '../../atoms/EscapeButton';

const Modal = ({
                   isOpen = false,
                   onClose,
                   title,
                   children,
                   size = 'medium',
                   showHeader = true,
                   showEscapeButton = true,
                   className = '',
                   ...props
               }) => {
    // Cerrar con tecla ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        small: 'max-w-md',
        medium: 'max-w-lg',
        large: 'max-w-2xl',
        xlarge: 'max-w-4xl'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay usando el átomo */}
            <Overlay
                isVisible={isOpen}
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} ${className}`}
                    onClick={(e) => e.stopPropagation()}
                    {...props}
                >
                    {/* Header */}
                    {showHeader && title && (
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h3>
                            {showEscapeButton && (
                                <EscapeButton onClick={onClose} />
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
