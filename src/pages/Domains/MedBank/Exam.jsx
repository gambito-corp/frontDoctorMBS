import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExamStartModal from './components/Exam/ExamStartModal';
import ExamTimer from './components/Exam/ExamTimer';
import ExamQuestionCard from './components/Exam/ExamQuestionCard';
import ExamPagination from './components/Exam/ExamPagination';
import { useApi } from '../../../hooks/useApi';
import './components/Exam/Exam.css';

const Exam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const { get, post } = useApi();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showExitModal, setShowExitModal] = useState(false);

    const [showStartModal, setShowStartModal] = useState(true);
    const [mode, setMode] = useState('repaso'); // 'repaso' o 'examen'
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [checked, setChecked] = useState({}); // { [questionId]: true/false }
    const [timeLeft, setTimeLeft] = useState(0);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [pendingQuestions, setPendingQuestions] = useState(0);
    const [examFinished, setExamFinished] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [resultData, setResultData] = useState(null); // score, aciertos, etc.
    const [isAiExam, setIsAiExam] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            setLoading(true);
            try {
                const res = await get(`medbank/exam/${examId}`);
                if (res?.data?.success) {
                    setExam(res.data.data);
                    const q = res.data.data.questions && res.data.data.questions.length > 0
                        ? res.data.data.questions
                        : (res.data.data.ai_questions || []);
                    setQuestions(q);
                    setIsAiExam(!!(res.data.data.ai_questions && res.data.data.ai_questions.length > 0));
                    setTimeLeft((res.data.data.time_limit || 60) * 60);
                } else {
                    setError('No se pudo cargar el examen');
                }
            } catch (err) {
                setError('Error al cargar el examen: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [examId, get]);

    useEffect(() => {
        if (!showStartModal && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        }
        if (timeLeft === 0 && !showStartModal) {
            handleFinishExam();
        }
    }, [showStartModal, timeLeft]);

    const handleStart = () => setShowStartModal(false);

    const handleModeChange = (value) => setMode(value);

    const handleSelectOption = (questionId, optionId) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
        if (mode === 'repaso') {
            setChecked(prev => ({ ...prev, [questionId]: true }));
        }
    };

    const handleCheckAnswer = () => {
        setChecked(prev => ({ ...prev, [questions[current].id]: true }));
    };

    const handlePageChange = (idx) => setCurrent(idx);

    const handleExitExam = () => {
        setShowExitModal(true);
    };

    const confirmExitExam = () => {
        setShowExitModal(false);
        navigate('/dashboard'); // Cambia la ruta si tu dashboard es otra
    };

    const cancelExitExam = () => {
        setShowExitModal(false);
    };

    const handleFinishExam = () => {
        let unanswered = 0;
        if (mode === 'repaso') {
            // En repaso, consideramos corregidas las que están en checked
            unanswered = questions.filter(q => !checked[q.id]).length;
        } else {
            // En modo examen, consideramos respondidas las que están en answers
            unanswered = questions.filter(q => !answers[q.id]).length;
        }

        if (unanswered > 0) {
            setPendingQuestions(unanswered);
            setShowFinishModal(true);
        } else {
            // Lógica para finalizar examen directamente
            finalizarExamen();
        }
    };

    const confirmarFinalizar = () => {
        setShowFinishModal(false);
        finalizarExamen();
    };

    const cancelarFinalizar = () => {
        setShowFinishModal(false);
    };

    const finalizarExamen = async () => {
        try {
            const key = isAiExam ? 'ai_question_id' : 'question_id';

            const payload = {
                exam_id: examId,
                ai: isAiExam,
                answers: Object.entries(answers).map(([question_id, option_id]) => ({
                    [key]: Number(question_id),
                    option_id: Number(option_id)
                }))
            };


            const result = await post('medbank/resolve-exam', payload);
            if (result?.data?.success) {
                console.log(result?.data);
                setResultData(result.data.data);
                setExamFinished(true);
            } else {
                alert('Error al corregir el examen: ' + (result?.data?.message || 'Error desconocido'));
            }
        } catch (err) {
            alert('Error al enviar el examen: ' + err.message);
        }
    };
    const handleShowResults = () => {
        setShowResults(true);
    };

    if (loading) return <div className="loading-container">Cargando examen...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!exam || questions.length === 0) return <div>No hay preguntas para este examen</div>;

    return (
        <div className="exam-root">
            <ExamStartModal
                open={showStartModal}
                title={exam.title}
                timeLimit={exam.time_limit}
                onStart={handleStart}
                mode={mode}
                onModeChange={handleModeChange}
            />

            {!showStartModal && (
                <>
                    <div className="exam-header">
                        {!examFinished && (
                            <ExamTimer timeLeft={timeLeft} />
                        )}
                    </div>
                    <div className="exam-content">
                        <ExamQuestionCard
                            examTitle={exam.title}
                            question={questions[current]}
                            selected={answers[questions[current].id]}
                            checked={checked[questions[current].id]}
                            mode={mode}
                            onSelect={optionId => handleSelectOption(questions[current].id, optionId)}
                            onCheck={handleCheckAnswer}
                            disabled={examFinished}
                        />
                        <div className="exam-footer">
                            <button
                                onClick={() => setCurrent(c => Math.max(0, c - 1))}
                                disabled={current === 0}
                                className="btn"
                            >
                                Anterior
                            </button>
                            {mode === 'repaso' && !checked[questions[current].id] && (
                                <button
                                    onClick={handleCheckAnswer}
                                    className="btn btn-resolver"
                                >
                                    Resolver
                                </button>
                            )}
                            <button
                                onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
                                disabled={current === questions.length - 1}
                                className="btn"
                            >
                                Siguiente
                            </button>
                            {!examFinished ? (
                                <button
                                    onClick={handleFinishExam}
                                    className="btn btn-finalizar"
                                >
                                    Finalizar Examen
                                </button>
                            ) : (
                                <button
                                    onClick={handleShowResults}
                                    className="btn btn-ver-resultados"
                                >
                                    Ver Resultados
                                </button>
                            )}
                        </div>
                        <ExamPagination
                            questions={questions}
                            current={current}
                            answers={answers}
                            checked={checked}
                            mode={mode}
                            onPageChange={handlePageChange}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                            <button
                                className="btn btn-exit"
                                onClick={handleExitExam}
                            >
                                Salir del Examen
                            </button>
                        </div>
                    </div>
                    {showExitModal && (
                        <div className="exam-modal-overlay">
                            <div className="exam-modal">
                                <h3>¿Seguro que quieres salir?</h3>
                                <p>Si sales ahora, <strong>perderás todo el progreso</strong> de este examen.</p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                                    <button className="btn btn-exit" onClick={confirmExitExam}>
                                        Sí, salir y perder progreso
                                    </button>
                                    <button className="btn" onClick={cancelExitExam}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showFinishModal && (
                        <div className="exam-modal-overlay">
                            <div className="exam-modal">
                                <h3>¿Finalizar el examen?</h3>
                                <p>
                                    {pendingQuestions === 1
                                        ? 'Queda 1 pregunta sin responder/corregir.'
                                        : `Quedan ${pendingQuestions} preguntas sin responder/corregir.`}
                                    <br />
                                    ¿Seguro que quieres finalizar? No podrás cambiar tus respuestas después.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                                    <button className="btn btn-finalizar" onClick={confirmarFinalizar}>
                                        Sí, finalizar examen
                                    </button>
                                    <button className="btn" onClick={cancelarFinalizar}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showResults && (
                        <div className="exam-results-screen">
                            <h2>¡Examen Finalizado!</h2>
                            <p><strong>Puntuación:</strong> {resultData.score} / 100</p>
                            <p><strong>Aciertos:</strong> {resultData.aciertos} de {resultData.total}</p>
                            {/* Puedes mostrar más feedback aquí */}
                            <button className="btn" onClick={() => navigate('/dashboard')}>
                                Volver al Dashboard
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Exam;
