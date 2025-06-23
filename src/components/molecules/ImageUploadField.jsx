import React, { useState, useEffect } from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import FileInput from '../atoms/FileInput';
import ImagePreview from '../atoms/ImagePreview';

const ImageUploadField = ({
                              id,
                              label,
                              urlValue = '',
                              fileValue = null,
                              onUrlChange,
                              onFileChange,
                              onClear,
                              error,
                              disabled = false,
                              className = ''
                          }) => {
    const [localUrlValue, setLocalUrlValue] = useState(urlValue);
    const [urlError, setUrlError] = useState('');
    const [isValidatingUrl, setIsValidatingUrl] = useState(false);
    const [previewSrc, setPreviewSrc] = useState('');
    const [previewType, setPreviewType] = useState('');

    // Sincronizar con prop externa
    useEffect(() => {
        setLocalUrlValue(urlValue);
    }, [urlValue]);

    // Solo manejar preview para archivos
    useEffect(() => {
        if (fileValue) {
            const fileUrl = URL.createObjectURL(fileValue);
            setPreviewSrc(fileUrl);
            setPreviewType('file');

            return () => URL.revokeObjectURL(fileUrl);
        } else if (!localUrlValue) {
            // Si no hay archivo y no hay URL, limpiar preview
            setPreviewSrc('');
            setPreviewType('');
        }
    }, [fileValue, localUrlValue]);

    // Función para validar si una cadena es una URL válida
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Función para verificar si la URL existe (HEAD request)
    const checkUrlExists = async (url) => {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors' // Para evitar problemas de CORS
            });
            return true; // Si no hay error, asumimos que existe
        } catch (error) {
            // Intentar con GET si HEAD falla
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    mode: 'no-cors'
                });
                return true;
            } catch (getError) {
                return false;
            }
        }
    };

    // Manejar cambio local (solo actualizar estado local)
    const handleUrlChange = (e) => {
        if (disabled) return;

        const newValue = e.target.value;
        setLocalUrlValue(newValue);

        // Limpiar errores mientras escribe
        if (urlError) {
            setUrlError('');
        }

        // Si se vacía, notificar inmediatamente y limpiar preview
        if (!newValue.trim()) {
            onUrlChange('');
            setPreviewSrc('');
            setPreviewType('');
        }
    };

    // Manejar cuando el input pierde el foco
// Manejar cuando el input pierde el foco
    const handleUrlBlur = async () => {
        if (disabled) return;

        const trimmedValue = localUrlValue.trim();

        if (trimmedValue === '') {
            // Si está vacío, no mostrar error ni previsualización
            setUrlError('');
            setPreviewSrc('');
            setPreviewType('');
            onUrlChange('');
            return;
        }

        if (!isValidUrl(trimmedValue)) {
            // Si no es URL válida, mostrar error
            setUrlError('La URL no es válida');
            setPreviewSrc('');
            setPreviewType('');
            onUrlChange('');
            return;
        }

        // Verificar si parece ser una URL de imagen por extensión
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
        const looksLikeImage = imageExtensions.test(trimmedValue);

        if (looksLikeImage) {
            // Si parece una imagen, intentar cargarla pero ser más permisivo
            setIsValidatingUrl(true);
            setUrlError('');

            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';

                const imageExists = await new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => {
                        // Si falla por CORS, asumir que la imagen existe
                        // porque la URL tiene extensión de imagen válida
                        resolve(true);
                    };
                    img.src = trimmedValue;

                    // Timeout más corto - 3 segundos
                    setTimeout(() => resolve(true), 3000); // ← Asumir que existe si tarda mucho
                });

                // Si llegamos aquí, mostrar la imagen
                setUrlError('');
                setPreviewSrc(trimmedValue);
                setPreviewType('url');
                onUrlChange(trimmedValue);

            } catch (error) {
                // Incluso si hay error, si parece imagen, permitirla
                setUrlError('');
                setPreviewSrc(trimmedValue);
                setPreviewType('url');
                onUrlChange(trimmedValue);
            } finally {
                setIsValidatingUrl(false);
            }
        } else {
            // Si no parece una imagen, intentar validación más estricta
            setIsValidatingUrl(true);
            setUrlError('');

            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';

                const imageExists = await new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                    img.src = trimmedValue;

                    // Timeout de 5 segundos para URLs sin extensión
                    setTimeout(() => resolve(false), 5000);
                });

                if (imageExists) {
                    setUrlError('');
                    setPreviewSrc(trimmedValue);
                    setPreviewType('url');
                    onUrlChange(trimmedValue);
                } else {
                    setUrlError('La URL no contiene una imagen válida o no es accesible');
                    setPreviewSrc('');
                    setPreviewType('');
                    onUrlChange('');
                }
            } catch (error) {
                setUrlError('Error al validar la URL');
                setPreviewSrc('');
                setPreviewType('');
                onUrlChange('');
            } finally {
                setIsValidatingUrl(false);
            }
        }
    };


    const handleFileChange = (e) => {
        if (disabled) return;

        const file = e.target.files[0];
        onFileChange(file);

        // Si se selecciona archivo, limpiar URL
        if (file) {
            setLocalUrlValue('');
            setUrlError('');
        }
    };

    const handleRemoveImage = () => {
        if (disabled) return;

        setPreviewSrc('');
        setPreviewType('');
        setLocalUrlValue('');
        setUrlError('');
        onClear();
    };

    const hasImage = previewSrc && (fileValue || (previewType === 'url'));

    return (
        <div className={`mb-4 ${className}`}>
            <Label htmlFor={id}>{label}</Label>

            <div className="mt-2 space-y-3">
                {/* Preview de imagen */}
                {hasImage && (
                    <div className="flex justify-center">
                        <ImagePreview
                            src={previewSrc}
                            onRemove={handleRemoveImage}
                            alt={`Preview ${label}`}
                        />
                    </div>
                )}

                {/* Inputs - solo mostrar cuando no hay imagen válida */}
                {!hasImage && (
                    <div className="space-y-3">
                        {/* Input URL */}
                        <div>
                            <Input
                                id={`${id}_url`}
                                type="url"
                                value={localUrlValue}
                                onChange={handleUrlChange}
                                onBlur={handleUrlBlur} // ← Validar solo en blur
                                placeholder="URL de la imagen (opcional)"
                                className="w-full"
                                disabled={disabled}
                                error={urlError}
                            />

                            {/* Indicadores de estado */}
                            {isValidatingUrl && (
                                <div className="flex items-center text-xs text-blue-600 mt-1">
                                    <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full mr-2"></div>
                                    Validando URL...
                                </div>
                            )}

                            {urlError && (
                                <div className="text-xs text-red-500 mt-1">
                                    {urlError}
                                </div>
                            )}
                        </div>

                        {/* Separador */}
                        <div className="flex items-center">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-3 text-sm text-gray-500 bg-white">o</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Input File */}
                        <div>
                            <FileInput
                                id={`${id}_file`}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="w-full"
                                disabled={disabled}
                            />
                        </div>
                    </div>
                )}

                {/* Mostrar tipo de imagen actual */}
                {hasImage && (
                    <div className="text-xs text-gray-500 text-center">
                        {previewType === 'url' ? '📎 Imagen desde URL' : '📁 Archivo subido'}
                    </div>
                )}
            </div>

            {error && (
                <span className="text-red-500 text-sm mt-1 block">{error}</span>
            )}
        </div>
    );
};

export default ImageUploadField;
