import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../useIsMobile';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useIsMobile', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('returns true when media query matches mobile breakpoint (< 768px)', () => {
        // Mock window.matchMedia to return true
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: true,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it('returns false when on desktop screen (>= 768px)', () => {
        // Mock window.matchMedia to return false
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });
});
