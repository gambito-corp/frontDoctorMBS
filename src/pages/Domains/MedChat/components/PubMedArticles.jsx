// src/pages/Domains/MedChat/components/PubMedArticles.jsx
import React, { useState } from 'react';
import { usePremiumAccess } from '../../../../hooks/usePremiumAccess';
import PremiumModal from '../../../../components/PremiumModal';

const PubMedArticles = ({ articles = [] }) => {
    const [showAll, setShowAll] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const { isPremium } = usePremiumAccess();

    if (!articles || articles.length === 0) {
        return null;
    }

    // Límite de artículos para usuarios normales
    const FREE_ARTICLES_LIMIT = 2;

    // Determinar qué artículos mostrar
    const articlesToShow = isPremium
        ? (showAll ? articles : articles.slice(0, 3))
        : articles.slice(0, FREE_ARTICLES_LIMIT);

    const hasMoreArticles = articles.length > (isPremium ? 3 : FREE_ARTICLES_LIMIT);
    const lockedArticles = !isPremium ? articles.slice(FREE_ARTICLES_LIMIT) : [];

    const toggleArticles = () => {
        if (isPremium) {
            setShowAll(!showAll);
        } else {
            setShowPremiumModal(true);
        }
    };
    const getStudyTypeColor = (tipo) => {
        // ✅ VERIFICAR QUE tipo NO SEA undefined
        if (!tipo || typeof tipo !== 'string') {
            return 'bg-gray-100 text-gray-800'; // Color por defecto
        }

        const tipoLower = tipo.toLowerCase();

        switch (tipoLower) {
            case 'meta analyses':
            case 'meta analysis':
                return 'bg-purple-100 text-purple-800';
            case 'systematic review':
            case 'systematic reviews':
                return 'bg-blue-100 text-blue-800';
            case 'randomized controlled trial':
            case 'rct':
                return 'bg-green-100 text-green-800';
            case 'observational studies':
            case 'observational study':
                return 'bg-yellow-100 text-yellow-800';
            case 'case report':
            case 'case reports':
                return 'bg-orange-100 text-orange-800';
            case 'review':
            case 'reviews':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStudyTypeLabel = (title, journal) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('systematic review')) return 'Revisión Sistemática';
        if (lowerTitle.includes('meta-analysis')) return 'Meta-análisis';
        if (lowerTitle.includes('clinical trial')) return 'Ensayo Clínico';
        if (lowerTitle.includes('randomized')) return 'Estudio Aleatorizado';
        if (lowerTitle.includes('review')) return 'Revisión';
        if (lowerTitle.includes('case report')) return 'Reporte de Caso';
        if (lowerTitle.includes('observational')) return 'Estudio Observacional';
        return journal || 'Estudio Científico';
    };

    const ArticleCard = ({ article, isLocked = false }) => (
        <div className={`relative bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
            isLocked ? 'opacity-60' : ''
        }`}>
            {/* Overlay para artículos bloqueados */}
            {isLocked && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-10 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                        <div className="mb-2">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">Contenido Premium</p>
                        <button
                            onClick={() => setShowPremiumModal(true)}
                            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                        >
                            Hazte Pro
                        </button>
                    </div>
                </div>
            )}

            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStudyTypeColor(article.title, article.journal)}`}>
                        {getStudyTypeLabel(article.title, article.journal)}
                    </span>
                    {article.year && (
                        <span className="text-xs text-gray-500 font-medium">
                            {article.year}
                        </span>
                    )}
                </div>

                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {article.title}
                </h4>

                {article.authors && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        <span className="font-medium">Autores:</span> {article.authors}
                    </p>
                )}

                {article.journal && (
                    <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Revista:</span> {article.journal}
                    </p>
                )}

                {article.abstract && (
                    <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                        {article.abstract}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    {article.pmid && (
                        <span className="text-xs text-gray-500">
              PMID: {article.pmid}
            </span>
                    )}

                    {article.url && !isLocked && (
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                            Ver artículo
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Referencias Científicas
                    <span className="text-sm font-normal text-gray-600">
            ({articles.length} artículo{articles.length !== 1 ? 's' : ''})
          </span>
                </h3>

                {!isPremium && articles.length > FREE_ARTICLES_LIMIT && (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>Mostrando {FREE_ARTICLES_LIMIT} de {articles.length}</span>
                    </div>
                )}
            </div>

            {/* Grid de artículos disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {articlesToShow.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                ))}
            </div>

            {/* Grid de artículos bloqueados para usuarios normales */}
            {!isPremium && lockedArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {lockedArticles.slice(0, 3).map((article, index) => (
                        <ArticleCard key={`locked-${index}`} article={article} isLocked={true} />
                    ))}
                </div>
            )}

            {/* Botón para mostrar más o upgrade */}
            {hasMoreArticles && (
                <div className="text-center">
                    {isPremium ? (
                        <button
                            onClick={toggleArticles}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2 mx-auto"
                        >
                            {showAll ? 'Mostrar menos' : `Ver ${articles.length - 3} artículos más`}
                            <svg
                                className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowPremiumModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Hazte Pro para ver {articles.length - FREE_ARTICLES_LIMIT} artículos más
                        </button>
                    )}
                </div>
            )}

            {/* Modal Premium */}
            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                featureName="acceso completo a referencias científicas"
            />
        </div>
    );
};

export default PubMedArticles;
