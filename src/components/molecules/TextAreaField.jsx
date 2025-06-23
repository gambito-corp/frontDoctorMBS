import React, { useState, useEffect } from 'react';
import Label from '../atoms/Label';
import TextArea from '../atoms/TextArea';
import Button from '../atoms/Button';

const TextAreaField = ({
                           id,
                           label,
                           value,
                           onChange,
                           placeholder,
                           error,
                           required = false,
                           showAIButton = false,
                           onAIGenerate,
                           aiLoading = false,
                           aiAnimating = false, // ← Nuevo prop
                           aiDisabled = false,
                           disabled = false,
                           className = ''
                       }) => {
    const [displayValue, setDisplayValue] = useState(value);

    // Manejar animación cuando aiAnimating cambie
    useEffect(() => {
        if (aiAnimating && value !== displayValue) {
            animateText(displayValue, value);
        } else {
            setDisplayValue(value);
        }
    }, [value, aiAnimating]);

    const animateText = async (fromText, toText) => {
        const startLength = fromText.length;
        const endLength = toText.length;
        const speed = 25;

        for (let i = startLength; i <= endLength; i++) {
            await new Promise(resolve => setTimeout(resolve, speed));
            setDisplayValue(toText.substring(0, i));
        }
    };

    const handleChange = (e) => {
        if (!aiAnimating && !disabled) {
            const newValue = e.target.value;
            setDisplayValue(newValue);
            onChange(e);
        }
    };

    return (
        <div className={`mb-4 relative ${className}`}>
            <div className="flex justify-between items-center">
                <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {showAIButton && (
                    <Button
                        type="button"
                        onClick={onAIGenerate}
                        disabled={aiLoading || aiDisabled || aiAnimating}
                        className={`relative h-10 flex transition duration-300 px-[20px] py-[3px] rounded-[8px] justify-center items-center gap-[8px] text-white font-semibold text-[12px] ${
                            aiLoading || aiDisabled || aiAnimating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-tema1 hover:bg-tema3'
                        }`}
                    >
                        {aiLoading ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                <span>Generando...</span>
                            </>
                        ) : aiAnimating ? (
                            <>
                                <span>✨</span>
                                <span>Escribiendo...</span>
                            </>
                        ) : aiDisabled ? (
                            <>
                                <span>⏳</span>
                                <span>Esperando...</span>
                            </>
                        ) : (
                            <>
                                <span>🤖</span>
                                <span>Generar por IA</span>
                            </>
                        )}
                    </Button>
                )}
            </div>

            <TextArea
                id={id}
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                error={error}
                required={required}
                rows={3}
                disabled={disabled || aiAnimating}
                className={aiAnimating ? 'bg-blue-50 border-blue-300' : ''}
            />

            {aiAnimating && (
                <div className="flex items-center mt-1 text-sm text-blue-600">
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    ✨ Escribiendo texto generado por IA...
                </div>
            )}
        </div>
    );
};

export default TextAreaField;
