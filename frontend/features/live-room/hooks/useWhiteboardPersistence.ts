'use client';

import { useEffect, useCallback } from 'react';
import type { Stroke } from './useWhiteboardSync';

const STORAGE_KEY_PREFIX = 'tms_whiteboard_';
const SAVE_INTERVAL = 10000; // 10 seconds

/**
 * Hook to handle whiteboard data persistence in localStorage.
 * Provides methods to load, save, and clear drawing data for a specific room.
 */
export const useWhiteboardPersistence = (roomId: string) => {
    const storageKey = `${STORAGE_KEY_PREFIX}${roomId}`;

    /**
     * Loads strokes from localStorage.
     * @returns {Stroke[]} Array of saved strokes or empty array if none found or on error.
     */
    const loadFromStorage = useCallback((): Stroke[] => {
        if (typeof window === 'undefined') return [];

        try {
            const savedData = localStorage.getItem(storageKey);
            if (!savedData) return [];
            return JSON.parse(savedData);
        } catch (error) {
            console.error('Failed to load whiteboard data from localStorage:', error);
            return [];
        }
    }, [storageKey]);

    /**
     * Saves strokes to localStorage.
     * @param {Stroke[]} strokes - Current whiteboard strokes.
     */
    const saveToStorage = useCallback((strokes: Stroke[]) => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(storageKey, JSON.stringify(strokes));
        } catch (error) {
            console.error('Failed to save whiteboard data to localStorage:', error);
        }
    }, [storageKey]);

    /**
     * Clears whiteboard data from localStorage for the current room.
     */
    const clearStorage = useCallback(() => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(storageKey);
    }, [storageKey]);

    /**
     * Effect to auto-save strokes periodically.
     * @param {Stroke[]} currentStrokes - The current set of strokes to be saved.
     */
    const useAutoSave = (currentStrokes: Stroke[]) => {
        useEffect(() => {
            const intervalId = setInterval(() => {
                saveToStorage(currentStrokes);
            }, SAVE_INTERVAL);

            return () => clearInterval(intervalId);
        }, [currentStrokes]);
    };

    return {
        loadFromStorage,
        saveToStorage,
        clearStorage,
        useAutoSave
    };
};
