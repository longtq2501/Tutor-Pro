'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

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

export function UIProvider({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeDialogs, setActiveDialogs] = useState(0);
    const [containerWidth, setContainerWidth] = useState<number>(() => {
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
 * Title has shrink-0 and min-width to avoid premature cut, subtitle hides first when space is tight.
 */
export function DashboardHeader({ title, subtitle, actions }: { title: string; subtitle?: string | null; actions?: React.ReactNode }) {
    const { containerWidth } = useUI();
    // Hide subtitle first when containerWidth is constrained (< 1200px)
    const showSubtitle = containerWidth >= 1200;

    return (
        <>
            <HeaderPortal to="title">
                <div className="flex items-center gap-2 min-w-0 shrink-0">
                    <h1
                        title={subtitle ? `${title} – ${subtitle}` : title}
                        className="text-[14px] sm:text-[16px] lg:text-[17px] font-black tracking-tight leading-none text-foreground truncate whitespace-nowrap shrink-0"
                    >
                        {title}
                    </h1>
                    {subtitle && showSubtitle && (
                        <span className="text-[13px] text-muted-foreground font-medium truncate opacity-70 whitespace-nowrap">
                            — {subtitle}
                        </span>
                    )}
                </div>
            </HeaderPortal>
            {actions && (
                <HeaderPortal to="actions">
                    <div className="flex items-center justify-end gap-1 sm:gap-1.5 min-w-0">
                        {actions}
                    </div>
                </HeaderPortal>
            )}
        </>
    );
}

// Keep useHeader for backward compatibility but mark as deprecated
export function useHeader() {
    // This is now handled by DashboardHeader component using Portals
}
