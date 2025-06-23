// src/pages/Domains/MedFlash/components/FlashcardItem.jsx
import React, { useState } from 'react';
import { usePremiumAccess } from '../../../../hooks/usePremiumAccess';
import { useApi } from '../../../../hooks/useApi';
import PremiumModal from '../../../../components/PremiumModal';

function FlashcardItem({
                           card,
                           isSelected = false,
                           onToggleSelection,
                           selectionMode = false,
                           onRefreshData,
                           onShowSuccess,
                           onShowError,
                           categoriesWithCount = [] // ✅ AGREGAR ESTA PROP
                       }) {
    const [showFullText, setShowFullText] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [premiumFeature, setPremiumFeature] = useState('');

    // Estados para modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [password, setPassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // Estados para modal de edición
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editData, setEditData] = useState({
        pregunta: '',
        respuesta: '',
        imagen: null,
        imagen_respuesta: null,
        url: '',
        url_respuesta: '',
        categorias: [],
        remove_imagen: false,
        remove_imagen_respuesta: false
    });
    // ✅ AGREGAR ESTADO PARA MANEJO DE IMÁGENES
    const [imageErrors, setImageErrors] = useState({
        pregunta: false,
        respuesta: false
    });

// ✅ FUNCIÓN PARA MANEJAR ERRORES DE CARGA DE IMAGEN
    const handleImageError = (type) => {
        setImageErrors(prev => ({
            ...prev,
            [type]: true
        }));
    };

