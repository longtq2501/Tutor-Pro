import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

import {
    HEADER_BREAKPOINTS,
    isHeaderDensityAtLeast,
    resolveHeaderDensity,
    type HeaderDensity,
} from '@/lib/ui/responsive';
import { DashboardHeader, HeaderSlot, UIProvider } from '@/contexts/UIContext';
import { useHeaderDensity } from '@/components/shared/ResponsiveHeaderActions';

/**
 * Renders the single-row app header contract:
 * - a title slot (always present, truncates first)
 * - an actions slot (keeps its intrinsic width)
 * - `DashboardHeader` portals into both slots using the measured container width.
 */
function renderDashboardHeader(containerWidth: number) {
    return render(
        <UIProvider initialContainerWidth={containerWidth}>
            <div>
                <HeaderSlot id="title" />
                <HeaderSlot id="actions" />
            </div>
            <DashboardHeader
                title="Tổng quan"
                subtitle="Bảng điều khiển"
                actions={<button type="button">Xuất báo cáo</button>}
                compactActions={<button type="button">Xuất</button>}
            />
        </UIProvider>
    );
}

function DensityProbe() {
    const { density, containerWidth, atLeast, fits } = useHeaderDensity();

    return (
        <div>
            <span data-testid="density">{density}</span>
            <span data-testid="container-width">{containerWidth}</span>
            <span data-testid="at-least-comfortable">{String(atLeast('comfortable'))}</span>
            <span data-testid="fits-900">{String(fits(900))}</span>
        </div>
    );
}


describe('resolveHeaderDensity', () => {
    it.each<[number, HeaderDensity]>([
        // 0 means "not measured yet" and deliberately falls back to `full`
        [1, 'minimal'],
        [320, 'minimal'],
        [HEADER_BREAKPOINTS.compact - 1, 'minimal'],
        [HEADER_BREAKPOINTS.compact, 'compact'],
        [HEADER_BREAKPOINTS.comfortable - 1, 'compact'],
        [HEADER_BREAKPOINTS.comfortable, 'comfortable'],
        [HEADER_BREAKPOINTS.wide - 1, 'comfortable'],
        [HEADER_BREAKPOINTS.wide, 'wide'],
        [HEADER_BREAKPOINTS.full - 1, 'wide'],
        [HEADER_BREAKPOINTS.full, 'full'],
        [1920, 'full'],
    ])('maps a %ipx content width to "%s"', (width, expected) => {
        expect(resolveHeaderDensity(width)).toBe(expected);
    });

    it('falls back to "full" when the width is not measured yet', () => {
        expect(resolveHeaderDensity(0)).toBe('full');
        expect(resolveHeaderDensity(-10)).toBe('full');
        expect(resolveHeaderDensity(Number.NaN)).toBe('full');
        expect(resolveHeaderDensity(Number.POSITIVE_INFINITY)).toBe('full');
    });
});

describe('isHeaderDensityAtLeast', () => {
    it('treats denser tiers as satisfying lower minimums', () => {
        expect(isHeaderDensityAtLeast('full', 'minimal')).toBe(true);
        expect(isHeaderDensityAtLeast('wide', 'comfortable')).toBe(true);
        expect(isHeaderDensityAtLeast('comfortable', 'comfortable')).toBe(true);
    });

    it('rejects minimums that need more room than available', () => {
        expect(isHeaderDensityAtLeast('minimal', 'compact')).toBe(false);
        expect(isHeaderDensityAtLeast('compact', 'comfortable')).toBe(false);
        expect(isHeaderDensityAtLeast('wide', 'full')).toBe(false);
    });
});

describe('useHeaderDensity', () => {
    it('exposes the seeded width, tier and helpers', () => {
        render(
            <UIProvider initialContainerWidth={700}>
                <DensityProbe />
            </UIProvider>
        );

        expect(screen.getByTestId('container-width')).toHaveTextContent('700');
        expect(screen.getByTestId('density')).toHaveTextContent('comfortable');
        expect(screen.getByTestId('at-least-comfortable')).toHaveTextContent('true');
        expect(screen.getByTestId('fits-900')).toHaveTextContent('false');
    });

    it('reports minimal density for narrow content areas', () => {
        render(
            <UIProvider initialContainerWidth={360}>
                <DensityProbe />
            </UIProvider>
        );

        expect(screen.getByTestId('density')).toHaveTextContent('minimal');
        expect(screen.getByTestId('at-least-comfortable')).toHaveTextContent('false');
    });
});


describe('DashboardHeader responsive contract', () => {
    it('renders title, subtitle and full actions at full density', () => {
        renderDashboardHeader(1280);

        expect(screen.getByRole('heading', { name: 'Tổng quan' })).toBeInTheDocument();
        expect(screen.getByText(/Bảng điều khiển/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Xuất báo cáo' })).toBeInTheDocument();
        // Primary actions win over the compact variant when there is room
        expect(screen.queryByRole('button', { name: 'Xuất' })).not.toBeInTheDocument();
    });

    it('drops the subtitle but keeps labelled actions at wide density', () => {
        renderDashboardHeader(900);

        expect(screen.getByRole('heading', { name: 'Tổng quan' })).toBeInTheDocument();
        expect(screen.queryByText(/Bảng điều khiển/)).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Xuất báo cáo' })).toBeInTheDocument();
    });

    it('swaps in compactActions below comfortable density', () => {
        renderDashboardHeader(520);

        expect(screen.getByRole('heading', { name: 'Tổng quan' })).toBeInTheDocument();
        expect(screen.queryByText(/Bảng điều khiển/)).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Xuất' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Xuất báo cáo' })).not.toBeInTheDocument();
    });

    it('keeps the title rendered (and truncatable) at minimal density', () => {
        renderDashboardHeader(320);

        const title = screen.getByRole('heading', { name: 'Tổng quan' });
        expect(title).toBeInTheDocument();
        expect(title.className).toContain('truncate');
        expect(screen.getByRole('button', { name: 'Xuất' })).toBeInTheDocument();
    });
});
