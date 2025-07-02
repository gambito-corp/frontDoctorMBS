// components/MedBank/StandardExamConfig/SelectionGrid.jsx
import React from 'react';
import { getDataByType } from '../data/examConfigData';

const SelectionGrid = ({ items, selectedItem, onItemSelect, colorScheme }) => {
    const data = getDataByType(items);

    const getColorClasses = (isSelected) => {
        const colors = {
            blue: isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-100 text-gray-700',
            teal: isSelected ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-teal-100 text-gray-700',
            green: isSelected ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-green-100 text-gray-700'
        };
        return colors[colorScheme];
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.map(item => (
                <div
                    key={item.id}
                    onClick={() => onItemSelect(item)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        getColorClasses(selectedItem?.id === item.id)
                    }`}
                >
                    <h3 className="font-semibold text-base mb-1">{item.name}</h3>
                    <p className="text-xs opacity-90 line-clamp-2">{item.description}</p>
                </div>
            ))}
        </div>
    );
};

export default SelectionGrid;
