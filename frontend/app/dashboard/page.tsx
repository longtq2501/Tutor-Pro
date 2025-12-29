'use client';

import React, { useState, useMemo } from 'react';
import {
    AlertCircle, CalendarDays, GraduationCap, LayoutDashboard,
    TrendingUp, UserCheck, FileText, LogOut, BookCheck, BookOpen
} from 'lucide-react';

// ============================================================================
// FEATURE-BASED IMPORTS (All refactored)
// ============================================================================
import AdminDashboard from '@/features/dashboard/admin-dashboard';
import StudentDashboard from '@/features/dashboard/student-dashboard';
import StudentList from '@/features/students/student-list';
import MonthlyView from '@/features/finance/monthly-view';
import ParentsView from '@/features/students/parents-view';
import UnpaidSessionsView from '@/features/finance/unpaid-sessions';
import StudentHomeworkView from '@/features/learning/homework/student-homework';
import TutorHomeworkView from '@/features/learning/homework/tutor-homework-view';
import DocumentLibrary from '@/features/documents/document-library';
import CalendarView from '@/features/calendar/calendar-view';

// Lesson Views - Different components for different roles
import LessonViewWrapper from '@/features/learning/lesson-view-wrapper'; // STUDENT - Xem bài giảng
import AdminLessonManager from '@/features/learning/lessons'; // ADMIN/TUTOR - Quản lý bài giảng

// ============================================================================
// UI COMPONENTS (Keep in /components - not feature-specific)
// ============================================================================
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
import { UIProvider } from '@/contexts/UIContext';
import { BackgroundBeams } from '@/components/ui/background-beams';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function AppContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const initialView = (searchParams.get('view') as View) || 'dashboard';
    const [currentView, setCurrentView] = useState<View>(initialView);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, logout, hasAnyRole } = useAuth();

    // Sync state to URL when changed
    const handleSetCurrentView = (view: View | ((prev: View) => View)) => {
        const newView = typeof view === 'function' ? view(currentView) : view;
        setCurrentView(newView);

        const params = new URLSearchParams(searchParams.toString());
        params.set('view', newView);
        router.push(`${pathname}?${params.toString()}`);
    };

    const navItems: NavItem[] = useMemo(() => {
        const allItems: NavItem[] = [
            { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
            { id: 'students', label: 'Học Sinh', icon: GraduationCap },
            { id: 'monthly', label: 'Thống Kê', icon: TrendingUp },
            { id: 'calendar', label: 'Lịch Dạy', icon: CalendarDays },
            { id: 'lessons', label: 'Bài Giảng', icon: BookOpen }, // Hiển thị cho tất cả roles
            { id: 'homework', label: 'Bài Tập', icon: BookCheck },
            { id: 'unpaid', label: 'Công Nợ', icon: AlertCircle },
            { id: 'parents', label: 'Phụ Huynh', icon: UserCheck },
            { id: 'documents', label: 'Tài Liệu', icon: FileText },
        ];

        return allItems.filter(item => {
            if (item.id === 'students' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'monthly' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'unpaid' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'parents' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'calendar' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            // lessons: Hiển thị cho tất cả roles nhưng nội dung khác nhau
            return true;
        });
    }, [hasAnyRole]);

    React.useEffect(() => {
        // Only reset if current view is invalid for role?
        // Or just trust the URL param if valid?
        // Keep original logic for role changes but respect URL on mount
        if (!initialView) setCurrentView('dashboard');
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
        <div className="flex h-screen relative isolate">

            {/* Animated gradient background - Hidden in light mode for pure white look */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none hidden dark:block">
                <div className="absolute top-0 left-0 w-full h-[500px] dark:h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-background dark:from-primary/10 dark:via-purple-900/10 dark:to-transparent rounded-b-[80px] dark:rounded-none transition-all duration-500" />
                <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[100px]" />

                {/* Background Beams - Only visible in dark mode, desktop only for performance */}
                <div className="hidden dark:hidden lg:dark:flex absolute inset-0 z-0">
                    <BackgroundBeams />
                </div>
            </div>

            <Sidebar
                navItems={navItems}
                currentView={currentView}
                setCurrentView={handleSetCurrentView}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <header className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center justify-between h-14 lg:h-16 px-4 lg:px-6">
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

                <main className="flex-1 overflow-y-auto min-w-0">
                    <div className="p-4">
                        {/* Dashboard */}
                        {currentView === 'dashboard' && hasAnyRole(['ADMIN', 'TUTOR']) && <AdminDashboard />}
                        {currentView === 'dashboard' && hasAnyRole(['STUDENT']) && <StudentDashboard />}

                        {/* All feature-based views */}
                        {currentView === 'students' && hasAnyRole(['ADMIN', 'TUTOR']) && <StudentList />}
                        {currentView === 'monthly' && hasAnyRole(['ADMIN', 'TUTOR']) && <MonthlyView />}
                        {currentView === 'calendar' && hasAnyRole(['ADMIN', 'TUTOR']) && <CalendarView />}

                        {/* ============================================================ */}
                        {/* LESSONS - Different views for different roles                */}
                        {/* ============================================================ */}
                        {/* ADMIN/TUTOR: Quản lý bài giảng (tạo, sửa, xóa, giao bài) */}
                        {currentView === 'lessons' && hasAnyRole(['ADMIN', 'TUTOR']) && <AdminLessonManager />}

                        {/* STUDENT: Xem bài giảng (timeline + detail modal) */}
                        {currentView === 'lessons' && hasAnyRole(['STUDENT']) && <LessonViewWrapper />}

                        {/* Homework */}
                        {currentView === 'homework' && hasAnyRole(['STUDENT']) && <StudentHomeworkView />}
                        {currentView === 'homework' && hasAnyRole(['ADMIN', 'TUTOR']) && <TutorHomeworkView />}

                        {/* Other views */}
                        {currentView === 'unpaid' && hasAnyRole(['ADMIN', 'TUTOR']) && <UnpaidSessionsView />}
                        {currentView === 'parents' && hasAnyRole(['ADMIN', 'TUTOR']) && <ParentsView />}
                        {currentView === 'documents' && <DocumentLibrary />}

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

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <UIProvider>
                <AppContent />
            </UIProvider>
        </ProtectedRoute>
    );
}
