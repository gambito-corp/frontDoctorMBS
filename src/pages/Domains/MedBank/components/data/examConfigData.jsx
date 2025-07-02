// components/MedBank/data/examConfigData.js
export const areas = [
    { id: 1, name: 'Medicina General', description: 'Conocimientos generales de medicina' },
    { id: 2, name: 'Cardiología', description: 'Especialidad del corazón' },
    { id: 3, name: 'Neurología', description: 'Especialidad del sistema nervioso' },
    { id: 4, name: 'Pediatría', description: 'Medicina infantil' },
    { id: 5, name: 'Ginecología', description: 'Salud femenina' }
];

export const categories = [
    { id: 1, name: 'Diagnóstico', description: 'Preguntas sobre diagnóstico médico' },
    { id: 2, name: 'Tratamiento', description: 'Preguntas sobre tratamientos' },
    { id: 3, name: 'Farmacología', description: 'Medicamentos y fármacos' },
    { id: 4, name: 'Anatomía', description: 'Estructura del cuerpo humano' }
];

export const tipos = [
    { id: 1, name: 'Tipo A', description: 'Preguntas de opción múltiple' },
    { id: 2, name: 'Tipo B', description: 'Preguntas verdadero/falso' },
    { id: 3, name: 'Tipo C', description: 'Preguntas de desarrollo' }
];

export const universities = [
    { id: 1, name: 'Universidad Complutense Madrid' },
    { id: 2, name: 'Universidad de Barcelona' },
    { id: 3, name: 'Universidad de Valencia' },
    { id: 4, name: 'Universidad de Sevilla' }
];

export const getDataByType = (type) => {
    const dataMap = {
        areas,
        categories,
        tipos,
        universities
    };
    return dataMap[type] || [];
};
