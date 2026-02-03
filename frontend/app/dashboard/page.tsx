'use client';

import {
    BookOpen,
    CalendarDays,
    ClipboardList,
    FileText,
    GraduationCap, LayoutDashboard,
    LogOut,
    Menu,
    TrendingUp,
    Users,
    Video
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// ============================================================================
// FEATURE-BASED IMPORTS (All refactored)
// ============================================================================
import AdminDashboard from '@/features/dashboard/admin-dashboard';
import { StudentViewSkeleton } from '@/features/students/unified-view/components/StudentViewSkeleton';
import { FinanceViewSkeleton } from '@/features/finance/management/components/FinanceViewSkeleton';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';


const StudentDashboard = dynamic(() => import('@/features/dashboard/student-dashboard'));

const UnifiedStudentView = dynamic(() => import('@/features/students/unified-view'), {
    loading: () => <StudentViewSkeleton />
});

const FinanceDashboard = dynamic(() => import('@/features/finance/management/components/FinanceDashboard'), {
    loading: () => <FinanceViewSkeleton />
});
// const MonthlyView = dynamic(() => import('@/features/finance/monthly-view'), {
//    loading: () => <MonthlyViewSkeleton />
// });
// const UnpaidSessionsView = dynamic(() => import('@/features/finance/unpaid-sessions'));
const DocumentLibrary = dynamic(() => import('@/features/documents/document-library'));
const CalendarView = dynamic(() => import('@/features/calendar/calendar-view'));

// Lesson Views - Different components for different roles
const LessonViewWrapper = dynamic(() => import('@/features/learning/lesson-view-wrapper'));
const AdminLessonManager = dynamic(() => import('@/features/learning/lessons'));
const TutorsFeature = dynamic(() => import('@/features/tutors'));
const LiveRoomFeature = dynamic(() => import('@/features/live-room'));

// ============================================================================
// UI COMPONENTS (Keep in /components - not feature-specific)
// ============================================================================
import { ModeToggle } from '@/components/ModeToggle';
import ProtectedRoute from '@/components/ProtectedRoute';
import { NavItem, Sidebar, View } from '@/components/Sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { UIProvider, useUI, HeaderSlot } from '@/contexts/UIContext';

import ExerciseDashboard from '@/features/exercises/exercise-dashboard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';

// ============================================================================
// MEMOIZED SUB-COMPONENTS FOR RENDERING ISOLATION
// ============================================================================

const AppHeader = React.memo(({ user, initials, roleBadge, logout }: {
    user: any;
    initials: string;
    roleBadge: any;
    logout: () => void;
}) => {
    const { setSidebarOpen } = useUI();

    return (
        <header className="border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-20 transition-all duration-300">
            <div className="flex flex-col w-full">
                {/* Global Utility Bar - Top */}
                <div className="flex items-center justify-between h-14 lg:h-16 px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-9 w-9"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        {/* Breadcrumb-like indicator (Small on desktop) */}
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/60 lg:hidden">
                            {/* Mobile Title Slot or logic can go here if needed, keeping it simple for now */}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                        <NotificationBell />
                        <ModeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-full hover:bg-white/5 transition-colors">
                                    <Avatar className="h-9 w-9 lg:h-10 lg:w-10 border border-primary/20">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs lg:text-sm font-bold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal p-4">
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold leading-none">{user?.fullName}</p>
                                            <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                        {roleBadge && (
                                            <span className={`inline-flex items-center w-fit px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadge.color}`}>
                                                {roleBadge.label}
                                            </span>
                                        )}
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => logout()} className="text-red-600 dark:text-red-400 cursor-pointer p-3">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span className="font-bold">Đăng xuất</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Hero Title & Actions Bar - Responsive layout */}
                <div className="px-4 lg:px-8 pb-4 lg:pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-8">
                    <div className="flex-1 min-w-0 w-full md:w-auto">
                        <HeaderSlot id="title" />
                    </div>

                    {/* Actions Slot */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap md:flex-nowrap shrink-0">
                        <HeaderSlot id="actions" />
                    </div>
                </div>
            </div>
        </header>
    );
});
AppHeader.displayName = 'AppHeader';


