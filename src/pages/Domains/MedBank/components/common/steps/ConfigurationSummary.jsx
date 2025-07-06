// src/pages/Domains/MedBank/components/TypesExamConfig/steps/ConfigurationSummary.jsx
import React from 'react';

const ConfigurationSummary = ({ configurations, totalQuestions, onRemoveConfiguration }) => {
    if (configurations.length === 0) {
        return null;
    }

    // NUEVO: Función para obtener datos de la dificultad
    const getDifficultyInfo = (difficulty) => {
        const difficultyMap = {
            facil: {
                color: '#28a745',
                bgColor: '#d4edda',
                icon: '😊',
                label: 'Fácil'
            },
            medio: {
                color: '#ffc107',
                bgColor: '#fff3cd',
                icon: '🤔',
                label: 'Medio'
            },
            dificil: {
                color: '#fd7e14',
                bgColor: '#ffeaa7',
                icon: '😰',
                label: 'Difícil'
            },
            experto: {
                color: '#dc3545',
                bgColor: '#f8d7da',
                icon: '🔥',
                label: 'Extremo'
            },
            suicida: {
                color: '#6f42c1',
                bgColor: '#e2d9f3',
                icon: '💀',
                label: 'Suicidio'
            }
        };

        return difficultyMap[difficulty] || {
            color: '#6c757d',
            bgColor: '#f8f9fa',
            icon: '❓',
            label: difficulty
        };
    };

    return (
        <div className="configuration-summary-bottom">
            <div className="summary-header">
                <h3>📋 Configuraciones del Examen</h3>
                <div className="summary-stats">
                    <span className="config-count">{configurations.length} configuración{configurations.length !== 1 ? 'es' : ''}</span>
                    <span className="question-count">{totalQuestions} pregunta{totalQuestions !== 1 ? 's' : ''} total</span>
                    <span className="progress-indicator">{Math.round((totalQuestions / 200) * 100)}% del límite</span>
                </div>
            </div>

            <div className="configurations-scroll-container">
                {configurations.map((config, index) => {
                    const difficultyInfo = getDifficultyInfo(config.difficulty);

                    return (
                        <div key={config.id} className="config-item-compact">
                            <div className="config-info">
                                <div className="config-number">#{index + 1}</div>

                                <div className="config-details">
                                    <div className="config-main">
                                        <strong>{config.area.name}</strong> → {config.category.name} → {config.tipo.name}
                                    </div>

                                    <div className="config-meta">
                                        <span className="questions-badge">
                                            {config.numQuestions} pregunta{config.numQuestions !== 1 ? 's' : ''}
                                        </span>
                                        {config.university && (
                                            <span className="university-badge">
                                                🏫 {config.university.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* NUEVO: Badge de dificultad en el centro */}
                                <div className="difficulty-badge-container">
                                    <div
                                        className="difficulty-badge-custom"
                                        style={{
                                            backgroundColor: difficultyInfo.bgColor,
                                            color: difficultyInfo.color,
                                            border: `2px solid ${difficultyInfo.color}`
                                        }}
                                    >
                                        <span className="difficulty-icon">{difficultyInfo.icon}</span>
                                        <span className="difficulty-label">{difficultyInfo.label}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => onRemoveConfiguration(config.id)}
                                className="remove-config-button"
                                title="Eliminar configuración"
                            >
                                🗑️
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Barra de progreso visual */}
            <div className="progress-bar-container">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(totalQuestions / 200) * 100}%` }}
                    ></div>
                </div>
                <span className="progress-text">{totalQuestions}/200 preguntas</span>
            </div>
        </div>
    );
};

export default ConfigurationSummary;
