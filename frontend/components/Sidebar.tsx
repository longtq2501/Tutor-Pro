'use client';

import React from 'react';
import { 
  AlertCircle, CalendarDays, GraduationCap, LayoutDashboard,
  TrendingUp, UserCheck, FileText, ChevronsLeft
} from 'lucide-react';

// Note: These types could be moved to a shared lib/types.ts file
export type View = 'dashboard' | 'students' | 'monthly' | 'documents' | 'parents' | 'unpaid' | 'calendar';
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
    
    return (
        <div className={`relative h-screen flex flex-col bg-card/80 dark:bg-card/60 backdrop-blur-xl border-r border-border shadow-lg transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
            
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 z-10 p-1 bg-card border-2 border-background rounded-full shadow-md hover:bg-muted transition-all"
                aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
                <ChevronsLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            <div className="flex items-center border-b border-border h-20 px-4 overflow-hidden">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-background rounded-lg flex-shrink-0">
                        <GraduationCap className="text-primary" size={24} />
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-32 opacity-100'}`}>
                         <span className="font-extrabold text-xl tracking-tight whitespace-nowrap">Tutor Pro</span>
                    </div>
                </div>
            </div>

            <nav className="flex-grow p-3 space-y-2">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            title={isCollapsed ? item.label : ''}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                                ${isActive 
                                    ? 'bg-primary text-primary-foreground shadow-md' 
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }
                                ${isCollapsed ? 'justify-center' : ''}
                            `}
                        >
                            <Icon size={20} />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}