// ✅ FUNCIÓN PARA VERIFICAR SI UNA URL ES VÁLIDA
    const isValidImageUrl = (url) => {
        if (!url) return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const { isPremium, user } = usePremiumAccess();
    const { delete: del, post } = useApi(); // ✅ AGREGAR post AQUÍ

    const handleCardClick = (e) => {
        if (selectionMode && !e.target.closest('button')) {
            onToggleSelection(card.id);
        }
    };

    const handleShowMore = (e) => {
        e.stopPropagation();
        setShowFullText(true);
    };

    const handleCloseModal = (e) => {
        e.stopPropagation();
        setShowFullText(false);
    };

    const handlePremiumAction = (action, featureName) => {
        if (!isPremium) {
            setPremiumFeature(featureName);
            setShowPremiumModal(true);
            return;
        }
        action();
    };

    // ✅ FUNCIÓN PARA ABRIR MODAL DE EDICIÓN - MEJORADA
    const handleEdit = (e) => {
        e.stopPropagation();
        handlePremiumAction(() => {
            // Inicializar datos del formulario con los datos actuales de la card
            setEditData({
                pregunta: card.pregunta || '',
                respuesta: card.respuesta || '',
                imagen: null, // Para nuevas imágenes
                imagen_respuesta: null, // Para nuevas imágenes
                url: card.url || '',
                url_respuesta: card.url_respuesta || '',
                categorias: card.categories ? card.categories.map(cat => cat.id) : [],
                remove_imagen: false,
                remove_imagen_respuesta: false
            });
            setShowEditModal(true);
        }, 'editar flashcards');
    };

    // ✅ FUNCIÓN PARA MANEJAR CAMBIOS EN EL FORMULARIO - MEJORADA
    const handleEditChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // ✅ FUNCIÓN PARA MANEJAR ARCHIVOS DE IMAGEN
    const handleImageChange = (field, file) => {
        setEditData(prev => ({
            ...prev,
            [field]: file,
            // Limpiar URL si se selecciona archivo
            [field === 'imagen' ? 'url' : 'url_respuesta']: '',
            // Desmarcar eliminación si se selecciona nueva imagen
            [field === 'imagen' ? 'remove_imagen' : 'remove_imagen_respuesta']: false
        }));
    };

    // ✅ FUNCIÓN PARA CONFIRMAR EDICIÓN - MEJORADA
    const handleConfirmEdit = async () => {
        if (!editData.pregunta.trim() || !editData.respuesta.trim()) {
            setEditError('La pregunta y respuesta son requeridas');
            return;
        }

        setEditLoading(true);
        setEditError('');

        try {
            // ✅ CREAR FORMDATA PARA MANEJAR ARCHIVOS
            const formData = new FormData();
            formData.append('pregunta', editData.pregunta.trim());
            formData.append('respuesta', editData.respuesta.trim());

            // URLs
            if (editData.url) {
                formData.append('url', editData.url);
            }
            if (editData.url_respuesta) {
                formData.append('url_respuesta', editData.url_respuesta);
            }

            // Imágenes
            if (editData.imagen) {
                formData.append('imagen', editData.imagen);
            }
            if (editData.imagen_respuesta) {
                formData.append('imagen_respuesta', editData.imagen_respuesta);
            }

            // Flags de eliminación
            if (editData.remove_imagen) {
                formData.append('remove_imagen', '1');
            }
            if (editData.remove_imagen_respuesta) {
                formData.append('remove_imagen_respuesta', '1');
            }

            // Categorías
            if (editData.categorias.length > 0) {
                formData.append('categorias', JSON.stringify(editData.categorias));
            }

            // ✅ USAR POST CON _method PARA SIMULAR PUT CON ARCHIVOS
            const response = await post(`medflash/${card.id}?_method=PUT`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.success) {
                onShowSuccess && onShowSuccess('Flashcard editada correctamente');
                setShowEditModal(false);
                onRefreshData && onRefreshData();
            } else {
                setEditError(response.error || 'Error al editar la flashcard');
            }

        } catch (error) {
            console.error('Error editando flashcard:', error);
            setEditError('Error de conexión al editar la flashcard');
        } finally {
            setEditLoading(false);
        }
    };

    // ✅ FUNCIÓN PARA CERRAR MODAL DE EDICIÓN
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditError('');
        setEditData({
            pregunta: '',
            respuesta: '',
            imagen: null,
            imagen_respuesta: null,
            url: '',
            url_respuesta: '',
            categorias: [],
            remove_imagen: false,
            remove_imagen_respuesta: false
        });
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        handlePremiumAction(() => {
            setShowDeleteModal(true);
        }, 'eliminar flashcards');
    };

    const handleConfirmDelete = async () => {
        const isRoot = user && user.roles && user.roles.includes('root');

        if (!isRoot && !password.trim()) {
            setDeleteError('La contraseña es requerida para confirmar la eliminación');
            return;
        }

        setDeleteLoading(true);
        setDeleteError('');

        try {
            const response = await del(`medflash/${card.id}`, {
                password: isRoot ? null : password.trim()
            });

            if (response.success) {
                onShowSuccess && onShowSuccess('Flashcard eliminada correctamente');
                setShowDeleteModal(false);
                setPassword('');
                onRefreshData && onRefreshData();
            } else {
                setDeleteError(response.error || 'Error al eliminar la flashcard');
            }

        } catch (error) {
            console.error('Error eliminando flashcard:', error);
            setDeleteError('Error de conexión al eliminar la flashcard');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setPassword('');
        setDeleteError('');
    };

    const isTextLong = card.pregunta && card.pregunta.length > 100;
    const displayText = isTextLong && !showFullText
        ? card.pregunta.substring(0, 100) + '...'
        : card.pregunta;

    return (
        <>
            <div
                className={`
                    relative bg-white rounded-lg shadow-md border-2 transition-all duration-300 
                    cursor-pointer h-48 p-4 flex flex-col justify-center items-center group
                    ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                    : 'border-gray-200 hover:shadow-lg hover:border-blue-300'
                }
                `}
                onClick={handleCardClick}
            >
                {/* Indicador de selección */}
                {isSelected && (
                    <div className="absolute top-2 right-2 z-20">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* ID de la card */}
                <div className="absolute top-3 left-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        #{card.id}
                    </span>
                </div>

                {/* Botones premium */}
                {!selectionMode && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 z-10">
                        {/* Botón Editar */}
                        <button
                            onClick={handleEdit}
                            className={`p-1.5 rounded-full transition-all duration-200 ${
                                isPremium
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            title={isPremium ? 'Editar flashcard' : 'Función Premium - Editar'}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {!isPremium && (
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </button>

                        {/* Botón Eliminar */}
                        <button
                            onClick={handleDelete}
                            className={`p-1.5 rounded-full transition-all duration-200 ${
                                isPremium
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            title={isPremium ? 'Eliminar flashcard' : 'Función Premium - Eliminar'}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {!isPremium && (
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    </div>
                )}

                {/* Contenido principal */}
                <div className="text-center flex-1 flex items-center justify-center px-4">
                    <p className="text-gray-800 text-lg font-medium leading-relaxed">
                        {displayText}
                    </p>
                </div>

                {/* Botón "Ver más" */}
                {isTextLong && (
                    <div className="mt-2 text-center">
                        <button
                            onClick={handleShowMore}
                            className="text-gray-400 hover:text-gray-600 text-xs opacity-70 hover:opacity-100 transition-all duration-200"
                        >
                            ...ver más
                        </button>
                    </div>
                )}

                {/* Estado de selección */}
                {selectionMode && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            isSelected
                                ? 'text-blue-600 bg-blue-100'
                                : 'text-gray-400 bg-gray-100'
                        }`}>
                            {isSelected ? '✓ Seleccionada' : 'Click para seleccionar'}
                        </span>
                    </div>
                )}
            </div>

            {/* Modal para texto completo */}
            {showFullText && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Pregunta completa - Card #{card.id}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4">
                            <p className="text-gray-800 text-base leading-relaxed">
                                {card.pregunta}
                            </p>
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ MODAL DE EDICIÓN COMPLETO */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Editar Flashcard #{card.id}
                                </h3>
                            </div>
                            <button
                                onClick={handleCloseEditModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Pregunta */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pregunta <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={editData.pregunta}
                                    onChange={(e) => handleEditChange('pregunta', e.target.value)}
                                    placeholder="Escribe tu pregunta médica aquí..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                    rows={3}
                                    disabled={editLoading}
                                    maxLength={2000}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {editData.pregunta.length}/2000 caracteres
                                </p>
                            </div>

                            {/* Respuesta */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Respuesta <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={editData.respuesta}
                                    onChange={(e) => handleEditChange('respuesta', e.target.value)}
                                    placeholder="Escribe la respuesta aquí..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                    rows={3}
                                    disabled={editLoading}
                                    maxLength={2000}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {editData.respuesta.length}/2000 caracteres
                                </p>
                            </div>

                            {/* Imágenes y URLs */}
                            {/* Imagen/URL Pregunta */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen para Pregunta
                                </label>

                                {/* Imagen actual */}
                                {card.imagen && !editData.remove_imagen && (
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                                        {!imageErrors.pregunta ? (
                                            <img
                                                src={card.imagen}
                                                alt="Imagen pregunta"
                                                className="max-w-32 max-h-32 object-cover border rounded"
                                                onError={() => handleImageError('pregunta')}
                                                onLoad={() => setImageErrors(prev => ({ ...prev, pregunta: false }))}
                                            />
                                        ) : (
                                            <div className="max-w-32 max-h-32 border rounded bg-gray-100 flex items-center justify-center">
                                                <div className="text-center p-4">
                                                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    <p className="text-xs text-gray-500">Error cargando imagen</p>
                                                    <p className="text-xs text-gray-400 mt-1 break-all">{card.imagen}</p>
                                                </div>
                                            </div>
                                        )}
                                        <label className="flex items-center mt-2">
                                            <input
                                                type="checkbox"
                                                checked={editData.remove_imagen}
                                                onChange={(e) => handleEditChange('remove_imagen', e.target.checked)}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-red-600">Eliminar imagen actual</span>
                                        </label>
                                    </div>
                                )}

                                {/* Nueva imagen */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange('imagen', e.target.files[0])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                                    disabled={editLoading}
                                />

                                {/* URL alternativa */}
                                <input
                                    type="url"
                                    value={editData.url}
                                    onChange={(e) => handleEditChange('url', e.target.value)}
                                    placeholder="O usa una URL: https://ejemplo.com/imagen.jpg"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={editLoading}
                                />

                                {/* Preview de URL */}
                                {editData.url && isValidImageUrl(editData.url) && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-1">Vista previa URL:</p>
                                        <img
                                            src={editData.url}
                                            alt="Preview URL"
                                            className="max-w-32 max-h-32 object-cover border rounded"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <div className="hidden text-xs text-red-500 mt-1">
                                            Error: No se puede cargar la imagen desde esta URL
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Imagen/URL Respuesta - SIMILAR ESTRUCTURA */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen para Respuesta
                                </label>

                                {/* Imagen actual */}
                                {card.imagen_respuesta && !editData.remove_imagen_respuesta && (
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                                        {!imageErrors.respuesta ? (
                                            <img
                                                src={card.imagen_respuesta}
                                                alt="Imagen respuesta"
                                                className="max-w-32 max-h-32 object-cover border rounded"
                                                onError={() => handleImageError('respuesta')}
                                                onLoad={() => setImageErrors(prev => ({ ...prev, respuesta: false }))}
                                            />
                                        ) : (
                                            <div className="max-w-32 max-h-32 border rounded bg-gray-100 flex items-center justify-center">
                                                <div className="text-center p-4">
                                                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" clipRule="evenodd" />
                                                    </svg>
                                                    <p className="text-xs text-gray-500">Error cargando imagen</p>
                                                    <p className="text-xs text-gray-400 mt-1 break-all">{card.imagen_respuesta}</p>
                                                </div>
                                            </div>
                                        )}
                                        <label className="flex items-center mt-2">
                                            <input
                                                type="checkbox"
                                                checked={editData.remove_imagen_respuesta}
                                                onChange={(e) => handleEditChange('remove_imagen_respuesta', e.target.checked)}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-red-600">Eliminar imagen actual</span>
                                        </label>
                                    </div>
                                )}

                                {/* Nueva imagen */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange('imagen_respuesta', e.target.files[0])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                                    disabled={editLoading}
                                />

                                {/* URL alternativa */}
                                <input
                                    type="url"
                                    value={editData.url_respuesta}
                                    onChange={(e) => handleEditChange('url_respuesta', e.target.value)}
                                    placeholder="O usa una URL: https://ejemplo.com/imagen.jpg"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={editLoading}
                                />

                                {/* Preview de URL */}
                                {editData.url_respuesta && isValidImageUrl(editData.url_respuesta) && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-1">Vista previa URL:</p>
                                        <img
                                            src={editData.url_respuesta}
                                            alt="Preview URL respuesta"
                                            className="max-w-32 max-h-32 object-cover border rounded"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <div className="hidden text-xs text-red-500 mt-1">
                                            Error: No se puede cargar la imagen desde esta URL
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Categorías */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categorías
                                </label>
                                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                                    {categoriesWithCount && categoriesWithCount.length > 0 ? (
                                        <div className="space-y-2">
                                            {categoriesWithCount.map((category) => (
                                                <label key={category.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={editData.categorias.includes(category.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                handleEditChange('categorias', [...editData.categorias, category.id]);
                                                            } else {
                                                                handleEditChange('categorias', editData.categorias.filter(id => id !== category.id));
                                                            }
                                                        }}
                                                        className="mr-3"
                                                        disabled={editLoading}
                                                    />
                                                    <span className="text-gray-700">{category.nombre}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            No hay categorías disponibles.
                                        </p>
                                    )}
                                </div>
                                {editData.categorias.length > 0 && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        {editData.categorias.length} categoría{editData.categorias.length !== 1 ? 's' : ''} seleccionada{editData.categorias.length !== 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>

                            {/* Error */}
                            {editError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-800 text-sm">{editError}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleCloseEditModal}
                                disabled={editLoading}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmEdit}
                                disabled={editLoading || !editData.pregunta.trim() || !editData.respuesta.trim()}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {editLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de eliminación */}
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
                                    Eliminar Flashcard
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
                                    ¿Estás seguro de que quieres eliminar la flashcard <strong>#{card.id}</strong>?
                                </p>
                                <p className="text-red-600 text-sm font-medium">
                                    ⚠️ Esta acción no se puede deshacer
                                </p>
                            </div>

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

                            {deleteError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-800 text-sm">{deleteError}</p>
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

            {/* Modal premium */}
            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                featureName={premiumFeature}
            />
        </>
    );
}

export default FlashcardItem;
