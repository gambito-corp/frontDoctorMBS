import React from 'react';

const Logo = ({ className = '' }) => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    return (
        <div className={`shrink-0 flex mr-24 pr-24 site-logo ${className}`}>
            <a href={baseUrl}>
                <img
                    src="/logo.svg"
                    alt="MBS - Med By Students"
                    className="block h-9"
                />
            </a>
        </div>
    );
};

export default Logo;
