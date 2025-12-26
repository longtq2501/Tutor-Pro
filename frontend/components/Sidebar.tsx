'use client';

import React from 'react';
import {
    GraduationCap, ChevronsLeft, X, Menu
} from 'lucide-react';

export type View = 'dashboard' | 'students' | 'monthly' | 'documents' | 'parents' | 'unpaid' | 'calendar' | 'homework' | 'lessons';
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

export function Sidebar({ currentView, setCurrentView, navItems, isCollapsed, setIsCollapsed }: SidebarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleNavClick = (view: View) => {
        setCurrentView(view);
        setMobileMenuOpen(false); // Close mobile menu after selection
    };

    return (
        <>
            {/* Mobile Menu Button - Square shape, no overlap */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="sidebar-toggle lg:hidden fixed top-4 left-4 z-40 h-10 w-10 rounded-lg bg-background hover:bg-muted border border-border flex items-center justify-center transition-colors shadow-sm"
                aria-label="Mở menu"
            >
                <Menu size={20} className="text-foreground" />
            </button>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop fixed, Mobile slide-in */}
            <div className={`
                fixed lg:relative h-screen flex flex-col bg-card/80 dark:bg-card/60 backdrop-blur-xl border-r border-border shadow-lg
                transition-all duration-300 ease-in-out z-50
                ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                w-72
            `}>

                {/* Desktop collapse button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:block absolute -right-3 top-8 z-10 p-1 bg-card border-2 border-background rounded-full shadow-md hover:bg-muted transition-all"
                    aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                >
                    <ChevronsLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
                </button>

                {/* Mobile close button */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="lg:hidden absolute right-4 top-4 p-2 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Đóng menu"
                >
                    <X size={24} className="text-foreground" />
                </button>

                {/* Logo Header */}
                <div className="flex items-center border-b border-border h-20 px-4 overflow-hidden">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-background rounded-lg flex-shrink-0">
                            <GraduationCap className="text-primary" size={24} />
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed && !mobileMenuOpen ? 'w-0 opacity-0' : 'w-32 opacity-100'}`}>
                            <span className="font-extrabold text-xl tracking-tight whitespace-nowrap">Tutor Pro</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-grow p-3 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = currentView === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                title={isCollapsed && !mobileMenuOpen ? item.label : ''}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                                    ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }
                                    ${isCollapsed && !mobileMenuOpen ? 'justify-center' : ''}
                                `}
                            >
                                <Icon size={20} />
                                {(!isCollapsed || mobileMenuOpen) && <span className="truncate">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}