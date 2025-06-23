import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

const FormField = ({
                       id,
                       label,
                       type = 'text',
                       value,
                       onChange,
                       placeholder,
                       error,
                       required = false,
                       className = ''
                   }) => {
    return (
        <div className={`mb-4 ${className}`}>
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                error={error}
                required={required}
            />
        </div>
    );
};

export default FormField;
