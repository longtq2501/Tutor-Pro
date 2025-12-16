
'use client';

import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, CalendarDays, GraduationCap, LayoutDashboard,
  TrendingUp, UserCheck, FileText
} from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import StudentList from '@/components/StudentList';
import MonthlyView from '@/components/MonthlyView';
import DocumentLibrary from '@/components/DocumentLibrary';
import ParentsView from '@/components/ParentsView';
import UnpaidSessionsView from '@/components/UnpaidSessionsView';
import CalendarView from '@/components/CalendarView';
import { Sidebar, View, NavItem } from '@/components/Sidebar';
import { ModeToggle } from '@/components/ModeToggle';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = useMemo(() => [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'students', label: 'Học Sinh', icon: GraduationCap },
    { id: 'monthly', label: 'Thống Kê', icon: TrendingUp },
    { id: 'calendar', label: 'Lịch Dạy', icon: CalendarDays },
    { id: 'unpaid', label: 'Công Nợ', icon: AlertCircle },
    { id: 'parents', label: 'Phụ Huynh', icon: UserCheck },
    { id: 'documents', label: 'Tài Liệu', icon: FileText },
  ], []);

  const currentTitle = useMemo(() => {
    return navItems.find(item => item.id === currentView)?.label || 'Dashboard';
  }, [currentView, navItems]);

  return (
    <div className="flex h-screen bg-background transition-colors duration-300">
      
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-background dark:from-primary/20 dark:via-purple-900/20 dark:to-background rounded-b-[80px] transition-all duration-500" />
        <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <Sidebar 
        navItems={navItems}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-20 px-8 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{currentTitle}</h1>
            <p className="text-sm text-muted-foreground">Chào mừng trở lại, đây là tổng quan của bạn.</p>
          </div>
          <div className="flex items-center gap-4">
             <ModeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto animate-in fade-in-50">
          <div className="p-8">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'students' && <StudentList />}
            {currentView === 'monthly' && <MonthlyView />}
            {currentView === 'calendar' && <CalendarView />}
            {currentView === 'unpaid' && <UnpaidSessionsView />}
            {currentView === 'parents' && <ParentsView />}
            {currentView === 'documents' && <DocumentLibrary />}
          </div>
        </main>
      </div>
    </div>
  );
}
