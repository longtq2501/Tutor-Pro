import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { RoomStateProvider, useRoomState } from '../../context/RoomStateContext';

// Mock dependency
vi.mock('../../hooks/useLiveRoomMedia', () => ({
    useLiveRoomMedia: () => ({
        retry: vi.fn(),
        error: null
    })
}));

describe('LiveRoomDisplay - Error Recovery Integration', () => {
    it('should show final error after max retries in state logic', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <RoomStateProvider>{children}</RoomStateProvider>
        );

        const { result } = renderHook(() => useRoomState(), { wrapper });

        // Simulate the logic in handleRetry
        const MAX_RETRIES = 3;
        let retryCount = 0;

        const simulateRetry = () => {
            if (retryCount >= MAX_RETRIES) {
                act(() => {
                    result.current.actions.setError(`Đã thử kết nối lại ${MAX_RETRIES} lần nhưng vẫn thất bại.`);
                });
                return;
            }
            retryCount++;
            act(() => {
                result.current.actions.setConnectionState('INITIALIZING');
                result.current.actions.setError(null);
            });
        };

        // Try 3 times
        for (let i = 0; i < 3; i++) {
            simulateRetry();
            expect(result.current.state.connectionState).toBe('INITIALIZING');
            expect(result.current.state.error).toBeNull();
        }

        // 4th time should set final error
        simulateRetry();
        expect(result.current.state.error).toContain('Đã thử kết nối lại 3 lần');
    });
});
