import React from 'react';

const MedBankTypeCard = ({
                             examType,
                             onSelect,
                             isPremium,
                             proExamIds,
                             setShowPremiumModal
                         }) => {
    const isPro = proExamIds.includes(examType.id);
    const isBlocked = isPro && !isPremium;

    return (
        <div
            onClick={() => {
                if (isBlocked) {
                    setShowPremiumModal(true);
                } else {
                    onSelect(examType);
                }
            }}
            className={`relative p-6 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300
                hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-gray-200 bg-white
                ${isBlocked ? "opacity-50 grayscale pointer-events-auto" : ""}
            `}
            style={isBlocked ? { filter: "grayscale(100%)" } : {}}
        >
            {/* Badge PRO */}
            {isPro && (
                <span className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-bold
                    ${isBlocked ? "bg-yellow-400 text-yellow-900" : "bg-gray-200 text-gray-800"}
                    shadow`}>
                    PRO
                </span>
            )}

            <div className="flex items-center mb-4">
                <div className={`w-16 h-16 rounded-full ${examType.color} ${examType.hoverColor} flex items-center justify-center text-2xl text-white mr-4 transition-colors duration-300`}>
                    {examType.icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {examType.title}
                    </h3>
                </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
                {examType.description}
            </p>

            <button
                type="button"
                onClick={e => {
                    e.stopPropagation();
                    if (isBlocked) {
                        setShowPremiumModal(true);
                    } else {
                        onSelect(examType);
                    }
                }}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300
                    ${examType.color} ${examType.hoverColor} hover:shadow-md focus:outline-none focus:ring-4 focus:ring-opacity-50
                    ${isBlocked ? "cursor-not-allowed opacity-70" : ""}
                `}
                disabled={isBlocked}
            >
                Configurar Examen
            </button>
        </div>
    );
};

export default MedBankTypeCard;
