import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RoomStateProvider, useRoomState } from '../RoomStateContext';
import { ReactNode } from 'react';

/**
 * Tests for RoomStateContext.
 * Verifies that actions are stable references to prevent infinite re-renders.
 */
describe('RoomStateContext', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <RoomStateProvider>{children}</RoomStateProvider>
    );

    it('should maintain stable actions reference across state updates', () => {
        const { result } = renderHook(() => useRoomState(), { wrapper });

        const initialActions = result.current.actions;

        // Trigger a state update
        act(() => {
            result.current.actions.setRoomId('test-room-123');
        });

        const nextActions = result.current.actions;

        // This should fail if actions is not memoized properly
        expect(nextActions).toBe(initialActions);
    });
});
