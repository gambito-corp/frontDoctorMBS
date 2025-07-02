import React from 'react';

const ExamModeSwitch = ({ mode, onChange }) => (
    <div className="exam-mode-switch">
        <label>
            <input
                type="radio"
                name="exam-mode"
                value="repaso"
                checked={mode === 'repaso'}
                onChange={() => onChange('repaso')}
            />
            Modo Repaso
        </label>
        <label>
            <input
                type="radio"
                name="exam-mode"
                value="examen"
                checked={mode === 'examen'}
                onChange={() => onChange('examen')}
            />
            Modo Examen
        </label>
    </div>
);

export default ExamModeSwitch;
