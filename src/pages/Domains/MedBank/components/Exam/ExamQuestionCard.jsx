import React from 'react';

const ExamQuestionCard = ({
                              examTitle,           // <-- Nuevo prop para el título del examen
                              question,
                              selected,
                              checked,
                              mode,
                              onSelect,
                              onCheck,
                              disabled
                          }) => (
    <div className="exam-question-card">
        {/* Header con el título del examen */}
        <div className="exam-question-header">
            {examTitle}
        </div>
        {/* Enunciado de la pregunta */}
        <div className="exam-question-enunciado">
            <strong>Pregunta:</strong> {question.content}
        </div>
        {/* Separador */}
        <hr className="exam-question-separator" />
        {/* Opciones */}
        <div className="exam-options">
            {question.options.map(option => {
                let className = "exam-option";
                if (selected === option.id) className += " selected";
                if (checked) {
                    if (option.is_correct) className += " correct";
                    else if (selected === option.id) className += " incorrect";
                }
                return (
                    <button
                        key={option.id}
                        className={className}
                        onClick={() => !checked && !disabled && onSelect(option.id)}
                        disabled={checked || disabled}
                    >
                        {option.content}
                    </button>
                );
            })}
        </div>
        {/* Feedback y explicación */}
        {mode === 'repaso' && checked && (
            <div className="exam-feedback">
                {question.options.find(opt => opt.is_correct && selected === opt.id)
                    ? <span className="success">¡Correcto!</span>
                    : <span className="error">Incorrecto. La respuesta correcta es: <b>{question.options.find(opt => opt.is_correct)?.content}</b></span>
                }
                <div className="exam-explanation">
                    <small>{question.explanation}</small>
                </div>
            </div>
        )}
    </div>
);

export default ExamQuestionCard;
