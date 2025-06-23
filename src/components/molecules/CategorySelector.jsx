import React from 'react';
import Label from '../atoms/Label';
import ToggleButton from '../atoms/ToggleButton';

const CategorySelector = ({
                              categories = [],
                              selectedCategories = [],
                              onChange,
                              className = ''
                          }) => {
    // ✅ FILTRAR CATEGORÍAS VÁLIDAS
    const validCategories = categories.filter(category =>
        category &&
        category.id !== undefined &&
        category.nombre !== undefined
    );

    const handleCategoryToggle = (categoryId) => {
        const newSelected = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];
        onChange(newSelected);
    };

    if (validCategories.length === 0) {
        return (
            <div className={`mb-4 ${className}`}>
                <Label>Categorías (opcional)</Label>
                <p className="text-gray-500 text-sm mt-2">
                    No tienes categorías creadas. Crea una categoría primero.
                </p>
            </div>
        );
    }

    return (
        <div className={`mb-4 ${className}`}>
            <Label>Categorías (opcional)</Label>
            <div
                className="mt-2 flex flex-wrap gap-2"
                role="group"
                aria-label="Seleccionar categorías"
            >
                {validCategories.map((category) => (
                    <ToggleButton
                        key={category.id}
                        id={`category-${category.id}`}
                        value={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onChange={handleCategoryToggle}
                        className="text-sm"
                    >
                        {category.nombre}
                    </ToggleButton>
                ))}
            </div>

            {/* Mostrar categorías seleccionadas */}
            {selectedCategories.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                    Seleccionadas: {selectedCategories.length} categoría{selectedCategories.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
};

export default CategorySelector;
