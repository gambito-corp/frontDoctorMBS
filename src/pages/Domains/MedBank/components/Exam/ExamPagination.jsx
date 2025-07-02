import React from 'react';

const ExamPagination = ({ questions, current, answers, checked, mode, onPageChange }) => (
    <div className="exam-pagination">
        {questions.map((q, idx) => {
            let className = "exam-page-badge";
            if (idx === current) className += " active";
            else if (checked[q.id]) {
                const isCorrect = q.options.find(opt => opt.is_correct)?.id === answers[q.id];
                className += isCorrect ? " correct" : " incorrect";
            } else if (answers[q.id]) {
                className += " answered";
            }
            return (
                <button
                    key={q.id}
                    className={className}
                    onClick={() => onPageChange(idx)}
                >
                    {idx + 1}
                </button>
            );
        })}
    </div>
);

export default ExamPagination;
