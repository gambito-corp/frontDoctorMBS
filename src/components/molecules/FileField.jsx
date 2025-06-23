import React from 'react';
import Label from '../atoms/Label';
import FileInput from '../atoms/FileInput';

const FileField = ({
                       id,
                       label,
                       onChange,
                       error,
                       accept = "image/*",
                       className = ''
                   }) => {
    return (
        <div className={`mb-4 ${className}`}>
            <Label htmlFor={id}>{label}</Label>
            <FileInput
                id={id}
                onChange={onChange}
                accept={accept}
                error={error}
            />
        </div>
    );
};

export default FileField;
