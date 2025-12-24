// ============================================================================
// FILE: calendar-view/index.tsx (MAIN)
// ============================================================================
'use client';

import { useState } from 'react';
import { recurringSchedulesApi, sessionsApi } from '@/lib/services';
import AddSessionModal from '@/features/calendar/add-session-modal';
import { useCalendarData } from './hooks/useCalendarData';
import { useCalendarDays } from './hooks/useCalendarDays';
import { useCalendarStats } from './hooks/useCalendarStats';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { DayDetailModal } from './components/DayDetailModal';
import { getMonthStr } from './utils';
import type { CalendarDay } from './types';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState('');

  const { sessions, setSessions, students, loading, loadData } = useCalendarData(currentDate);
  const calendarDays = useCalendarDays(currentDate, sessions);
  const stats = useCalendarStats(sessions);

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
    } catch (error) {
      alert('Lỗi khi xóa.');
    }
  };

  const handleTogglePayment = async (sessionId: number) => {
    try {
      const updated = await sessionsApi.togglePayment(sessionId);
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
      if (selectedDay) setSelectedDay(prev => prev ? { ...prev, sessions: prev.sessions.map(s => s.id === sessionId ? updated : s) } : null);
    } catch (error) {
      alert('Không thể cập nhật trạng thái thanh toán!');
    }
  };

  const handleToggleComplete = async (sessionId: number) => {
    try {
      const updated = await sessionsApi.toggleCompleted(sessionId);
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
      if (selectedDay) setSelectedDay(prev => prev ? { ...prev, sessions: prev.sessions.map(s => s.id === sessionId ? updated : s) } : null);
    } catch (error) {
      alert('Không thể cập nhật trạng thái!');
    }
  };

  return (
    <div className="space-y-4">
      <CalendarHeader 
        currentDate={currentDate} 
        stats={stats} 
        isGenerating={isGenerating}
        onChangeMonth={(dir) => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + dir))}
        onToday={() => setCurrentDate(new Date())}
        onAutoGenerate={handleAutoGenerate}
      />

      <CalendarGrid 
        days={calendarDays}
        onDayClick={setSelectedDay}
        onAddSession={(dateStr) => { setSelectedDateStr(dateStr); setShowAddSessionModal(true); }}
      />

      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
          onAddSession={(dateStr) => { setSelectedDateStr(dateStr); setShowAddSessionModal(true); }}
          onDelete={handleDeleteSession}
          onTogglePayment={handleTogglePayment}
          onToggleComplete={handleToggleComplete}
        />
      )}

      {showAddSessionModal && (
        <AddSessionModal
          onClose={() => { setShowAddSessionModal(false); setSelectedStudentId(null); setSelectedDateStr(''); }}
          onSubmit={async (sessionsCount: any, hoursPerSession: any, sessionDate: any, month: any) => {
            if (!selectedStudentId) { alert('Vui lòng chọn học sinh!'); return; }
            try {
              await sessionsApi.create({ studentId: selectedStudentId, month, sessions: sessionsCount, sessionDate: selectedDateStr || sessionDate, hoursPerSession });
              setShowAddSessionModal(false); setSelectedStudentId(null); setSelectedDateStr(''); loadData();
            } catch (error) { alert('Lỗi khi tạo buổi học.'); }
          }}
          initialDate={selectedDateStr}
        />
      )}
    </div>
  );
}