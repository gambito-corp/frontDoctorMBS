import React, { useState, useEffect } from 'react';
import { useApi } from '../../../../hooks/useApi';
import StepIndicator from '../components/common/steps/StepIndicator';
import AreaSelection from '../components/common/steps/AreaSelection';
import CategorySelection from '../components/common/steps/CategorySelection';
import TipoSelection from '../components/common/steps/TipoSelection';
import ExamConfiguration from '../components/common/steps/ExamConfiguration';
import ConfigurationSummary from '../components/common/steps/ConfigurationSummary';
import '../MedBank.css';

const AIExamConfig = ({ onBack }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        selectedArea: null,
        selectedCategory: null,
        selectedTipo: null,
        numQuestions: 10,
        difficulty: '',
        university: null
    });

    // NUEVO: Array para almacenar múltiples configuraciones
    const [savedConfigurations, setSavedConfigurations] = useState([]);
    const [universities, setUniversities] = useState([]);
    const { get, post, loading } = useApi();

    const steps = [
        { id: 1, title: 'Área', description: 'Selecciona el área de estudio' },
        { id: 2, title: 'Categoría', description: 'Elige la categoría específica' },
        { id: 3, title: 'Tipo', description: 'Define el tipo de preguntas' },
        { id: 4, title: 'Configuración', description: 'Configura tu examen' }
    ];

    useEffect(() => {
        loadUniversities();
    }, []);

    const loadUniversities = async () => {
        try {
            const result = await get('medbank/universities');
            if (result?.success && result?.data?.data && Array.isArray(result.data.data)) {
                setUniversities(result.data.data);
            } else if (result?.success && Array.isArray(result.data)) {
                setUniversities(result.data);
            }
        } catch (err) {
            console.error('❌ Error al cargar universidades:', err);
        }
    };

    const handleStepData = (stepKey, value) => {
        setFormData(prev => ({ ...prev, [stepKey]: value }));

        if (stepKey === 'selectedArea') {
            setFormData(prev => ({
                ...prev,
                selectedArea: value,
                selectedCategory: null,
                selectedTipo: null
            }));
        }

        if (stepKey === 'selectedCategory') {
            setFormData(prev => ({
                ...prev,
                selectedCategory: value,
                selectedTipo: null
            }));
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const canProceedToNext = () => {
        switch (currentStep) {
            case 1: return formData.selectedArea !== null;
            case 2: return formData.selectedCategory !== null;
            case 3: return formData.selectedTipo !== null;
            case 4: return formData.numQuestions > 0 && formData.difficulty !== '';
            default: return false;
        }
    };

    const getTotalQuestions = () => {
        return savedConfigurations.reduce((total, config) => total + config.numQuestions, 0);
    };

    const canAddMoreConfigurations = () => {
        const currentTotal = getTotalQuestions();
        return currentTotal + formData.numQuestions <= 200;
    };

    const handleAddConfiguration = () => {
        if (!canAddMoreConfigurations()) {
            alert('No puedes agregar más configuraciones. El máximo total es 200 preguntas.');
            return;
        }

        const currentConfig = {
            area: formData.selectedArea,
            category: formData.selectedCategory,
            tipo: formData.selectedTipo,
            difficulty: formData.difficulty,
            university: formData.university
        };

        // NUEVO: Buscar si ya existe una configuración idéntica
        const existingConfigIndex = savedConfigurations.findIndex(config =>
            areConfigurationsEqual(config, currentConfig)
        );

        if (existingConfigIndex !== -1) {
            // SUMAR a la configuración existente
            setSavedConfigurations(prev => {
                const updated = [...prev];
                updated[existingConfigIndex] = {
                    ...updated[existingConfigIndex],
                    numQuestions: updated[existingConfigIndex].numQuestions + formData.numQuestions
                };
                return updated;
            });

            console.log('✅ Configuración sumada a la existente');
        } else {
            // CREAR nueva configuración
            const newConfig = {
                id: Date.now(),
                area: formData.selectedArea,
                category: formData.selectedCategory,
                tipo: formData.selectedTipo,
                numQuestions: formData.numQuestions,
                difficulty: formData.difficulty,
                university: formData.university
            };

            setSavedConfigurations(prev => [...prev, newConfig]);
            console.log('✅ Nueva configuración agregada:', newConfig);
        }

        // Resetear formulario y volver al paso 1
        setFormData({
            selectedArea: null,
            selectedCategory: null,
            selectedTipo: null,
            numQuestions: 10,
            difficulty: '',
            university: null
        });

        setCurrentStep(1);
    };

    const handleRemoveConfiguration = (configId) => {
        setSavedConfigurations(prev => prev.filter(config => config.id !== configId));
    };

    const handleGenerateExam = async (mode = 'current') => {
        try {
            let examData;

            if (mode === 'current') {
                // MODO NORMAL: Solo la configuración actual
                if (!formData.selectedArea || !formData.selectedCategory || !formData.selectedTipo || !formData.difficulty) {
                    alert('Por favor, completa todos los campos de la configuración');
                    return;
                }

                examData = {
                    area_id: formData.selectedArea.id,
                    category_id: formData.selectedCategory.id,
                    tipo_id: formData.selectedTipo.id,
                    num_questions: formData.numQuestions,
                    difficulty: formData.difficulty,
                    university_id: formData.university?.id || null
                };

                const result = await post('medbank/generate-exam/', examData);

                if (result?.success) {
                    console.log('✅ Examen normal generado:', result.data);
                    alert(`¡Examen generado exitosamente con ${formData.numQuestions} preguntas!`);
                }

            } else if (mode === 'mixed') {
                // MODO MIXTO: Configuraciones guardadas + actual (si está completa)
                let allConfigurations = [...savedConfigurations];

                // Si hay una configuración actual completa, agregarla
                if (formData.selectedArea && formData.selectedCategory && formData.selectedTipo && formData.difficulty) {
                    const currentConfig = {
                        area_id: formData.selectedArea.id,
                        category_id: formData.selectedCategory.id,
                        tipo_id: formData.selectedTipo.id,
                        num_questions: formData.numQuestions,
                        difficulty: formData.difficulty,
                        university_id: formData.university?.id || null
                    };
                    allConfigurations.push(currentConfig);
                } else {
                    // Solo usar configuraciones guardadas
                    allConfigurations = savedConfigurations.map(config => ({
                        area_id: config.area.id,
                        category_id: config.category.id,
                        tipo_id: config.tipo.id,
                        num_questions: config.numQuestions,
                        difficulty: config.difficulty,
                        university_id: config.university?.id || null
                    }));
                }

                const totalQuestionsForExam = allConfigurations.reduce((total, config) => total + config.num_questions, 0);

                examData = {
                    configurations: allConfigurations,
                    total_questions: totalQuestionsForExam
                };

                console.log('📤 Generando examen mixto:', examData);
                const result = await post('medbank/generate-mixed-exam', examData);

                if (result?.success) {
                    console.log('✅ Examen mixto generado:', result.data);
                    alert(`¡Examen mixto generado exitosamente con ${totalQuestionsForExam} preguntas!`);
                }
            }

        } catch (err) {
            console.error('❌ Error al generar examen:', err);
            alert('Error al generar el examen: ' + err.message);
        }
    };

    const areConfigurationsEqual = (config1, config2) => {
        return (
            config1.area.id === config2.area.id &&
            config1.category.id === config2.category.id &&
            config1.tipo.id === config2.tipo.id &&
            config1.difficulty === config2.difficulty &&
            config1.university?.id === config2.university?.id
        );
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <AreaSelection
                        selectedArea={formData.selectedArea}
                        onAreaSelect={(area) => handleStepData('selectedArea', area)}
                        onAutoAdvance={nextStep}
                        type={'ai'}
                    />
                );
            case 2:
                return (
                    <CategorySelection
                        selectedCategory={formData.selectedCategory}
                        onCategorySelect={(category) => handleStepData('selectedCategory', category)}
                        selectedArea={formData.selectedArea}
                        onAutoAdvance={nextStep}
                        type={'ai'}
                    />
                );
            case 3:
                return (
                    <TipoSelection
                        selectedTipo={formData.selectedTipo}
                        onTipoSelect={(tipo) => handleStepData('selectedTipo', tipo)}
                        selectedCategory={formData.selectedCategory}
                        onAutoAdvance={nextStep}
                        type={'ai'}
                    />
                );
            case 4:
                return (
                    <ExamConfiguration
                        formData={formData}
                        universities={universities}
                        onDataChange={handleStepData}
                        onAddConfiguration={handleAddConfiguration}
                        onGenerateExam={handleGenerateExam}
                        savedConfigurations={savedConfigurations}
                        totalQuestions={getTotalQuestions()}
                        canAddMore={canAddMoreConfigurations()}
                        loading={loading}
                        type={'ai'}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="standard-exam-config">
            <div className="config-header">
                <button onClick={onBack} className="back-button">
                    ← Volver a Selección de Exámenes
                </button>
                <h2>📚 Banco de Preguntas Estándar</h2>
                <p>Configura tu examen paso a paso. Puedes agregar múltiples configuraciones hasta 200 preguntas.</p>
            </div>

            <div className="step-container">
                <StepIndicator
                    steps={steps}
                    currentStep={currentStep}
                    completedSteps={currentStep - 1}
                />

                <div className="step-content">
                    <div className="step-header">
                        <h3>{steps[currentStep - 1].title}</h3>
                        <p>{steps[currentStep - 1].description}</p>
                        {savedConfigurations.length > 0 && (
                            <div className="progress-info">
                                <span className="progress-text">
                                    Configuraciones guardadas: {savedConfigurations.length} |
                                    Total preguntas: {getTotalQuestions()}/200
                                </span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${(getTotalQuestions() / 200) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="step-body">
                        {renderCurrentStep()}
                    </div>

                    <div className="step-navigation">
                        <div className="nav-buttons">
                            {currentStep > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="nav-button prev-button"
                                    disabled={loading}
                                >
                                    ← Anterior
                                </button>
                            )}

                            {currentStep < steps.length && (
                                <button
                                    onClick={nextStep}
                                    className="nav-button next-button"
                                    disabled={!canProceedToNext() || loading}
                                >
                                    Siguiente →
                                </button>
                            )}
                        </div>

                        <div className="step-info">
                            Paso {currentStep} de {steps.length}
                        </div>
                    </div>
                </div>
            </div>
            {/* NUEVO: Mostrar resumen de configuraciones guardadas */}
            {savedConfigurations.length > 0 && (
                <ConfigurationSummary
                    configurations={savedConfigurations}
                    totalQuestions={getTotalQuestions()}
                    onRemoveConfiguration={handleRemoveConfiguration}
                />
            )}
        </div>
    );
};
export default AIExamConfig;