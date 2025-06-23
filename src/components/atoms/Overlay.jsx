import React from 'react';

const Overlay = ({
                     isVisible = false,
                     onClick,
                     opacity = 'bg-opacity-50',
                     className = '',
                     ...props
                 }) => {
    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 bg-black ${opacity} transition-opacity ${className}`}
            onClick={onClick}
            {...props}
        />
    );
};

export default Overlay;
