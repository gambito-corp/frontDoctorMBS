// src/pages/Domains/MedFlash/components/CardsList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../../../../hooks/useApi';
import { usePremiumAccess } from '../../../../hooks/usePremiumAccess';
import FlashcardItem from './FlashcardItem';
import PremiumModal from '../../../../components/PremiumModal';

function CardsList({
                       showCardsList,
                       setShowCardsList,
                       flashcards: initialFlashcards,
                       categoriesWithCount,
                       onRefreshData,
                       selectedCardIds = [],
                       selectionMode = false,
                       onToggleSelection
                   }) {
    const [flashcards, setFlashcards] = useState(initialFlashcards || []);
    const [cardsViewMode, setCardsViewMode] = useState('compact');
    const [cardsLoading, setCardsLoading] = useState(false);
    const [cardsError, setCardsError] = useState('');
    const [cardsSuccess, setCardsSuccess] = useState('');
    const [cardsCurrentPage, setCardsCurrentPage] = useState(1);
    const [cardsTotalPages, setCardsTotalPages] = useState(1);
    const [totalCards, setTotalCards] = useState(0);
    const [cardsSearchTerm, setCardsSearchTerm] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const searchInputRef = useRef(null);
    const [absoluteTotalCards, setAbsoluteTotalCards] = useState(0);
    const [cardsWithoutCategory, setCardsWithoutCategory] = useState(0);

    // ✅ ESTADOS PARA FUNCIONES PREMIUM
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [premiumFeature, setPremiumFeature] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteType, setDeleteType] = useState(''); // 'category' o 'all'
    const [password, setPassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    // ✅ HOOK PREMIUM
    const { isPremium, user } = usePremiumAccess();

    const { get, delete: del } = useApi();

    // FUNCIONES PARA MOSTRAR ALERTAS
    const showSuccess = (message) => {
        setCardsSuccess(message);
    };

    const showError = (message) => {
        setCardsError(message);
    };

    // Auto-limpiar alertas
    useEffect(() => {
        if (cardsSuccess || cardsError) {
            const timer = setTimeout(() => {
                setCardsSuccess('');
                setCardsError('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [cardsSuccess, cardsError]);

    // Resto de useEffects existentes...
    useEffect(() => {
        if (!showCardsList) return;

        const timeoutId = setTimeout(() => {
            const activeElement = document.activeElement;
            const wasSearchInputFocused = activeElement === searchInputRef.current;

            setCardsCurrentPage(1);
            loadFlashcards().then(() => {
                if (wasSearchInputFocused && cardsSearchTerm) {
                    setTimeout(() => {
                        searchInputRef.current?.focus();
                    }, 0);
                }
            });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [cardsSearchTerm]);

    useEffect(() => {
        if (showCardsList) {
            loadFlashcards();
        }
    }, [showCardsList, cardsViewMode, cardsCurrentPage, selectedCategoryFilter]);

    useEffect(() => {
        if (showCardsList) {
            loadFlashcards();
        }
    }, [categoriesWithCount]);

    useEffect(() => {
        const loadAbsoluteTotal = async () => {
            try {
                const response = await get('medflash?page=1&per_page=1');
                if (response.success) {
                    setAbsoluteTotalCards(response.data.data.total);
                }
            } catch (error) {
                console.error('Error al cargar total absoluto:', error);
            }
        };

        if (showCardsList) {
            loadAbsoluteTotal();
        }
    }, [showCardsList]);

    useEffect(() => {
        if (showCardsList) {
            loadCardsWithoutCategoryCount();
        }
    }, [showCardsList, categoriesWithCount]);

    // Funciones existentes...
    const loadFlashcards = async () => {
        try {
            setCardsLoading(true);
            const perPage = cardsViewMode === 'compact' ? 4 : 16;
            let url = `medflash?page=${cardsCurrentPage}&per_page=${perPage}`;

            if (cardsSearchTerm.trim()) {
                url += `&search=${encodeURIComponent(cardsSearchTerm)}`;
            }

            if (selectedCategoryFilter === 'without_category') {
                url += `&sin_categoria=true`;
            } else if (selectedCategoryFilter !== 'all') {
                url += `&categoria=${selectedCategoryFilter}`;
            }

            const response = await get(url);
            if (response.success) {
                setFlashcards(response.data.data.data);
                setCardsTotalPages(response.data.data.last_page);
                setTotalCards(response.data.data.total);

                if (selectedCategoryFilter === 'all' && !cardsSearchTerm.trim()) {
                    setAbsoluteTotalCards(response.data.data.total);
                }
            }
        } catch (error) {
            console.error('Error al cargar flashcards:', error);
            setCardsError('Error al cargar las flashcards');
        } finally {
            setCardsLoading(false);
        }
    };

    const loadCardsWithoutCategoryCount = async () => {
        try {
            const response = await get('medflash?page=1&per_page=1&sin_categoria=true');
            if (response.success) {
                setCardsWithoutCategory(response.data.data.total);
            }
        } catch (error) {
            console.error('Error al cargar conteo sin categoría:', error);
            setCardsWithoutCategory(0);
        }
    };

    const toggleCardsList = () => {
        setShowCardsList(!showCardsList);
    };

    const toggleCardsViewMode = () => {
        setCardsViewMode(prev => prev === 'compact' ? 'expanded' : 'compact');
    };

    // ✅ FUNCIÓN PARA MANEJAR ACCIONES PREMIUM
    const handlePremiumAction = (action, featureName) => {
        if (!isPremium) {
            setPremiumFeature(featureName);
            setShowPremiumModal(true);
            return;
        }
        action();
    };

    // ✅ FUNCIÓN PARA ELIMINAR CARDS DE CATEGORÍA
    const handleDeleteCategory = () => {
        handlePremiumAction(() => {
            setDeleteType('category');
            setShowDeleteModal(true);
        }, 'eliminación masiva de categoría');
    };

    // ✅ FUNCIÓN PARA ELIMINAR TODAS LAS CARDS
    const handleDeleteAll = () => {
        handlePremiumAction(() => {
            setDeleteType('all');
            setShowDeleteModal(true);
        }, 'eliminación masiva total');
    };

    // ✅ FUNCIÓN PARA CONFIRMAR ELIMINACIÓN
    const handleConfirmDelete = async () => {
        // Verificar si es usuario root (puede skipear contraseña)
        const isRoot = user && user.roles && user.roles.includes('root');

        if (!isRoot && !password.trim()) {
            setCardsError('La contraseña es requerida para confirmar la eliminación');
            return;
        }

        setDeleteLoading(true);
        setCardsError('');

        try {
            let endpoint = '';
            let payload = {};

            if (deleteType === 'category') {
                endpoint = 'medflash/delete-by-category';
                payload = {
                    category_id: selectedCategoryFilter === 'without_category' ? null : selectedCategoryFilter,
                    password: isRoot ? null : password.trim()
                };
            } else {
                endpoint = 'medflash/delete-all';
                payload = {
                    password: isRoot ? null : password.trim()
                };
            }

            const response = await del(endpoint, payload);

            if (response.success) {
                const deletedCount = response.data.deleted_count || 0;
                setCardsSuccess(`${deletedCount} flashcards eliminadas exitosamente`);
                setShowDeleteModal(false);
                setPassword('');
                onRefreshData();
            } else {
                setCardsError(response.error || 'Error al eliminar las flashcards');
            }
        } catch (error) {
            console.error('Error eliminando flashcards:', error);
            setCardsError('Error de conexión al eliminar las flashcards');
        } finally {
            setDeleteLoading(false);
        }
    };

    // ✅ FUNCIÓN PARA CERRAR MODAL DE ELIMINACIÓN
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setPassword('');
        setDeleteType('');
        setCardsError('');
    };

    // ✅ OBTENER NOMBRE DE CATEGORÍA ACTUAL
    const getCurrentCategoryName = () => {
        if (selectedCategoryFilter === 'all') return 'Todas las categorías';
        if (selectedCategoryFilter === 'without_category') return 'Sin categorías';

        const category = categoriesWithCount.find(cat => cat.id == selectedCategoryFilter);
        return category ? category.nombre : 'Categoría desconocida';
    };

    // Componente de paginación (existente)
    const PaginationControls = () => {
        const perPage = cardsViewMode === 'compact' ? 4 : 16;
        const startCard = (cardsCurrentPage - 1) * perPage + 1;
        const endCard = Math.min(cardsCurrentPage * perPage, totalCards);

        const generatePageNumbers = () => {
            const pages = [];
            const maxVisiblePages = 5;

            if (cardsTotalPages <= maxVisiblePages) {
                for (let i = 1; i <= cardsTotalPages; i++) {
                    pages.push(i);
                }
            } else {
                if (cardsCurrentPage <= 3) {
                    for (let i = 1; i <= 4; i++) {
                        pages.push(i);
                    }
                    pages.push('...');
                    pages.push(cardsTotalPages);
                } else if (cardsCurrentPage >= cardsTotalPages - 2) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = cardsTotalPages - 3; i <= cardsTotalPages; i++) {
                        pages.push(i);
                    }
                } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = cardsCurrentPage - 1; i <= cardsCurrentPage + 1; i++) {
                        pages.push(i);
                    }
                    pages.push('...');
                    pages.push(cardsTotalPages);
                }
            }
            return pages;
        };

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                    Mostrando {startCard} - {endCard} de {totalCards} flashcards
                    {selectedCardIds.length > 0 && (
                        <span className="ml-2 text-blue-600 font-medium">
                            ({selectedCardIds.length} seleccionadas)
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCardsCurrentPage(1)}
                        disabled={cardsCurrentPage === 1}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Primera
                    </button>

                    <button
                        onClick={() => setCardsCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={cardsCurrentPage === 1}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Anterior
                    </button>

                    {generatePageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={index} className="px-2 py-1 text-sm text-gray-500">...</span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => setCardsCurrentPage(page)}
                                className={`px-3 py-1 text-sm border rounded ${
                                    cardsCurrentPage === page
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-white border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => setCardsCurrentPage(prev => Math.min(prev + 1, cardsTotalPages))}
                        disabled={cardsCurrentPage === cardsTotalPages}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Siguiente
                    </button>

                    <button
                        onClick={() => setCardsCurrentPage(cardsTotalPages)}
                        disabled={cardsCurrentPage === cardsTotalPages}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Última
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Seleccionar Flashcards</h2>
                            <p className="text-gray-600 mt-1">Selecciona Las Flashcards para estudiar</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* ✅ BOTONES PREMIUM DE ELIMINACIÓN MASIVA */}
                        <button
                            onClick={handleDeleteCategory}
                            disabled={selectedCategoryFilter === 'all'}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedCategoryFilter === 'all'
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : isPremium
                                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            title={
                                selectedCategoryFilter === 'all'
                                    ? 'No disponible en "Todas las categorías"'
                                    : isPremium
                                        ? `Eliminar todas las cards de "${getCurrentCategoryName()}"`
                                        : 'Función Premium - Eliminar categoría'
                            }
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Eliminar Categoría</span>
                            {!isPremium && selectedCategoryFilter !== 'all' && (
                                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={handleDeleteAll}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                isPremium
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            title={isPremium ? 'Eliminar todas las flashcards' : 'Función Premium - Eliminar todo'}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Eliminar Todo</span>
                            {!isPremium && (
                                <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={toggleCardsViewMode}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span>{cardsViewMode === 'compact' ? 'Expandir' : 'Compactar'}</span>
                        </button>
                    </div>
            </div>

                <>
                    {/* Alertas */}
                    {cardsLoading && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
                            {cardsSearchTerm ? 'Buscando flashcards...' : 'Cargando flashcards...'}
                        </div>
                    )}

                    {cardsSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                            {cardsSuccess}
                        </div>
                    )}

                    {cardsError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {cardsError}
                        </div>
                    )}

                    {/* INDICADOR DE MODO SELECCIÓN */}
                    {selectionMode && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-blue-700 font-medium">
                                    Modo selección activo - Haz click en las cards para seleccionarlas
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Filtros y búsqueda */}
                    <div className="mb-6">
                        {/* Barra de búsqueda */}
                        <div className="mb-4">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Buscar en preguntas y respuestas..."
                                value={cardsSearchTerm}
                                onChange={(e) => setCardsSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Pestañas de categorías */}
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 overflow-x-auto">
                                {/* Pestaña "Todas" */}
                                <button
                                    onClick={() => setSelectedCategoryFilter('all')}
                                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        selectedCategoryFilter === 'all'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Todas las categorías
                                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                                        {absoluteTotalCards}
                                    </span>
                                </button>

                                {/* Pestaña "Sin categorías" */}
                                <button
                                    onClick={() => setSelectedCategoryFilter('without_category')}
                                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        selectedCategoryFilter === 'without_category'
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Sin categorías
                                    <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                                        selectedCategoryFilter === 'without_category'
                                            ? 'bg-orange-100 text-orange-900'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}>
                                        {cardsWithoutCategory}
                                    </span>
                                </button>

                                {/* Pestañas de categorías */}
                                {categoriesWithCount.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategoryFilter(category.id)}
                                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            selectedCategoryFilter === category.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {category.nombre}
                                        <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                                            selectedCategoryFilter === category.id
                                                ? 'bg-blue-100 text-blue-900'
                                                : 'bg-gray-100 text-gray-900'
                                        }`}>
                                            {category.cards_count}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Grid de flashcards */}
                    {flashcards.length > 0 ? (
                        <>
                            <div className={`grid gap-4 ${
                                cardsViewMode === 'compact'
                                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            }`}>
                                {flashcards.map(card => (
                                    <FlashcardItem
                                        key={card.id}
                                        card={card}
                                        isCompact={cardsViewMode === 'compact'}
                                        searchTerm={cardsSearchTerm}
                                        onRefreshData={onRefreshData}
                                        onShowSuccess={showSuccess}
                                        onShowError={showError}
                                        isSelected={selectedCardIds.includes(card.id)}
                                        onToggleSelection={onToggleSelection}
                                        selectionMode={selectionMode}
                                        categoriesWithCount={categoriesWithCount} // ✅ AGREGAR ESTA LÍNEA
                                    />
                                ))}
                            </div>

                            <PaginationControls />
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron flashcards</h3>
                            <p className="text-gray-500 mb-6">
                                {!selectionMode && (
                                    <>
                                        Haz clic en cualquier card para ver la respuesta. Los botones de editar y eliminar aparecen al pasar el mouse.
                                        {cardsViewMode === 'compact' ? ' Usa "Expandir" para ver más cards por página.' : ' Usa "Compactar" para vista reducida.'}
                                    </>
                                )}
                            </p>
                            <p className="text-sm text-gray-400">
                                {cardsSearchTerm || selectedCategoryFilter !== 'all'
                                    ? 'Prueba con otros términos de búsqueda o selecciona otra categoría'
                                    : 'Crea tu primera flashcard para comenzar a estudiar'
                                }
                            </p>
                        </div>
                    )}
                </>

            {/* ✅ MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Confirmar Eliminación
                                </h3>
                            </div>
                            <button
                                onClick={handleCloseDeleteModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-gray-800 mb-2">
                                    {deleteType === 'category'
                                        ? `¿Estás seguro de que quieres eliminar TODAS las flashcards de "${getCurrentCategoryName()}"?`
                                        : '¿Estás seguro de que quieres eliminar TODAS las flashcards?'
                                    }
                                </p>
                                <p className="text-red-600 text-sm font-medium">
                                    ⚠️ Esta acción no se puede deshacer
                                </p>
                            </div>

                            {/* Campo de contraseña (solo si no es root) */}
                            {user && user.roles && !user.roles.includes('root') && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirma tu contraseña para continuar:
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Ingresa tu contraseña"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        disabled={deleteLoading}
                                    />
                                </div>
                            )}

                            {user && user.roles && user.roles.includes('root') && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-blue-800 text-sm">
                                        🔑 Como usuario Root, puedes proceder sin contraseña
                                    </p>
                                </div>
                            )}

                            {cardsError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-800 text-sm">{cardsError}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleCloseDeleteModal}
                                disabled={deleteLoading}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleteLoading}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {deleteLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Eliminando...
                                    </>
                                ) : (
                                    'Confirmar Eliminación'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ MODAL PREMIUM */}
            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                featureName={premiumFeature}
            />
        </div>
    );
}

export default CardsList;
