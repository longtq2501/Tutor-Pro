import { useState, useEffect, useCallback } from 'react';

interface CountdownResult {
    seconds: number;
    formatted: string;
    isReady: boolean;
}

/**
 * Custom hook to calculate and update a countdown timer to a target date.
 * 
 * @param {string} targetDate - The ISO date string to count down to.
 * @param {number} [readyThresholdMinutes=15] - Minutes before the target when the session is "ready".
 * @returns {CountdownResult} The current countdown state.
 */
export const useCountdown = (targetDate: string, readyThresholdMinutes: number = 15): CountdownResult => {
    const calculateDelta = useCallback(() => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const delta = Math.max(0, Math.floor((target - now) / 1000));
        return delta;
    }, [targetDate]);

    const [seconds, setSeconds] = useState<number>(calculateDelta());

    useEffect(() => {
        const timer = setInterval(() => {
            const delta = calculateDelta();
            setSeconds(delta);
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateDelta]);

    const formatTime = (totalSeconds: number): string => {
        if (totalSeconds <= 0) return '00:00:00';

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        }

        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isReady = seconds <= readyThresholdMinutes * 60;

    return {
        seconds,
        formatted: formatTime(seconds),
        isReady
    };
};
