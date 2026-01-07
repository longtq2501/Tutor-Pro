'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    activeDialogs: number;
    openDialog: () => void;
    closeDialog: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeDialogs, setActiveDialogs] = useState(0);

    const openDialog = () => setActiveDialogs(prev => prev + 1);
    const closeDialog = () => setActiveDialogs(prev => Math.max(0, prev - 1));

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            setSidebarOpen,
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
