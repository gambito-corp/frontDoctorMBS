// src/pages/Domains/MedBank/components/DifficultySelect/DifficultySelect.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../../../../../hooks/useApi';
import '../../MedBank.css';

const DifficultySelect = ({
                              value,
                              onChange,
                              disabled = false,
                              placeholder = "Selecciona una dificultad",
                              className = "",
                              showDescriptions = true,
                              required = false
                          }) => {
    const [difficulties, setDifficulties] = useState([]);
    const [loadingDifficulties, setLoadingDifficulties] = useState(false);
    const [errorDifficulties, setErrorDifficulties] = useState(null);

    const { get } = useApi();

    useEffect(() => {
        loadDifficulties();
    }, []);

    const loadDifficulties = async () => {
        setLoadingDifficulties(true);
        setErrorDifficulties(null);

        try {
            const result = await get('medbank/difficulties');
            if (result.success) {
                setDifficulties(result.data.data);
                console.log('✅ Dificultades cargadas en componente:', result.data.data);
            } else {
                throw new Error(result.message || 'Error al cargar dificultades');
            }
        } catch (err) {
            console.error('❌ Error al cargar dificultades:', err);
            setErrorDifficulties(err.message || 'Error desconocido');
        } finally {
            setLoadingDifficulties(false);
        }
    };

    const handleChange = (event) => {
        const selectedId = event.target.value;
        const selectedDifficulty = difficulties.find(d => d.id === selectedId);
        onChange(event, selectedDifficulty);
    };

    if (errorDifficulties) {
        return (
            <div className="difficulty-select-error">
                <label>Nivel de Dificultad {required && <span className="required">*</span>}</label>
                <div className="error-container">
                    <span>❌ Error: {errorDifficulties}</span>
                    <button
                        onClick={loadDifficulties}
                        className="retry-button"
                        type="button"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`difficulty-select-container ${className}`}>
            <label htmlFor="difficulty-select">
                Nivel de Dificultad {required && <span className="required">*</span>}
            </label>
            <select
                id="difficulty-select"
                value={value || ''}
                onChange={handleChange}
                className="difficulty-select"
                disabled={disabled || loadingDifficulties}
                required={required}
            >
                <option value="" disabled>
                    {loadingDifficulties ? 'Cargando dificultades...' : placeholder}
                </option>

                {difficulties
                    .filter(difficulty => difficulty.unlocked)
                    .map((difficulty) => (
                        <option key={difficulty.id} value={difficulty.id}>
                            {difficulty.name}
                            {showDescriptions && ` - ${difficulty.description}`}
                        </option>
                    ))
                }

                {/* Mostrar dificultades bloqueadas si las hay */}
                {difficulties.filter(d => !d.unlocked).length > 0 && (
                    <optgroup label="🔒 Bloqueadas">
                        {difficulties
                            .filter(difficulty => !difficulty.unlocked)
                            .map((difficulty) => (
                                <option key={difficulty.id} value={difficulty.id} disabled>
                                    🔒 {difficulty.name} (Bloqueada)
                                </option>
                            ))
                        }
                    </optgroup>
                )}
            </select>

            {/* Mostrar descripción completa de la dificultad seleccionada */}
            {value && showDescriptions && (
                <div className="difficulty-description">
                    <strong>Descripción:</strong> {difficulties.find(d => d.id === value)?.description}
                </div>
            )}

            {loadingDifficulties && (
                <div className="difficulty-loading">
                    ⏳ Cargando dificultades...
                </div>
            )}
        </div>
    );
};

export default DifficultySelect;
