// src/pages/Domains/MedFlash/components/CategoriesManagement.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../../../../hooks/useApi';

function CategoriesManagement({ showCategoriesList, setShowCategoriesList, onRefreshData,  categoriesWithCount }) {
    // Estados para la gestión de categorías
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Estados para búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Estados para edición
    const [editingCategory, setEditingCategory] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');

    // Estados de UI
    const [managementError, setManagementError] = useState('');
    const [managementSuccess, setManagementSuccess] = useState('');
    const [managementLoading, setManagementLoading] = useState(false);

    const { get, put, delete: del } = useApi();

    // Auto-limpiar alertas
    useEffect(() => {
        if (managementSuccess || managementError) {
            const timer = setTimeout(() => {
                setManagementSuccess('');
                setManagementError('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [managementSuccess, managementError]);

    // Cargar categorías cuando se abra la sección
    useEffect(() => {
        if (showCategoriesList) {
            loadCategories();
        }
    }, [showCategoriesList, currentPage]);

    // Búsqueda con debounce
    useEffect(() => {
        if (!showCategoriesList) return;

        const timeoutId = setTimeout(() => {
            if (searchTerm.trim() !== '') {
                searchCategories();
            } else {
                loadCategories();
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, currentPage, showCategoriesList]);

    useEffect(() => {
        // Recargar categorías cuando se actualicen los datos globales
        if (showCategoriesList) {
            if (searchTerm.trim() !== '') {
                searchCategories();
            } else {
                loadCategories();
            }
        }
    }, [categoriesWithCount]); // Escucha cambios en categoriesWithCount


    const toggleCategoriesList = () => {
        setShowCategoriesList(!showCategoriesList);
        if (showCategoriesList) {
            setSearchTerm('');
            setCurrentPage(1);
            setManagementError('');
            setManagementSuccess('');
        }
    };

    const loadCategories = async () => {
        try {
            setManagementLoading(true);
            setIsSearching(false);
            const response = await get('medflash/categories/count');

            if (response.success) {
                console.log(response.data);
                setCategories(response.data.data);
                setTotalPages(response.data.last_page);
                setTotalItems(response.data.total);
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        } finally {
            setManagementLoading(false);
        }
    };

    const searchCategories = async () => {
        try {
            setManagementLoading(true);
            setIsSearching(true);
            const response = await get(`medflash/categories/search?search=${encodeURIComponent(searchTerm)}&page=${currentPage}&per_page=10`);

            if (response.success) {
                setCategories(response.data.data.data);
                setTotalPages(response.data.data.last_page);
                setTotalItems(response.data.data.total);
            }
        } catch (error) {
            console.error('Error al buscar categorías:', error);
        } finally {
            setManagementLoading(false);
            setIsSearching(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        setSelectedCategories([]);
        setSelectAll(false);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    // Funciones de selección
    const handleSelectCategory = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(categories.map(cat => cat.id));
        }
        setSelectAll(!selectAll);
    };

    // Funciones de edición
    const startEditCategory = (category) => {
        setEditingCategory(category.id);
        setEditCategoryName(category.nombre);
        setManagementError('');
        setManagementSuccess('');
    };

    const cancelEditCategory = () => {
        setEditingCategory(null);
        setEditCategoryName('');
        setManagementError('');
        setManagementSuccess('');
    };

    const saveEditCategory = async (categoryId) => {
        if (!editCategoryName.trim()) {
            setManagementError('El nombre de la categoría es requerido');
            return;
        }

        try {
            setManagementLoading(true);
            const response = await put(`medflash/category/${categoryId}`, {
                name: editCategoryName.trim()
            });

            if (response.success) {
                setManagementSuccess('Categoría actualizada exitosamente');
                setEditingCategory(null);
                setEditCategoryName('');
                onRefreshData();
                if (searchTerm.trim() !== '') {
                    searchCategories();
                } else {
                    loadCategories();
                }
            } else {
                handleManagementApiError(response);
            }
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            setManagementError('Error al actualizar la categoría');
        } finally {
            setManagementLoading(false);
        }
    };

    // Funciones de eliminación
    const deleteCategory = async (categoryId) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría? Las flashcards asociadas quedarán sin categoría.')) {
            return;
        }

        try {
            setManagementLoading(true);
            const response = await del(`medflash/category/${categoryId}`);
            if (response.success) {
                setManagementSuccess('Categoría eliminada exitosamente');
                onRefreshData();
                if (searchTerm.trim() !== '') {
                    searchCategories();
                } else {
                    loadCategories();
                }
            } else {
                handleManagementApiError(response);
            }
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            setManagementError('Error al eliminar la categoría');
        } finally {
            setManagementLoading(false);
        }
    };

    const deleteSelectedCategories = async () => {
        if (selectedCategories.length === 0) {
            setManagementError('Selecciona al menos una categoría para eliminar');
            return;
        }

        if (!window.confirm(`¿Estás seguro de eliminar ${selectedCategories.length} categorías? Las flashcards asociadas quedarán sin categoría.`)) {
            return;
        }

        try {
            setManagementLoading(true);
            const response = await del('medflash/categories/bulk', {
                category_ids: selectedCategories
            });

            if (response.success) {
                setManagementSuccess(`${selectedCategories.length} categorías eliminadas exitosamente`);
                setSelectedCategories([]);
                setSelectAll(false);
                onRefreshData();
                if (searchTerm.trim() !== '') {
                    searchCategories();
                } else {
                    loadCategories();
                }
            } else {
                handleManagementApiError(response);
            }
        } catch (error) {
            console.error('Error al eliminar categorías:', error);
            setManagementError('Error al eliminar las categorías');
        } finally {
            setManagementLoading(false);
        }
    };

    const deleteAllCategories = async () => {
        if (!window.confirm('¿Estás seguro de eliminar TODAS las categorías? Esta acción no se puede deshacer. Todas las flashcards quedarán sin categoría.')) {
            return;
        }

        try {
            setManagementLoading(true);
            const response = await del('medflash/categories/all');
            if (response.success) {
                setManagementSuccess('Todas las categorías han sido eliminadas');
                setSelectedCategories([]);
                setSelectAll(false);
                setSearchTerm('');
                onRefreshData();
                loadCategories();
            } else {
                handleManagementApiError(response);
            }
        } catch (error) {
            console.error('Error al eliminar todas las categorías:', error);
            setManagementError('Error al eliminar todas las categorías');
        } finally {
            setManagementLoading(false);
        }
    };

    const handleManagementApiError = (response) => {
        let errorMessage = 'Error al procesar la solicitud';

        if (response.status === 422) {
            errorMessage = 'Los datos enviados no son válidos';
        } else if (response.status === 409) {
            errorMessage = 'Ya existe una categoría con ese nombre';
        } else if (response.status === 401) {
            errorMessage = 'No tienes permisos para realizar esta acción';
        } else if (response.error) {
            errorMessage = response.error;
        }

        setManagementError(errorMessage);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div
                className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={toggleCategoriesList}
                style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
                        <p className="text-gray-600 mt-1">Edita, elimina y administra tus categorías</p>
                    </div>
                    <svg
                        className={`w-6 h-6 text-gray-500 transition-transform ${showCategoriesList ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {showCategoriesList && (
                <div className="p-6">
                    {/* Alertas */}
                    {managementSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between animate-fade-in">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-green-800">{managementSuccess}</p>
                            </div>
                            <button
                                onClick={() => setManagementSuccess('')}
                                className="text-green-600 hover:text-green-800 ml-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {managementError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between animate-fade-in">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-800">{managementError}</p>
                            </div>
                            <button
                                onClick={() => setManagementError('')}
                                className="text-red-600 hover:text-red-800 ml-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Loading */}
                    {managementLoading && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <p className="text-blue-800 font-medium">Cargando categorías...</p>
                            </div>
                        </div>
                    )}

                    {/* Barra de búsqueda */}
                    <div className="mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Buscar en todas las categorías..."
                                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                disabled={managementLoading}
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                            <div>
                                {searchTerm ? (
                                    isSearching ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Buscando...
                                        </span>
                                    ) : (
                                        `${totalItems} resultado${totalItems !== 1 ? 's' : ''} para "${searchTerm}"`
                                    )
                                ) : (
                                    `Total: ${totalItems} categorías`
                                )}
                            </div>
                            {searchTerm && (
                                <span className="text-blue-600 font-medium">
                                    Búsqueda global activa
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Botones de acción masiva */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <button
                            onClick={deleteSelectedCategories}
                            disabled={selectedCategories.length === 0 || managementLoading}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Eliminar Seleccionadas ({selectedCategories.length})
                        </button>
                        <button
                            onClick={deleteAllCategories}
                            disabled={managementLoading}
                            className="bg-red-800 hover:bg-red-900 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Eliminar Todas
                        </button>
                    </div>

                    {/* Lista de categorías */}
                    {!managementLoading && categories.length > 0 ? (
                        <>
                            <div className="flex items-center p-3 bg-gray-50 rounded-t-lg border-b">
                                <input
                                    type="checkbox"
                                    checked={selectAll && categories.length > 0}
                                    onChange={handleSelectAll}
                                    className="mr-3"
                                />
                                <span className="font-medium text-gray-700">
                                    Seleccionar todas ({categories.length} en esta página)
                                </span>
                            </div>

                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => handleSelectCategory(category.id)}
                                            />
                                            {editingCategory === category.id ? (
                                                <input
                                                    type="text"
                                                    value={editCategoryName}
                                                    onChange={(e) => setEditCategoryName(e.target.value)}
                                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    maxLength={50}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="font-medium text-gray-900">
                                                    {searchTerm ? (
                                                        category.nombre.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, index) =>
                                                            part.toLowerCase() === searchTerm.toLowerCase() ? (
                                                                <mark key={index} className="bg-yellow-200 px-1 rounded">
                                                                    {part}
                                                                </mark>
                                                            ) : (
                                                                part
                                                            )
                                                        )
                                                    ) : (
                                                        category.nombre
                                                    )}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {editingCategory === category.id ? (
                                                <>
                                                    <button
                                                        onClick={() => saveEditCategory(category.id)}
                                                        className="text-green-600 hover:text-green-800 font-medium px-3 py-1"
                                                    >
                                                        Guardar
                                                    </button>
                                                    <button
                                                        onClick={cancelEditCategory}
                                                        className="text-gray-600 hover:text-gray-800 font-medium px-3 py-1"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEditCategory(category)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCategory(category.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium px-3 py-1"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-700">
                                        Página {currentPage} de {totalPages}
                                        {searchTerm && ` (${totalItems} resultados)`}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1 || managementLoading}
                                            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages || managementLoading}
                                            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : !managementLoading ? (
                        <div className="text-center py-8 text-gray-500">
                            {searchTerm ? (
                                <div>
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <p>No se encontraron categorías que coincidan con "{searchTerm}"</p>
                                    <button
                                        onClick={clearSearch}
                                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Limpiar búsqueda
                                    </button>
                                </div>
                            ) : (
                                'No hay categorías creadas'
                            )}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default CategoriesManagement;
