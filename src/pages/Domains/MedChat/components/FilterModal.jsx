import React, { useState, useEffect, useMemo } from 'react';
import DoubleRangeSlider from './DoubleRangeSlider';
import {usePremiumAccess} from "../../../../hooks/usePremiumAccess";
import { Crown, Sparkles, Lock } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters = {} }) => {
    // ✅ TIPOS DE DOCUMENTO (exactos de tu DocumentTypeEnum)
    const documentTypes = [
        { value: 'journal_articles', label: 'Artículos de Revista' },
        { value: 'books', label: 'Libros y Documentos' },
        { value: 'guidelines', label: 'Guías y Recomendaciones' },
        { value: 'news_commentary', label: 'Noticias y Comentarios' },
        { value: 'educational', label: 'Material Educativo' },
        { value: 'conferences', label: 'Material de Conferencias' },
        { value: 'technical_legal', label: 'Técnico y Legal' }
    ];
    const { isPremium } = usePremiumAccess();

    // ✅ SUBFILTROS POR TIPO (exactos de tu DocumentTypeEnum)
    const subfiltrosByType = {
        journal_articles: [
            { key: 'meta_analyses', label: 'Meta-análisis', evidence_level: 'highest' },
            { key: 'systematic_reviews', label: 'Revisiones Sistemáticas', evidence_level: 'highest' },
            { key: 'randomized_controlled_trials', label: 'Ensayos Controlados Aleatorizados', evidence_level: 'high' },
            { key: 'controlled_clinical_trials', label: 'Ensayos Clínicos Controlados', evidence_level: 'high' },
            { key: 'clinical_trials', label: 'Ensayos Clínicos', evidence_level: 'medium' },
            { key: 'observational_studies', label: 'Estudios Observacionales', evidence_level: 'medium' },
            { key: 'cohort_studies', label: 'Estudios de Cohorte', evidence_level: 'medium' },
            { key: 'case_control_studies', label: 'Estudios Caso-Control', evidence_level: 'medium' },
            { key: 'cross_sectional_studies', label: 'Estudios Transversales', evidence_level: 'medium' },
            { key: 'case_reports', label: 'Reportes de Casos', evidence_level: 'low' },
            { key: 'reviews', label: 'Revisiones', evidence_level: 'medium' },
            { key: 'comparative_studies', label: 'Estudios Comparativos', evidence_level: 'medium' },
            { key: 'multicenter_studies', label: 'Estudios Multicéntricos', evidence_level: 'high' }
        ],
        books: [
            { key: 'handbooks', label: 'Manuales' },
            { key: 'textbooks', label: 'Libros de Texto' },
            { key: 'atlases', label: 'Atlas' },
            { key: 'dictionaries', label: 'Diccionarios' },
            { key: 'encyclopedias', label: 'Enciclopedias' },
            { key: 'formularies', label: 'Formularios' },
            { key: 'pharmacopoeia', label: 'Farmacopea' },
            { key: 'monographs', label: 'Monografías' }
        ],
        guidelines: [
            { key: 'practice_guidelines', label: 'Guías de Práctica Clínica', evidence_level: 'high' },
            { key: 'consensus_conferences', label: 'Conferencias de Consenso', evidence_level: 'high' },
            { key: 'nih_consensus', label: 'Consenso NIH', evidence_level: 'high' },
            { key: 'government_publications', label: 'Publicaciones Gubernamentales' }
        ],
        news_commentary: [
            { key: 'editorials', label: 'Editoriales' },
            { key: 'letters', label: 'Cartas' },
            { key: 'comments', label: 'Comentarios' },
            { key: 'news', label: 'Noticias' },
            { key: 'newspaper_articles', label: 'Artículos de Periódico' }
        ],
        educational: [
            { key: 'patient_education', label: 'Educación del Paciente' },
            { key: 'lectures', label: 'Conferencias' },
            { key: 'interactive_tutorials', label: 'Tutoriales Interactivos' },
            { key: 'instructional_videos', label: 'Videos Instructivos' },
            { key: 'study_guides', label: 'Guías de Estudio' }
        ],
        conferences: [
            { key: 'meeting_abstracts', label: 'Resúmenes de Reuniones' },
            { key: 'congresses', label: 'Congresos' },
            { key: 'addresses', label: 'Discursos' }
        ],
        technical_legal: [
            { key: 'technical_reports', label: 'Reportes Técnicos' },
            { key: 'legal_cases', label: 'Casos Legales' },
            { key: 'legislation', label: 'Legislación' },
            { key: 'patents', label: 'Patentes' }
        ]
    };

    // ✅ GRUPOS DE EDAD
    const ageGroups = [
        { value: 'infant', label: 'Infante' },
        { value: 'child', label: 'Niño' },
        { value: 'adolescent', label: 'Adolescente' },
        { value: 'adult', label: 'Adulto' },
        { value: 'middle_aged', label: 'Mediana Edad' },
        { value: 'aged', label: 'Anciano' }
    ];

    // ✅ ESTADO DEL FORMULARIO
    const [selectedDocumentTypes, setSelectedDocumentTypes] = useState(['journal_articles']);
    const [selectedSubfilters, setSelectedSubfilters] = useState([]);
    const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
    const [filters, setFilters] = useState({
        year_from: null,
        year_to: null,
        language: '',
        species: '',
        free_full_text: false,
        has_abstract: false,
        pmc_articles: false
    });
    const [dateRange, setDateRange] = useState([1900, 2025]);

    const currentYear = new Date().getFullYear();

    // ✅ SUBFILTROS DISPONIBLES SEGÚN TIPOS SELECCIONADOS
    const availableSubfilters = useMemo(() => {
        const allSubfilters = [];

        selectedDocumentTypes.forEach(docType => {
            if (subfiltrosByType[docType]) {
                allSubfilters.push(...subfiltrosByType[docType]);
            }
        });

        // Eliminar duplicados por key
        const uniqueSubfilters = allSubfilters.filter((subfiltro, index, self) =>
            index === self.findIndex(s => s.key === subfiltro.key)
        );

        return uniqueSubfilters;
    }, [selectedDocumentTypes]);

    // ✅ VERIFICAR SI HAY FILTROS DE MÁXIMA EVIDENCIA SELECCIONADOS
    const hasHighestEvidence = useMemo(() => {
        return selectedSubfilters.some(key => {
            const subfiltro = availableSubfilters.find(s => s.key === key);
            return subfiltro?.evidence_level === 'highest';
        });
    }, [selectedSubfilters, availableSubfilters]);

    // ✅ VERIFICAR SI HAY FILTROS DE ALTA EVIDENCIA SELECCIONADOS
    const hasHighEvidence = useMemo(() => {
        return selectedSubfilters.some(key => {
            const subfiltro = availableSubfilters.find(s => s.key === key);
            return ['highest', 'high'].includes(subfiltro?.evidence_level);
        });
    }, [selectedSubfilters, availableSubfilters]);

    // ✅ LIMPIAR SUBFILTROS CUANDO CAMBIAN LOS TIPOS DE DOCUMENTO
    useEffect(() => {
        const validSubfilters = availableSubfilters.map(s => s.key);
        setSelectedSubfilters(prev => prev.filter(key => validSubfilters.includes(key)));
    }, [availableSubfilters]);

    // ✅ CARGAR FILTROS INICIALES
    useEffect(() => {
        if (initialFilters && Object.keys(initialFilters).length > 0) {
            loadInitialFilters(initialFilters);
        }
    }, [initialFilters]);

    // ✅ FUNCIONES AUXILIARES
    const loadInitialFilters = (initialFilters) => {
        if (initialFilters.document_type) {
            setSelectedDocumentTypes(
                Array.isArray(initialFilters.document_type)
                    ? initialFilters.document_type
                    : [initialFilters.document_type]
            );
        }

        if (initialFilters.subfiltros) {
            setSelectedSubfilters([...initialFilters.subfiltros]);
        }

        if (initialFilters.age_groups) {
            setSelectedAgeGroups([...initialFilters.age_groups]);
        }

        // ✅ CARGAR RANGO DE FECHAS
        if (initialFilters.year_from && initialFilters.year_to) {
            setDateRange([initialFilters.year_from, initialFilters.year_to]);
        } else if (initialFilters.year_from) {
            setDateRange([initialFilters.year_from, currentYear]);
        } else if (initialFilters.year_to) {
            setDateRange([2000, initialFilters.year_to]);
        }

        // Cargar otros filtros
        const newFilters = { ...filters };
        Object.keys(newFilters).forEach(key => {
            if (initialFilters[key] !== undefined) {
                newFilters[key] = initialFilters[key];
            }
        });
        setFilters(newFilters);
    };

    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
    };

    const handleDocumentTypeChange = (docType) => {
        setSelectedDocumentTypes(prev => {
            if (prev.includes(docType)) {
                return prev.filter(type => type !== docType);
            } else {
                return [...prev, docType];
            }
        });
    };

    const handleSubfilterChange = (subfiltro) => {
        setSelectedSubfilters(prev => {
            if (prev.includes(subfiltro)) {
                return prev.filter(key => key !== subfiltro);
            } else {
                return [...prev, subfiltro];
            }
        });
    };

    const handleAgeGroupChange = (ageGroup) => {
        setSelectedAgeGroups(prev => {
            if (prev.includes(ageGroup)) {
                return prev.filter(age => age !== ageGroup);
            } else {
                return [...prev, ageGroup];
            }
        });
    };

    const selectEvidenceLevel = (level) => {
        const targetSubfilters = availableSubfilters
            .filter(s => {
                if (level === 'highest') return s.evidence_level === 'highest';
                if (level === 'high') return ['highest', 'high'].includes(s.evidence_level);
                return false;
            })
            .map(s => s.key);

        // Toggle: si ya están todos seleccionados, deseleccionar
        const allSelected = targetSubfilters.every(key =>
            selectedSubfilters.includes(key)
        );

        if (allSelected) {
            setSelectedSubfilters(prev => prev.filter(key => !targetSubfilters.includes(key)));
        } else {
            // Agregar los que no estén seleccionados
            setSelectedSubfilters(prev => {
                const newSelection = [...prev];
                targetSubfilters.forEach(key => {
                    if (!newSelection.includes(key)) {
                        newSelection.push(key);
                    }
                });
                return newSelection;
            });
        }
    };

    const clearSubfilters = () => {
        setSelectedSubfilters([]);
    };

    const datePresets = [
        { key: 'last_year', label: 'Último año', range: [currentYear - 1, currentYear] },
        { key: 'last_3_years', label: 'Últimos 3 años', range: [currentYear - 3, currentYear] },
        { key: 'last_5_years', label: 'Últimos 5 años', range: [currentYear - 5, currentYear] },
        { key: 'last_10_years', label: 'Últimos 10 años', range: [currentYear - 10, currentYear] },
        { key: 'all_time', label: 'Todo el tiempo', range: [1900, currentYear] }
    ];


    const setDatePreset = (preset) => {
        setDateRange(preset.range);
    };

    const isDatePresetActive = (preset) => {
        return dateRange[0] === preset.range[0] && dateRange[1] === preset.range[1];
    };

    const getSubfiltroClass = (subfiltro) => {
        const isSelected = selectedSubfilters.includes(subfiltro.key);

        if (!isSelected) return 'border border-gray-200';

        switch (subfiltro.evidence_level) {
            case 'highest': return 'border-green-300 bg-green-50';
            case 'high': return 'border-blue-300 bg-blue-50';
            case 'medium': return 'border-yellow-300 bg-yellow-50';
            case 'low': return 'border-gray-300 bg-gray-100';
            default: return 'border-purple-300 bg-purple-50';
        }
    };

    const getEvidenceBadgeClass = (level) => {
        switch (level) {
            case 'highest': return 'bg-green-100 text-green-800';
            case 'high': return 'bg-blue-100 text-blue-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEvidenceLevelText = (level) => {
        const texts = {
            highest: 'Máxima',
            high: 'Alta',
            medium: 'Media',
            low: 'Baja'
        };
        return texts[level] || '';
    };

    const totalFiltersApplied = useMemo(() => {
        let count = 0;
        if (selectedDocumentTypes.length > 1 || !selectedDocumentTypes.includes('journal_articles')) count++;
        if (selectedSubfilters.length > 0) count++;
        if (selectedAgeGroups.length > 0) count++;
        if (dateRange[0] !== 1900 || dateRange[1] !== currentYear) count++; // ✅ Cambio aquí
        if (filters.language) count++;
        if (filters.species) count++;
        if (filters.free_full_text || filters.has_abstract || filters.pmc_articles) count++;
        return count;
    }, [selectedDocumentTypes, selectedSubfilters, selectedAgeGroups, dateRange, filters, currentYear]);


    const clearAllFilters = () => {
        setSelectedDocumentTypes(['journal_articles']);
        setSelectedSubfilters([]);
        setSelectedAgeGroups([]);
        setDateRange([1900, currentYear]);
        setFilters({
            language: '',
            species: '',
            free_full_text: false,
            has_abstract: false,
            pmc_articles: false
        });
    };


    const applyFilters = () => {
        const appliedFilters = {
            document_type: selectedDocumentTypes.length === 1
                ? selectedDocumentTypes[0]
                : selectedDocumentTypes,
            subfiltros: selectedSubfilters,
            age_groups: selectedAgeGroups,
            year_from: dateRange[0], // ✅ Usar valores del slider
            year_to: dateRange[1],   // ✅ Usar valores del slider
            ...filters
        };

        // Limpiar valores vacíos (excepto year_from y year_to)
        Object.keys(appliedFilters).forEach(key => {
            if (key !== 'year_from' && key !== 'year_to' && (
                appliedFilters[key] === '' ||
                appliedFilters[key] === null ||
                (Array.isArray(appliedFilters[key]) && appliedFilters[key].length === 0)
            )) {
                delete appliedFilters[key];
            }
        });

        console.log('Filtros aplicados:', appliedFilters);
        onApplyFilters(appliedFilters);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">

                {/* ✅ CAPA DE BLOQUEO PARA USUARIOS NO PRO */}
                {!isPremium && (
                    <div className="absolute inset-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center p-8 max-w-md">
                            {/* Icono principal */}
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <Crown className="w-10 h-10 text-white" />
                            </div>

                            {/* Título */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Filtros Avanzados
                            </h2>

                            {/* Descripción */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Los filtros avanzados son una característica exclusiva para usuarios
                                <span className="font-semibold text-yellow-600"> PRO</span>.
                                Obtén acceso a filtros por tipo de estudio, fechas, idiomas y mucho más.
                            </p>

                            {/* Lista de beneficios */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                                    Con PRO obtienes:
                                </h3>
                                <ul className="text-sm text-gray-700 space-y-2">
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                        Filtros por tipo de estudio (Meta-análisis, RCT, etc.)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                        Filtros por fecha de publicación
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                        Filtros por idioma y especie
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                        Búsquedas ilimitadas
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                        Acceso a todos los artículos PubMed
                                    </li>
                                </ul>
                            </div>

                            {/* Botones de acción */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        // Aquí rediriges a la página de upgrade
                                        window.location.href = '/premium';
                                    }}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                                >
                                    <Crown className="w-5 h-5 mr-2" />
                                    Actualizar a PRO
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full bg-gray-100 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Cerrar
                                </button>
                            </div>

                            {/* Oferta especial */}
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-xs text-yellow-800">
                                    <strong>🎉 Oferta especial:</strong> 30% de descuento en tu primera suscripción PRO
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-semibold text-gray-900">Filtros de Búsqueda</h2>
                        {!isPremium && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
                                <Lock className="w-3 h-3 mr-1" />
                                PRO
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Body - Solo visible para usuarios PRO */}
                <div className={`p-6 overflow-y-auto max-h-[calc(90vh-140px)] ${!isPremium ? 'opacity-20 pointer-events-none' : ''}`}>
                    <div className="space-y-6">

                        {/* ✅ SECCIÓN: TIPOS DE DOCUMENTO DINÁMICOS */}
                        <div className="filter-section">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Tipos de Documento</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {documentTypes.map(docType => (
                                    <label
                                        key={docType.value}
                                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                            selectedDocumentTypes.includes(docType.value)
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedDocumentTypes.includes(docType.value)}
                                            onChange={() => handleDocumentTypeChange(docType.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{docType.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* ✅ SECCIÓN: SUBFILTROS DINÁMICOS */}
                        {availableSubfilters.length > 0 && (
                            <div className="filter-section">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Tipos de Estudio
                                    <span className="text-sm text-gray-500 font-normal">({availableSubfilters.length} disponibles)</span>
                                </h3>

                                {/* Filtros rápidos por nivel de evidencia */}
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => selectEvidenceLevel('highest')}
                                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                                            hasHighestEvidence
                                                ? 'bg-green-100 text-green-800 border-green-300'
                                                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                                        }`}
                                    >
                                        🏆 Máxima Evidencia
                                    </button>
                                    <button
                                        onClick={() => selectEvidenceLevel('high')}
                                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                                            hasHighEvidence
                                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                                        }`}
                                    >
                                        ⭐ Alta Evidencia
                                    </button>
                                    <button
                                        onClick={clearSubfilters}
                                        className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 transition-colors"
                                    >
                                        🗑️ Limpiar
                                    </button>
                                </div>

                                {/* Lista de subfiltros con scroll */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                                    {availableSubfilters.map(subfiltro => (
                                        <label
                                            key={subfiltro.key}
                                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-white transition-colors ${getSubfiltroClass(subfiltro)}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedSubfilters.includes(subfiltro.key)}
                                                onChange={() => handleSubfilterChange(subfiltro.key)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm font-medium text-gray-700">{subfiltro.label}</span>
                                                {subfiltro.evidence_level && (
                                                    <span
                                                        className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getEvidenceBadgeClass(subfiltro.evidence_level)}`}
                                                    >
                                                        {getEvidenceLevelText(subfiltro.evidence_level)}
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ✅ SECCIÓN: SLIDER DE FECHAS */}
                        <div className="filter-section">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Rango de Fechas</h3>

                            {/* Rangos predefinidos */}
                            {/*<div className="mb-6 flex flex-wrap gap-2">
                                {datePresets.map(preset => (
                                    <button
                                        key={preset.key}
                                        onClick={() => setDatePreset(preset)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors ${
                                            isDatePresetActive(preset) ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>*/}

                            {/* Slider de rango doble */}
                            <DoubleRangeSlider
                                min={1800}
                                max={currentYear}
                                value={dateRange}
                                onChange={handleDateRangeChange}
                                label=""
                            />
                        </div>

                        {/* ✅ SECCIÓN: FILTROS ADICIONALES */}
                        <div className="filter-section">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros Adicionales</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Idioma */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                                    <select
                                        value={filters.language}
                                        onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Todos los idiomas</option>
                                        <option value="english">Inglés</option>
                                        <option value="spanish">Español</option>
                                        <option value="french">Francés</option>
                                        <option value="german">Alemán</option>
                                        <option value="portuguese">Portugués</option>
                                    </select>
                                </div>

                                {/* Especie */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Especie</label>
                                    <select
                                        value={filters.species}
                                        onChange={(e) => setFilters(prev => ({ ...prev, species: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Todas las especies</option>
                                        <option value="humans">Humanos</option>
                                        <option value="animals">Animales</option>
                                        <option value="mice">Ratones</option>
                                        <option value="rats">Ratas</option>
                                    </select>
                                </div>
                            </div>

                            {/* Grupos de edad */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Grupos de Edad</label>
                                <div className="flex flex-wrap gap-2">
                                    {ageGroups.map(ageGroup => (
                                        <label
                                            key={ageGroup.value}
                                            className={`flex items-center space-x-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                                selectedAgeGroups.includes(ageGroup.value)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedAgeGroups.includes(ageGroup.value)}
                                                onChange={() => handleAgeGroupChange(ageGroup.value)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{ageGroup.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Opciones de contenido */}
                            <div className="mt-4 space-y-3">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={filters.free_full_text}
                                        onChange={(e) => setFilters(prev => ({ ...prev, free_full_text: e.target.checked }))}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Solo texto completo gratuito</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={filters.has_abstract}
                                        onChange={(e) => setFilters(prev => ({ ...prev, has_abstract: e.target.checked }))}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Solo con resumen</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={filters.pmc_articles}
                                        onChange={(e) => setFilters(prev => ({ ...prev, pmc_articles: e.target.checked }))}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Solo artículos PMC</span>
                                </label>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer - Solo visible para usuarios PRO */}
                <div className={`flex items-center justify-between p-6 border-t bg-gray-50 ${!isPremium ? 'opacity-20 pointer-events-none' : ''}`}>
                    <div className="text-sm text-gray-600">
                        {totalFiltersApplied > 0 ? (
                            <span className="font-medium">{totalFiltersApplied} filtro(s) aplicado(s)</span>
                        ) : (
                            <span className="text-gray-400">Sin filtros aplicados</span>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={clearAllFilters}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Limpiar Todo
                        </button>
                        <button
                            onClick={applyFilters}
                            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors ${
                                totalFiltersApplied === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={totalFiltersApplied === 0}
                        >
                            Aplicar Filtros ({totalFiltersApplied})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default FilterModal;
