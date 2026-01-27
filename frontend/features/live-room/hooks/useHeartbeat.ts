'use client';

import { useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';

/**
 * Hook to send periodic heartbeats to the backend to keep the session alive.
 * Default interval is 30 seconds (PresenceService expects at least one pulse every 65s).
 */
export const useHeartbeat = (roomId: string, intervalMs: number = 5000) => {
    const { isConnected, sendMessage } = useWebSocket();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isConnected || !roomId) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Initial heartbeat
        sendMessage(`/app/room/${roomId}/heartbeat`, {});

        // Setup interval
        intervalRef.current = setInterval(() => {
            if (process.env.NODE_ENV !== 'production') {
                console.log(`[Heartbeat] Sending pulse for room: ${roomId}`);
            }
            sendMessage(`/app/room/${roomId}/heartbeat`, {});
        }, intervalMs);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isConnected, roomId, sendMessage, intervalMs]);
};
