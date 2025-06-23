import React from 'react';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

const ActionButtons = ({
                           selectedCount = 0,
                           totalCount = 0,
                           categorySelectedCount = 0,
                           categoryTotalCount = 0,
                           allSelected = false,        // ← Prop del padre
                           categoryAllSelected = false, // ← Prop del padre
                           onStartGame,
                           onSelectAll,
                           onDeselectAll,
                           onSelectCategory,
                           onDeselectCategory,
                           onCreateFlashcard,
                           onCreateCategory,
                           disabled = false,
                           className = '',
                           ...props
                       }) => {
    const hasSelected = selectedCount > 0;

    // ✅ USAR LAS PROPS DIRECTAMENTE, NO RECALCULAR
    // Las props ya vienen calculadas desde FlashcardList

    return (
        <div className={`flex items-center justify-between gap-4 p-4 bg-white border-t border-gray-200 ${className}`} {...props}>
            {/* Botones de selección - TOGGLEABLES */}
            <div className="flex items-center gap-2">
                {/* Toggle para todas las cards */}
                {allSelected ? (
                    <Button
                        variant="secondary"
                        onClick={onDeselectAll}
                        disabled={disabled}
                        className="text-sm"
                    >
                        Deseleccionar todas ({totalCount})
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        onClick={onSelectAll}
                        disabled={disabled || totalCount === 0}
                        className="text-sm"
                    >
                        Seleccionar todas ({totalCount})
                    </Button>
                )}

                {/* Toggle para categoría actual */}
                {categoryTotalCount > 0 && (
                    categoryAllSelected ? (
                        <Button
                            variant="secondary"
                            onClick={onDeselectCategory}
                            disabled={disabled}
                            className="text-sm"
                        >
                            Deseleccionar categoría ({categoryTotalCount})
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={onSelectCategory}
                            disabled={disabled}
                            className="text-sm"
                        >
                            Seleccionar categoría ({categoryTotalCount})
                        </Button>
                    )
                )}
            </div>

            {/* Botones principales */}
            <div className="flex items-center gap-3">
                <Button
                    variant="secondary"
                    onClick={onCreateCategory}
                    disabled={disabled}
                >
                    + Nueva Categoría
                </Button>

                <Button
                    variant="secondary"
                    onClick={onCreateFlashcard}
                    disabled={disabled}
                >
                    + Nueva Flashcard
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="primary"
                        onClick={onStartGame}
                        disabled={!hasSelected || disabled}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-medium"
                    >
                        🎮 Empezar Juego
                        {hasSelected && (
                            <Badge variant="success" size="small">
                                {selectedCount}
                            </Badge>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ActionButtons;
