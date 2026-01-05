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
import { useCallback } from 'react';
import { CalendarGrid } from './components/CalendarGrid';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarSkeleton } from './components/CalendarSkeleton';
import { ContextMenu } from './components/ContextMenu';
import { DayDetailModal } from './components/DayDetailModal';
import { DayView } from './components/DayView';
import { LessonDetailModal } from './components/LessonDetailModal';
import { ListView } from './components/ListView';
import { WeekView } from './components/WeekView';
import { useCalendarView } from './useCalendarView';
import { getMonthStr } from './utils';

/**
 * Component CalendarView (Refactoring Specialist Edition)
 * 
 * Chức năng: Giao diện chính của Lịch học.
 * UI-ONLY: Chỉ chịu trách nhiệm hiển thị các View (Month, Week, Day, List) và Modals.
 * Toàn bộ Logic được đẩy vào useCalendarView hook.
 */
export default function CalendarView() {
  const {
    // State & Data
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
    filteredCalendarDays,
    stats,
    currentDayInfo,
    filteredSessions,
    deleteConfirmationOpen,
    loadingSessions,
    isScrolled,
    loading,
    isInitialLoad,
    statusFilter,

    // Actions & Handlers
    setDeleteConfirmationOpen,
    setCurrentView,
    setSelectedDay,
    setSelectedSession,
    setContextMenu,
    setStatusFilter,
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
    exportToExcel,
  } = useCalendarView();

  // Render các loại View khác nhau dựa trên currentView
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
      {/* Header điều hướng và Stats */}
      <CalendarHeader
        currentDate={currentDate}
        currentView={currentView}
        onNavigate={navigateMonth}
        onToday={goToToday}
        onViewChange={setCurrentView}
        onAddSession={() => openAddSessionModal(selectedDateStr || new Date().toISOString().split('T')[0])}
        onGenerateInvoice={exportToExcel}
        onAutoGenerate={handleAutoGenerate}
        isGenerating={isGenerating}
        sessions={filteredSessions} // Hiển thị sessions đã lọc
        stats={stats}
        isScrolled={isScrolled}
        onFilterChange={setStatusFilter}
        currentFilter={statusFilter}
      />

      <main className="transition-all duration-300">
        {renderView()}
      </main>

      {/* Modal xác nhận xóa tất cả */}
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

      {/* Modal chi tiết ngày */}
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

      {/* Modal chi tiết buổi học (Lesson) */}
      {selectedSession && (
        <LessonDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onUpdate={handleUpdateSession}
          onDelete={handleDeleteSession}
          initialMode={modalMode}
        />
      )}

      {/* Menu chuột phải (Context Menu) */}
      {contextMenu && (
        <ContextMenu
          session={contextMenu.session}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          onEdit={handleSessionEdit}
          onUpdate={handleUpdateSession}
        />
      )}

      {/* Modal thêm buổi học mới */}
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