const MainContentSwitcher = React.memo(({ currentView, hasAnyRole }: {
    currentView: View;
    hasAnyRole: (roles: ("ADMIN" | "TUTOR" | "STUDENT")[]) => boolean;
}) => (
    <main className="flex-1 overflow-y-auto min-w-0 overscroll-none relative bg-background">
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={currentView}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                className="p-4 min-h-full"
            >
                {/* Dashboard */}
                {currentView === 'dashboard' && hasAnyRole(['ADMIN', 'TUTOR']) && <AdminDashboard />}
                {currentView === 'dashboard' && hasAnyRole(['STUDENT']) && <StudentDashboard />}

                {/* All feature-based views */}
                {(currentView === 'students' || currentView === 'parents') && hasAnyRole(['ADMIN', 'TUTOR']) && <UnifiedStudentView />}
                {(currentView === 'finance' || currentView === 'monthly') && hasAnyRole(['ADMIN', 'TUTOR']) && <FinanceDashboard />}
                {/* {currentView === 'monthly' && hasAnyRole(['ADMIN', 'TUTOR']) && <MonthlyView />} */}
                {currentView === 'calendar' && hasAnyRole(['ADMIN', 'TUTOR']) && <CalendarView />}

                {/* New Exercise Dashboard */}
                {currentView === 'exercises' && <ExerciseDashboard />}

                {/* Admin/Tutor Lesson Manager */}
                {currentView === 'lessons' && hasAnyRole(['ADMIN', 'TUTOR']) && <AdminLessonManager />}
                {/* Tutor Management */}
                {currentView === 'tutors' && hasAnyRole(['ADMIN']) && <TutorsFeature />}

                {/* Live Room */}
                {currentView === 'live-room' && <LiveRoomFeature />}

                {/* Student Lesson View */}
                {currentView === 'lessons' && hasAnyRole(['STUDENT']) && <LessonViewWrapper />}


                {/* Other views */}
                {/* {currentView === 'unpaid' && hasAnyRole(['ADMIN', 'TUTOR']) && <UnpaidSessionsView />} */}
                {currentView === 'documents' && <DocumentLibrary />}

                {/* Fallback */}
                {currentView === 'dashboard' && !hasAnyRole(['ADMIN', 'TUTOR', 'STUDENT']) && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Bạn không có quyền xem trang này</p>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    </main>
));
MainContentSwitcher.displayName = 'MainContentSwitcher';

function AppContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const initialView = (searchParams.get('view') as View) || 'dashboard';
    const [currentView, setCurrentView] = useState<View>(initialView);
    const { isCollapsed, setIsCollapsed } = useUI();
    const { user, logout, hasAnyRole } = useAuth();
    const roomId = searchParams.get('roomId');

    // Auto-collapse logic for tablets
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                setIsCollapsed(true);
            } else if (window.innerWidth >= 1024) {
                setIsCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sync state to URL when currentView changes
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlView = params.get('view');

        if (urlView !== currentView) {
            params.set('view', currentView);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [currentView, pathname, router]);

    // Sync URL changes to state (browser back/forward)
    React.useEffect(() => {
        const viewFromUrl = (searchParams.get('view') as View) || 'dashboard';
        if (viewFromUrl !== currentView) {
            setCurrentView(viewFromUrl);
        }
    }, [searchParams]); // Remove currentView from deps to avoid loop

    // Simple handler - just update state, let useEffect handle URL
    const handleSetCurrentView = useCallback((view: View | ((prev: View) => View)) => {
        setCurrentView(view);
    }, []);

    const navItems: NavItem[] = useMemo(() => {
        const allItems: NavItem[] = [
            { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
            { id: 'tutors', label: 'Gia Sư', icon: Users },
            { id: 'students', label: 'Học Sinh & PH', icon: GraduationCap },
            { id: 'finance', label: 'Tài Chính', icon: TrendingUp }, // Unified View
            { id: 'calendar', label: 'Lịch Dạy', icon: CalendarDays },
            { id: 'lessons', label: 'Bài Giảng', icon: BookOpen },
            { id: 'exercises', label: 'Khảo thí', icon: ClipboardList },
            // { id: 'unpaid', label: 'Công Nợ', icon: AlertCircle },
            { id: 'documents', label: 'Tài Liệu', icon: FileText },
            { id: 'live-room', label: 'Lớp học', icon: Video },
        ];

        return allItems.filter(item => {
            if (item.id === 'students' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'finance' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'monthly' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'unpaid' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'calendar' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'tutors' && !hasAnyRole(['ADMIN'])) return false;
            // live-room is accessible by everyone involved in a session, but usually accessed via link. 
            // We can hide it from main nav if no active session, or keep it. 
            // For now, let's allow it for ADMIN/TUTOR/STUDENT as a specialized view.
            // if (item.id === 'live-room') return false; // Hide from sidebar initially, accessed via Calendar/Link
            if (item.id === 'live-room') return true;
            return true;
        });
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

    const roleBadge = useMemo(() => user ? getRoleBadge(user.role) : null, [user]);
    const initials = useMemo(() => user ? getInitials(user.fullName) : '', [user]);

    // 🚀 FULL SCREEN TAKEOVER LIVE ROOM MODE
    // If in live-room view AND roomId is present, render bypassing the layout
    if (currentView === 'live-room' && roomId) {
        return (
            <div className="fixed inset-0 z-50 bg-background w-screen h-screen overflow-hidden">
                <LiveRoomFeature roomId={roomId} />
            </div>
        );
    }

    // Standard Dashboard Layout
    return (
        <div className="flex h-screen relative isolate bg-background">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none hidden dark:block">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-purple-500/5 to-background transition-all duration-500" />
            </div>

            <Sidebar
                navItems={navItems}
                currentView={currentView === 'monthly' ? 'finance' : currentView}
                setCurrentView={handleSetCurrentView}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-background">
                <AppHeader
                    user={user}
                    initials={initials}
                    roleBadge={roleBadge}
                    logout={logout}
                />

                <MainContentSwitcher
                    currentView={currentView}
                    hasAnyRole={hasAnyRole}
                />
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
