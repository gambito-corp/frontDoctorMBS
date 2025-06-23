import React, { useState, useEffect, useRef } from 'react';

const TextArea = ({
                      id,
                      value,
                      onChange,
                      placeholder,
                      rows = 3,
                      className = '',
                      error,
                      disabled = false,
                      ...props
                  }) => {
    const textareaRef = useRef(null);

    return (
        <div className="w-full">
            <textarea
                ref={textareaRef}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`mt-1 block w-full rounded border-gray-300 focus:border-tema1 focus:ring-tema1 resize-vertical transition-all duration-200 ${
                    disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                } ${className}`}
                disabled={disabled}
                {...props}
            />
            {error && (
                <span className="text-red-500 text-sm">{error}</span>
            )}
        </div>
    );
};

export default TextArea;
