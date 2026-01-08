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
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import AddSessionModal from '@/features/calendar/add-session-modal';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import type { SessionRecord } from '@/lib/types/finance';
import { getStatusColors } from './utils/statusColors';
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
    isFetching,
    statusFilter,
    searchQuery,

    // Actions & Handlers
    setDeleteConfirmationOpen,
    setCurrentView,
    setSelectedDay,
    setSelectedSession,
    setContextMenu,
    setStatusFilter,
    setSearchQuery,
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
    handleContextMenu,
    handleDragEnd,
  } = useCalendarView();

  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    setActiveSession(event.active.data.current as SessionRecord);
  };

  const handleDragEndInternal = (event: DragEndEvent) => {
    setActiveSession(null);
    handleDragEnd(event);
  };

  // Optimized Handlers
  const handleHeaderAddSession = useCallback(() => {
    openAddSessionModal(selectedDateStr || new Date().toISOString().split('T')[0]);
  }, [openAddSessionModal, selectedDateStr]);

  // Render các loại View khác nhau dựa trên currentView
  const renderView = useCallback(() => {
    if (isInitialLoad) return (
      <div className="px-4 sm:px-6">
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
              onDayClick={setSelectedDay}
              onAddSession={openAddSessionModal}
              onSessionClick={handleSessionClick}
              onSessionEdit={handleSessionEdit}
              onUpdate={handleUpdateSession}
              onContextMenu={handleContextMenu}
            />
          </div>
        );
    }
  }, [
    loading, isInitialLoad, currentView, filteredCalendarDays, setSelectedDay, openAddSessionModal,
    handleSessionClick, handleSessionEdit, handleUpdateSession, currentDayInfo, filteredSessions, handleContextMenu, handleDragEnd
  ]);

  return (
    <div className="bg-transparent">
      {/* Header điều hướng và Stats */}
      <CalendarHeader
        currentDate={currentDate}
        currentView={currentView}
        onNavigate={navigateMonth}
        onToday={goToToday}
        onViewChange={setCurrentView}
        onAddSession={handleHeaderAddSession}
        onGenerateInvoice={exportToExcel}
        onAutoGenerate={handleAutoGenerate}
        isGenerating={isGenerating}
        sessions={filteredSessions} // Hiển thị sessions đã lọc
        stats={stats}
        isScrolled={isScrolled}
        onFilterChange={setStatusFilter}
        currentFilter={statusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isFetching={isFetching}
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEndInternal}
      >
        <main className="transition-all duration-300">
          {renderView()}
        </main>

        <DragOverlay dropAnimation={null}>
          {activeSession ? (
            <div className={`
              px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-2xl cursor-grabbing scale-105 transition-transform border-l-[3px] z-[9999]
              flex items-center gap-2
              ${getStatusColors(activeSession.status || 'SCHEDULED').bg}
              ${getStatusColors(activeSession.status || 'SCHEDULED').text}
              border-slate-200/50 dark:border-white/10
            `}>
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm ${getStatusColors(activeSession.status || 'SCHEDULED').dot}`} />
              {activeSession.studentName}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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

      <AnimatePresence>
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
      </AnimatePresence>

      <AnimatePresence>
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
      </AnimatePresence>

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

      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}
