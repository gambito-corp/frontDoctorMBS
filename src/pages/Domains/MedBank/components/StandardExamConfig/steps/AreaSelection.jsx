// src/pages/Domains/MedBank/components/StandardExamConfig/steps/AreaSelection.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../../../../../../hooks/useApi';

const AreaSelection = ({ selectedArea, onAreaSelect, onAutoAdvance }) => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [areaCounts, setAreaCounts] = useState({});

    const { get } = useApi();

    useEffect(() => {
        loadAreas();
    }, []);

    const loadAreas = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await get('medbank/areas?type=standard');
            if (result?.success && result?.data?.data && Array.isArray(result.data.data)) {
                setAreas(result.data.data);
            } else {
                throw new Error('Respuesta inválida del servidor');
            }
        } catch (err) {
            setError(err.message || 'Error al cargar áreas');
            setAreas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAreaSelect = (area) => {
        onAreaSelect(area);
        setTimeout(() => {
            onAutoAdvance();
        }, 500);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando áreas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>❌ {error}</p>
                <button onClick={loadAreas} className="retry-button">
                    Reintentar
                </button>
            </div>
        );
    }

    // Filtrar áreas que tienen conteos cargados
    const areasWithCounts = areas.filter(area => areaCounts[area.id] > 0);

    if (areasWithCounts.length === 0 && Object.keys(areaCounts).length > 0) {
        return (
            <div className="empty-state">
                <p>No hay áreas con preguntas disponibles</p>
            </div>
        );
    }

    return (
        <div className="selection-container">
            <div className="selection-grid-compact">
                {areas
                    .filter(area => area.questions_count > 0)
                    .map((area) => (
                        <div
                            key={area.id}
                            className={`selection-card-compact ${
                                selectedArea?.id === area.id ? 'selected' : ''
                            }`}
                            onClick={() => handleAreaSelect(area)}
                        >
                            <h4 className="card-title-compact">{area.name}</h4>
                            {area.description && (
                                <p className="card-description-compact">{area.description}</p>
                            )}
                            <div className="question-count-badge">
                                {area.questions_count} pregunta{area.questions_count !== 1 ? 's' : ''}
                            </div>
                            {selectedArea?.id === area.id && (
                                <div className="selected-indicator-compact">✓</div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default AreaSelection;
