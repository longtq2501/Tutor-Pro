import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useWhiteboardPersistence } from './useWhiteboardPersistence';
import { useWebSocket } from '../context/WebSocketContext';

/**
 * Message payload for whiteboard synchronization.
 */
/**
 * Message payload for whiteboard synchronization.
 */
interface SyncMessage {
    type: 'STROKE' | 'CLEAR' | 'UNDO';
    payload?: Stroke | string; // Stroke for STROKE, string (id) for UNDO
}

/**
 * Stroke data structure for whiteboard drawing.
 */
export interface StrokePoint {
    x: number;
    y: number;
}

export interface Stroke {
    id: string;
    points: StrokePoint[];
    color: string;
    width: number;
    tool: 'pen' | 'eraser';
    timestamp: number;
    userId?: string; // Track who made the stroke
}

export interface WhiteboardSyncState {
    strokes: Stroke[];
    currentStroke: Stroke | null;
    redoStack: Stroke[]; // Stacks for undo/redo
    selectedColor: string;
    selectedWidth: number;
    selectedTool: 'pen' | 'eraser';
    isDrawing: boolean;
}

export interface WhiteboardSyncActions {
    startStroke: (point: StrokePoint) => void;
    addPoint: (point: StrokePoint) => void;
    endStroke: () => void;
    clearBoard: () => void;
    undoBoard: () => void;
    redoBoard: () => void;
    setColor: (color: string) => void;
    setWidth: (width: number) => void;
    setTool: (tool: 'pen' | 'eraser') => void;
    receiveRemoteStroke: (stroke: Stroke) => void;
    receiveRemoteUndo: (strokeId: string) => void;
}

/**
 * Throttle function that limits execution to once per interval.
 */
function throttle<T extends (...args: any[]) => void>(
    func: T,
    delay: number
): T {
    let lastCall = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    return ((...args: Parameters<T>) => {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;

        if (timeSinceLastCall >= delay) {
            lastCall = now;
            func(...args);
        } else {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                func(...args);
            }, delay - timeSinceLastCall);
        }
    }) as T;
}

/**
 * Hook for managing whiteboard drawing with throttled WebSocket sync.
 * Throttles stroke updates to 1 message per 50ms (20 messages/sec max).
 */
