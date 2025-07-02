// src/pages/Domains/MedBank/components/StandardExamConfig/StepIndicator.jsx
import React from 'react';

const StepIndicator = ({ steps, currentStep, completedSteps }) => {
    return (
        <div className="step-indicator">
            {steps.map((step, index) => (
                <div key={step.id} className="step-item">
                    <div className={`step-circle ${
                        index + 1 <= completedSteps ? 'completed' :
                            index + 1 === currentStep ? 'active' : 'inactive'
                    }`}>
                        {index + 1 <= completedSteps ? '✓' : step.id}
                    </div>
                    <div className="step-label">
                        <span className="step-title">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`step-connector ${
                            index + 1 < currentStep ? 'completed' : 'inactive'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default StepIndicator;
