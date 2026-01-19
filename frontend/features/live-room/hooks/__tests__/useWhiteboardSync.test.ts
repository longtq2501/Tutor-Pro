import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWhiteboardSync } from '../useWhiteboardSync';

describe('useWhiteboardSync - Throttling', () => {
    let mockSendMessage: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockSendMessage = vi.fn();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should throttle stroke updates to max 1 per 50ms', async () => {
        const { result } = renderHook(() =>
            useWhiteboardSync('room-123', mockSendMessage as (destination: string, payload: unknown) => void)
        );

        // Start a stroke
        act(() => {
            result.current.startStroke({ x: 10, y: 10 });
        });

        // Add 10 points rapidly (simulating fast drawing)
        act(() => {
            for (let i = 0; i < 10; i++) {
                result.current.addPoint({ x: 10 + i, y: 10 + i });
            }
        });

        // Should only send 1 message immediately
        expect(mockSendMessage).toHaveBeenCalledTimes(1);

        // Advance time by 50ms
        act(() => {
            vi.advanceTimersByTime(50);
        });

        // Should send throttled message
        expect(mockSendMessage).toHaveBeenCalledTimes(2);
    });

    it('should batch points in stroke data', () => {
        const { result } = renderHook(() =>
            useWhiteboardSync('room-123', mockSendMessage as (destination: string, payload: unknown) => void)
        );

        act(() => {
            result.current.startStroke({ x: 0, y: 0 });
            result.current.addPoint({ x: 1, y: 1 });
            result.current.addPoint({ x: 2, y: 2 });
        });

        // Should have sent at least one message
        expect(mockSendMessage).toHaveBeenCalled();

        // Advance time to ensure throttled message is sent
        act(() => {
            vi.advanceTimersByTime(50);
        });

        const lastCall = mockSendMessage.mock.calls[mockSendMessage.mock.calls.length - 1];
        const strokeData = lastCall[1];

        expect(strokeData.points).toHaveLength(3);
        expect(strokeData.points[0]).toEqual({ x: 0, y: 0 });
        expect(strokeData.points[2]).toEqual({ x: 2, y: 2 });
    });

    it('should include color, width, and tool in stroke data', () => {
        const { result } = renderHook(() =>
            useWhiteboardSync('room-123', mockSendMessage as (destination: string, payload: unknown) => void)
        );

        act(() => {
            result.current.setColor('#FF0000');
            result.current.setWidth(4);
            result.current.setTool('pen');
            result.current.startStroke({ x: 10, y: 10 });
            result.current.addPoint({ x: 11, y: 11 }); // Add a point to trigger send
        });

        // Should have sent at least one message
        expect(mockSendMessage).toHaveBeenCalled();

        const strokeData = mockSendMessage.mock.calls[0][1];
        expect(strokeData.color).toBe('#FF0000');
        expect(strokeData.width).toBe(4);
        expect(strokeData.tool).toBe('pen');
    });

    it('should clear board and send clear message', () => {
        const { result } = renderHook(() =>
            useWhiteboardSync('room-123', mockSendMessage as (destination: string, payload: unknown) => void)
        );

        act(() => {
            result.current.startStroke({ x: 10, y: 10 });
            result.current.endStroke();
        });

        expect(result.current.strokes).toHaveLength(1);

        act(() => {
            result.current.clearBoard();
        });

        expect(result.current.strokes).toHaveLength(0);
        expect(mockSendMessage).toHaveBeenCalledWith(
            '/app/room/room-123/whiteboard/clear',
            {}
        );
    });

    it('should update tool state correctly', () => {
        const { result } = renderHook(() =>
            useWhiteboardSync('room-123', mockSendMessage as (destination: string, payload: unknown) => void)
        );

        expect(result.current.selectedTool).toBe('pen');

        act(() => {
            result.current.setTool('eraser');
        });

        expect(result.current.selectedTool).toBe('eraser');
    });

    it('should track drawing state', () => {
        const { result } = renderHook(() =>
            useWhiteboardSync('room-123', mockSendMessage as (destination: string, payload: unknown) => void)
        );

        expect(result.current.isDrawing).toBe(false);

        act(() => {
            result.current.startStroke({ x: 10, y: 10 });
        });

        expect(result.current.isDrawing).toBe(true);

        act(() => {
            result.current.endStroke();
        });

        expect(result.current.isDrawing).toBe(false);
    });

    it('should receive and store remote strokes', () => {
        const { result } = renderHook(() =>
            useWhiteboardSync('room-123', mockSendMessage as (destination: string, payload: unknown) => void)
        );

        const remoteStroke = {
            id: 'remote-1',
            points: [{ x: 50, y: 50 }],
            color: '#0000FF',
            width: 2,
            tool: 'pen' as const,
            timestamp: Date.now(),
        };

        act(() => {
            result.current.receiveRemoteStroke(remoteStroke);
        });

        expect(result.current.strokes).toHaveLength(1);
        expect(result.current.strokes[0]).toEqual(remoteStroke);
    });
});
