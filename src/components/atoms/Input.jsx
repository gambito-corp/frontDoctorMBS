import React from 'react';

const Input = ({
                   id,
                   type = 'text',
                   value,
                   onChange,
                   onBlur, // ← Agregar soporte para onBlur
                   placeholder,
                   className = '',
                   error,
                   disabled = false,
                   ...props
               }) => {
    return (
        <div className="w-full">
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur} // ← Pasar onBlur
                placeholder={placeholder}
                disabled={disabled}
                className={`mt-1 block w-full rounded border-gray-300 focus:border-tema1 focus:ring-tema1 ${
                    disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                } ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <span className="text-red-500 text-sm">{error}</span>
            )}
        </div>
    );
};

export default Input;
