import React, { useState } from 'react';
import MedBankTypeSelector   from './components/MedBankTypeSelector';
import StandardExamConfig    from './ExamTypes/StandardExamConfig';
import AIExamConfig          from './ExamTypes/AIExamConfig';
import PdfExamConfig         from './ExamTypes/PdfExamConfig';
import PersonalFailedExamConfig from './ExamTypes/PersonalFailedExamConfig';
import GlobalFailedExamConfig   from './ExamTypes/GlobalFailedExamConfig';
import { useApi }            from '../../../hooks/useApi';
import { usePremiumAccess }  from '../../../hooks/usePremiumAccess';
import PremiumModal          from '../../../components/PremiumModal';
import { getUserType }       from '../../../utils/getUserType';
import { getUser }           from '../../../utils/tokens';

const PRO_EXAM_IDS = [3, 4, 5];
const TEMP_DISABLED_IDS = [];


const MedBank = () => {
    /* ───────────────── state ───────────────── */
    const [selectedExamType, setSelectedExamType] = useState(null);
    const [examConfigData,  setExamConfigData]    = useState(null);
    const [isLoadingConfig, setIsLoadingConfig]   = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    /* ──────────────── hooks ──────────────── */
    const { get, loading, error } = useApi();
    const { isPremium }           = usePremiumAccess();

    const user     = getUser();
    const userType = getUserType(JSON.parse(user));
    const isRoot = userType === 'root';


    /* Bloqueamos PDF (id 3) a todos excepto root */
    const disabledExamIds = isRoot ? [] : TEMP_DISABLED_IDS;

    /* ───────────────── handlers ───────────────── */
    const handleExamTypeSelect = async (examType) => {
        /* 1) bloqueo por Premium (no aplica a root) */
        if (PRO_EXAM_IDS.includes(examType.id) && !isPremium && !isRoot) {
            setShowPremiumModal(true);
            return;
        }

        setSelectedExamType(examType);
        setIsLoadingConfig(true);
        await fetchExamConfigData(examType);
        setIsLoadingConfig(false);
    };

    const fetchExamConfigData = async (examType) => {
        try {
            switch (examType.id) {
                case 1:
                    const st = await get('medbank/areas?type=standard');
                    if (st.success) setExamConfigData(st.data);
                    break;
                case 2:
                    const ai = await get('medbank/areas?type=ai');
                    if (ai.success) setExamConfigData(ai.data);
                    break;
                case 3:
                    setExamConfigData({ type: 'pdf' });
                    break;
                case 4:
                    const pf = await get('medbank/areas?type=personal-failed');
                    if (pf.success) setExamConfigData(pf.data);
                    break;
                case 5:
                    const gf = await get('medbank/areas?type=global-failed');
                    if (gf.success) setExamConfigData(gf.data);
                    break;
                default:
                    setExamConfigData(null);
            }
        } catch {
            setExamConfigData(null);
        }
    };

    const handleBackToSelection = () => {
        setSelectedExamType(null);
        setExamConfigData(null);
    };

    /* ──────────────── renders cortocircuito ──────────────── */
    if (
        selectedExamType &&
        PRO_EXAM_IDS.includes(selectedExamType.id) &&
        !isPremium &&
        !isRoot
    ) {
        /* usuario normal intenta colarse en un PRO */
        return (
            <PremiumModal
                isOpen
                onClose={() => {
                    setShowPremiumModal(false);
                    setSelectedExamType(null);
                }}
                featureName="esta función de examen Pro"
            />
        );
    }

    if (selectedExamType && (isLoadingConfig || loading)) {
        return <div className="min-h-screen py-20 text-center">Cargando…</div>;
    }

    /* rutas de configuración según tipo */
    if (selectedExamType && examConfigData) {
        const id = selectedExamType.id;
        if (id === 1) return <StandardExamConfig onBack={handleBackToSelection} />;
        if (id === 2) return <AIExamConfig        onBack={handleBackToSelection} />;
        if (id === 3) return <PdfExamConfig       onBack={handleBackToSelection} />;
        if (id === 4) return <PersonalFailedExamConfig onBack={handleBackToSelection} />;
        if (id === 5) return <GlobalFailedExamConfig   onBack={handleBackToSelection} />;
        return <>INVALIDOOOOOOOO</>;
    }

    if (selectedExamType && error) {
        return <div className="min-h-screen py-20 text-center">Error</div>;
    }

    /* ───────────────── componente principal ───────────────── */
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {!selectedExamType && (
                    <MedBankTypeSelector
                        onExamTypeSelect={handleExamTypeSelect}
                        isPremium={isPremium}
                        proExamIds={PRO_EXAM_IDS}
                        disabledExamIds={disabledExamIds}
                        setShowPremiumModal={setShowPremiumModal}
                        isRoot={isRoot}
                    />
                )}
            </div>

            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                featureName="esta función de examen Pro"
            />
        </div>
    );
};

export default MedBank;
