import { useState, useMemo } from 'react';
import { recurringSchedulesApi, sessionsApi } from '@/lib/services';
import AddSessionModal from '@/features/calendar/add-session-modal';
import { useCalendarData } from './hooks/useCalendarData';
import { useCalendarDays } from './hooks/useCalendarDays';
import { useCalendarStats } from './hooks/useCalendarStats';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { WeekView } from './components/WeekView';
import { DayView } from './components/DayView';
import { ListView } from './components/ListView';
import { LessonDetailModal } from './components/LessonDetailModal';
import { DayDetailModal } from './components/DayDetailModal';
import { ContextMenu } from './components/ContextMenu';
import { StatusLegend } from './components/StatusLegend';
import { getMonthStr } from './utils';
import type { CalendarDay } from './types';
import type { CalendarViewType } from './components/ViewSwitcher';
import type { SessionRecord } from '@/lib/types/finance';

export default function CalendarView() {
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
  const todayDateStr = new Date().toISOString().split('T')[0];
  const currentDayInfo = useMemo(() => {
    return calendarDays.find(d => d.isToday) || calendarDays[0] || null;
  }, [calendarDays]);

  const handleUpdateSession = (updated: SessionRecord) => {
    // If updated is the same as previous, it might be a deletion signal (some components might use this)
    // But usually we just update the list
    setSessions(prev => {
      const exists = prev.some(s => s.id === updated.id);
      if (exists) {
        return prev.map(s => s.id === updated.id ? updated : s);
      } else {
        // If it's a new session (e.g. from duplication), reload data or add to list
        loadData();
        return prev;
      }
    });

    // Also update selected day if open
    if (selectedDay) {
      setSelectedDay(prev => prev ? {
        ...prev,
        sessions: prev.sessions.map(s => s.id === updated.id ? updated : s)
      } : null);
    }
  };

  const handleAutoGenerate = async () => {
    if (!confirm('Bạn có muốn tự động tạo lịch học cho tháng này dựa trên lịch cố định?')) return;
    try {
      setIsGenerating(true);
      const result = await recurringSchedulesApi.generateSessions(getMonthStr(currentDate));
      alert(`✅ ${result.message || 'Đã tạo xong các buổi học!'}`);
      loadData();
    } catch (error) {
      alert('❌ Không thể tạo buổi học tự động. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa buổi học này?')) return;
    try {
      await sessionsApi.delete(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (selectedDay) setSelectedDay(prev => prev ? { ...prev, sessions: prev.sessions.filter(s => s.id !== sessionId) } : null);
      if (selectedSession?.id === sessionId) setSelectedSession(null);
    } catch (error) {
      alert('Lỗi khi xóa.');
    }
  };

  const handleSessionClick = (session: SessionRecord) => {
    setModalMode('view');
    setSelectedSession(session);
  };

  const handleSessionEdit = (session: SessionRecord) => {
    setModalMode('edit');
    setSelectedSession(session);
  };

  // Re-mapping functions to handle status-based updates if needed, 
  // but for now we keep the simple ones as legacy
  const handleTogglePayment = async (sessionId: number) => {
    try {
      const updated = await sessionsApi.togglePayment(sessionId);
      handleUpdateSession(updated);
    } catch (error) {
      alert('Không thể cập nhật trạng thái thanh toán!');
    }
  };

  const handleToggleComplete = async (sessionId: number) => {
    try {
      const updated = await sessionsApi.toggleCompleted(sessionId);
      handleUpdateSession(updated);
    } catch (error) {
      alert('Không thể cập nhật trạng thái!');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'week':
        return (
          <WeekView
            days={calendarDays} // Simplified: useCalendarDays would need enhancement for direct week access
            onDayClick={setSelectedDay}
            onAddSession={(dateStr) => { setSelectedDateStr(dateStr); setShowAddSessionModal(true); }}
            onSessionClick={handleSessionClick}
            onSessionEdit={handleSessionEdit}
            onUpdate={handleUpdateSession}
          />
        );
      case 'day':
        return (
          <DayView
            day={currentDayInfo}
            onAddSession={(dateStr) => { setSelectedDateStr(dateStr); setShowAddSessionModal(true); }}
            onSessionClick={handleSessionClick}
            onSessionEdit={handleSessionEdit}
            onUpdate={handleUpdateSession}
          />
        );
      case 'list':
        return (
          <ListView
            sessions={sessions}
            onSessionClick={handleSessionClick}
            onSessionEdit={handleSessionEdit}
            onUpdate={handleUpdateSession}
          />
        );
      case 'month':
      default:
        return (
          <CalendarGrid
            days={calendarDays}
            onDayClick={setSelectedDay}
            onAddSession={(dateStr) => { setSelectedDateStr(dateStr); setShowAddSessionModal(true); }}
            onSessionClick={handleSessionClick}
            onSessionEdit={handleSessionEdit}
            onUpdate={handleUpdateSession}
            onContextMenu={(e, session) => setContextMenu({ x: e.clientX, y: e.clientY, session })}
          />
        );
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <CalendarHeader
        currentDate={currentDate}
        stats={stats}
        isGenerating={isGenerating}
        currentView={currentView}
        onChangeMonth={(dir) => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + dir))}
        onToday={() => setCurrentDate(new Date())}
        onAutoGenerate={handleAutoGenerate}
        onViewChange={setCurrentView}
        onExport={() => sessionsApi.exportToExcel(getMonthStr(currentDate))}
      />

      <StatusLegend />

      {renderView()}

      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
          onAddSession={(dateStr) => { setSelectedDateStr(dateStr); setShowAddSessionModal(true); }}
          onDelete={handleDeleteSession}
          onTogglePayment={handleTogglePayment}
          onToggleComplete={handleToggleComplete}
          onSessionClick={setSelectedSession}
        />
      )}

      {selectedSession && (
        <LessonDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onUpdate={handleUpdateSession}
          initialMode={modalMode}
        />
      )}

      {contextMenu && (
        <ContextMenu
          session={contextMenu.session}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          onEdit={handleSessionEdit}
          onUpdate={handleUpdateSession}
        />
      )}

      {showAddSessionModal && (
        <AddSessionModal
          onClose={() => { setShowAddSessionModal(false); setSelectedDateStr(''); }}
          students={students}
          initialStudentId={null}
          onSubmit={async (studentId, sessionsCount, hoursPerSession, sessionDate, month, subject, startTime, endTime) => {
            try {
              await sessionsApi.create({
                studentId,
                sessions: sessionsCount,
                hoursPerSession,
                sessionDate,
                month,
                subject,
                startTime,
                endTime,
                status: 'SCHEDULED'
              });

              alert('✅ Đã thêm buổi học thành công!');
              setShowAddSessionModal(false);
              loadData();
            } catch (error) {
              console.error('Failed to create session:', error);
              alert('❌ Lỗi khi thêm buổi học. Vui lòng thử lại.');
            }
          }}
          initialDate={selectedDateStr}
        />
      )}
    </div>
  );
}