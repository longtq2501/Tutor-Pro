import { useState, useMemo, useCallback } from 'react';
import { recurringSchedulesApi, sessionsApi } from '@/lib/services';
import { toast } from 'sonner';
import { useCalendarData } from './useCalendarData';
import { useCalendarDays } from './useCalendarDays';
import { useCalendarStats } from './useCalendarStats';
import { getMonthStr } from '../utils';
import type { CalendarDay } from '../types';
import type { CalendarViewType } from '../components/ViewSwitcher';
import type { SessionRecord } from '@/lib/types/finance';

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

    const { sessions, setSessions, students, loading, loadData } = useCalendarData(currentDate);
    const calendarDays = useCalendarDays(currentDate, sessions);
    const stats = useCalendarStats(sessions);

    // Get current day for Day View
    const currentDayInfo = useMemo(() => {
        return calendarDays.find(d => d.isToday) || calendarDays[0] || null;
    }, [calendarDays]);

    const handleUpdateSession = useCallback((updated: SessionRecord) => {
        setSessions(prev => {
            const exists = prev.some(s => s.id === updated.id);
            if (exists) {
                return prev.map(s => s.id === updated.id ? updated : s);
            } else {
                loadData();
                return prev;
            }
        });

        if (selectedDay) {
            setSelectedDay(prev => prev ? {
                ...prev,
                sessions: prev.sessions.map(s => s.id === updated.id ? updated : s)
            } : null);
        }

        if (selectedSession?.id === updated.id) {
            setSelectedSession(updated);
        }
    }, [selectedDay, selectedSession, setSessions, loadData]);

    const handleAutoGenerate = async () => {
        if (!confirm('Bạn có muốn tự động tạo lịch học cho tháng này dựa trên lịch cố định?')) return;

        const promise = recurringSchedulesApi.generateSessions(getMonthStr(currentDate));

        toast.promise(promise, {
            loading: 'Đang tạo lịch học tự động...',
            success: (result) => {
                loadData();
                return `✅ ${result.message || 'Đã tạo xong các buổi học!'}`;
            },
            error: '❌ Không thể tạo buổi học tự động. Vui lòng thử lại.'
        });

        try {
            setIsGenerating(true);
            await promise;
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteSession = async (sessionId: number) => {
        if (!confirm('Bạn chắc chắn muốn xóa buổi học này?')) return;
        try {
            await sessionsApi.delete(sessionId);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            if (selectedDay) {
                setSelectedDay(prev => prev ? { ...prev, sessions: prev.sessions.filter(s => s.id !== sessionId) } : null);
            }
            if (selectedSession?.id === sessionId) {
                setSelectedSession(null);
            }
            toast.success('Đã xóa buổi học thành công');
        } catch (error) {
            toast.error('Lỗi khi xóa buổi học');
        }
    };

    const handleSessionClick = useCallback((session: SessionRecord) => {
        setModalMode('view');
        setSelectedSession(session);
    }, []);

    const handleSessionEdit = useCallback((session: SessionRecord) => {
        setModalMode('edit');
        setSelectedSession(session);
    }, []);

    const handleTogglePayment = async (sessionId: number) => {
        try {
            const updated = await sessionsApi.togglePayment(sessionId);
            handleUpdateSession(updated);
            toast.success(updated.paid ? 'Đã xác nhận thanh toán' : 'Đã hủy xác nhận thanh toán');
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái thanh toán!');
        }
    };

    const handleToggleComplete = async (sessionId: number) => {
        try {
            const updated = await sessionsApi.toggleCompleted(sessionId);
            handleUpdateSession(updated);
            toast.success(updated.completed ? 'Đã đánh dấu hoàn thành' : 'Đã hủy đánh dấu hoàn thành');
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái!');
        }
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
        try {
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

            toast.success('✅ Đã thêm buổi học thành công!');
            setShowAddSessionModal(false);
            setSelectedDateStr('');
            loadData();
        } catch (error) {
            console.error('Failed to create session:', error);
            toast.error('❌ Lỗi khi thêm buổi học. Vui lòng thử lại.');
        }
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
        exportToExcel: () => sessionsApi.exportToExcel(getMonthStr(currentDate))
    };
};
