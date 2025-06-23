import React from 'react';
import Box from '../atoms/Box';

const ContentBox = ({ children, className = '' }) => {
    return (
        <Box className={`p-6 ${className}`}>
            {children}
        </Box>
    );
};

export default ContentBox;
