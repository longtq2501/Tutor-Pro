import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AddSessionModal from '@/features/calendar/add-session-modal';
import { useCallback, useMemo, useState } from 'react';
import { CalendarGrid } from './components/CalendarGrid';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarSkeleton } from './components/CalendarSkeleton';
import { ContextMenu } from './components/ContextMenu';
import { DayDetailModal } from './components/DayDetailModal';
import { DayView } from './components/DayView';
import { LessonDetailModal } from './components/LessonDetailModal';
import { ListView } from './components/ListView';
import { WeekView } from './components/WeekView';
import { useCalendarView } from './hooks/useCalendarView';
import { getMonthStr } from './utils';

export default function CalendarView() {
  const {
    currentDate,
    currentView,
    isGenerating,
    selectedDay,
    selectedSession,
    showAddSessionModal,
    selectedDateStr,
    modalMode,
    contextMenu,
    students,
    calendarDays,
    stats,
    currentDayInfo,
    sessions,
    deleteConfirmationOpen,
    setDeleteConfirmationOpen,
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
    handleConfirmDeleteAll,
    loadingSessions,
    isScrolled,
    loading,
    isInitialLoad
  } = useCalendarView();


  const [statusFilter, setStatusFilter] = useState<string | 'ALL'>('ALL');

  const filteredSessions = useMemo(() => sessions.filter(s =>
    statusFilter === 'ALL' || s.status === statusFilter
  ), [sessions, statusFilter]);

  const filteredCalendarDays = useMemo(() => calendarDays.map(day => ({
    ...day,
    sessions: day.sessions.filter(s =>
      statusFilter === 'ALL' || s.status === statusFilter
    )
  })), [calendarDays, statusFilter]);

  const renderView = useCallback(() => {
    if (loading || isInitialLoad) return (
      <div className="px-6">
        <CalendarSkeleton />
      </div>
    );

    switch (currentView) {
      case 'week':
        return (
          <WeekView
            days={filteredCalendarDays}
            onDayClick={setSelectedDay}
            onAddSession={openAddSessionModal}
            onSessionClick={handleSessionClick}
            onSessionEdit={handleSessionEdit}
            onUpdate={handleUpdateSession}
          />
        );
      case 'day':
        return (
          <DayView
            day={currentDayInfo}
            onAddSession={openAddSessionModal}
            onSessionClick={handleSessionClick}
            onSessionEdit={handleSessionEdit}
            onUpdate={handleUpdateSession}
          />
        );
      case 'list':
        return (
          <ListView
            sessions={filteredSessions}
            onSessionClick={handleSessionClick}
            onSessionEdit={handleSessionEdit}
            onUpdate={handleUpdateSession}
          />
        );
      case 'month':
      default:
        return (
          <div className="px-4 sm:px-6">
            <CalendarGrid
              days={filteredCalendarDays}
              onDayClick={(day) => setSelectedDay(day)}
              onAddSession={openAddSessionModal}
              onSessionClick={handleSessionClick}
              onSessionEdit={handleSessionEdit}
              onUpdate={handleUpdateSession}
              onContextMenu={(e, session) => setContextMenu({ x: e.clientX, y: e.clientY, session })}
            />
          </div>
        );
    }
  }, [
    loading, isInitialLoad, currentView, filteredCalendarDays, setSelectedDay, openAddSessionModal,
    handleSessionClick, handleSessionEdit, handleUpdateSession, currentDayInfo, filteredSessions, setContextMenu
  ]);

  return (
    <div className="min-h-screen bg-transparent">
      <CalendarHeader
        currentDate={currentDate}
        currentView={currentView}
        onNavigate={navigateMonth}
        onToday={goToToday}
        onViewChange={setCurrentView}
        onAddSession={() => openAddSessionModal(selectedDateStr || new Date().toISOString().split('T')[0])}
        onGenerateInvoice={handleAutoGenerate}
        isGenerating={isGenerating}
        sessions={sessions}
        stats={stats}
        isScrolled={isScrolled}
        onFilterChange={setStatusFilter}
        currentFilter={statusFilter}
      />

      <main className="transition-all duration-300">
        {renderView()}
      </main>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tất cả buổi học tháng {getMonthStr(currentDate)}?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn tất cả các buổi học trong tháng này.
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              onClick={handleConfirmDeleteAll}
            >
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
          onAddSession={openAddSessionModal}
          onDelete={handleDeleteSession}
          onTogglePayment={handleTogglePayment}
          onToggleComplete={handleToggleComplete}
          onSessionClick={setSelectedSession}
          loadingSessions={loadingSessions}
        />
      )}

      {selectedSession && (
        <LessonDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onUpdate={handleUpdateSession}
          onDelete={handleDeleteSession}
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
          onClose={closeAddSessionModal}
          students={students}
          initialStudentId={null}
          onSubmit={handleAddSessionSubmit}
          initialDate={selectedDateStr}
        />
      )}
    </div>
  );
}
