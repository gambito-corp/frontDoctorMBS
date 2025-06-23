import React from 'react';
import Card from '../atoms/Card';
import IconButton from '../atoms/IconButton';
import Badge from '../atoms/Badge';

const SelectFlashCard = ({
                             flashcard,
                             selected = false,
                             onSelect,
                             onEdit,
                             onDelete,
                             canEdit = false,
                             canDelete = false,
                             className = '',
                             ...props
                         }) => {
    return (
        <Card
            selected={selected}
            onClick={onSelect}
            hoverable
            className={`relative cursor-pointer flex-shrink-0 w-64 h-48 border rounded-lg shadow-md transition-all duration-200 hover:shadow-lg overflow-y-hidden hover:overflow-y-auto ${
                selected ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200' : 'bg-white border-gray-200'
            } ${className}`} // ← rounded-lg, shadow-md, ring para seleccionadas
            {...props}
        >
            {/* Contenido principal - Solo pregunta como en Laravel */}
            <div className={`pt-8`}>
                <h2 className="font-bold text-lg">{flashcard.pregunta}</h2>
            </div>

            {/* Botones de acción - Posición absoluta como en Laravel */}
            {(canEdit || canDelete) && (
                <div className="flex justify-end space-x-1 absolute right-2 top-2 z-10">
                    {canEdit && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(flashcard);
                            }}
                            className="px-2 py-1 bg-[#5b8080] text-white rounded hover:bg-[#4a6f6f] text-xs flex items-center gap-1"
                            title="Editar"
                        >
                            <img
                                className="w-[17px]"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAAnQAAAJ0Bj3LnbgAAAKVQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////uP3jVQAAADd0Uk5TAA0zEQWU/P+rrf6WTIT6nmsSeE0y+c8TmAyubT700BRmg2xF9nn4ofuRSESHC8bECtQwxYZHLXliBKEAAADPSURBVHicbc9fC8FQGMfx58dwsSQp5g4jJSQX3v9bkOQKnRDbhZBo7Z9zhthz9lxs6/M9Pe2AtAEQyidnQzrBi3kwCkjmCs2LF6JyWALzyDzLd+1eBjtvAg6R9TD/g1G/VNV+0XIbW6TOWxuycascYj8AcyI7L3J+8LuH2nNQHy1Xnv9dkPs3aP4Jur9Dhichy1XIdBX6u+T/qXP6cxmaFax0l2Gw7i75niQMHWuhuwxjzCd+JJgTRsKOtl47XqedMF2WesD+SGxAs+eCo5oXGpptV/4P7iMAAAAASUVORK5CYII="
                                alt="Boton Editar"
                            />
                            Editar
                        </button>
                    )}
                    {canDelete && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(flashcard);
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs flex items-center gap-1"
                            title="Eliminar"
                        >
                            <img
                                className="w-[17px]"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMxQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////OpLhCAAAAER0Uk5TAB6guwXf7sLeSv9QZd3A6/Kp1teomuXmmYv09Yp9BG0SvxNsXiEiXU8wMU5AP2AgDXR1C/aOy8puUgbIaGnH0blHk7WaBofeAAABGklEQVR4nHXRWUsDMRAA4BldkLbrg9SDUtpla+tRpIhHPZ70l+uTWLRIK15V67rWUrT64tZ9iYybjLskigMhk3xDQjII/wQmCcqUiH6BFYEAi8aEMCGFOIqmDFEYg62y9JelQIx/qrpAgo0fxr2TFEgAmMJ3A7I45Dtm8MWAORww5LBvQB57DIW3aR/AhkANKA6zTwzO66wH4MKDGlAa5O4Zyv38rQYLvcINw5LvXGlQ9dwLhpXu/LkGvJTAJQnwARIqz+W2BrW7SothtbN4psHa9XLz53c38ER7xyadxt9ex4b28C1oxLDdVs3g2GnVjmPYRc/1fbVddML0kUg6WHqcqGbCJqynRpd1v6u3dh/xMJr2iA7Mnv+Jb5RQaBkMZdeJAAAAAElFTkSuQmCC"
                                alt="Boton Eliminar"
                            />
                            Eliminar
                        </button>
                    )}
                </div>
            )}


            {/* Overlay para usuarios sin permisos */}
            {!canEdit && !canDelete && (
                <div className="flex justify-end absolute right-3 top-3 gap-[10px] cursor-not-allowed">
                    <div className="bg-black/50 absolute w-full h-full rounded-[5px]"></div>
                    <button
                        type="button"
                        className="px-2 py-1 bg-[#5b8080] text-white rounded hover:bg-white hover:text-[#5b8080] text-xs flex items-center gap-1 cursor-not-allowed"
                        title="Editar"
                        disabled
                    >
                        <img
                            className="w-[17px]"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAAnQAAAJ0Bj3LnbgAAAKVQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////uP3jVQAAADd0Uk5TAA0zEQWU/P+rrf6WTIT6nmsSeE0y+c8TmAyubT700BRmg2xF9nn4ofuRSESHC8bECtQwxYZHLXliBKEAAADPSURBVHicbc9fC8FQGMfx58dwsSQp5g4jJSQX3v9bkOQKnRDbhZBo7Z9zhthz9lxs6/M9Pe2AtAEQyidnQzrBi3kwCkjmCs2LF6JyWALzyDzLd+1eBjtvAg6R9TD/g1G/VNV+0XIbW6TOWxuycascYj8AcyI7L3J+8LuH2nNQHy1Xnv9dkPs3aP4Jur9Dhichy1XIdBX6u+T/qXP6cxmaFax0l2Gw7i75niQMHWuhuwxjzCd+JJgTRsKOtl47XqedMF2WesD+SGxAs+eCo5oXGpptV/4P7iMAAAAASUVORK5CYII="
                            alt="Boton Editar"
                        />
                        Editar
                    </button>
                    <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs flex items-center gap-1 cursor-not-allowed"
                        title="Eliminar"
                        disabled
                    >
                        <img
                            className="w-[17px]"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMxQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////OpLhCAAAAER0Uk5TAB6guwXf7sLeSv9QZd3A6/Kp1teomuXmmYv09Yp9BG0SvxNsXiEiXU8wMU5AP2AgDXR1C/aOy8puUgbIaGnH0blHk7WaBofeAAABGklEQVR4nHXRWUsDMRAA4BldkLbrg9SDUtpla+tRpIhHPZ70l+uTWLRIK15V67rWUrT64tZ9iYybjLskigMhk3xDQjII/wQmCcqUiH6BFYEAi8aEMCGFOIqmDFEYg62y9JelQIx/qrpAgo0fxr2TFEgAmMJ3A7I45Dtm8MWAORww5LBvQB57DIW3aR/AhkANKA6zTwzO66wH4MKDGlAa5O4Zyv38rQYLvcINw5LvXGlQ9dwLhpXu/LkGvJTAJQnwARIqz+W2BrW7SothtbN4psHa9XLz53c38ER7xyadxt9ex4b28C1oxLDdVs3g2GnVjmPYRc/1fbVddML0kUg6WHqcqGbCJqynRpd1v6u3dh/xMJr2iA7Mnv+Jb5RQaBkMZdeJAAAAAElFTkSuQmCC"
                            alt="Boton Eliminar"
                        />
                        Eliminar
                    </button>
                </div>
            )}
        </Card>
    );
};

export default SelectFlashCard;
