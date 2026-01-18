import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RoomErrorBoundary } from '../RoomErrorBoundary';
import { createElement } from 'react';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return createElement('div', null, 'No error');
};

describe('RoomErrorBoundary', () => {
    it('should render children when no error', () => {
        render(
            createElement(RoomErrorBoundary, null,
                createElement(ThrowError, { shouldThrow: false })
            )
        );

        expect(screen.getByText('No error')).toBeDefined();
    });

    it('should catch error and display fallback UI', () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            createElement(RoomErrorBoundary, null,
                createElement(ThrowError, { shouldThrow: true })
            )
        );

        expect(screen.getByText('Đã xảy ra lỗi')).toBeDefined();
        expect(screen.getByText('Thử lại')).toBeDefined();
        expect(screen.getByText('Rời phòng')).toBeDefined();

        consoleSpy.mockRestore();
    });

    it('should display error message in details', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            createElement(RoomErrorBoundary, null,
                createElement(ThrowError, { shouldThrow: true })
            )
        );

        expect(screen.getByText('Test error')).toBeDefined();

        consoleSpy.mockRestore();
    });
});
