import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../../../../hooks/useApi';
import { usePremiumAccess } from '../../../../../../hooks/usePremiumAccess';
import DifficultySelect from '../DifficultySelect/DifficultySelect';
import PremiumModal from '../../../../../../components/PremiumModal';

const ExamConfiguration = ({
                               formData,
                               onDataChange,
                               onAddConfiguration,
                               savedConfigurations,
                               totalQuestions,
                               canAddMore,
                               loading,
                               type // <-- Añade esta prop
                           }) => {
    const [availableQuestions, setAvailableQuestions] = useState(null);
    const [loadingCount, setLoadingCount] = useState(false);
    const [countError, setCountError] = useState(null);
    const [examTitle, setExamTitle] = useState('Examen personalizado');
    const [examDuration, setExamDuration] = useState(60); // minutos por defecto

    const [universities, setUniversities] = useState([]);
    const [loadingUniversities, setLoadingUniversities] = useState(false);
    const [universitiesError, setUniversitiesError] = useState(null);

    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const [examError, setExamError] = useState(null);
    const [generatingExam, setGeneratingExam] = useState(false);
    const navigate = useNavigate();
    const isPremium = usePremiumAccess();
    const { get, post } = useApi();

    useEffect(() => {
        loadUniversities();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (
            formData.selectedArea &&
            formData.selectedCategory &&
            formData.selectedTipo &&
            ['standard', 'personal-failed', 'global-failed'].includes(type) // Solo para estos tipos
        ) {
            loadAvailableQuestionsCount();
        } else {
            setAvailableQuestions(null);
        }
        // eslint-disable-next-line
    }, [formData.selectedArea, formData.selectedCategory, formData.selectedTipo, formData.difficulty, formData.university, type]);

    useEffect(() => {
        if (availableQuestions !== null && formData.numQuestions > availableQuestions) {
            onDataChange('numQuestions', Math.max(1, availableQuestions));
        }
        // eslint-disable-next-line
    }, [availableQuestions, formData.numQuestions, onDataChange]);

    const handleTitleChange = (e) => setExamTitle(e.target.value);

    const handleDurationChange = (e) => {
        let val = parseInt(e.target.value) || 1;
        if (val < 1) val = 1;
        if (val > 300) val = 300; // máximo 5 horas
        setExamDuration(val);
    };

    const loadUniversities = async () => {
        setLoadingUniversities(true);
        setUniversitiesError(null);

        try {
            const result = await get('medbank/universidades');
            if (result?.success && result?.data?.data && Array.isArray(result.data.data)) {
                setUniversities(result.data.data);
            } else {
                throw new Error('Respuesta inválida del servidor para universidades');
            }
        } catch (err) {
            setUniversitiesError(err.message || 'Error al cargar universidades');
            setUniversities([]);
        } finally {
            setLoadingUniversities(false);
        }
    };

    const loadAvailableQuestionsCount = async () => {
        setLoadingCount(true);
        setCountError(null);

        try {
            const params = new URLSearchParams({
                tipo_id: formData.selectedTipo.id,
            });

            if (formData.difficulty) {
                params.append('difficulty', formData.difficulty);
            }
            if (formData.university?.id) {
                params.append('university_id', formData.university.id);
            }

            if (type === 'personal-failed' || type === 'global-failed') {
                params.append('failed_type', type);
            }

            const result = await get(`medbank/counting-questions?${params.toString()}`);
            if (result?.success) {
                const count = result.data.data.count;
                setAvailableQuestions(count);
            } else {
                throw new Error('Error al obtener el contador');
            }
        } catch (err) {
            setCountError('Error al cargar');
            setAvailableQuestions(null);
        } finally {
            setLoadingCount(false);
        }
    };

    const handleNumQuestionsChange = (event) => {
        const value = parseInt(event.target.value) || 1;
        let finalMax = maxQuestionsAllowed;          // ya incluye cap por usuario
        if (availableQuestions !== null && availableQuestions < finalMax) {
            finalMax = availableQuestions;
        }
        const clampedValue = Math.min(Math.max(value, 1), finalMax);
        onDataChange('numQuestions', clampedValue);
    };

    const handleDifficultyChange = (event, difficultyData) => {
        onDataChange('difficulty', event.target.value);
    };

    const handleUniversityChange = (event) => {
        const universityId = event.target.value;
        const university = universities.find(u => u.id.toString() === universityId);
        onDataChange('university', university || null);
    };

    const userCap          = isPremium ? 200 : 10;               // 200 ó 10
    const maxQuestionsAllowed = Math.min(userCap, 200 - totalQuestions);
    const currentConfigQuestions = formData.difficulty ? formData.numQuestions : 0;
    const totalWithCurrent = totalQuestions + currentConfigQuestions;

    const isCurrentConfigComplete = formData.selectedArea &&
        formData.selectedCategory &&
        formData.selectedTipo &&
        formData.difficulty;

    const isMixedMode = savedConfigurations.length > 0;
    const totalQuestionsForButton = isMixedMode ? totalWithCurrent : currentConfigQuestions;

    const getRealMaxQuestions = () => {
        if (availableQuestions === null) return maxQuestionsAllowed;
        return Math.min(maxQuestionsAllowed, availableQuestions);
    };

    const getBadgeColor = () => {
        if (availableQuestions === null || loadingCount) return 'gray';
        if (availableQuestions === 0) return 'red';
        if (availableQuestions < 10) return 'orange';
        if (availableQuestions < 50) return 'yellow';
        return 'green';
    };

    const handleGenerateExam = async () => {
        setExamError(null);

        /* 1. ¿cuántas preguntas se van a generar? */
        const questionsRequested = isMixedMode
            ? totalWithCurrent           // configuraciones guardadas + actual
            : formData.numQuestions;     // solo configuración actual

        /* 2. Si NO es premium y supera 10 → mostrar modal y salir */
        if (!isPremium && questionsRequested > 10) {
            setShowPremiumModal(true);
            return;
        }

        /* 3. Validaciones habituales ----------------------------------- */
        if (!formData.difficulty) {
            alert('⚠️ Selecciona una dificultad antes de generar el examen.');
            return;
        }
        if (!isCurrentConfigComplete) {
            alert('Completa todos los campos de la configuración actual.');
            return;
        }
        if (
            ['standard','personal-failed','global-failed'].includes(type) &&
            availableQuestions !== null &&
            (availableQuestions === 0 || availableQuestions < formData.numQuestions)
        ) {
            alert('⚠️ No hay suficientes preguntas disponibles para esta configuración.');
            return;
        }

        /* 4. Construir payload y llamar al backend ---------------------- */
        setGeneratingExam(true);

        try {
            const currentConfig = {
                area_id      : formData.selectedArea.id,
                category_id  : formData.selectedCategory.id,
                tipo_id      : formData.selectedTipo.id,
                num_questions: formData.numQuestions,
                difficulty   : formData.difficulty,
                university_id: formData.university?.id ?? null,
            };

            const payload = isMixedMode
                ? {
                    title         : examTitle,
                    duration      : examDuration,
                    mode          : type,
                    current_config: currentConfig,
                    saved_configs : [
                        ...savedConfigurations.map(cfg => ({
                            area_id      : cfg.area.id,
                            category_id  : cfg.category.id,
                            tipo_id      : cfg.tipo.id,
                            num_questions: cfg.numQuestions,
                            difficulty   : cfg.difficulty,
                            university_id: cfg.university?.id ?? null,
                        })),
                    ],
                }
                : {
                    title         : examTitle,
                    duration      : examDuration,
                    mode          : type,
                    current_config: currentConfig,
                };


            /** ───────── Función auxiliar con reintento ───────── **/
            const generateExamWithRetry = async (maxRetries = 3) => {
                let attempt = 0;

                while (attempt < maxRetries) {
                    attempt += 1;

                    try {
                        const res = await post(`medbank/generate-exam/${type}`, payload);

                        const { success, data, message } = res?.data ?? {};
                        const examId = data?.exam_id;

                        if (success && examId) {
                            return examId;                      // ← éxito
                        }

                        throw new Error(message || 'Sin exam_id');
                    } catch (err) {
                        if (attempt === maxRetries) throw err; // ← se agotaron intentos
                        await new Promise(r => setTimeout(r, 800 * attempt)); // back-off lineal
                    }
                }
            };

            /** ───────── Llamada principal ───────── **/
            const examId = await generateExamWithRetry(3);
            navigate(`/medbank/${examId}`);
            return;

        } catch (err) {
            const msg = err.message || 'No fue posible generar el examen';
            alert(`Error al generar el examen: ${msg}`);
            setExamError(msg);
        } finally {
            setGeneratingExam(false);
        }
    };


    return (
        <div className="configuration-container">
            {/* Resumen de selección actual */}
            <div className="selection-summary">
                <h4>Configuración actual:</h4>
                <div className="summary-items">
                    <div className="summary-item">
                        <span className="summary-label">Área:</span>
                        <span className="summary-value">{formData.selectedArea?.name}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Categoría:</span>
                        <span className="summary-value">{formData.selectedCategory?.name}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Tipo:</span>
                        <span className="summary-value">{formData.selectedTipo?.name}</span>
                    </div>
                </div>
            </div>

            {/* Información de límites */}
            {totalQuestions > 0 && (
                <div className="limits-info">
                    <p><strong>Preguntas ya guardadas:</strong> {totalQuestions}/200</p>
                    {isCurrentConfigComplete && (
                        <p><strong>Configuración actual:</strong> {currentConfigQuestions} preguntas</p>
                    )}
                    <p><strong>Límite del sistema:</strong> {maxQuestionsAllowed} preguntas disponibles</p>
                    {['standard', 'personal-failed', 'global-failed'].includes(type) && availableQuestions !== null && (
                        <p><strong>Preguntas en BD:</strong> {availableQuestions} preguntas con filtros actuales</p>
                    )}
                </div>
            )}

            {/* Configuración del examen */}
            <div className="config-form">
                {/* Número de preguntas */}
                <div className="form-group">
                    <label htmlFor="exam-title">
                        Título del examen <span className="required">*</span>
                    </label>
                    <input
                        id="exam-title"
                        type="text"
                        value={examTitle}
                        onChange={handleTitleChange}
                        className="form-input"
                        maxLength={255}
                        required
                        disabled={loading || generatingExam}
                        placeholder="Ej: Examen de Anatomía"
                    />
                    <label htmlFor="exam-duration">
                        Duración (minutos) <span className="required">*</span>
                    </label>
                    <input
                        id="exam-duration"
                        type="number"
                        min={1}
                        max={300}
                        value={examDuration}
                        onChange={handleDurationChange}
                        className="form-input"
                        required
                        disabled={loading || generatingExam}
                        placeholder="Ej: 60"
                    />
                    <small className="form-help">
                        Entre 1 y 300 minutos (máximo 5 horas)
                    </small>
                    <label htmlFor="num-questions">
                        Número de preguntas <span className="required">*</span>
                    </label>
                    <input
                        id="num-questions"
                        type="number"
                        min="1"
                        max={getRealMaxQuestions()}
                        value={formData.numQuestions}
                        onChange={handleNumQuestionsChange}
                        className="form-input"
                        disabled={loading}
                    />
                    <small className="form-help">
                        Mínimo 1, máximo {getRealMaxQuestions()} preguntas
                        {['standard', 'personal-failed', 'global-failed'].includes(type) && availableQuestions !== null && availableQuestions < maxQuestionsAllowed && (
                            <span className="availability-note"> (limitado por disponibilidad en BD)</span>
                        )}
                    </small>

                    {/* Badge de preguntas disponibles */}
                    {['standard', 'personal-failed', 'global-failed'].includes(type) &&
                        formData.selectedArea && formData.selectedCategory && formData.selectedTipo && (
                            <div className="questions-badge-container">
                                <div className={`questions-available-badge badge-${getBadgeColor()}`}>
                                    {loadingCount ? (
                                        <span className="badge-loading">
                                            <span className="mini-spinner"></span>
                                            Consultando BD...
                                        </span>
                                    ) : countError ? (
                                        <span className="badge-error">
                                            ❌ {countError}
                                            <button
                                                onClick={loadAvailableQuestionsCount}
                                                className="retry-mini-button"
                                            >
                                                🔄
                                            </button>
                                        </span>
                                    ) : availableQuestions !== null ? (
                                        <span className="badge-content">
                                            <span className="badge-icon">📊</span>
                                            <span className="badge-text">
                                                {availableQuestions} pregunta{availableQuestions !== 1 ? 's' : ''} en BD
                                            </span>
                                        </span>
                                    ) : null}
                                </div>

                                {/* Información adicional */}
                                {availableQuestions !== null && !loadingCount && (
                                    <div className="badge-info">
                                        <span>Filtros aplicados:</span>
                                        {formData.difficulty && (
                                            <span> Dificultad: {formData.difficulty}</span>
                                        )}
                                        {formData.university && (
                                            <span> • Universidad: {formData.university.name}</span>
                                        )}
                                        {!formData.difficulty && !formData.university && (
                                            <span> Ninguno (todas las preguntas del tipo)</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                </div>

                {/* Selector de dificultad */}
                <div className="form-group">
                    <DifficultySelect
                        value={formData.difficulty}
                        onChange={handleDifficultyChange}
                        disabled={loading}
                        placeholder="Selecciona la dificultad"
                        showDescriptions={true}
                        required={true}
                    />
                    {!formData.difficulty && (
                        <div className="difficulty-warning">
                            ⚠️ <strong>Importante:</strong> Debes seleccionar una dificultad para que las preguntas se incluyan en el examen.
                        </div>
                    )}
                </div>

                {/* Selector de universidad (opcional) */}
                <div className="form-group">
                    <label htmlFor="university-select">
                        Universidad (opcional)
                    </label>
                    <select
                        id="university-select"
                        value={formData.university?.id || ''}
                        onChange={handleUniversityChange}
                        className="form-select"
                        disabled={loading || loadingUniversities}
                    >
                        <option value="">
                            {loadingUniversities ? 'Cargando universidades...' : 'Todas las universidades'}
                        </option>
                        {universities.map((university) => (
                            <option key={university.id} value={university.id}>
                                {university.name}
                            </option>
                        ))}
                    </select>
                    <small className="form-help">
                        Filtra preguntas por universidad específica
                        {universitiesError && (
                            <span className="error-text"> • Error: {universitiesError}</span>
                        )}
                    </small>
                </div>

                {/* Botones de acción */}
                <div className="action-buttons">
                    {canAddMore && totalWithCurrent < 200 && (
                        <button
                            onClick={onAddConfiguration}
                            disabled={loading || !isCurrentConfigComplete}
                            className="add-config-button"
                        >
                            ➕ Agregar Configuración y Continuar
                        </button>
                    )}

                    <button
                        onClick={handleGenerateExam}
                        disabled={loading || totalQuestionsForButton === 0 || (['standard', 'personal-failed', 'global-failed'].includes(type) && availableQuestions === 0) || generatingExam}
                        className={`generate-button ${isMixedMode ? 'mixed-mode' : 'normal-mode'}`}
                    >
                        {generatingExam ? 'Generando Examen...' :
                            `🎯 Generar Examen (${totalQuestionsForButton} preguntas)`}
                    </button>
                </div>

                {/* Información del modo actual */}
                <div className="mode-info">
                    {isMixedMode ? (
                        <div className="mixed-info">
                            <strong>Modo Mixto:</strong> Se generará un examen con las configuraciones guardadas + la configuración actual
                        </div>
                    ) : (
                        <div className="normal-info">
                            <strong>Modo Normal:</strong> Se generará un examen solo con la configuración actual
                        </div>
                    )}
                </div>

                {examError && <div className="error-message">{examError}</div>}

                {totalWithCurrent >= 200 && (
                    <div className="warning-message">
                        ⚠️ Has alcanzado el límite máximo de 200 preguntas.
                    </div>
                )}
            </div>
            {!isPremium && (
                <PremiumModal
                    isOpen={showPremiumModal}
                    onClose={() => setShowPremiumModal(false)}
                    featureName="crear exámenes de más de 10 preguntas"
                />
            )}
        </div>
    );
};

export default ExamConfiguration;
