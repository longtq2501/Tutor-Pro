import { useState, useEffect, useCallback, useRef } from 'react';
import { useRoomState } from '../context/RoomStateContext';
import { onlineSessionApi } from '@/lib/services/onlineSession';
import axios from 'axios';

interface UseBillableTimerResult {
    formattedTime: string;
    isBillable: boolean;
}

interface TimerState {
    baseDurationSeconds: number;
    realtimeSeconds: number;
    isBillable: boolean;
}

const POLLING_INTERVAL_MS = 30000; // 30 seconds

/**
 * Hook to calculate and display real-time billable duration.
 * 
 * Production-Ready Features:
 * - Polls backend every 30s to sync historical duration (handles rejoins).
 * - Uses Date.now() delta for drift-free local timing.
 * - Aborts API calls on unmount.
 * - Consolidates state to prevent race conditions.
 *
 * @param roomId - The ID of the current room
 * @returns Formatted time string (MM:SS) and billable status
 */
export const useBillableTimer = (roomId: string): UseBillableTimerResult => {
    const { state } = useRoomState();

    // Consolidated state to avoid race conditions
    const [timerState, setTimerState] = useState<TimerState>({
        baseDurationSeconds: 0,
        realtimeSeconds: 0,
        isBillable: false,
    });

    // Refs for interval management
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Polling & Initial Fetch Logic
    useEffect(() => {
        const controller = new AbortController();

        const fetchStats = async () => {
            try {
                const stats = await onlineSessionApi.getRoomStats(roomId, { signal: controller.signal });

                setTimerState(prev => ({
                    ...prev,
                    baseDurationSeconds: stats.durationMinutes * 60
                }));
            } catch (error: any) {
                if (error.name !== 'AbortError' && !axios.isCancel(error)) {
                    console.error('Failed to fetch room stats:', error);
                }
            }
        };

        // Initial fetch
        if (roomId) {
            fetchStats();

            // Setup polling
            pollingIntervalRef.current = setInterval(fetchStats, POLLING_INTERVAL_MS);
        }

        return () => {
            controller.abort();
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [roomId]);

    // 2. Local Overlap Calculation (High Frequency)
    useEffect(() => {
        const calculateOverlap = () => {
            const tutor = state.participants.find(p => p.role === 'TUTOR');
            const student = state.participants.find(p => p.role === 'STUDENT');
            const billingActive = !!(tutor && student);

            let currentOverlapSeconds = 0;

            if (billingActive && tutor.joinedAt && student.joinedAt) {
                // Determine start of current overlap
                const overlapStart = new Date(Math.max(
                    new Date(tutor.joinedAt).getTime(),
                    new Date(student.joinedAt).getTime()
                ));

                // Drift-safe calculation using Date delta instead of counting ticks
                const now = Date.now();
                currentOverlapSeconds = Math.max(0, Math.floor((now - overlapStart.getTime()) / 1000));
            }

            setTimerState(prev => ({
                ...prev,
                isBillable: billingActive,
                realtimeSeconds: billingActive ? currentOverlapSeconds : 0
            }));
        };

        // Run immediately
        calculateOverlap();

        // Update UI every second
        const intervalId = setInterval(calculateOverlap, 1000);

        return () => clearInterval(intervalId);
    }, [state.participants]);

    const totalSeconds = timerState.baseDurationSeconds + timerState.realtimeSeconds;

    const formatTime = useCallback((totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    return {
        formattedTime: formatTime(totalSeconds),
        isBillable: timerState.isBillable
    };
};
