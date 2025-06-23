// src/hooks/useTypewriter.js
import { useState, useEffect } from 'react';

export const useTypewriter = (text, speed = 50, startDelay = 0) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!text) {
            setDisplayedText('');
            setCurrentIndex(0);
            setIsTyping(false);
            return; // ✅ AQUÍ FALTABA LA LLAVE DE CIERRE
        }

        setIsTyping(true);
        setDisplayedText('');
        setCurrentIndex(0);

        const startTimer = setTimeout(() => {
            const typeTimer = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;

                    if (nextIndex <= text.length) {
                        setDisplayedText(text.slice(0, nextIndex));
                        return nextIndex;
                    } else {
                        setIsTyping(false);
                        clearInterval(typeTimer);
                        return prevIndex;
                    }
                });
            }, speed);

            return () => clearInterval(typeTimer);
        }, startDelay);

        return () => clearTimeout(startTimer);
    }, [text, speed, startDelay]);

    return { displayedText, isTyping };
};
