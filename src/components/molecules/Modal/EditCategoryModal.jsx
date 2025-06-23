import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from '../../atoms/Button';
import { useApi } from '../../../hooks/useApi';

const EditCategoryModal = ({
                               isOpen = false,
                               onClose,
                               category = null,
                               onCategoryUpdated
                           }) => {
    const api = useApi();
    const [formData, setFormData] = useState({
        nombre: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Cargar datos cuando se abre el modal
    useEffect(() => {
        if (isOpen && category) {
            setFormData({
                nombre: category.nombre || category.name || ''
            });
            setErrors({});
        }
    }, [isOpen, category]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category) return;

        // Validación básica
        const newErrors = {};
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre de la categoría es obligatorio';
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (formData.nombre.trim().length > 50) {
            newErrors.nombre = 'El nombre no puede tener más de 50 caracteres';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const result = await api.put(`flashcard/categories/${category.id}`, {
                nombre: formData.nombre.trim()
            });

            if (result.success) {
                onCategoryUpdated?.(result.data.category);
                onClose();
            } else {
                setErrors({ general: result.error || 'Error al actualizar la categoría' });
            }
        } catch (error) {
            console.error('Error updating category:', error);
            setErrors({ general: 'Error de conexión. Inténtalo de nuevo.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Limpiar errores al cerrar
    const handleClose = () => {
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Editar Categoría"
            size="medium"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error general */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-800">{errors.general}</p>
                    </div>
                )}

                {/* Información actual */}
                {category && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-800">
                                    <span className="font-medium">Categoría actual:</span> {category.nombre || category.name}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Campo nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la categoría *
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        maxLength={50}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.nombre ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Matemáticas, Historia, Ciencias..."
                    />
                    {errors.nombre && (
                        <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.nombre.length}/50 caracteres
                    </p>
                </div>

                {/* Vista previa */}
                {formData.nombre.trim() && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vista previa
                        </label>
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-900">
                                    {formData.nombre.trim()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Información adicional */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-800">
                                Información importante
                            </h3>
                            <div className="mt-2 text-sm text-gray-600">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Todas las flashcards mantendrán su asociación con esta categoría</li>
                                    <li>El cambio se aplicará inmediatamente</li>
                                    <li>Puedes usar emojis y caracteres especiales</li>
                                </ul>
                            </div>
                        </div>
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
                        type="submit"
                        variant="primary"
                        disabled={loading || !formData.nombre.trim()}
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditCategoryModal;
