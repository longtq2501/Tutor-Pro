
'use client';

import React, { useState } from 'react';
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
import { ModeToggle } from '@/components/ModeToggle';

type View = 'dashboard' | 'students' | 'monthly' | 'documents' | 'parents' | 'unpaid' | 'calendar';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const navItems = [
    { id: 'dashboard' as const, label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'students' as const, label: 'Học Sinh', icon: GraduationCap },
    { id: 'monthly' as const, label: 'Thống Kê', icon: TrendingUp },
    { id: 'calendar' as const, label: 'Lịch Dạy', icon: CalendarDays },
    { id: 'unpaid' as const, label: 'Công Nợ', icon: AlertCircle },
    { id: 'parents' as const, label: 'Phụ Huynh', icon: UserCheck },
    { id: 'documents' as const, label: 'Tài Liệu', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      
      {/* Animated gradient background - Softened for Light Mode */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-background dark:from-primary/20 dark:via-purple-900/20 dark:to-background rounded-b-[80px] transition-all duration-500" />
        <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-4 mb-3">
              {/* Logo Box - Made stronger with white bg and shadow */}
              <div className="p-3 bg-white dark:bg-white/10 rounded-2xl shadow-lg border border-indigo-100 dark:border-white/20">
                <GraduationCap size={40} className="text-indigo-600 dark:text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Tutor Manager Pro
              </h1>
            </div>
            <p className="text-muted-foreground text-lg font-medium max-w-xl">
              Quản lý học sinh, lịch dạy và doanh thu hiệu quả
            </p>
          </div>

          {/* Dark mode toggle placeholder */}
          <div className="hidden sm:block">
          </div>
        </header>

        {/* Navigation */}
        <nav className="mb-10 sticky top-4 z-40">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-2 overflow-x-auto no-scrollbar">
            <div className="flex space-x-2 min-w-max">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`
                      flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md scale-[1.02]' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'students' && <StudentList />}
          {currentView === 'monthly' && <MonthlyView />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'unpaid' && <UnpaidSessionsView />}
          {currentView === 'parents' && <ParentsView />}
          {currentView === 'documents' && <DocumentLibrary />}
        </main>
      </div>
    </div>
  );
}
