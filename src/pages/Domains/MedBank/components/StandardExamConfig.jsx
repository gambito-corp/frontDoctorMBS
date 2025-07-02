// src/pages/Domains/MedBank/components/StandardExamConfig.jsx
import React, { useState } from 'react';
import TabNavigation from './StandardExamConfig/TabNavigation';
import TabContent from './StandardExamConfig/TabContent';
import ExamCollectionSummary from './StandardExamConfig/ExamCollectionSummary';
import { areas, categories, tipos } from './data/examConfigData';

const StandardExamConfig = ({ examType }) => {
    const [activeTab, setActiveTab] = useState('areas');
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [questionCount, setQuestionCount] = useState('');
    const [examCollection, setExamCollection] = useState([]);
    const [examTitle, setExamTitle] = useState('');
    const [examTime, setExamTime] = useState('');

    const tabs = [
        { id: 'areas', name: 'Áreas', count: areas.length },
        { id: 'categories', name: 'Categorías', count: selectedArea ? categories.length : 0 },
        { id: 'tipos', name: 'Tipos', count: selectedCategory ? tipos.length : 0 },
        { id: 'config', name: 'Configuración', count: selectedTipo ? 1 : 0 }
    ];

    const addCombination = () => {
        if (!selectedArea || !selectedCategory || !selectedTipo || !questionCount) {
            alert('Por favor completa todos los campos');
            return;
        }

        const newCombination = {
            area_name: selectedArea.name,
            category_name: selectedCategory.name,
            tipo_name: selectedTipo.name,
            university_id: selectedUniversity || 'Todas',
            question_count: parseInt(questionCount)
        };

        setExamCollection([...examCollection, newCombination]);
        setQuestionCount('');
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Configuración del Examen</h2>
                        <div className="text-sm text-gray-500">
                            Usuarios Freemium: máximo 10 preguntas
                        </div>
                    </div>

                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    <TabContent
                        activeTab={activeTab}
                        selectedArea={selectedArea}
                        selectedCategory={selectedCategory}
                        selectedTipo={selectedTipo}
                        selectedUniversity={selectedUniversity}
                        questionCount={questionCount}
                        onAreaSelect={(area) => {
                            setSelectedArea(area);
                            setActiveTab('categories');
                        }}
                        onCategorySelect={(category) => {
                            setSelectedCategory(category);
                            setActiveTab('tipos');
                        }}
                        onTipoSelect={(tipo) => {
                            setSelectedTipo(tipo);
                            setActiveTab('config');
                        }}
                        onUniversityChange={setSelectedUniversity}
                        onQuestionCountChange={setQuestionCount}
                        onAddCombination={addCombination}
                    />
                </div>
            </div>

            {examCollection.length > 0 && (
                <ExamCollectionSummary
                    examCollection={examCollection}
                    examTitle={examTitle}
                    examTime={examTime}
                    onTitleChange={setExamTitle}
                    onTimeChange={setExamTime}
                />
            )}
        </div>
    );
};

export default StandardExamConfig;
