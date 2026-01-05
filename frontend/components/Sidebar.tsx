'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import React, { useEffect, useState, memo } from 'react';
import { useUI } from '@/contexts/UIContext';

export type View = 'dashboard' | 'students' | 'monthly' | 'documents' | 'parents' | 'unpaid' | 'calendar' | 'homework' | 'lessons' | 'exercises';
export type NavItem = {
    id: View;
    label: string;
    icon: React.ElementType;
};

interface SidebarProps {
    currentView: View;
    setCurrentView: (view: View) => void;
    navItems: NavItem[];
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar = memo(({ currentView, setCurrentView, navItems, isCollapsed, setIsCollapsed }: SidebarProps) => {
    const { isSidebarOpen, setSidebarOpen } = useUI();

    // Auto-close sidebar on mobile when window is resized to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isSidebarOpen) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen, setSidebarOpen]);

    const handleNavClick = (view: View) => {
        setCurrentView(view);
        setSidebarOpen(false);
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.div
                initial={false}
                animate={{
                    width: isCollapsed ? 80 : 256,
                    x: isSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -288 : 0)
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={cn(
                    "main-sidebar",
                    "fixed lg:relative h-screen flex flex-col bg-card dark:bg-card border-r border-border shadow-2xl lg:shadow-none",
                    "z-50 flex-shrink-0",
                    isCollapsed ? "items-center" : "items-stretch"
                )}
            >
                {/* Desktop collapse button - Positioned outside the sidebar edge */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex absolute -right-4 top-8 z-50 h-8 w-8 items-center justify-center bg-card border border-border rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all group"
                    aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center"
                    >
                        <ChevronLeft size={18} className="transition-transform group-hover:scale-110" />
                    </motion.div>
                </button>

                {/* Mobile close button */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden absolute right-4 top-4 p-2 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Đóng menu"
                >
                    <X size={24} className="text-foreground" />
                </button>

                {/* Logo Header */}
                <div className="flex items-center border-b border-border h-20 px-4 shrink-0 overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-background rounded-lg shrink-0 shadow-sm">
                            <GraduationCap className="text-primary" size={24} />
                        </div>
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden whitespace-nowrap"
                                >
                                    <span className="font-extrabold text-xl tracking-tight text-foreground">Tutor Pro</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-grow p-3 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = currentView === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                title={isCollapsed ? item.label : ''}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-colors duration-200 group relative",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    isCollapsed ? "justify-center px-0" : "px-3"
                                )}
                            >
                                <Icon size={20} className={cn("shrink-0 transition-transform duration-200", !isActive && "group-hover:scale-110")} />

                                <AnimatePresence mode="wait">
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="truncate whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-6 bg-primary-foreground rounded-r-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </motion.div>
        </>
    );
});

Sidebar.displayName = 'Sidebar';
