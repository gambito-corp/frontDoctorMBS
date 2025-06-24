// src/pages/Domains/MedChat/components/SearchTypeSelector.jsx
import React from 'react';
import { Tooltip } from 'react-tooltip';
import {
    Search,
    Globe,
    Microscope,
    Filter
} from 'lucide-react';

const SearchTypeSelector = ({
                                selectedType,
                                onTypeChange,
                                onFilterClick,
                                hasActiveFilters = false
                            }) => {
    const searchTypes = [
        {
            id: 'simple',
            icon: Search,
            tooltip: 'Búsqueda Simple',
            description: 'Respuesta rápida basada en conocimiento general médico'
        },
        {
            id: 'standard',
            icon: Globe,
            tooltip: 'Búsqueda Web',
            description: 'Búsqueda en artículos científicos con resultados estándar'
        },
        {
            id: 'deep_research',
            icon: Microscope,
            tooltip: 'Investigación Profunda',
            description: 'Análisis detallado con artículos científicos incluidos en la respuesta'
        }
    ];

    return (
        <div className="flex items-center space-x-1 mr-2">
            {/* Radio Buttons Camuflados */}
            {searchTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedType === type.id;

                return (
                    <div key={type.id} className="relative">
                        <button
                            type="button"
                            onClick={() => onTypeChange(type.id)}
                            className={`
                                p-2 rounded-lg transition-all duration-200 
                                ${isSelected
                                ? 'bg-blue-100 text-blue-600 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }
                            `}
                            data-tooltip-id={`search-type-${type.id}`}
                        >
                            <IconComponent size={18} />
                        </button>

                        {/* Tooltip */}
                        <Tooltip
                            id={`search-type-${type.id}`}
                            place="top"
                            className="z-50"
                        >
                            <div className="text-center">
                                <div className="font-semibold text-sm">{type.tooltip}</div>
                                <div className="text-xs mt-1 max-w-48">{type.description}</div>
                            </div>
                        </Tooltip>
                    </div>
                );
            })}

            {/* Separador */}
            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Botón de Filtros */}
            <button
                type="button"
                onClick={onFilterClick}
                className={`
                    p-2 rounded-lg transition-all duration-200 relative
                    ${hasActiveFilters
                    ? 'bg-green-100 text-green-600 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }
                `}
                data-tooltip-id="filter-button"
            >
                <Filter size={18} />
                {hasActiveFilters && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                )}
            </button>

            <Tooltip
                id="filter-button"
                place="top"
                className="z-50"
            >
                <div className="text-center">
                    <div className="font-semibold text-sm">Filtros Avanzados</div>
                    <div className="text-xs mt-1">
                        {hasActiveFilters ? 'Filtros activos' : 'Configurar filtros de búsqueda'}
                    </div>
                </div>
            </Tooltip>
        </div>
    );
};

export default SearchTypeSelector;
