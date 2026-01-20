"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * Connection states for WebRTC lifecycle.
 */
export type WebRTCConnectionState =
    | 'INITIALIZING'  // Pre-join REST API calls
    | 'SIGNALING'     // WebSocket connection
    | 'NEGOTIATING'   // SDP Offer/Answer
    | 'CONNECTING'    // ICE Candidate exchange
    | 'CONNECTED'     // Success
    | 'FAILED';        // Error state

interface StateInfo {
    message: string;
    progress: number;
}

const STATE_CONFIG: Record<WebRTCConnectionState, StateInfo> = {
    INITIALIZING: { message: 'Đang khởi tạo phòng học...', progress: 10 },
    SIGNALING: { message: 'Đang thiết lập tín hiệu...', progress: 30 },
    NEGOTIATING: { message: 'Đang đàm phán kết nối...', progress: 50 },
    CONNECTING: { message: 'Đang kết nối ngang hàng...', progress: 80 },
    CONNECTED: { message: 'Kết nối thành công!', progress: 100 },
    FAILED: { message: 'Kết nối thất bại.', progress: 0 },
};

export interface UseWebRTCConnectionResult {
    state: WebRTCConnectionState;
    progress: number;
    statusMessage: string;
    updateState: (state: WebRTCConnectionState) => void;
    setError: (error: string) => void;
    error: string | null;
    reset: () => void;
}

/**
 * Hook to manage the WebRTC connection lifecycle and tracking progress.
 * 
 * @returns {UseWebRTCConnectionResult} Connection state and progress tracking
 */
export const useWebRTCConnection = (): UseWebRTCConnectionResult => {
    const [state, setState] = useState<WebRTCConnectionState>('INITIALIZING');
    const [error, setErrorState] = useState<string | null>(null);

    const updateState = useCallback((newState: WebRTCConnectionState) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[WebRTC] State transition: ${state} -> ${newState}`);
        }
        setState(newState);
        if (newState !== 'FAILED') {
            setErrorState(null);
        }
    }, [state]);

    const setError = useCallback((message: string) => {
        setState('FAILED');
        setErrorState(message);
    }, []);

    const reset = useCallback(() => {
        setState('INITIALIZING');
        setErrorState(null);
    }, []);

    return {
        state,
        progress: STATE_CONFIG[state].progress,
        statusMessage: STATE_CONFIG[state].message,
        updateState,
        setError,
        error,
        reset,
    };
};
