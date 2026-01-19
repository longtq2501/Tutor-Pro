'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';

interface TypingResponse {
    userId: number;
    userName: string;
    typing: boolean;
}

/**
 * Hook to manage chat typing indicator state and synchronization.
 */
export const useChatTyping = (roomId: string, currentUserId: number) => {
    const { isConnected, sendMessage, subscribe } = useWebSocket();
    const [typingUsers, setTypingUsers] = useState<Map<number, string>>(new Map());
    const typingTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});

    // Subscribe to typing events
    useEffect(() => {
        if (!isConnected) return;

        const unsubscribe = subscribe(`/topic/room/${roomId}/typing`, (payload) => {
            const { userId, userName, typing } = payload as TypingResponse;

            // Don't show typing indicator for yourself
            if (userId === currentUserId) return;

            if (typing) {
                setTypingUsers((prev) => {
                    const next = new Map(prev);
                    next.set(userId, userName);
                    return next;
                });

                // Set a safety timeout to clear typing status if no "stop" message received
                if (typingTimeoutRef.current[userId]) {
                    clearTimeout(typingTimeoutRef.current[userId]);
                }
                typingTimeoutRef.current[userId] = setTimeout(() => {
                    setTypingUsers((prev) => {
                        const next = new Map(prev);
                        next.delete(userId);
                        return next;
                    });
                }, 5000); // 5 seconds safety timeout
            } else {
                setTypingUsers((prev) => {
                    const next = new Map(prev);
                    next.delete(userId);
                    return next;
                });
                if (typingTimeoutRef.current[userId]) {
                    clearTimeout(typingTimeoutRef.current[userId]);
                    delete typingTimeoutRef.current[userId];
                }
            }
        });

        return () => {
            unsubscribe();
            // Clear all timeouts on unmount to prevent leaks
            if (typingTimeoutRef.current) {
                Object.values(typingTimeoutRef.current).forEach(clearTimeout);
                typingTimeoutRef.current = {};
            }
        };
    }, [isConnected, roomId, subscribe, currentUserId]);

    /**
     * Notify other participants that current user is typing.
     */
    const setLocalTyping = useCallback((isTyping: boolean) => {
        if (!isConnected) return;
        sendMessage(`/app/room/${roomId}/typing`, { typing: isTyping });
    }, [isConnected, roomId, sendMessage]);

    return {
        typingUsers: Array.from(typingUsers.values()),
        setLocalTyping,
    };
};
