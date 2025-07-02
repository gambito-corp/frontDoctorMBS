import React, { useState, useEffect } from 'react';
import { useApi } from '../../../../../../hooks/useApi';

const TipoSelection = ({ selectedTipo, onTipoSelect, selectedCategory, onAutoAdvance }) => {
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { get } = useApi();

    useEffect(() => {
        if (selectedCategory?.id) {
            loadTipos();
        }
    }, [selectedCategory]);

    const loadTipos = async () => {
        if (!selectedCategory?.id) return;
        setLoading(true);
        setError(null);
        try {
            const result = await get(`medbank/tipos?type=standard&category_id=${selectedCategory.id}`);
            if (result?.success && result?.data?.data && Array.isArray(result.data.data)) {
                setTipos(result.data.data);
            } else {
                throw new Error('Respuesta inválida del servidor');
            }
        } catch (err) {
            setError(err.message || 'Error al cargar tipos');
            setTipos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTipoSelect = (tipo) => {
        onTipoSelect(tipo);
        setTimeout(() => {
            onAutoAdvance();
        }, 500);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando tipos para {selectedCategory?.name}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>❌ {error}</p>
                <button onClick={loadTipos} className="retry-button">
                    Reintentar
                </button>
            </div>
        );
    }

    // Solo mostrar tipos con preguntas disponibles
    const filteredTipos = tipos.filter(tipo => tipo.questions_count > 0);

    if (filteredTipos.length === 0) {
        return (
            <div className="empty-state">
                <p>No hay tipos con preguntas disponibles para la categoría seleccionada</p>
                <small>Categoría: {selectedCategory?.name}</small>
            </div>
        );
    }

    return (
        <div className="selection-container">
            <div className="selection-info">
                <p>Categoría seleccionada: <strong>{selectedCategory?.name}</strong></p>
            </div>
            <div className="selection-grid-compact">
                {filteredTipos.map((tipo) => (
                    <div
                        key={tipo.id}
                        className={`selection-card-compact ${
                            selectedTipo?.id === tipo.id ? 'selected' : ''
                        }`}
                        onClick={() => handleTipoSelect(tipo)}
                    >
                        <h4 className="card-title-compact">{tipo.name}</h4>
                        {tipo.description && (
                            <p className="card-description-compact">{tipo.description}</p>
                        )}
                        <div className="question-count-badge">
                            {tipo.questions_count} pregunta{tipo.questions_count !== 1 ? 's' : ''}
                        </div>
                        {selectedTipo?.id === tipo.id && (
                            <div className="selected-indicator-compact">✓</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TipoSelection;
