'use client';

import {
    BarChart3,
    BookOpen,
    CalendarDays,
    ClipboardCheck,
    FolderArchive,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    TrendingUp,
    User,
    Users,
    Video
} from 'lucide-react';
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// FEATURE-BASED IMPORTS (All refactored)
// ============================================================================
import AdminDashboard from '@/features/dashboard/admin-dashboard';
import { StudentViewSkeleton } from '@/features/students/unified-view/components/StudentViewSkeleton';
import { FinanceViewSkeleton } from '@/features/finance/management/components/FinanceViewSkeleton';
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
const SettingsView = dynamic(() => import('@/features/settings'));
const ReportsFeature = dynamic(() => import('@/features/reports'));

// ============================================================================
// UI COMPONENTS (Keep in /components - not feature-specific)
// ============================================================================
import { ModeToggle } from '@/components/shared/ModeToggle';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { NavItem, Sidebar, View } from '@/components/tutor/Sidebar';
import { TourOverlay } from '@/components/onboarding/TourOverlay';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { HeaderSlot, UIProvider, useUI } from '@/contexts/UIContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import type { TourView } from '@/components/onboarding/useTour';
import { type UserInfo } from '@/lib/services/auth';

import ExerciseDashboard from '@/features/exercises/exercise-dashboard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { FeedbackWidget } from '@/features/support/components/FeedbackWidget';

// ============================================================================
// MEMOIZED SUB-COMPONENTS FOR RENDERING ISOLATION
// ============================================================================

interface RoleBadge {
    label: string;
    color: string;
}

const AppHeader = React.memo(({ user, initials, roleBadge, logout }: {
    user: UserInfo | null;
    initials: string;
    roleBadge: RoleBadge | null;
    logout: () => void;
}) => {
    const { setSidebarOpen } = useUI();
    const router = useRouter();

    return (
        // Single-row sticky header – h-14 (56px) on all screens
        <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-20 transition-all duration-300">
            <div className="flex items-center h-14 px-2 sm:px-3 lg:px-5 gap-1.5 sm:gap-2 min-w-0 overflow-hidden">

                {/* Hamburger (mobile only) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-8 w-8 shrink-0"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Mở menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Title Slot – shrink-0 so title NEVER shrinks prematurely */}
                <div className="min-w-0 flex-1">
                    <HeaderSlot id="title" />
                </div>

                {/* Actions Slot – keeps its intrinsic width, the title truncates instead */}
                <div className="flex items-center justify-end gap-1 sm:gap-1.5 min-w-0 shrink-0 max-w-full">
                    <HeaderSlot id="actions" />
                </div>

                {/* Separator */}
                <div className="h-6 w-px bg-border/60 shrink-0 hidden md:block" />

                {/* Global Utility: Notification + Avatar — NEVER HIDDEN, ALWAYS VISIBLE */}
                <div className="flex items-center gap-1 shrink-0 z-10">
                    <NotificationBell />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-muted/50 transition-colors p-0">
                                <Avatar className="h-8 w-8 border border-primary/20">
                                    <AvatarImage src={user?.avatarUrl} alt={user?.fullName} className="object-cover" />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-xl border-border shadow-2xl" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal p-4">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold leading-none text-foreground">{user?.fullName}</p>
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
                            <DropdownMenuSeparator className="bg-border/50" />

                            {/* Mode Toggle inside menu */}
                            <div className="px-3 py-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Giao diện</p>
                                <ModeToggle compact />
                            </div>
                            <DropdownMenuSeparator className="bg-border/50" />

                            <DropdownMenuItem
                                onClick={() => router.push('/dashboard?view=settings')}
                                className="cursor-pointer p-3 focus:bg-primary/5 group"
                            >
                                <User className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="font-bold">Thông tin cá nhân</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem onClick={() => logout()} className="text-red-600 dark:text-red-400 cursor-pointer p-3 focus:bg-red-500/5 group">
                                <LogOut className="mr-2 h-4 w-4 text-red-600/70 group-hover:text-red-600 transition-colors" />
                                <span className="font-bold">Đăng xuất</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
});
AppHeader.displayName = 'AppHeader';



const MainContentSwitcher = React.memo(({ currentView, hasAnyRole }: {
    currentView: View;
    hasAnyRole: (roles: ("ADMIN" | "TUTOR" | "STUDENT")[]) => boolean;
}) => {
    const isFullHeight = currentView === 'calendar' || currentView === 'documents' || currentView === 'reports';

    return (
        <main className="flex-1 min-w-0 overscroll-none relative bg-background flex flex-col h-full min-h-0 overflow-hidden">
            <div
                key={currentView}
                className={cn(
                    "w-full flex-1 min-h-0",
                    isFullHeight
                        ? "flex flex-col h-full p-1.5 sm:p-2 pb-1.5 sm:pb-2 overflow-hidden"
                        : "overflow-y-auto p-3 sm:p-4 pb-6 sm:pb-8"
                )}
            >
                {/* Dashboard */}
                {currentView === 'dashboard' && hasAnyRole(['ADMIN', 'TUTOR']) && (
                    <section data-tour="module-dashboard">
                        <AdminDashboard />
                    </section>
                )}
                {currentView === 'dashboard' && hasAnyRole(['STUDENT']) && <StudentDashboard />}

                {/* All feature-based views */}
                {(currentView === 'students' || currentView === 'parents') && hasAnyRole(['ADMIN', 'TUTOR']) && (
                    <section data-tour="module-students">
                        <UnifiedStudentView />
                    </section>
                )}
                {(currentView === 'finance' || currentView === 'monthly') && hasAnyRole(['ADMIN', 'TUTOR']) && (
                    <section data-tour="module-finance">
                        <FinanceDashboard />
                    </section>
                )}
                {currentView === 'reports' && hasAnyRole(['TUTOR']) && (
                    <section data-tour="module-reports" className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
                        <ReportsFeature />
                    </section>
                )}
                {/* {currentView === 'monthly' && hasAnyRole(['ADMIN', 'TUTOR']) && <MonthlyView />} */}
                {currentView === 'calendar' && hasAnyRole(['ADMIN', 'TUTOR']) && (
                    <section data-tour="module-calendar" className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
                        <CalendarView />
                    </section>
                )}

                {/* New Exercise Dashboard */}
                {currentView === 'exercises' && (
                    <section data-tour="module-exercises">
                        <ExerciseDashboard />
                    </section>
                )}

                {/* Admin/Tutor Lesson Manager */}
                {currentView === 'lessons' && hasAnyRole(['ADMIN', 'TUTOR']) && (
                    <section data-tour="module-lessons">
                        <AdminLessonManager />
                    </section>
                )}
                {/* Tutor Management */}
                {currentView === 'tutors' && hasAnyRole(['ADMIN']) && <TutorsFeature />}

                {/* Live Room */}
                {currentView === 'live-room' && (
                    <section data-tour="module-live-room">
                        <LiveRoomFeature />
                    </section>
                )}

                {/* Settings */}
                {currentView === 'settings' && (
                    <section data-tour="module-settings">
                        <SettingsView />
                    </section>
                )}

                {/* Student Lesson View */}
                {currentView === 'lessons' && hasAnyRole(['STUDENT']) && <LessonViewWrapper />}


                {/* Other views */}
                {/* {currentView === 'unpaid' && hasAnyRole(['ADMIN', 'TUTOR']) && <UnpaidSessionsView />} */}
                {currentView === 'documents' && (
                    <section data-tour="module-documents" className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
                        <DocumentLibrary />
                    </section>
                )}

                {/* Fallback */}
                {currentView === 'dashboard' && !hasAnyRole(['ADMIN', 'TUTOR', 'STUDENT']) && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Bạn không có quyền xem trang này</p>
                    </div>
                )}
            </div>
        </main>
    );
});
MainContentSwitcher.displayName = 'MainContentSwitcher';

function AppContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const initialView = (searchParams.get('view') as View) || 'dashboard';
    const [currentView, setCurrentView] = useState<View>(initialView);
    const { isCollapsed, setIsCollapsed } = useUI();
    const { user, logout, hasAnyRole } = useAuth();
    const { showTour, handleTourComplete } = useOnboarding();
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
    }, [setIsCollapsed]);

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

    const handleTourNavigateView = useCallback((view: TourView) => {
        setCurrentView(view);
    }, []);

    const navItems: NavItem[] = useMemo(() => {
        const allItems: NavItem[] = [
            { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
            { id: 'tutors', label: 'Gia Sư', icon: Users },
            { id: 'students', label: 'Học Sinh & PH', icon: GraduationCap },
            { id: 'finance', label: 'Tài Chính', icon: TrendingUp },
            { id: 'reports', label: 'Báo Cáo', icon: BarChart3 },
            { id: 'calendar', label: 'Lịch dạy', icon: CalendarDays },
            { id: 'exercises', label: 'Khảo thí', icon: ClipboardCheck },
            { id: 'documents', label: 'Tài Liệu', icon: FolderArchive },
            { id: 'lessons', label: 'Bài Giảng', icon: BookOpen },
            { id: 'live-room', label: 'Lớp học', icon: Video },
            { id: 'settings', label: 'Cài đặt', icon: Settings },
        ];

        return allItems.filter(item => {
            if (item.id === 'students' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'finance' && !hasAnyRole(['ADMIN', 'TUTOR'])) return false;
            if (item.id === 'reports' && !hasAnyRole(['TUTOR'])) return false;
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

    // Measure content wrapper with ResizeObserver for priority-plus responsiveness
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const { setContainerWidth } = useUI();

    useEffect(() => {
        const el = contentWrapperRef.current;
        if (!el) return;
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = Math.round(entry.contentRect.width);
                setContainerWidth(width);
            }
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [setContainerWidth]);

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
        <div className="flex h-[100dvh] max-h-[100dvh] relative isolate bg-background overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none hidden dark:block">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-purple-500/5 to-background transition-all duration-500" />
            </div>

            <Sidebar
                navItems={navItems}
                currentView={currentView === 'monthly' ? 'finance' : currentView}
                setCurrentView={handleSetCurrentView}
                isLocked={showTour}
            />

            <div
                ref={contentWrapperRef}
                className="flex-1 flex flex-col h-full min-h-0 min-w-0 overflow-hidden relative z-10 bg-background @container [container-type:inline-size]"
            >
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

            <FeedbackWidget />

            {showTour && (
                <TourOverlay
                    onComplete={handleTourComplete}
                    onNavigateView={handleTourNavigateView}
                />
            )}
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
