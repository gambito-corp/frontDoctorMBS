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
                                 disabledExamIds = [],   // ← [3] para no-root
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
                /* bloqueo PREMIUM (no aplica a root) */
                const isProLocked =
                    proExamIds.includes(examType.id) && !isPremium && !isRoot;

                /* bloqueo por mantenimiento (pdf para usuarios ≠ root) */
                const isTemporarilyDisabled = disabledExamIds.includes(examType.id);

                const disabled  = isProLocked || isTemporarilyDisabled;
                const tooltip   = isTemporarilyDisabled
                    ? DISCLAIMER_ROOT
                    : isProLocked
                        ? 'Esta opción requiere acceso Premium'
                        : '';

                return (
                    <MedBankTypeCard
                        key={examType.id}
                        examType={examType}
                        disabled={disabled}
                        tooltip={tooltip}
                        isProLocked={isProLocked}
                        onSelect={onExamTypeSelect}
                        setShowPremiumModal={setShowPremiumModal}
                    />
                );
            })}
        </div>
    </>
);

export default MedBankTypeSelector;
