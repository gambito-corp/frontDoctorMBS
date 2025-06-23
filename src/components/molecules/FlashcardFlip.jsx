import React from 'react';

const FlashcardFlip = ({
                           children,
                           showAnswer,
                           slideDirection,
                           className = ''
                       }) => {
    return (
        <div className="pb-10 game-space">
            <div
                className={`relative perspective-1000 w-full transition-all duration-400 ${
                    slideDirection === 'left' ? 'slide-left' :
                        slideDirection === 'right' ? 'slide-right' : ''
                } ${className}`}
            >
                <div className={`card-inner w-full transition-transform duration-500 transform-style-3d ${showAnswer ? 'rotate-y-180' : ''}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FlashcardFlip;
