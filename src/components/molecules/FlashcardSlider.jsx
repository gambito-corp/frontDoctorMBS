import React, { useRef } from 'react';
import IconButton from '../atoms/IconButton';
import SelectFlashCard from './SelectFlashCard';

const FlashcardSlider = ({
                             flashcards = [],
                             selectedIds = [],
                             onSelectFlashcard,
                             onEditFlashcard,
                             onDeleteFlashcard,
                             canEdit = false,
                             canDelete = false,
                             className = '',
                             ...props
                         }) => {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = direction === 'left'
                ? sliderRef.current.scrollLeft - scrollAmount
                : sliderRef.current.scrollLeft + scrollAmount;

            sliderRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    if (flashcards.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 text-gray-500">
                <div className="text-center">
                    <div className="text-4xl mb-2">📚</div>
                    <div>No hay flashcards disponibles</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} {...props}>
            {/* Botón izquierdo */}
            <IconButton
                icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                }
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md hover:bg-gray-50"
                size="large"
            />

            {/* Contenedor deslizable */}
            <div
                ref={sliderRef}
                className="flex overflow-x-auto gap-6 px-12 py-4 scrollbar-hide h-48"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {flashcards.map((flashcard) => (
                    <SelectFlashCard
                        key={flashcard.id}
                        flashcard={flashcard}
                        selected={selectedIds.includes(flashcard.id)}
                        onSelect={() => onSelectFlashcard(flashcard.id)}
                        onEdit={onEditFlashcard}
                        onDelete={onDeleteFlashcard}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        className="flex-shrink-0"
                    />
                ))}
            </div>

            {/* Botón derecho */}
            <IconButton
                icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                }
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md hover:bg-gray-50"
                size="large"
            />

            <style jsx={"true"}>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default FlashcardSlider;
