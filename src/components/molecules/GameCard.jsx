import React from 'react';

const GameCard = ({
                      children,
                      isBack = false,
                      className = '',
                      onTouchStart,
                      onTouchEnd,
                      slideDirection,
                      showAnswer,
                      ...props
                  }) => {
    const baseClasses = isBack
        ? "card-face card-back bg-white transform rotate-y-180"
        : "card-face card-front bg-[#195b81] text-white";

    return (
        <div
            className={`${baseClasses} p-10 rounded-[20px] ${className}`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            {...props}
        >
            {children}
        </div>
    );
};

export default GameCard;
