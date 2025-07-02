// src/pages/Domains/MedBank/components/StandardExamConfig/TabContent.jsx
import React from 'react';
import SelectionGrid from './SelectionGrid';
import ConfigurationPanel from './ConfigurationPanel';

const TabContent = ({
                        activeTab,
                        selectedArea,
                        selectedCategory,
                        selectedTipo,
                        selectedUniversity,
                        questionCount,
                        onAreaSelect,
                        onCategorySelect,
                        onTipoSelect,
                        onUniversityChange,
                        onQuestionCountChange,
                        onAddCombination
                    }) => {
    const renderTabContent = () => {
        switch (activeTab) {
            case 'areas':
                return (
                    <SelectionGrid
                        items="areas"
                        selectedItem={selectedArea}
                        onItemSelect={onAreaSelect}
                        colorScheme="blue"
                    />
                );

            case 'categories':
                return (
                    <SelectionGrid
                        items="categories"
                        selectedItem={selectedCategory}
                        onItemSelect={onCategorySelect}
                        colorScheme="teal"
                    />
                );

            case 'tipos':
                return (
                    <SelectionGrid
                        items="tipos"
                        selectedItem={selectedTipo}
                        onItemSelect={onTipoSelect}
                        colorScheme="green"
                    />
                );

            case 'config':
                return (
                    <ConfigurationPanel
                        selectedUniversity={selectedUniversity}
                        questionCount={questionCount}
                        onUniversityChange={onUniversityChange}
                        onQuestionCountChange={onQuestionCountChange}
                        onAddCombination={onAddCombination}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-[400px]">
            {renderTabContent()}
        </div>
    );
};

export default TabContent;
