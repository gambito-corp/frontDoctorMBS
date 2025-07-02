// src/pages/Domains/MedBank/components/data/examTypes.jsx
export const examTypesData = [
    {
        id: 1,
        title: "Banco de Preguntas Estándar",
        description: "Selecciona hasta 200 preguntas de nuestras más de 15,000 preguntas disponibles validadas",
        icon: "📚",
        color: "bg-blue-500",
        hoverColor: "hover:bg-blue-600",
        configType: "standard"
    },
    {
        id: 2,
        title: "Examen Por IA",
        description: "Solicita un tema específico y te generamos una cantidad limitada de preguntas de ese o esos temas",
        icon: "🤖",
        color: "bg-purple-500",
        hoverColor: "hover:bg-purple-600",
        configType: "standard"
    },
    {
        id: 3,
        title: "Examen desde PDF",
        description: "Sube un PDF a la plataforma, nuestra IA personalizada lo lee y te entrega un examen sobre el contenido",
        icon: "📄",
        color: "bg-green-500",
        hoverColor: "hover:bg-green-600",
        configType: "pdf"
    },
    {
        id: 4,
        title: "Preguntas Más Falladas por Ti",
        description: "Elige entre los temas que más hayas fallado para mejorar tus puntos débiles",
        icon: "🎯",
        color: "bg-red-500",
        hoverColor: "hover:bg-red-600",
        configType: "standard"
    },
    {
        id: 5,
        title: "Preguntas Más Falladas por la Comunidad",
        description: "Elige entre los temas que más hayan fallado otros usuarios de la plataforma",
        icon: "👥",
        color: "bg-orange-500",
        hoverColor: "hover:bg-orange-600",
        configType: "standard"
    }
];
