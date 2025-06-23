import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../molecules/TabBar';
import SearchBar from '../molecules/SearchBar';
import FlashcardSlider from '../molecules/FlashcardSlider';
import ActionButtons from '../molecules/ActionButtons';
import { useApi } from '../../hooks/useApi';

const FlashcardList = ({
                           flashcards = [],
                           categories = [],
                           activeTabOverride,
                           onStartGame,
                           onCreateFlashcard,
                           onCreateCategory,
                           onEditFlashcard,
                           onDeleteFlashcard,
                           canEdit = false,
                           canDelete = false,
                           className = '',
                           ...props
                       }) => {

    const [activeTab, setActiveTab] = useState('sin-categoria');
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchValues, setSearchValues] = useState({});
    const [gameLoading, setGameLoading] = useState(false); // ← AGREGAR loading state

    const api = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTabOverride) {
            setActiveTab(activeTabOverride);
            // Reset después de un momento para permitir cambios manuales
            setTimeout(() => {
                // No resetear aquí, dejar que el padre lo maneje
            }, 1000);
        }
    }, [activeTabOverride]);
    const tabs = useMemo(() => {
        // ✅ FILTRAR CATEGORÍAS VÁLIDAS
        const validCategories = categories.filter(category =>
            category &&
            category.id !== undefined &&
            category.nombre !== undefined
        );

        const sinCategoriaCount = flashcards.filter(f => !f.category || f.category === 'Sin Categoría').length;

        const baseTabs = [
            {
                id: 'sin-categoria',
                name: 'Sin Categoría',
                count: sinCategoriaCount
            }
        ];

        const categoryTabs = validCategories.map(category => ({
            id: category.id,
            name: category.nombre,
            count: flashcards.filter(f => f.category === category.nombre).length
        }));

        return [...baseTabs, ...categoryTabs];
    }, [flashcards, categories]);
    const filteredFlashcards = useMemo(() => {
        let filtered = flashcards;

        // Filtrar por categoría
        if (activeTab === 'sin-categoria') {
            filtered = flashcards.filter(f => !f.category || f.category === 'Sin Categoría');
        } else {
            const activeCategory = categories.find(c => c.id === activeTab);
            if (activeCategory) {
                filtered = flashcards.filter(f => f.category === activeCategory.nombre);
            }
        }

        // Filtrar por búsqueda
        const searchValue = searchValues[activeTab] || '';
        if (searchValue.trim()) {
            filtered = filtered.filter(f =>
                f.pregunta.toLowerCase().includes(searchValue.toLowerCase()) ||
                f.respuesta.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        return filtered;
    }, [flashcards, categories, activeTab, searchValues]);
    const allUniqueIds = useMemo(() => {
        return [...new Set(flashcards.map(f => f.id))];
    }, [flashcards]);
    const categoryUniqueIds = useMemo(() => {
        return [...new Set(filteredFlashcards.map(f => f.id))];
    }, [filteredFlashcards]);
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };
    const handleSearchChange = (e) => {
        setSearchValues(prev => ({
            ...prev,
            [activeTab]: e.target.value
        }));
    };
    const handleClearSearch = () => {
        setSearchValues(prev => ({
            ...prev,
            [activeTab]: ''
        }));
    };
    const handleSelectFlashcard = (flashcardId) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(flashcardId)) {
                newSet.delete(flashcardId);
            } else {
                newSet.add(flashcardId);
            }
            return Array.from(newSet);
        });
    };
    const handleSelectAll = () => {
        setSelectedIds(prev => {
            const currentSet = new Set(prev);
            allUniqueIds.forEach(id => currentSet.add(id));
            return Array.from(currentSet);
        });
    };
    const handleDeselectAll = () => {
        setSelectedIds([]);
    };
    const handleSelectCategory = () => {
        setSelectedIds(prev => {
            const currentSet = new Set(prev);
            categoryUniqueIds.forEach(id => currentSet.add(id));
            return Array.from(currentSet);
        });
    };
    const handleDeselectCategory = () => {
        setSelectedIds(prev => {
            const categorySet = new Set(categoryUniqueIds);
            return prev.filter(id => !categorySet.has(id));
        });
    };
    const selectedInCategory = selectedIds.filter(id => categoryUniqueIds.includes(id)).length;
    const allSelected = selectedIds.length === allUniqueIds.length && allUniqueIds.length > 0;
    const categoryAllSelected = selectedInCategory === categoryUniqueIds.length && categoryUniqueIds.length > 0;
    const handleStartGame = async () => {
        if (selectedIds.length === 0) {
            console.error('❌ No hay flashcards seleccionadas');
            return;
        }

        setGameLoading(true);

        try {
            const result = await api.post('flashcard/start-game', {
                flashcard_ids: selectedIds,
                total_selected: selectedIds.length
            });

            console.log('✅ Respuesta del juego:', result);

            if (result.success) {
                console.log('🎮 Juego iniciado exitosamente:', result.data);

                if (onStartGame) {
                    onStartGame(result.data);
                }

                navigate('/game');

            } else {
                console.error('❌ Error al iniciar juego:', result.error);
                // alert('Error al iniciar el juego: ' + result.error);
            }
        } catch (error) {
            console.error('💥 Error de conexión al iniciar juego:', error);
            // alert('Error de conexión. Inténtalo de nuevo.');
        } finally {
            setGameLoading(false);
        }
    };


    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} {...props}>
            {/* Slider de Tabs */}
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                showCounts={true}
                className="px-6 pt-6"
            />

            {/* Barra de búsqueda */}
            <SearchBar
                searchValue={searchValues[activeTab] || ''}
                onSearchChange={handleSearchChange}
                onClearSearch={handleClearSearch}
                selectedCount={selectedInCategory}
                totalCount={categoryUniqueIds.length}
                placeholder={`Buscar en ${tabs.find(t => t.id === activeTab)?.name || 'esta categoría'}...`}
                className="mx-6 my-4"
            />

            {/* Slider de Flashcards */}
            <FlashcardSlider
                flashcards={filteredFlashcards}
                selectedIds={selectedIds}
                onSelectFlashcard={handleSelectFlashcard}
                onEditFlashcard={onEditFlashcard}
                onDeleteFlashcard={onDeleteFlashcard}
                canEdit={canEdit}
                canDelete={canDelete}
                className="h-48"
            />

            {/* Botones de acción */}
            <ActionButtons
                selectedCount={selectedIds.length}
                totalCount={allUniqueIds.length}
                categorySelectedCount={selectedInCategory}
                categoryTotalCount={categoryUniqueIds.length}
                allSelected={allSelected}
                categoryAllSelected={categoryAllSelected}
                onStartGame={handleStartGame}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onSelectCategory={handleSelectCategory}
                onDeselectCategory={handleDeselectCategory}
                onCreateFlashcard={onCreateFlashcard}
                onCreateCategory={onCreateCategory}
            />
        </div>
    );
};

export default FlashcardList;
