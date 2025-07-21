import React from 'react';

const MedBankTypeCard = ({
                             examType,
                             onSelect,
                             disabled = false,
                             tooltip = '',
                             isProLocked = false,
                             setShowPremiumModal,
                         }) => {
    /* bloqueo efectivo */
    const isBlocked = disabled || isProLocked;
    const classes =
        `relative p-6 rounded-xl shadow-lg transition-all duration-300
     border-2 border-transparent bg-white hover:shadow-xl hover:border-gray-200
     ${isBlocked ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer hover:scale-105'}`;

    const handleClick = () => {
        if (isBlocked) {
            /* si es por premium ⇒ mostrar modal */
            if (isProLocked) setShowPremiumModal(true);
            return;
        }
        onSelect(examType);
    };

    return (
        <div className={classes} onClick={handleClick} title={tooltip}>
            {/* badge PRO */}
            {isProLocked && (
                <span className="absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900 shadow">
          PRO
        </span>
            )}

            {/* icono + título */}
            <div className="flex items-center mb-4">
                <div className={`w-16 h-16 rounded-full ${examType.color} flex items-center justify-center text-2xl text-white mr-4`}>
                    {examType.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{examType.title}</h3>
            </div>

            {/* descripción */}
            <p className="text-gray-600 mb-6">{examType.description}</p>

            {/* botón interno */}
            <button
                type="button"
                disabled={isBlocked}
                className={`w-full py-3 rounded-lg font-semibold text-white transition
          ${examType.color} hover:shadow-md
          ${isBlocked ? 'cursor-not-allowed opacity-70' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
            >
                Configurar examen
            </button>

            {/* texto de downtime inline para pdf */}
            {tooltip && disabled && (
                <p className="mt-4 text-xs italic text-gray-600">{tooltip}</p>
            )}
        </div>
    );
};

export default MedBankTypeCard;
