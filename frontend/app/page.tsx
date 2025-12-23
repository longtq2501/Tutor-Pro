'use client';

import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, CalendarDays, GraduationCap, LayoutDashboard,
  TrendingUp, UserCheck, FileText, LogOut, User, BookCheck, BookOpen // ✅ Add BookOpen
} from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import StudentDashboard from '@/components/StudentDashboard';
import StudentList from '@/components/StudentList';
import MonthlyView from '@/components/MonthlyView';
import DocumentLibrary from '@/components/DocumentLibrary';
import ParentsView from '@/components/ParentsView';
import UnpaidSessionsView from '@/components/UnpaidSessionsView';
import CalendarView from '@/components/CalendarView';
import { Sidebar, View, NavItem } from '@/components/Sidebar';
import { ModeToggle } from '@/components/ModeToggle';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import StudentHomeworkView from '@/components/StudentHomeworkView';
import TutorHomeworkView from '@/components/TutorHomeworkView';
// ✅ Import Wrapper instead of Timeline directly
import LessonViewWrapper from '@/components/LessonViewWrapper';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout, hasAnyRole } = useAuth();

  // ✅ ADD 'lessons' TO NAVIGATION
  const navItems: NavItem[] = useMemo(() => {
    const allItems: NavItem[] = [
      { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
      { id: 'students', label: 'Học Sinh', icon: GraduationCap },
      { id: 'monthly', label: 'Thống Kê', icon: TrendingUp },
      { id: 'calendar', label: 'Lịch Dạy', icon: CalendarDays },
      { id: 'lessons', label: 'Bài Giảng', icon: BookOpen }, // ✅ NEW
      { id: 'homework', label: 'Bài Tập', icon: BookCheck },
      { id: 'unpaid', label: 'Công Nợ', icon: AlertCircle },
      { id: 'parents', label: 'Phụ Huynh', icon: UserCheck },
      { id: 'documents', label: 'Tài Liệu', icon: FileText },
    ];

    return allItems.filter(item => {
      // Students: ADMIN, TUTOR only
      if (item.id === 'students' && !hasAnyRole(['ADMIN', 'TUTOR'])) {
        return false;
      }
      
      // Monthly Stats: ADMIN, TUTOR only
      if (item.id === 'monthly' && !hasAnyRole(['ADMIN', 'TUTOR'])) {
        return false;
      }
      
      // Unpaid: ADMIN, TUTOR only
      if (item.id === 'unpaid' && !hasAnyRole(['ADMIN', 'TUTOR'])) {
        return false;
      }
      
      // Parents: ADMIN, TUTOR only
      if (item.id === 'parents' && !hasAnyRole(['ADMIN', 'TUTOR'])) {
        return false;
      }
  
      // Calendar: ADMIN, TUTOR only
      if (item.id === 'calendar' && !hasAnyRole(['ADMIN', 'TUTOR'])) {
        return false;
      }

      // ✅ Lessons: STUDENT only (TUTOR/ADMIN can manage via separate admin panel)
      if (item.id === 'lessons' && !hasAnyRole(['STUDENT'])) {
        return false;
      }
      
      return true;
    });
  }, [hasAnyRole]);

  React.useEffect(() => {
    setCurrentView('dashboard');
  }, [hasAnyRole]);

  const currentTitle = useMemo(() => {
    return navItems.find(item => item.id === currentView)?.label || 'Dashboard';
  }, [currentView, navItems]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN: { label: 'Quản trị viên', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
      TUTOR: { label: 'Gia sư', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
      STUDENT: { label: 'Học sinh', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
    };
    return badges[role as keyof typeof badges] || badges.STUDENT;
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

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
        <header className="border-b border-border">
          <div className="flex items-center justify-between h-16 lg:h-20 px-4 lg:px-8">
            <div className="flex-1 min-w-0 pl-12 lg:pl-0">
              <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-foreground truncate">{currentTitle}</h1>
              <p className="text-xs lg:text-sm text-muted-foreground hidden lg:block truncate">
                Chào mừng trở lại, {user?.fullName}.
              </p>
            </div>
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <ModeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 lg:h-10 lg:w-10 rounded-full">
                    <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs lg:text-base">
                        {user && getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user?.email}
                      </p>
                      {roleBadge && (
                        <span className={`inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium ${roleBadge.color}`}>
                          {roleBadge.label}
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-red-600 dark:text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto animate-in fade-in-50">
          <div className="p-4 lg:p-8">
            {/* Dashboard */}
            {currentView === 'dashboard' && hasAnyRole(['ADMIN', 'TUTOR']) && <Dashboard />}
            {currentView === 'dashboard' && hasAnyRole(['STUDENT']) && <StudentDashboard />}
            
            {/* Other views */}
            {currentView === 'students' && hasAnyRole(['ADMIN', 'TUTOR']) && <StudentList />}
            {currentView === 'monthly' && hasAnyRole(['ADMIN', 'TUTOR']) && <MonthlyView />}
            {currentView === 'calendar' && hasAnyRole(['ADMIN', 'TUTOR']) && <CalendarView />}
            {currentView === 'unpaid' && hasAnyRole(['ADMIN', 'TUTOR']) && <UnpaidSessionsView />}
            {currentView === 'parents' && hasAnyRole(['ADMIN', 'TUTOR']) && <ParentsView />}
            {currentView === 'documents' && <DocumentLibrary />}
            {currentView === 'homework' && hasAnyRole(['STUDENT']) && <StudentHomeworkView />}
            {currentView === 'homework' && hasAnyRole(['ADMIN', 'TUTOR']) && <TutorHomeworkView />}
            
            {/* ✅ NEW: Learning Log - Student only (with inline detail view) */}
            {currentView === 'lessons' && hasAnyRole(['STUDENT']) && <LessonViewWrapper />}
            
            {/* Fallback */}
            {currentView === 'dashboard' && !hasAnyRole(['ADMIN', 'TUTOR', 'STUDENT']) && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Bạn không có quyền xem trang này</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  );
}