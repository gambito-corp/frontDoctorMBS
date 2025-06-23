import React, { useState } from 'react';
import Modal from './Modal';
import Button from '../../atoms/Button';
import { useApi } from '../../../hooks/useApi';

const DeleteCategoryModal = ({
                                 isOpen = false,
                                 onClose,
                                 category = null,
                                 onCategoryDeleted
                             }) => {
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmText, setConfirmText] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Texto que debe escribir para confirmar
    const confirmationText = 'ELIMINAR CATEGORIA';

    const handleDelete = async () => {
        if (!category || !isConfirmed) return;

        setLoading(true);
        setError('');

        try {
            const result = await api.delete(`flashcard/categories/${category.id}`);

            if (result.success) {
                onCategoryDeleted?.(category);
                onClose();
            } else {
                setError(result.error || 'Error al eliminar la categoría');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Error de conexión. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Limpiar estados al cerrar
    const handleClose = () => {
        setError('');
        setConfirmText('');
        setIsConfirmed(false);
        onClose();
    };

    // Verificar texto de confirmación
    const handleConfirmTextChange = (e) => {
        const value = e.target.value;
        setConfirmText(value);
        setIsConfirmed(value === confirmationText);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Eliminar Categoría"
            size="medium"
        >
            <div className="space-y-4">
                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Icono y mensaje principal */}
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">
                            ¿Eliminar esta categoría?
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                            Esta acción no se puede deshacer.
                        </p>
                    </div>
                </div>

                {/* Información de la categoría */}
                {category && (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                                <div>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Categoría a eliminar
                                    </span>
                                    <p className="text-lg font-medium text-gray-900 mt-1">
                                        {category.nombre || category.name}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    ID
                                </span>
                                <p className="text-sm text-gray-700 mt-1">
                                    #{category.id}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Advertencias múltiples */}
                <div className="space-y-3">
                    {/* Advertencia principal */}
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    ⚠️ Advertencia Crítica
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>
                                        Esta categoría será eliminada <strong>permanentemente</strong>.
                                        No podrás recuperarla después de confirmar esta acción.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Impacto en flashcards */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    📚 Impacto en Flashcards
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Todas las flashcards de esta categoría quedarán <strong>sin categoría</strong></li>
                                        <li>Las flashcards NO serán eliminadas, solo perderán su categorización</li>
                                        <li>Podrás reasignarlas a otras categorías posteriormente</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DOBLE VERIFICACIÓN */}
                <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-orange-800">
                                    🔒 Verificación de Seguridad
                                </h3>
                                <p className="text-sm text-orange-700 mt-1">
                                    Para confirmar la eliminación de la categoría, escribe <code className="bg-orange-200 px-1 rounded font-mono text-xs">{confirmationText}</code> en el campo de abajo:
                                </p>
                            </div>
                        </div>

                        <div>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={handleConfirmTextChange}
                                placeholder={`Escribe "${confirmationText}" para confirmar`}
                                className={`w-full px-3 py-2 border rounded-md text-sm font-mono ${
                                    confirmText === confirmationText
                                        ? 'border-green-300 bg-green-50 text-green-800'
                                        : 'border-gray-300'
                                }`}
                            />
                            {isConfirmed && (
                                <div className="flex items-center mt-2">
                                    <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-green-600 font-medium">
                                        ✅ Verificación completada
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Confirmación final */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="confirm-understand"
                            checked={isConfirmed}
                            onChange={() => {}} // Solo visual, la lógica está en el input de texto
                            disabled
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <label htmlFor="confirm-understand" className="ml-2 text-sm text-gray-700">
                            Entiendo que esta acción es <strong>irreversible</strong> y afectará a las flashcards asociadas
                        </label>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        onClick={handleDelete}
                        disabled={loading || !isConfirmed}
                    >
                        {loading ? 'Eliminando...' : '🗑️ Eliminar Categoría'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteCategoryModal;
