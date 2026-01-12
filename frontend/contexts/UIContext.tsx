'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    activeDialogs: number;
    openDialog: () => void;
    closeDialog: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeDialogs, setActiveDialogs] = useState(0);

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

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            setSidebarOpen,
            isCollapsed,
            setIsCollapsed,
            activeDialogs,
            openDialog,
            closeDialog
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
