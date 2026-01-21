import { renderHook, act } from '@testing-library/react';
import { useCountdown } from '../useCountdown';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useCountdown', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Fix "now" to a specific point in time
        const mockNow = new Date('2026-01-01T10:00:00Z').getTime();
        vi.setSystemTime(mockNow);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should calculate initial countdown correctly', () => {
        const targetDate = '2026-01-01T10:05:00Z'; // 5 minutes later
        const { result } = renderHook(() => useCountdown(targetDate));

        expect(result.current.seconds).toBe(300);
        expect(result.current.formatted).toBe('05:00');
        expect(result.current.isReady).toBe(true); // default threshold is 15m
    });

    it('should update every second', () => {
        const targetDate = '2026-01-01T10:05:00Z';
        const { result } = renderHook(() => useCountdown(targetDate));

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.seconds).toBe(299);
        expect(result.current.formatted).toBe('04:59');
    });

    it('should handle hours in formatting', () => {
        const targetDate = '2026-01-01T12:30:00Z'; // 2.5 hours later
        const { result } = renderHook(() => useCountdown(targetDate));

        expect(result.current.formatted).toBe('2h 30m 0s');
    });

    it('should respect the readyThresholdMinutes', () => {
        const targetDate = '2026-01-01T10:20:00Z'; // 20 minutes later
        const { result } = renderHook(() => useCountdown(targetDate, 15));

        expect(result.current.isReady).toBe(false);

        act(() => {
            vi.advanceTimersByTime(5 * 60 * 1000 + 1000); // Wait 5m 1s
        });

        expect(result.current.seconds).toBe(899); // 14m 59s remaining
        expect(result.current.isReady).toBe(true);
    });

    it('should stay at 0 when reached', () => {
        const targetDate = '2026-01-01T10:00:05Z';
        const { result } = renderHook(() => useCountdown(targetDate));

        act(() => {
            vi.advanceTimersByTime(6000);
        });

        expect(result.current.seconds).toBe(0);
        expect(result.current.formatted).toBe('00:00:00');
    });
});