export const useWhiteboardSync = (
    roomId: string,
    currentUserId?: string | number,
    sendMessage?: (destination: string, payload: unknown) => void
) => {
    const { loadFromStorage, clearStorage, useAutoSave } = useWhiteboardPersistence(roomId);

    // Hydrate initial state from localStorage
    const savedStrokes = useMemo(() => loadFromStorage(), [loadFromStorage]);

    const [state, setState] = useState<WhiteboardSyncState>(() => ({
        strokes: savedStrokes,
        currentStroke: null,
        redoStack: [],
        selectedColor: '#000000',
        selectedWidth: 2,
        selectedTool: 'pen',
        isDrawing: false,
    }));

    // Periodically save to localStorage (10s interval defined in useWhiteboardPersistence)
    useAutoSave(state.strokes);

    const throttledSendRef = useRef<((stroke: Stroke) => void) | null>(null);

    useEffect(() => {
        if (sendMessage) {
            throttledSendRef.current = throttle((stroke: Stroke) => {
                sendMessage(`/app/room/${roomId}/whiteboard`, stroke);
            }, 50);
        }
    }, [roomId, sendMessage]);

    // Reactive send for current drawing stroke
    useEffect(() => {
        if (state.isDrawing && state.currentStroke && throttledSendRef.current) {
            throttledSendRef.current(state.currentStroke);
        }
    }, [state.currentStroke, state.isDrawing]);


    const startStroke = useCallback((point: StrokePoint) => {
        setState(prev => {
            const newStroke: Stroke = {
                id: `${Date.now()}-${Math.random()}`,
                points: [point],
                color: prev.selectedColor,
                width: prev.selectedWidth,
                tool: prev.selectedTool,
                timestamp: Date.now(),
                userId: currentUserId?.toString(),
            };

            return {
                ...prev,
                currentStroke: newStroke,
                isDrawing: true,
                redoStack: [], // Clear redo stack on new action
            };
        });
    }, []);

    const addPoint = useCallback((point: StrokePoint) => {
        setState(prev => {
            if (!prev.currentStroke) return prev;

            const updatedStroke = {
                ...prev.currentStroke,
                points: [...prev.currentStroke.points, point],
            };

            return {
                ...prev,
                currentStroke: updatedStroke,
            };
        });
    }, []);

    const endStroke = useCallback(() => {
        setState(prev => {
            if (!prev.currentStroke) return prev;

            return {
                ...prev,
                strokes: [...prev.strokes, prev.currentStroke],
                currentStroke: null,
                isDrawing: false,
            };
        });
    }, []);

    const clearBoard = useCallback(() => {
        setState(prev => ({
            ...prev,
            strokes: [],
            currentStroke: null,
            redoStack: [],
        }));

        clearStorage();

        if (sendMessage) {
            sendMessage(`/app/room/${roomId}/whiteboard/clear`, {});
        }
    }, [roomId, sendMessage, clearStorage]);

    const undoBoard = useCallback(() => {
        setState(prev => {
            if (prev.strokes.length === 0) return prev;

            const newStrokes = [...prev.strokes];
            const lastStroke = newStrokes.pop();

            if (!lastStroke) return prev;

            if (sendMessage) {
                sendMessage(`/app/room/${roomId}/whiteboard/undo`, { id: lastStroke.id });
            }

            return {
                ...prev,
                strokes: newStrokes,
                redoStack: [lastStroke, ...prev.redoStack],
            };
        });
    }, [roomId, sendMessage]);

    const redoBoard = useCallback(() => {
        setState(prev => {
            if (prev.redoStack.length === 0) return prev;

            const newRedoStack = [...prev.redoStack];
            const strokeToRestore = newRedoStack.shift();

            if (!strokeToRestore) return prev;

            if (sendMessage) {
                sendMessage(`/app/room/${roomId}/whiteboard`, strokeToRestore);
            }

            return {
                ...prev,
                strokes: [...prev.strokes, strokeToRestore],
                redoStack: newRedoStack,
            };
        });
    }, [roomId, sendMessage]);

    const setColor = useCallback((color: string) => {
        setState(prev => ({ ...prev, selectedColor: color }));
    }, []);

    const setWidth = useCallback((width: number) => {
        setState(prev => ({ ...prev, selectedWidth: width }));
    }, []);

    const setTool = useCallback((tool: 'pen' | 'eraser') => {
        setState(prev => ({ ...prev, selectedTool: tool }));
    }, []);

    const receiveRemoteStroke = useCallback((stroke: Stroke) => {
        // Echo cancellation: Ignore our own messages
        if (stroke.userId === currentUserId?.toString()) {
            return;
        }

        setState(prev => {
            const index = prev.strokes.findIndex(s => s.id === stroke.id);
            if (index !== -1) {
                const newStrokes = [...prev.strokes];
                newStrokes[index] = stroke;
                return { ...prev, strokes: newStrokes };
            }
            return {
                ...prev,
                strokes: [...prev.strokes, stroke],
            };
        });
    }, [currentUserId]);

    const receiveRemoteUndo = useCallback((strokeId: string) => {
        setState(prev => ({
            ...prev,
            strokes: prev.strokes.filter(s => s.id !== strokeId),
        }));
    }, []);

    // WebSocket subscription for remote updates
    const { subscribe } = useWebSocket();
    useEffect(() => {
        if (!subscribe) return;

        console.log(`[WhiteboardSync] Subscribing to room ${roomId}`);

        const unsubscribeStroke = subscribe(`/topic/room/${roomId}/whiteboard`, (data) => {
            receiveRemoteStroke(data as Stroke);
        });

        const unsubscribeClear = subscribe(`/topic/room/${roomId}/whiteboard/clear`, () => {
            setState(prev => ({
                ...prev,
                strokes: [],
                currentStroke: null,
                redoStack: [],
            }));
        });

        const unsubscribeUndo = subscribe(`/topic/room/${roomId}/whiteboard/undo`, (data) => {
            const { id } = data as { id: string };
            receiveRemoteUndo(id);
        });

        return () => {
            unsubscribeStroke();
            unsubscribeClear();
            unsubscribeUndo();
        };
    }, [roomId, subscribe, receiveRemoteStroke, receiveRemoteUndo]);

    return {
        ...state,
        startStroke,
        addPoint,
        endStroke,
        clearBoard,
        undoBoard,
        redoBoard,
        setColor,
        setWidth,
        setTool,
        receiveRemoteStroke,
        receiveRemoteUndo,
    };
};
