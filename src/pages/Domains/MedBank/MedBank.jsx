import React, { useState } from 'react';
import MedBankTypeSelector from './components/MedBankTypeSelector';
import StandardExamConfig from './ExamTypes/StandardExamConfig';
import AIExamConfig from './ExamTypes/AIExamConfig';
import PdfExamConfig from './ExamTypes/PdfExamConfig';
import PersonalFailedExamConfig from './ExamTypes/PersonalFailedExamConfig';
import GlobalFailedExamConfig from './ExamTypes/GlobalFailedExamConfig';
import { useApi } from '../../../hooks/useApi';
import { usePremiumAccess } from "../../../hooks/usePremiumAccess";
import PremiumModal from '../../../components/PremiumModal';

const PRO_EXAM_IDS = [3, 4, 5];

const MedBank = () => {
    const [selectedExamType, setSelectedExamType] = useState(null);
    const [examConfigData, setExamConfigData] = useState(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const { get, loading, error } = useApi();
    const { isPremium } = usePremiumAccess();

    // Nuevo: intercepta selección de tipos Pro si no es premium
    const handleExamTypeSelect = async (examType) => {
        if (PRO_EXAM_IDS.includes(examType.id) && !isPremium) {
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
            switch(examType.id) {
                case 1:
                    const standardResult = await get('medbank/areas?type=standard');
                    if (standardResult.success) setExamConfigData(standardResult.data);
                    break;
                case 2:
                    const aiResult = await get('medbank/areas?type=ai');
                    if (aiResult.success) setExamConfigData(aiResult.data);
                    break;
                case 3:
                    setExamConfigData({ type: 'pdf' });
                    break;
                case 4:
                    const personalResult = await get('medbank/areas?type=personal-failed');
                    if (personalResult.success) setExamConfigData(personalResult.data);
                    break;
                case 5:
                    const communityResult = await get('medbank/areas?type=global-failed');
                    if (communityResult.success) setExamConfigData(communityResult.data);
                    break;
                default:
                    setExamConfigData(null);
            }
        } catch (err) {
            setExamConfigData(null);
        }
    };

    const handleBackToSelection = () => {
        setSelectedExamType(null);
        setExamConfigData(null);
    };

    // Protección extra: si logra acceder por manipulación, lanza modal
    if (selectedExamType && PRO_EXAM_IDS.includes(selectedExamType.id) && !isPremium) {
        return (
            <>
                <PremiumModal
                    isOpen={true}
                    onClose={() => {
                        setShowPremiumModal(false);
                        setSelectedExamType(null);
                    }}
                    featureName="esta función de examen Pro"
                />
            </>
        );
    }

    if (selectedExamType && (isLoadingConfig || loading)) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                {/* ...pantalla de carga igual que antes... */}
            </div>
        );
    }
    if (selectedExamType && selectedExamType.id === 1 && examConfigData) {
        return (
            <StandardExamConfig
                examType={selectedExamType}
                onBack={handleBackToSelection}
            />
        );
    }
    if (selectedExamType && selectedExamType.id === 2 && examConfigData) {
        return (
            <AIExamConfig
                onBack={handleBackToSelection}
            />
        );
    }
    if (selectedExamType && selectedExamType.id === 3 && examConfigData) {
        return (
            <PdfExamConfig
                onBack={handleBackToSelection}
            />
        );
    }
    if (selectedExamType && selectedExamType.id === 4 && examConfigData) {
        return (
            <PersonalFailedExamConfig
                onBack={handleBackToSelection}
            />
        );
    }
    if (selectedExamType && selectedExamType.id === 5 && examConfigData) {
        return (
            <GlobalFailedExamConfig
                onBack={handleBackToSelection}
            />
        );
    }

    if (selectedExamType && examConfigData) {
        return <>INVALIDOOOOOOOO</>;
    }

    if (selectedExamType && error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                {/* ...pantalla de error igual que antes... */}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {!selectedExamType ? (
                    <MedBankTypeSelector
                        onExamTypeSelect={handleExamTypeSelect}
                        isPremium={isPremium}
                        proExamIds={PRO_EXAM_IDS}
                        setShowPremiumModal={setShowPremiumModal}
                    />
                ) : null}
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
