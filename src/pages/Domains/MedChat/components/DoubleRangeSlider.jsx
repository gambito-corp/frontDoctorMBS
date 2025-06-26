import React, { useState, useEffect, useRef } from 'react';

const DoubleRangeSlider = ({
                               min = 1800,
                               max = 2025,
                               value = [2020, 2025],
                               onChange,
                               label = "Fecha de publicación"
                           }) => {
    const [minVal, setMinVal] = useState(value[0]);
    const [maxVal, setMaxVal] = useState(value[1]);
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);

    // Convertir a porcentaje
    const getPercent = (value) => Math.round(((value - min) / (max - min)) * 100);

    // Actualizar slider cuando cambian los valores
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value);

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    // Notificar cambios al componente padre
    useEffect(() => {
        onChange && onChange([minVal, maxVal]);
    }, [minVal, maxVal, onChange]);

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-4">{label}</label>

            <div className="relative mb-6">
                {/* Slider container */}
                <div className="relative h-2 bg-gray-200 rounded-lg">
                    {/* Range highlight */}
                    <div
                        ref={range}
                        className="absolute h-2 bg-blue-500 rounded-lg"
                    />

                    {/* Min slider */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={minVal}
                        ref={minValRef}
                        onChange={(event) => {
                            const value = Math.min(+event.target.value, maxVal - 1);
                            setMinVal(value);
                            event.target.value = value.toString();
                        }}
                        className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none slider-thumb"
                        style={{ zIndex: 1 }}
                    />

                    {/* Max slider */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={maxVal}
                        ref={maxValRef}
                        onChange={(event) => {
                            const value = Math.max(+event.target.value, minVal + 1);
                            setMaxVal(value);
                            event.target.value = value.toString();
                        }}
                        className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none slider-thumb"
                        style={{ zIndex: 2 }}
                    />
                </div>

                {/* Value labels */}
                <div className="flex justify-between mt-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Desde</span>
                        <span className="text-sm font-medium text-gray-900">{minVal}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Hasta</span>
                        <span className="text-sm font-medium text-gray-900">{maxVal}</span>
                    </div>
                </div>

                {/* Year markers */}
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>{min}</span>
                    <span>Cualquier año</span>
                    <span>{max}</span>
                </div>
            </div>

            <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          pointer-events: all;
          position: relative;
          z-index: 3;
        }

        .slider-thumb::-moz-range-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          pointer-events: all;
          position: relative;
          z-index: 3;
        }

        .slider-thumb::-webkit-slider-track {
          background: transparent;
        }

        .slider-thumb::-moz-range-track {
          background: transparent;
        }

        .slider-thumb:focus {
          outline: none;
        }

        .slider-thumb:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        .slider-thumb:focus::-moz-range-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
      `}</style>
        </div>
    );
};

export default DoubleRangeSlider;
