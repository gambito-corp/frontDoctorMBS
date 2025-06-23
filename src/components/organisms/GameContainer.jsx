import React from 'react';

const GameContainer = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`max-w-xl mx-auto p-6 container-full ${className}`}
            {...props}
        >
            <h1 className="text-3xl font-bold mb-6 text-indigo-700 primary-color title-ask-container">
                Juego de Flashcards
            </h1>
            <hr className="mb-6" />
            {children}
        </div>
    );
};

export default GameContainer;
