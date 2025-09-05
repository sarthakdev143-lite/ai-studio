import { useState, useEffect } from "react";
import { GenerationResult } from "@/app/types";

export const useLocalStorageHistory = (key: string, maxItems = 5) => {
    const [history, setHistory] = useState<GenerationResult[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch {
                setHistory([]);
            }
        }
    }, [key]);

    // Save whenever history changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(history));
    }, [history, key]);

    // Add new item (limit to maxItems)
    const addToHistory = (item: GenerationResult) => {
        setHistory(prev => [item, ...prev.slice(0, maxItems - 1)]);
    };

    return { history, addToHistory, setHistory };
};
