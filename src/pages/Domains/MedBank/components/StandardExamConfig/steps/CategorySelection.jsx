import React, { useState, useEffect } from 'react';
import { useApi } from '../../../../../../hooks/useApi';

const CategorySelection = ({ selectedCategory, onCategorySelect, selectedArea, onAutoAdvance }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { get } = useApi();

    useEffect(() => {
        if (selectedArea?.id) {
            loadCategories();
        }
    }, [selectedArea]);

    const loadCategories = async () => {
        if (!selectedArea?.id) return;
        setLoading(true);
        setError(null);
        try {
            const result = await get(`medbank/categories?type=standard&area_id=${selectedArea.id}`);
            if (result?.success && result?.data?.data && Array.isArray(result.data.data)) {
                setCategories(result.data.data);
            } else {
                throw new Error('Respuesta inválida del servidor');
            }
        } catch (err) {
            setError(err.message || 'Error al cargar categorías');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (category) => {
        onCategorySelect(category);
        setTimeout(() => {
            onAutoAdvance();
        }, 500);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando categorías para {selectedArea?.name}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>❌ {error}</p>
                <button onClick={loadCategories} className="retry-button">
                    Reintentar
                </button>
            </div>
        );
    }

    // Solo mostrar categorías con preguntas disponibles
    const filteredCategories = categories.filter(cat => cat.questions_count > 0);

    if (filteredCategories.length === 0) {
        return (
            <div className="empty-state">
                <p>No hay categorías disponibles para el área seleccionada</p>
                <small>Área: {selectedArea?.name}</small>
            </div>
        );
    }

    return (
        <div className="selection-container">
            <div className="selection-info">
                <p>Área seleccionada: <strong>{selectedArea?.name}</strong></p>
            </div>
            <div className="selection-grid-compact">
                {filteredCategories.map((category) => (
                    <div
                        key={category.id}
                        className={`selection-card-compact ${
                            selectedCategory?.id === category.id ? 'selected' : ''
                        }`}
                        onClick={() => handleCategorySelect(category)}
                    >
                        <h4 className="card-title-compact">{category.name}</h4>
                        {category.description && (
                            <p className="card-description-compact">{category.description}</p>
                        )}
                        <div className="question-count-badge">
                            {category.questions_count} pregunta{category.questions_count !== 1 ? 's' : ''}
                        </div>
                        {selectedCategory?.id === category.id && (
                            <div className="selected-indicator-compact">✓</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategorySelection;
