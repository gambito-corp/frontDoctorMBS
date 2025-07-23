import React from 'react';
import MedBankTypeCard from './MedBankTypeCard';
import { examTypesData } from './data/examTypes';

const DISCLAIMER_ROOT =
    'Debido a la gran recepción del modelo nuestros servidores están temporalmente fuera de servicio, y estamos ' +
    'trabajando a toda prisa para restablecerlo lo más rápido que podamos.';

const MedBankTypeSelector = ({
                                 onExamTypeSelect,
                                 isPremium,
                                 proExamIds,
                                 setShowPremiumModal,
                                 isRoot = false,         // ← NEW
                             }) => (
    <>
        {/* encabezado */}
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🏦 MedBank&nbsp;–&nbsp;Banco de Exámenes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Selecciona el tipo de examen que mejor se adapte a tus necesidades de estudio.
            </p>
        </div>

        {/* tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {examTypesData.map((examType) => {
                return (
                    <MedBankTypeCard
                        key={examType.id}
                        examType={examType}
                        onSelect={onExamTypeSelect}
                        setShowPremiumModal={setShowPremiumModal}
                    />
                );
            })}
        </div>
    </>
);

export default MedBankTypeSelector;
