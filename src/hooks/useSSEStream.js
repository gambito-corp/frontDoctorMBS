// src/hooks/useSSEStream.js
import { useState, useRef, useCallback } from 'react';

export const useSSEStream = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const abortControllerRef = useRef(null);

    const startStream = useCallback(async (url, data, onChunk, onComplete, onError) => {
        try {
            setIsStreaming(true);

            // ✅ CREAR ABORT CONTROLLER PARA CANCELAR REQUESTS
            abortControllerRef.current = new AbortController();

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'text/plain',
                },
                body: JSON.stringify(data),
                signal: abortControllerRef.current.signal // ✅ SIGNAL PARA CANCELAR
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === 'content') {
                                onChunk(data.content, data.full_content);
                            } else if (data.type === 'done') {
                                onComplete(data.full_content);
                                setIsStreaming(false);
                                return;
                            } else if (data.type === 'error') {
                                onError(data.content);
                                setIsStreaming(false);
                                return;
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }

        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Stream error:', error);
                onError(error.message);
            }
            setIsStreaming(false);
        }
    }, []);

    const stopStream = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsStreaming(false);
    }, []);

    return {
        startStream,
        stopStream,
        isStreaming
    };
};
