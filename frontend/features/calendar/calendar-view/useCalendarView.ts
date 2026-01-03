import { recurringSchedulesApi, sessionsApi } from '@/lib/services';
import type { SessionRecord } from '@/lib/types/finance';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { UseCalendarViewReturn } from './CalendarView.types';
import type { CalendarViewType } from './components/ViewSwitcher';
import { useCalendarData } from './hooks/useCalendarData';
import { useCalendarDays } from './hooks/useCalendarDays';
import { useCalendarStats } from './hooks/useCalendarStats';
import type { CalendarDay } from './types';
import { getMonthStr } from './utils';

/**
 * Hook useCalendarView (Refactoring Specialist Edition)
 * 
 * Chức năng: Quản lý toàn bộ State và Logic nghiệp vụ cho component CalendarView.
 * Luồng dữ liệu:
 * 1. Fetch data từ API (sessions, students) qua useCalendarData.
 * 2. Xử lý Logic lọc (statusFilter) và phân bổ dữ liệu vào CalendarDays.
 * 3. Cung cấp các Handlers để UI tương tác (Edit, Delete, Complete, v.v.)
 */
export const useCalendarView = (): UseCalendarViewReturn => {
    // === 1. State cơ bản ===
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

    // === 2. State Lọc (Logic chuyển từ UI index.tsx sang) ===
    const [statusFilter, setStatusFilter] = useState<string | 'ALL'>('ALL');

    // === 3. Xử lý Hiệu năng (Scroll listener) ===
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

    // === 4. Data Fetching ===
    const { sessions, setSessions, students, loading, loadData, updateSession } = useCalendarData(currentDate);

    useEffect(() => {
        if (!loading) {
            setIsInitialLoad(false);
        }
    }, [loading]);

    // === 5. Logic xử lý dữ liệu & Filtering (Performance optimized) ===
    const rawCalendarDays = useMemo(() => useCalendarDays(currentDate, sessions), [currentDate, sessions]);
    const stats = useCalendarStats(sessions);

    // Lọc sessions dựa trên statusFilter
    const filteredSessions = useMemo(() => sessions.filter(s =>
        statusFilter === 'ALL' || s.status === statusFilter
    ), [sessions, statusFilter]);

    // Lọc calendarDays dựa trên statusFilter
    const filteredCalendarDays = useMemo(() => rawCalendarDays.map(day => ({
        ...day,
        sessions: day.sessions.filter(s =>
            statusFilter === 'ALL' || s.status === statusFilter
        )
    })), [rawCalendarDays, statusFilter]);

    // Lấy thông tin ngày hiện tại (cho Day View)
    const currentDayInfo = useMemo(() => {
        return filteredCalendarDays.find(d => d.isToday) || filteredCalendarDays[0] || null;
    }, [filteredCalendarDays]);

    // === 6. Handlers (Actions) ===

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
    }, [selectedDay, selectedSession, contextMenu, updateSession]);

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

    const handleToggleComplete = async (sessionId: number, version?: number) => {
        if (loadingSessions.has(sessionId)) return;
        setLoadingSessions(prev => new Set(prev).add(sessionId));

        const promise = async () => {
            let effectiveVersion = version;
            if (effectiveVersion === undefined) {
                const currentSession = sessions.find(s => s.id === sessionId);
                if (!currentSession) throw new Error("Session not found");
                effectiveVersion = currentSession.version;
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

    const handleAddSessionSubmit = async (studentId: number, count: number, hours: number, date: string, month: string, subject?: string, start?: string, end?: string) => {
        const promise = async () => {
            await sessionsApi.create({
                studentId, sessions: count, hoursPerSession: hours, sessionDate: date, month,
                subject: subject || '', startTime: start || '', endTime: end || '', status: 'SCHEDULED'
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

    const goToToday = () => setCurrentDate(new Date());

    const openAddSessionModal = (dateStr: string) => {
        setSelectedDateStr(dateStr);
        setShowAddSessionModal(true);
    };

    const closeAddSessionModal = () => {
        setShowAddSessionModal(false);
        setSelectedDateStr('');
    };

    const handleConfirmDeleteAll = async () => {
        const monthStr = getMonthStr(currentDate);
        setDeleteConfirmationOpen(false);
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

    const exportToExcel = async () => {
        const monthStr = getMonthStr(currentDate);
        const promise = sessionsApi.exportToExcel(monthStr);
        toast.promise(promise, {
            loading: `Đang chuẩn bị file Excel tháng ${monthStr}...`,
            success: `Đã tải xuống file Excel tháng ${monthStr}`,
            error: 'Lỗi khi xuất file Excel.'
        });
    };

    return {
        currentDate, currentView, isGenerating, selectedDay, selectedSession, showAddSessionModal,
        selectedDateStr, modalMode, contextMenu, deleteConfirmationOpen, loadingSessions, isScrolled,
        loading, isInitialLoad, statusFilter, filteredSessions, filteredCalendarDays, stats,
        currentDayInfo, students, setCurrentView, setSelectedDay, setSelectedSession, setContextMenu,
        setStatusFilter, setDeleteConfirmationOpen, navigateMonth, goToToday, handleAutoGenerate,
        handleUpdateSession, handleDeleteSession, handleSessionClick, handleSessionEdit,
        handleTogglePayment, handleToggleComplete, handleAddSessionSubmit, openAddSessionModal,
        closeAddSessionModal, handleConfirmDeleteAll, exportToExcel
    };
};
