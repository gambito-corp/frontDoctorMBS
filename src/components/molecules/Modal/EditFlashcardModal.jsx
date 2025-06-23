import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from '../../atoms/Button';
import { useApi } from '../../../hooks/useApi';
import CategorySelector from '../CategorySelector';

const EditFlashcardModal = ({
                                isOpen = false,
                                onClose,
                                flashcard = null,
                                categories = [],
                                onFlashcardUpdated
                            }) => {
    const api = useApi();
    const [formData, setFormData] = useState({
        pregunta: '',
        respuesta: '',
        url: '',
        imagen: null,
        url_respuesta: '',
        imagen_respuesta: null,
        selectedCategories: []
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [previewImages, setPreviewImages] = useState({
        pregunta: null,
        respuesta: null
    });

    // Cargar datos cuando se abre el modal
    useEffect(() => {
        if (isOpen && flashcard) {
            setFormData({
                pregunta: flashcard.pregunta || '',
                respuesta: flashcard.respuesta || '',
                url: flashcard.url || '',
                imagen: null,
                url_respuesta: flashcard.url_respuesta || '',
                imagen_respuesta: null,
                selectedCategories: flashcard.categories?.map(cat => cat.id) || []
            });

            // Configurar previsualizaciones de imágenes existentes
            setPreviewImages({
                pregunta: flashcard.url || null,
                respuesta: flashcard.url_respuesta || null
            });

            setErrors({});
        }
    }, [isOpen, flashcard]);

    // Limpiar URLs de objeto cuando el componente se desmonte
    useEffect(() => {
        return () => {
            Object.values(previewImages).forEach(preview => {
                if (preview && preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!flashcard) return;

        // Validación básica
        const newErrors = {};
        if (!formData.pregunta.trim()) {
            newErrors.pregunta = 'La pregunta es obligatoria';
        }
        if (!formData.respuesta.trim()) {
            newErrors.respuesta = 'La respuesta es obligatoria';
        }

        // Validación de imágenes
        if (formData.url.trim() && formData.imagen) {
            newErrors.imagen = 'No puedes subir una imagen y una URL al mismo tiempo para la pregunta';
        }
        if (formData.url_respuesta.trim() && formData.imagen_respuesta) {
            newErrors.imagen_respuesta = 'No puedes subir una imagen y una URL al mismo tiempo para la respuesta';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();
            submitData.append('pregunta', formData.pregunta.trim());
            submitData.append('respuesta', formData.respuesta.trim());
            submitData.append('url', formData.url.trim());
            submitData.append('url_respuesta', formData.url_respuesta.trim());

            if (formData.imagen) {
                submitData.append('imagen', formData.imagen);
            }
            if (formData.imagen_respuesta) {
                submitData.append('imagen_respuesta', formData.imagen_respuesta);
            }
            if (formData.selectedCategories.length > 0) {
                submitData.append('categorias', JSON.stringify(formData.selectedCategories));
            }

            const result = await api.put(`flashcard/${flashcard.id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (result.success) {
                onFlashcardUpdated?.(result.data.flashcard || result.data.data);
                onClose();
            } else {
                setErrors({ general: result.error || 'Error al actualizar la flashcard' });
            }
        } catch (error) {
            console.error('Error updating flashcard:', error);
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

    const handleCategoryChange = (selectedCategories) => {
        setFormData(prev => ({
            ...prev,
            selectedCategories
        }));
    };

    const handleImageUrlChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            [field === 'url' ? 'imagen' : 'imagen_respuesta']: value.trim() ? null : prev[field === 'url' ? 'imagen' : 'imagen_respuesta']
        }));

        // Actualizar preview
        const previewType = field === 'url' ? 'pregunta' : 'respuesta';
        setPreviewImages(prev => ({
            ...prev,
            [previewType]: value.trim() || null
        }));
    };

    const handleImageFileChange = (field, file) => {
        const previewType = field === 'imagen' ? 'pregunta' : 'respuesta';

        setFormData(prev => ({
            ...prev,
            [field]: file,
            [field === 'imagen' ? 'url' : 'url_respuesta']: file ? '' : prev[field === 'imagen' ? 'url' : 'url_respuesta']
        }));

        // Crear preview para el archivo
        if (file) {
            const newPreview = URL.createObjectURL(file);

            // Limpiar preview anterior si existe
            const oldPreview = previewImages[previewType];
            if (oldPreview && oldPreview.startsWith('blob:')) {
                URL.revokeObjectURL(oldPreview);
            }

            setPreviewImages(prev => ({
                ...prev,
                [previewType]: newPreview
            }));
        } else {
            setPreviewImages(prev => ({
                ...prev,
                [previewType]: null
            }));
        }
    };

    const handleImageClear = (type) => {
        if (type === 'pregunta') {
            setFormData(prev => ({
                ...prev,
                url: '',
                imagen: null
            }));

            // Limpiar preview
            const oldPreview = previewImages.pregunta;
            if (oldPreview && oldPreview.startsWith('blob:')) {
                URL.revokeObjectURL(oldPreview);
            }

            setPreviewImages(prev => ({
                ...prev,
                pregunta: null
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                url_respuesta: '',
                imagen_respuesta: null
            }));

            // Limpiar preview
            const oldPreview = previewImages.respuesta;
            if (oldPreview && oldPreview.startsWith('blob:')) {
                URL.revokeObjectURL(oldPreview);
            }

            setPreviewImages(prev => ({
                ...prev,
                respuesta: null
            }));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Flashcard"
            size="large"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error general */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-800">{errors.general}</p>
                    </div>
                )}

                {/* Pregunta */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pregunta *
                    </label>
                    <textarea
                        name="pregunta"
                        value={formData.pregunta}
                        onChange={handleChange}
                        required
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.pregunta ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Escribe tu pregunta aquí..."
                    />
                    {errors.pregunta && (
                        <p className="text-sm text-red-600 mt-1">{errors.pregunta}</p>
                    )}
                </div>

                {/* Respuesta */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Respuesta *
                    </label>
                    <textarea
                        name="respuesta"
                        value={formData.respuesta}
                        onChange={handleChange}
                        required
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.respuesta ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Escribe tu respuesta aquí..."
                    />
                    {errors.respuesta && (
                        <p className="text-sm text-red-600 mt-1">{errors.respuesta}</p>
                    )}
                </div>

                {/* Imágenes en 2 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Imagen de Pregunta */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Imagen de Pregunta
                        </label>

                        {/* URL de imagen */}
                        <div className="mb-3">
                            <input
                                type="url"
                                placeholder="URL de la imagen"
                                value={formData.url}
                                onChange={(e) => handleImageUrlChange('url', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.imagen || errors.url ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                        </div>

                        {/* Subir archivo */}
                        <div className="mb-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange('imagen', e.target.files[0])}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Preview */}
                        {previewImages.pregunta && (
                            <div className="mb-3">
                                <img
                                    src={previewImages.pregunta}
                                    alt="Preview pregunta"
                                    className="max-w-full h-32 object-cover rounded-md border"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleImageClear('pregunta')}
                                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                                >
                                    Quitar imagen
                                </button>
                            </div>
                        )}

                        {(errors.imagen || errors.url) && (
                            <p className="text-sm text-red-600">{errors.imagen || errors.url}</p>
                        )}
                    </div>

                    {/* Imagen de Respuesta */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Imagen de Respuesta
                        </label>

                        {/* URL de imagen */}
                        <div className="mb-3">
                            <input
                                type="url"
                                placeholder="URL de la imagen"
                                value={formData.url_respuesta}
                                onChange={(e) => handleImageUrlChange('url_respuesta', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.imagen_respuesta || errors.url_respuesta ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                        </div>

                        {/* Subir archivo */}
                        <div className="mb-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange('imagen_respuesta', e.target.files[0])}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Preview */}
                        {previewImages.respuesta && (
                            <div className="mb-3">
                                <img
                                    src={previewImages.respuesta}
                                    alt="Preview respuesta"
                                    className="max-w-full h-32 object-cover rounded-md border"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleImageClear('respuesta')}
                                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                                >
                                    Quitar imagen
                                </button>
                            </div>
                        )}

                        {(errors.imagen_respuesta || errors.url_respuesta) && (
                            <p className="text-sm text-red-600">{errors.imagen_respuesta || errors.url_respuesta}</p>
                        )}
                    </div>
                </div>

                {/* Selector de categorías */}
                <CategorySelector
                    categories={categories}
                    selectedCategories={formData.selectedCategories}
                    onChange={handleCategoryChange}
                />

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditFlashcardModal;
