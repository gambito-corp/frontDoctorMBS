import React from 'react';

const Box = ({ children, className = '' }) => {
    return (
        <div className={`bg-white overflow-hidden shadow-sm sm:rounded-lg ${className}`}>
            {children}
        </div>
    );
};

export default Box;
