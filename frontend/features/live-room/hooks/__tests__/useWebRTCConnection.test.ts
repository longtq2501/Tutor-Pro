import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useWebRTCConnection } from '../useWebRTCConnection';

describe('useWebRTCConnection', () => {
    it('should initialize with INITIALIZING state', () => {
        const { result } = renderHook(() => useWebRTCConnection());
        expect(result.current.state).toBe('INITIALIZING');
        expect(result.current.progress).toBe(10);
        expect(result.current.statusMessage).toContain('khởi tạo');
    });

    it('should update state correctly', () => {
        const { result } = renderHook(() => useWebRTCConnection());

        act(() => {
            result.current.updateState('SIGNALING');
        });

        expect(result.current.state).toBe('SIGNALING');
        expect(result.current.progress).toBe(30);

        act(() => {
            result.current.updateState('CONNECTED');
        });

        expect(result.current.state).toBe('CONNECTED');
        expect(result.current.progress).toBe(100);
    });

    it('should handle errors', () => {
        const { result } = renderHook(() => useWebRTCConnection());
        const errorMessage = 'Tín hiệu bị ngắt kết nối';

        act(() => {
            result.current.setError(errorMessage);
        });

        expect(result.current.state).toBe('FAILED');
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.progress).toBe(0);
    });

    it('should clear error when state is updated to non-FAILED', () => {
        const { result } = renderHook(() => useWebRTCConnection());

        act(() => {
            result.current.setError('Error');
        });
        expect(result.current.error).toBe('Error');

        act(() => {
            result.current.updateState('INITIALIZING');
        });
        expect(result.current.error).toBeNull();
    });

    it('should reset to INITIALIZING state', () => {
        const { result } = renderHook(() => useWebRTCConnection());

        act(() => {
            result.current.setError('Critical fail');
            result.current.reset();
        });

        expect(result.current.state).toBe('INITIALIZING');
        expect(result.current.error).toBeNull();
        expect(result.current.progress).toBe(10);
    });
});
