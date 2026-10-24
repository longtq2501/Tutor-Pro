'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { isHeaderDensityAtLeast, resolveHeaderDensity } from '@/lib/ui/responsive';

interface UIContextType {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    activeDialogs: number;
    openDialog: () => void;
    closeDialog: () => void;
    // Dynamic Header
    headerTitle: string;
    setHeaderTitle: (title: string) => void;
    headerSubtitle: string | null;
    setHeaderSubtitle: (subtitle: string | null) => void;
    headerActions: React.ReactNode | null;
    setHeaderActions: (actions: React.ReactNode | null) => void;
    // Portal Slots
    titleSlot: HTMLElement | null;
    setTitleSlot: (slot: HTMLElement | null) => void;
    actionsSlot: HTMLElement | null;
    setActionsSlot: (slot: HTMLElement | null) => void;
    // Container Query / Measured Width
    containerWidth: number;
    setContainerWidth: (w: number) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({
    children,
    initialContainerWidth,
}: {
    children: ReactNode;
    /** Optional seed for the measured width — used by tests and SSR. */
    initialContainerWidth?: number;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeDialogs, setActiveDialogs] = useState(0);
    const [containerWidth, setContainerWidth] = useState<number>(() => {
        if (typeof initialContainerWidth === 'number' && initialContainerWidth > 0) {
            return initialContainerWidth;
        }
        if (typeof window !== 'undefined') {
            return window.innerWidth;
        }
        return 1280;
    });

    const openDialog = () => setActiveDialogs(prev => prev + 1);
    const closeDialog = () => setActiveDialogs(prev => Math.max(0, prev - 1));

    // Update global CSS variable for sidebar width
    React.useEffect(() => {
        const handleResize = () => {
            const isLargeDesktop = window.innerWidth >= 1920;
            const isMobile = window.innerWidth < 1024;

            let width = 0;
            if (isMobile) {
                width = 0;
            } else if (isCollapsed) {
                width = isLargeDesktop ? 80 : 64;
            } else {
                width = isLargeDesktop ? 280 : 220;
            }
            document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isCollapsed]);

    // Portal Slots for Header
    const [titleSlot, setTitleSlot] = useState<HTMLElement | null>(null);
    const [actionsSlot, setActionsSlot] = useState<HTMLElement | null>(null);

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            setSidebarOpen,
            isCollapsed,
            setIsCollapsed,
            activeDialogs,
            openDialog,
            closeDialog,
            headerTitle: '', // Deprecated
            setHeaderTitle: () => { }, // Deprecated
            headerSubtitle: null, // Deprecated
            setHeaderSubtitle: () => { }, // Deprecated
            headerActions: null, // Deprecated
            setHeaderActions: () => { }, // Deprecated
            titleSlot,
            setTitleSlot,
            actionsSlot,
            setActionsSlot,
            containerWidth,
            setContainerWidth,
        }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}

/**
 * Slot component placed in the layout where features will inject their content
 */
export function HeaderSlot({ id }: { id: 'title' | 'actions' }) {
    const { setTitleSlot, setActionsSlot } = useUI();
    return (
        <div
            ref={(el) => {
                if (id === 'title') setTitleSlot(el);
                if (id === 'actions') setActionsSlot(el);
            }}
            className="h-full min-w-0"
        />
    );
}

/**
 * Portal component used by features to inject content into the layout slots
 */
export function HeaderPortal({ children, to }: { children: React.ReactNode; to: 'title' | 'actions' }) {
    const { titleSlot, actionsSlot } = useUI();
    const slot = to === 'title' ? titleSlot : actionsSlot;

    if (!slot) return null;
    return createPortal(children, slot);
}

/**
 * Component to be used by features to project their header content into the layout.
 * Designed for the single-row header (h-14 = 56px).
 *
 * Responsive contract:
 * - The title always truncates first (`min-w-0` + `truncate`), never the actions.
 * - Low-priority text (subtitle) is only rendered at `full` density (>= 1200px).
 * - `compactActions` replaces `actions` below `comfortable` density (< 640px), so
 *   modules can swap wide controls for icon-only / overflow-menu variants.
 */
export function DashboardHeader({
    title,
    subtitle,
    actions,
    compactActions,
    actionsClassName,
}: {
    title: string;
    subtitle?: string | null;
    actions?: React.ReactNode;
    /** Alternative (fewer/smaller) controls rendered below 640px of content width. */
    compactActions?: React.ReactNode;
    /** Extra classes applied to the actions wrapper. */
    actionsClassName?: string;
}) {
    const { containerWidth } = useUI();
    const density = resolveHeaderDensity(containerWidth);
    // Hide subtitle first when the content area is constrained (< 1200px)
    const showSubtitle = isHeaderDensityAtLeast(density, 'full');
    const useCompactActions = Boolean(compactActions) && !isHeaderDensityAtLeast(density, 'comfortable');
    const renderedActions = useCompactActions ? compactActions : actions;

    return (
        <>
            <HeaderPortal to="title">
                <div className="flex items-center gap-2 min-w-0 max-w-full">
                    <h1
                        title={subtitle ? `${title} – ${subtitle}` : title}
                        className="text-[14px] sm:text-[16px] lg:text-[17px] font-black tracking-tight leading-none text-foreground truncate min-w-0"
                    >
                        {title}
                    </h1>
                    {subtitle && showSubtitle && (
                        <span className="hidden md:block text-[13px] text-muted-foreground font-medium truncate opacity-70 min-w-0">
                            — {subtitle}
                        </span>
                    )}
                </div>
            </HeaderPortal>
            {renderedActions ? (
                <HeaderPortal to="actions">
                    <div
                        data-header-actions
                        className={cn(
                            'flex flex-nowrap items-center justify-end gap-1 sm:gap-1.5 min-w-0 shrink-0',
                            actionsClassName
                        )}
                    >
                        {renderedActions}
                    </div>
                </HeaderPortal>
            ) : null}
        </>
    );
}

// Keep useHeader for backward compatibility but mark as deprecated
export function useHeader() {
    // This is now handled by DashboardHeader component using Portals
}
