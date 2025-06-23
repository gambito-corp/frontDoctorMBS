import React from 'react';

const FileInput = ({
                       id,
                       onChange,
                       accept = "image/*",
                       className = '',
                       error,
                       ...props
                   }) => {
    return (
        <div className="w-full">
            <input
                id={id}
                type="file"
                onChange={onChange}
                accept={accept}
                className={`w-full text-sm text-grey-500 file:mr-5 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-80 file:sky-950 hover:file:cursor-pointer ${className}`}
                {...props}
            />
            {error && (
                <span className="text-red-500 text-sm">{error}</span>
            )}
        </div>
    );
};

export default FileInput;
