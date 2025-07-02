import React from 'react';

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const ExamTimer = ({ timeLeft }) => (
    <div className="exam-timer">
        Tiempo restante: <strong>{formatTime(timeLeft)}</strong>
    </div>
);

export default ExamTimer;
