import React, { useState, useEffect, useCallback  } from 'react';
import TextAreaField from '../molecules/TextAreaField';
import ImageUploadField from '../molecules/ImageUploadField';
import CategorySelector from '../molecules/CategorySelector';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import FullScreenLoader from '../atoms/FullScreenLoader';
import { useApi } from '../../hooks/useApi';

const FlashcardForm = ({
                           onFlashcardCreated,
                           categories = [],
                           className = '',
                           ...props
                       }) => {
    const [formData, setFormData] = useState({
        pregunta: '',
        respuesta: '',
        url: '',
        imagen: null,
        url_respuesta: '',
        imagen_respuesta: null,
        selectedCategories: []
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [aiLoading, setAiLoading] = useState({
        pregunta: false,
        respuesta: false
    });
    const [isAnyAiLoading, setIsAnyAiLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiAnimating, setAiAnimating] = useState({
        pregunta: false,
        respuesta: false
    });

    const api = useApi();

    // Controlar el estado general de IA
    useEffect(() => {
        const anyLoading = aiLoading.pregunta || aiLoading.respuesta;
        setIsAnyAiLoading(anyLoading);
    }, [aiLoading.pregunta, aiLoading.respuesta]);

    // ← Nuevo: Estado general de loading (IA o submit)
    const isAnyLoading = isAnyAiLoading || isSubmitting;

    const handleChange = useCallback((field, value) => {
        if (isSubmitting) return;

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    }, [isSubmitting, errors]); // ← Dependencias específicas

    const handleImageUrlChange = (field, value) => {
        // ← Prevenir cambios si está enviando
        if (isSubmitting) return;

        setFormData(prev => ({
            ...prev,
            [field]: value,
            [field === 'url' ? 'imagen' : 'imagen_respuesta']: value.trim() ? null : prev[field === 'url' ? 'imagen' : 'imagen_respuesta']
        }));
    };

    const handleImageFileChange = (field, file) => {
        // ← Prevenir cambios si está enviando
        if (isSubmitting) return;

        setFormData(prev => ({
            ...prev,
            [field === 'imagen' ? 'imagen' : 'imagen_respuesta']: file,
            [field === 'imagen' ? 'url' : 'url_respuesta']: file ? '' : prev[field === 'imagen' ? 'url' : 'url_respuesta']
        }));
    };

    const handleImageClear = (type) => {
        // ← Prevenir cambios si está enviando
        if (isSubmitting) return;

        if (type === 'pregunta') {
            setFormData(prev => ({
                ...prev,
                url: '',
                imagen: null
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                url_respuesta: '',
                imagen_respuesta: null
            }));
        }
    };

    const handleAIGenerate = async (type) => {
        if (isAnyLoading) {
            setErrors(prev => ({
                ...prev,
                [`ai_${type}`]: isSubmitting
                    ? 'No se puede generar IA mientras se está creando la flashcard.'
                    : 'Ya hay una generación de IA en proceso. Espera a que termine.'
            }));
            return;
        }

        setAiLoading(prev => ({ ...prev, [type]: true }));
        setErrors(prev => ({ ...prev, [`ai_${type}`]: null }));

        try {
            let prompt = '';

            if (type === 'pregunta') {
                prompt = formData.respuesta
                    ? `Genera una pregunta de flashcard para esta respuesta: ${formData.respuesta} pero que sea muy breve que es para la pregunta de una Flashcard y su dificultad debe ser a nivel de Medico Universitario.`
                    : `Genera una pregunta de flashcard para una flashcard que sea muy breve que es para la pregunta de una Flashcard tiene que ser de caracter medico y su dificultad debe ser a nivel de Medico Universitario.`;
            } else {
                prompt = formData.pregunta
                    ? `Genera una respuesta breve y clara para esta pregunta: ${formData.pregunta} pero que sea muy breve que es para la respuesta de una Flashcard y su dificultad debe ser a nivel de Medico Universitario.`
                    : `Genera una respuesta educativa para una flashcard que sea muy breve que es para la respuesta de una Flashcard y su dificultad debe ser a nivel de Medico Universitario.`;
            }

            const result = await api.get('flashcard/ai-generate', {
                params: {
                    type: type,
                    prompt: prompt,
                    current_text: formData[type]
                }
            });

            if (result.success) {
                const generatedText = result.data?.data?.generated_text || result.data?.generated_text;
                if (generatedText) {
                    // ← Activar animación ANTES de cambiar el valor
                    setAiAnimating(prev => ({ ...prev, [type]: true }));

                    // ← Cambiar el valor directamente
                    setFormData(prev => ({
                        ...prev,
                        [type]: generatedText
                    }));

                    // ← Desactivar animación después de un tiempo
                    setTimeout(() => {
                        setAiAnimating(prev => ({ ...prev, [type]: false }));
                    }, generatedText.length * 25); // 25ms por carácter
                } else {
                    setErrors(prev => ({
                        ...prev,
                        [`ai_${type}`]: 'No se pudo generar el texto'
                    }));
                }
            } else {
                setErrors(prev => ({
                    ...prev,
                    [`ai_${type}`]: result.error || 'Error al generar contenido con IA'
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [`ai_${type}`]: 'Error de conexión con el servicio de IA'
            }));
        } finally {
            setAiLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        // ← Prevenir envío si hay cualquier loading activo
        if (isAnyLoading) {
            setErrors({
                general: isAnyAiLoading
                    ? 'Espera a que termine la generación de IA antes de enviar el formulario.'
                    : 'Ya se está procesando la flashcard.'
            });
            return;
        }

        // Validación básica del cliente
        const newErrors = {};
        if (!formData.pregunta.trim()) {
            newErrors.pregunta = 'La pregunta es requerida';
        } else if (formData.pregunta.trim().length <= 5) {
            newErrors.pregunta = 'La pregunta debe tener al menos 5 caracteres';
        }

        if (!formData.respuesta.trim()) {
            newErrors.respuesta = 'La respuesta es requerida';
        } else if (formData.respuesta.trim().length <= 2) {
            newErrors.respuesta = 'La respuesta debe tener al menos 2 caracteres';
        }

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

        setIsSubmitting(true);

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

            const result = await api.post('flashcard', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // En FlashcardForm.jsx, en el handleSubmit:
            if (result.success) {
                console.log('✅ Respuesta completa flashcard:', result);

                // ✅ EXTRAER LA FLASHCARD CORRECTAMENTE
                const newFlashcard = result.data.data || result.data.flashcard || result.data;
                console.log('✅ Flashcard extraída:', newFlashcard);

                setSuccessMessage('Flashcard creada exitosamente');
                setFormData({
                    pregunta: '',
                    respuesta: '',
                    url: '',
                    imagen: null,
                    url_respuesta: '',
                    imagen_respuesta: null,
                    selectedCategories: []
                });

                if (onFlashcardCreated && newFlashcard && newFlashcard.id) {
                    onFlashcardCreated(newFlashcard);
                } else {
                    console.error('❌ No se pudo extraer la flashcard válida:', newFlashcard);
                }
            } else {
                if (result.status === 422 && result.errors) {
                    const serverErrors = {};
                    Object.keys(result.errors).forEach(field => {
                        serverErrors[field] = Array.isArray(result.errors[field])
                            ? result.errors[field][0]
                            : result.errors[field];
                    });
                    setErrors(serverErrors);
                } else {
                    setErrors({ general: result.error || 'Error al crear la flashcard' });
                }
            }
        } catch (error) {
            setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* ← Loading fullscreen */}
            <FullScreenLoader
                show={isSubmitting}
                message="Creando flashcard..."
                subMessage="Por favor espera, estamos procesando tu flashcard"
            />

            <div className="bg-white p-6 rounded container-askt">
                <h1 className="text-2xl font-semibold mb-4 primary-color title-ask-container">
                    Crear Flashcard
                </h1>
                <hr />

                <form onSubmit={handleSubmit} className="form-container-ask mt-4">
                    <Alert type="error" message={errors.general} />
                    <Alert type="success" message={successMessage} />

                    {/* ← Mostrar alerta solo para IA, no para submit */}
                    {isAnyAiLoading && !isSubmitting && (
                        <Alert
                            type="info"
                            message="🤖 Generando contenido con IA... Por favor espera antes de usar otros botones."
                            className="mb-4"
                        />
                    )}

                    {/* Pregunta */}
                    <TextAreaField
                        id="pregunta"
                        label="Pregunta"
                        value={formData.pregunta}
                        onChange={(e) => handleChange('pregunta', e.target.value)}
                        placeholder="Ingresa la pregunta"
                        error={errors.pregunta}
                        required
                        showAIButton={true}
                        onAIGenerate={() => handleAIGenerate('pregunta')}
                        aiLoading={aiLoading.pregunta}
                        aiDisabled={isAnyLoading && !aiLoading.pregunta}
                        disabled={isSubmitting}
                        animated={true}
                        aiAnimating={aiAnimating.pregunta}
                    />
                    {errors.ai_pregunta && (
                        <Alert type="error" message={errors.ai_pregunta} className="mb-4" />
                    )}

                    {/* Respuesta */}
                    <TextAreaField
                        id="respuesta"
                        label="Respuesta"
                        value={formData.respuesta}
                        onChange={(e) => handleChange('respuesta', e.target.value)}
                        placeholder="Ingresa la respuesta"
                        error={errors.respuesta}
                        required
                        showAIButton={true}
                        onAIGenerate={() => handleAIGenerate('respuesta')}
                        aiLoading={aiLoading.respuesta}
                        aiDisabled={isAnyLoading && !aiLoading.respuesta}
                        disabled={isSubmitting}
                        animated={true}
                        aiAnimating={aiAnimating.respuesta}
                    />
                    {errors.ai_respuesta && (
                        <Alert type="error" message={errors.ai_respuesta} className="mb-4" />
                    )}

                    {/* Imágenes en 2 columnas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <ImageUploadField
                            id="imagen_pregunta"
                            label="Imagen de Pregunta"
                            urlValue={formData.url}
                            fileValue={formData.imagen}
                            onUrlChange={(value) => handleImageUrlChange('url', value)}
                            onFileChange={(file) => handleImageFileChange('imagen', file)}
                            onClear={() => handleImageClear('pregunta')}
                            error={errors.imagen || errors.url}
                            disabled={isSubmitting}
                        />

                        <ImageUploadField
                            id="imagen_respuesta"
                            label="Imagen de Respuesta"
                            urlValue={formData.url_respuesta}
                            fileValue={formData.imagen_respuesta}
                            onUrlChange={(value) => handleImageUrlChange('url_respuesta', value)}
                            onFileChange={(file) => handleImageFileChange('imagen_respuesta', file)}
                            onClear={() => handleImageClear('respuesta')}
                            error={errors.imagen_respuesta || errors.url_respuesta}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Selector de categorías */}
                    <CategorySelector
                        categories={categories}
                        selectedCategories={formData.selectedCategories}
                        onChange={(selected) => handleChange('selectedCategories', selected)}
                    />



                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isAnyLoading}
                        className="boton-success-m w-full md:w-auto"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 814 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creando...
                            </>
                        ) : isAnyAiLoading ? 'Esperando IA...' : 'Crear Flashcard'}
                    </Button>
                </form>
            </div>
        </>
    );
};

export default FlashcardForm;
