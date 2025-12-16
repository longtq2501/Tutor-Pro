
'use client';

import { useState } from 'react';
import { Calendar, User, TrendingUp, FileText, UserCheck, AlertCircle, CalendarDays } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import StudentList from '@/components/StudentList';
import MonthlyView from '@/components/MonthlyView';
import DocumentLibrary from '@/components/DocumentLibrary';
import ParentsView from '@/components/ParentsView';
import UnpaidSessionsView from '@/components/UnpaidSessionsView';
import CalendarView from '@/components/CalendarView';

type View = 'dashboard' | 'students' | 'monthly' | 'documents' | 'parents' | 'unpaid' | 'calendar';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'students', label: 'Học Sinh', icon: User },
    { id: 'monthly', label: 'Theo Tháng', icon: Calendar },
    { id: 'calendar', label: 'Lịch', icon: CalendarDays },
    { id: 'unpaid', label: 'Công Nợ', icon: AlertCircle },
    { id: 'parents', label: 'Phụ Huynh', icon: UserCheck },
    { id: 'documents', label: 'Tài Liệu', icon: FileText },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hệ Thống Quản Lý Gia Sư</h1>
           <p className="text-gray-500 mt-1">Quản lý học sinh, lịch dạy và doanh thu hiệu quả.</p>
        </div>

        {/* Navigation Bar - Scrollable on mobile */}
        <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
          <div className="flex space-x-2 border-b border-gray-200 min-w-max pb-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all
                    ${isActive 
                      ? 'border-indigo-600 text-indigo-600 bg-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <main className="animate-in fade-in duration-300">
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
