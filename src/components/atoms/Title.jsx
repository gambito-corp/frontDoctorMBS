import React from 'react';

const Title = ({ children, level = 'h2', className = '' }) => {
    const Tag = level;
    const baseClasses = 'font-semibold text-xl text-gray-800 leading-tight';

    return (
        <Tag className={`${baseClasses} ${className}`}>
            {children}
        </Tag>
    );
};

export default Title;

