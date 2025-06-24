import React, { useState } from 'react';
import { X, Calendar, FileText, Globe, Users, Clock } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, onApplyFilters, currentFilters = {} }) => {
    const [filters, setFilters] = useState({
        year_from: currentFilters.year_from || 2020,
        year_to: currentFilters.year_to || 2025,
        sources: currentFilters.sources || ['scientific_articles'],
        article_types: currentFilters.article_types || [],
        language: currentFilters.language || 'english',
        free_full_text: currentFilters.free_full_text || false,
        has_abstract: currentFilters.has_abstract || false,
        species: currentFilters.species || 'humans',
        sex: currentFilters.sex || '',
        age_groups: currentFilters.age_groups || []
    });

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({
            year_from: 2020,
            year_to: 2025,
            sources: ['scientific_articles'],
            article_types: [],
            language: 'english',
            free_full_text: false,
            has_abstract: false,
            species: 'humans',
            sex: '',
            age_groups: []
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Filtros de Búsqueda</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Rango de Fechas */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Calendar className="mr-2" size={20} />
                        Rango de Fechas
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Desde
                            </label>
                            <input
                                type="number"
                                min="1800"
                                max="2025"
                                value={filters.year_from}
                                onChange={(e) => setFilters({...filters, year_from: parseInt(e.target.value)})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hasta
                            </label>
                            <input
                                type="number"
                                min="1800"
                                max="2025"
                                value={filters.year_to}
                                onChange={(e) => setFilters({...filters, year_to: parseInt(e.target.value)})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Tipos de Artículos */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                        <FileText className="mr-2" size={20} />
                        Tipos de Artículos
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { value: 'meta_analyses', label: 'Meta-análisis' },
                            { value: 'systematic_reviews', label: 'Revisiones Sistemáticas' },
                            { value: 'reviews', label: 'Revisiones' },
                            { value: 'clinical_trials', label: 'Ensayos Clínicos' },
                            { value: 'observational_studies', label: 'Estudios Observacionales' },
                            { value: 'case_reports', label: 'Reportes de Caso' }
                        ].map(type => (
                            <label key={type.value} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters.article_types.includes(type.value)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFilters({
                                                ...filters,
                                                article_types: [...filters.article_types, type.value]
                                            });
                                        } else {
                                            setFilters({
                                                ...filters,
                                                article_types: filters.article_types.filter(t => t !== type.value)
                                            });
                                        }
                                    }}
                                    className="mr-2"
                                />
                                <span className="text-sm">{type.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Idioma */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Globe className="mr-2" size={20} />
                        Idioma
                    </h3>
                    <select
                        value={filters.language}
                        onChange={(e) => setFilters({...filters, language: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="english">Inglés</option>
                        <option value="spanish">Español</option>
                        <option value="french">Francés</option>
                        <option value="german">Alemán</option>
                        <option value="portuguese">Portugués</option>
                    </select>
                </div>

                {/* Disponibilidad de Texto */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Disponibilidad de Texto</h3>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.free_full_text}
                                onChange={(e) => setFilters({...filters, free_full_text: e.target.checked})}
                                className="mr-2"
                            />
                            <span className="text-sm">Solo texto completo gratuito</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.has_abstract}
                                onChange={(e) => setFilters({...filters, has_abstract: e.target.checked})}
                                className="mr-2"
                            />
                            <span className="text-sm">Solo artículos con resumen</span>
                        </label>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-between">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Resetear
                    </button>
                    <div className="space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;