import React from 'react';
import ExamModeSwitch from './ExamModeSwitch';

const ExamStartModal = ({ open, title, timeLimit, mode, onModeChange, onStart }) => {
    if (!open) return null;
    return (
        <div className="exam-modal-overlay">
            <div className="exam-modal">
                <h2>Vas a empezar con el Test: <span>{title}</span></h2>
                <p>Tienes <strong>{timeLimit} minutos</strong> para completarlo.<br />
                    Una vez acabado el tiempo, el test se resolverá automáticamente.
                </p>
                <ExamModeSwitch mode={mode} onChange={onModeChange} />
                <div className="exam-mode-info-card">
                    {mode === 'repaso' ? (
                        <p>
                            <strong>Modo Repaso:</strong> Recibes feedback inmediato tras cada respuesta.
                        </p>
                    ) : (
                        <p>
                            <strong>Modo Examen:</strong> Solo verás las respuestas correctas al finalizar.
                        </p>
                    )}
                </div>
                <button className="btn btn-primary" onClick={onStart}>
                    Empezar examen
                </button>
            </div>
        </div>
    );
};

export default ExamStartModal;
