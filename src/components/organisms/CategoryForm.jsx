import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import FormGroup from '../molecules/FormGroup';
import Alert from '../atoms/Alert';
import { useApi } from '../../hooks/useApi';

const CategoryForm = ({ onCategoryCreated }) => {
    const [categoryName, setCategoryName] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const api = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        if (!categoryName.trim()) {
            setErrors({ categoryName: 'El nombre de la categoría es requerido' });
            return;
        }

        try {
            const result = await api.post('flashcard/category', {
                nombre: categoryName.trim()
            });
            if (result.success) {
                const newCategory = result.data.data;

                // ✅ VERIFICAR QUE TENGA nombre
                if (newCategory && newCategory.nombre) {
                    setSuccessMessage('Categoría creada exitosamente');
                    setCategoryName('');

                    if (onCategoryCreated) {
                        onCategoryCreated(newCategory);
                    }
                } else {
                    console.error('❌ Estructura de categoría inválida:', newCategory);
                    setErrors({ general: 'Error: estructura de datos inválida' });
                }

                return;
            } else {
                if (result.errors) {
                    const formattedErrors = {};
                    Object.keys(result.errors).forEach(field => {
                        formattedErrors[field] = Array.isArray(result.errors[field])
                            ? result.errors[field][0]
                            : result.errors[field];
                    });
                    setErrors(formattedErrors);
                } else {
                    setErrors({ general: `Error al crear la categoría` });
                }
            }
        } catch (error) {
            console.log('💥 Error en catch:', error);

            // ✅ VERIFICAR SI YA HAY MENSAJE DE ÉXITO
            if (successMessage) {
                console.log('✅ Ignorando error porque ya hay éxito');
                return;
            }

            // ✅ MANEJO MEJORADO DE ERRORES HTTP
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 422 && data.errors) {
                    // Errores de validación
                    const formattedErrors = {};
                    Object.keys(data.errors).forEach(field => {
                        formattedErrors[field] = Array.isArray(data.errors[field])
                            ? data.errors[field][0]
                            : data.errors[field];
                    });
                    setErrors(formattedErrors);
                } else {
                    setErrors({ general: `Error ${status}: ${data.message || 'Error del servidor'}` });
                }
            } else {
                setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
            }
        }
    };


    return (
        <div className="bg-white rounded container-askt">
            <h2 className="text-2xl font-semibold mb-4 primary-color title-ask-container">
                Crear Categoría
            </h2>
            <hr />

            <form onSubmit={handleSubmit}>
                <Alert type="error" message={errors.general} />
                <Alert type="success" message={successMessage} />

                <FormGroup
                    onSubmit={handleSubmit}
                    submitText="Crear Categoría"
                    loading={api.loading}
                >
                    <FormField
                        id="categoryName"
                        label="Nombre de la Categoría"
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Ingresa el nombre de la categoría"
                        error={errors.categoryName || errors.nombre} // ← CORREGIR: Verificar ambos
                        required
                    />
                </FormGroup>
            </form>
        </div>
    );
};
export default CategoryForm;
