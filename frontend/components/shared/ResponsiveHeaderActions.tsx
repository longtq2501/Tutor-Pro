'use client';

import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useUI } from '@/contexts/UIContext';
import {
    isHeaderDensityAtLeast,
    resolveHeaderDensity,
    type HeaderDensity,
} from '@/lib/ui/responsive';

/**
 * Shared building blocks for the single-row (h-14) application header.
 *
 * Every module header renders its controls into the shared header portal, therefore
 * it must never wrap onto a second row and must collapse its own controls as the
 * *measured* content width shrinks. `useHeaderDensity()` exposes that measurement in
 * a declarative way so each module can drop labels (icon-only) or move secondary
 * actions into a "⋯" overflow menu.
 */

export interface HeaderOverflowItem {
    /** Stable key used for React reconciliation. */
    key: string;
    label: string;
    icon?: React.ReactNode;
    onSelect: () => void;
    disabled?: boolean;
    destructive?: boolean;
}

export interface HeaderDensityInfo {
    /** Measured width of the content area (px). */
    containerWidth: number;
    /** Current header density tier. */
    density: HeaderDensity;
    /** True when the current density is at least as roomy as `minimum`. */
    atLeast: (minimum: HeaderDensity) => boolean;
    /** True when the content area is at least `minWidth` px wide. */
    fits: (minWidth: number) => boolean;
}

export function useHeaderDensity(): HeaderDensityInfo {
    const { containerWidth } = useUI();
    const density = resolveHeaderDensity(containerWidth);

    return React.useMemo<HeaderDensityInfo>(() => ({
        containerWidth,
        density,
        atLeast: (minimum: HeaderDensity) => isHeaderDensityAtLeast(density, minimum),
        fits: (minWidth: number) => containerWidth >= minWidth,
    }), [containerWidth, density]);
}

/** Standard class for a 32px icon-only action button inside the header. */
export const headerIconButtonClass = 'h-8 w-8 shrink-0 rounded-xl border-border/40 hover:bg-muted/50';

/**
 * Single-row, non-wrapping container for header actions.
 * `justify-end` keeps the controls right-aligned inside the actions portal slot.
 */
export function HeaderActionsRow({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            data-header-actions
            className={cn(
                'flex flex-nowrap items-center justify-end gap-1 sm:gap-1.5 min-w-0 shrink-0',
                className
            )}
        >
            {children}
        </div>
    );
}

interface HeaderOverflowMenuProps {
    /** Secondary actions collapsed into the menu. */
    items?: HeaderOverflowItem[];
    /** Extra menu content (e.g. custom `DropdownMenuItem`s) rendered before `items`. */
    children?: React.ReactNode;
    /** Accessible name for the trigger button. */
    label?: string;
    className?: string;
    contentClassName?: string;
    disabled?: boolean;
}

/**
 * "⋯" dropdown used to keep low-priority header actions reachable on narrow screens.
 * Renders nothing when there is no content, so callers can pass a conditional list.
 */
export function HeaderOverflowMenu({
    items = [],
    children,
    label = 'Thêm tùy chọn',
    className,
    contentClassName,
    disabled,
}: HeaderOverflowMenuProps) {
    const hasItems = items.length > 0;

    if (!hasItems && !children) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    disabled={disabled}
                    aria-label={label}
                    title={label}
                    className={cn(headerIconButtonClass, className)}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className={cn('w-60 rounded-xl border-border/60 shadow-xl z-50', contentClassName)}
            >
                {children}
                {items.map((item) => (
                    <DropdownMenuItem
                        key={item.key}
                        onClick={item.onSelect}
                        disabled={item.disabled}
                        className={cn(
                            'rounded-lg font-medium text-[13px] cursor-pointer gap-2',
                            item.destructive && 'text-destructive focus:text-destructive'
                        )}
                    >
                        {item.icon ? (
                            <span className="mr-1 flex h-4 w-4 shrink-0 items-center justify-center">
                                {item.icon}
                            </span>
                        ) : null}
                        <span className="truncate">{item.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
