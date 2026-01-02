import { recurringSchedulesApi, sessionsApi } from '@/lib/services';
import type { SessionRecord } from '@/lib/types/finance';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { CalendarViewType } from '../components/ViewSwitcher';
import type { CalendarDay } from '../types';
import { getMonthStr } from '../utils';
import { useCalendarData } from './useCalendarData';
import { useCalendarDays } from './useCalendarDays';
import { useCalendarStats } from './useCalendarStats';

export const useCalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<CalendarViewType>('month');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
    const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
    const [showAddSessionModal, setShowAddSessionModal] = useState(false);
    const [selectedDateStr, setSelectedDateStr] = useState('');
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; session: SessionRecord } | null>(null);

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState<Set<number>>(new Set());
    const [isScrolled, setIsScrolled] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Throttled scroll listener
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { sessions, setSessions, students, loading, loadData, updateSession } = useCalendarData(currentDate);

    // Initial load tracking
    useEffect(() => {
        if (!loading) {
            setIsInitialLoad(false);
        }
    }, [loading]);

    // ... (rest of the hooks)

    const handleInitiateDeleteAll = () => {
        setDeleteConfirmationOpen(true);
    };

    const handleConfirmDeleteAll = async () => {
        const monthStr = getMonthStr(currentDate);
        setDeleteConfirmationOpen(false); // Close dialog immediately or keep it open until success? UX choice. Let's close it first.

        const promise = async () => {
            await sessionsApi.deleteByMonth(monthStr);
            loadData();
        };

        toast.promise(promise(), {
            loading: `Đang xóa tất cả buổi học tháng ${monthStr}...`,
            success: `Đã xóa tất cả buổi học tháng ${monthStr}`,
            error: 'Lỗi khi xóa dữ liệu.'
        });
    };

    // ... (rest of the functions)
    // Memoize heavy calculations to prevent re-runs on every render (e.g. during scroll)
    const calendarDays = useMemo(() => useCalendarDays(currentDate, sessions), [currentDate, sessions]);
    const stats = useCalendarStats(sessions); // useCalendarStats is now internaly memoized, but wrapping it here for safety and clarity if needed is also fine, though its internal useMemo handles sessions change. Actually let's just make it clear.


    // Get current day for Day View
    const currentDayInfo = useMemo(() => {
        return calendarDays.find(d => d.isToday) || calendarDays[0] || null;
    }, [calendarDays]);

    const handleUpdateSession = useCallback((updated: SessionRecord) => {
        updateSession(updated);

        if (selectedDay) {
            setSelectedDay(prev => prev ? {
                ...prev,
                sessions: prev.sessions.map(s => s.id === updated.id ? updated : s)
            } : null);
        }

        if (selectedSession?.id === updated.id) {
            setSelectedSession(updated);
        }

        if (contextMenu?.session.id === updated.id) {
            setContextMenu(prev => prev ? { ...prev, session: updated } : null);
        }
    }, [selectedDay, selectedSession, contextMenu, setSessions, loadData]);

    const handleAutoGenerate = async () => {
        const promise = recurringSchedulesApi.generateSessions(getMonthStr(currentDate));

        toast.promise(promise, {
            loading: 'Đang tự động tạo lịch học...',
            success: (result) => {
                loadData();
                return `✅ ${result.message || 'Đã tạo xong các buổi học!'}`;
            },
            error: '❌ Không thể tạo buổi học tự động.'
        });
    };

    const handleDeleteSession = useCallback(async (id: number) => {
        const promise = async () => {
            await sessionsApi.delete(id);
            setSessions(prev => prev.filter(s => s.id !== id));

            if (selectedDay) {
                setSelectedDay(prev => prev ? {
                    ...prev,
                    sessions: prev.sessions.filter(s => s.id !== id)
                } : null);
            }

            if (selectedSession?.id === id) {
                setSelectedSession(null);
            }
            loadData();
        };

        toast.promise(promise(), {
            loading: 'Đang xóa buổi học...',
            success: 'Đã xóa buổi học thành công',
            error: 'Lỗi khi xóa buổi học'
        });
    }, [selectedDay, selectedSession, setSessions, loadData]);

    const handleSessionClick = useCallback((session: SessionRecord) => {
        setModalMode('view');
        setSelectedSession(session);
    }, []);

    const handleSessionEdit = useCallback((session: SessionRecord) => {
        setModalMode('edit');
        setSelectedSession(session);
    }, []);

    const handleTogglePayment = async (sessionId: number, version?: number) => {
        if (loadingSessions.has(sessionId)) return;

        setLoadingSessions(prev => new Set(prev).add(sessionId));

        const promise = async () => {
            // Use provided version or fallback to lookup
            let effectiveVersion = version;
            if (effectiveVersion === undefined) {
                const currentSession = sessions.find(s => s.id === sessionId);
                if (!currentSession) throw new Error("Session not found");
                effectiveVersion = currentSession.version;
            }

            const updated = await sessionsApi.togglePayment(sessionId, effectiveVersion);
            handleUpdateSession(updated);
            setLoadingSessions(prev => {
                const next = new Set(prev);
                next.delete(sessionId);
                return next;
            });
            return updated.paid ? 'Đã xác nhận thanh toán' : 'Đã hủy xác nhận thanh toán';
        };

        toast.promise(promise(), {
            loading: 'Đang cập nhật trạng thái thanh toán...',
            success: (msg) => msg,
            error: (err) => {
                setLoadingSessions(prev => {
                    const next = new Set(prev);
                    next.delete(sessionId);
                    return next;
                });
                return err instanceof Error ? err.message : 'Không thể cập nhật trạng thái thanh toán!';
            }
        });
    };

    // ✅ BEST FIX - Bỏ fallback lookup
    // useCalendarView.ts - Line ~142
    const handleToggleComplete = async (
        sessionId: number,
        version?: number  // ← Cho phép undefined
    ) => {
        console.log('🔴 Version received:', version);

        if (loadingSessions.has(sessionId)) return;

        setLoadingSessions(prev => new Set(prev).add(sessionId));

        const promise = async () => {
            // ✅ Nếu undefined, lookup từ state (với functional update)
            let effectiveVersion = version;

            if (effectiveVersion === undefined) {
                const currentSession = sessions.find(s => s.id === sessionId);
                if (!currentSession) throw new Error("Session not found");
                effectiveVersion = currentSession.version;
                console.log('🟡 Fallback version from state:', effectiveVersion);
            }

            const updated = await sessionsApi.toggleCompleted(sessionId, effectiveVersion);
            handleUpdateSession(updated);
            setLoadingSessions(prev => {
                const next = new Set(prev);
                next.delete(sessionId);
                return next;
            });
            return updated.completed ? 'Đã đánh dấu hoàn thành' : 'Đã hủy đánh dấu hoàn thành';
        };

        toast.promise(promise(), {
            loading: 'Đang cập nhật trạng thái...',
            success: (msg) => msg,
            error: (err) => {
                setLoadingSessions(prev => {
                    const next = new Set(prev);
                    next.delete(sessionId);
                    return next;
                });
                return err instanceof Error ? err.message : 'Không thể cập nhật trạng thái!';
            }
        });
    };

    const handleAddSessionSubmit = async (
        studentId: number,
        sessionsCount: number,
        hoursPerSession: number,
        sessionDate: string,
        month: string,
        subject?: string,
        startTime?: string,
        endTime?: string
    ) => {
        const promise = async () => {
            await sessionsApi.create({
                studentId,
                sessions: sessionsCount,
                hoursPerSession,
                sessionDate,
                month,
                subject: subject || '',
                startTime: startTime || '',
                endTime: endTime || '',
                status: 'SCHEDULED'
            });
            setShowAddSessionModal(false);
            setSelectedDateStr('');
            loadData();
        };

        toast.promise(promise(), {
            loading: 'Đang thêm buổi học...',
            success: '✅ Đã thêm buổi học thành công!',
            error: '❌ Lỗi khi thêm buổi học. Vui lòng thử lại.'
        });
    };

    const navigateMonth = (dir: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + dir));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const openAddSessionModal = (dateStr: string) => {
        setSelectedDateStr(dateStr);
        setShowAddSessionModal(true);
    };

    const closeAddSessionModal = () => {
        setShowAddSessionModal(false);
        setSelectedDateStr('');
    };

    return {
        // State
        currentDate,
        currentView,
        isGenerating,
        selectedDay,
        selectedSession,
        showAddSessionModal,
        selectedDateStr,
        modalMode,
        contextMenu,
        sessions,
        students,
        loading,
        calendarDays,
        stats,
        currentDayInfo,
        deleteConfirmationOpen,
        setDeleteConfirmationOpen,
        isScrolled,
        isInitialLoad,

        // Actions
        setCurrentView,
        setSelectedDay,
        setSelectedSession,
        setContextMenu,
        navigateMonth,
        goToToday,
        handleAutoGenerate,
        handleUpdateSession,
        handleDeleteSession,
        handleSessionClick,
        handleSessionEdit,
        handleTogglePayment,
        handleToggleComplete,
        handleAddSessionSubmit,
        openAddSessionModal,
        closeAddSessionModal,
        handleInitiateDeleteAll,
        handleConfirmDeleteAll,
        loadingSessions,
        exportToExcel: async () => {
            const monthStr = getMonthStr(currentDate);
            const promise = sessionsApi.exportToExcel(monthStr);

            toast.promise(promise, {
                loading: `Đang chuẩn bị file Excel tháng ${monthStr}...`,
                success: `Đã tải xuống file Excel tháng ${monthStr}`,
                error: 'Lỗi khi xuất file Excel.'
            });
        }
    };
};
