import AddSessionModal from '@/features/calendar/add-session-modal';
import { useCalendarView } from './hooks/useCalendarView';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { WeekView } from './components/WeekView';
import { DayView } from './components/DayView';
import { ListView } from './components/ListView';
import { LessonDetailModal } from './components/LessonDetailModal';
import { DayDetailModal } from './components/DayDetailModal';
import { ContextMenu } from './components/ContextMenu';
import { StatusLegend } from './components/StatusLegend';
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
    handleInitiateDeleteAll,
    handleConfirmDeleteAll,
    exportToExcel
  } = useCalendarView();

  const renderView = () => {
    switch (currentView) {
      case 'week':
        return (
          <WeekView
            days={calendarDays}
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
            onAddSession={openAddSessionModal}
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
      <div className="sticky top-0 z-30 pb-4 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4 pt-[16px] border-b border-border/10 shadow-sm transition-all rounded-[18px]">
        <div className="space-y-4">
          <CalendarHeader
            currentDate={currentDate}
            stats={stats}
            isGenerating={isGenerating}
            currentView={currentView}
            onChangeMonth={navigateMonth}
            onToday={goToToday}
            onAutoGenerate={handleAutoGenerate}
            onViewChange={setCurrentView}
            onExport={exportToExcel}
            onDeleteAll={handleInitiateDeleteAll}
          />

          <StatusLegend />
        </div>
      </div>

      {renderView()}

      {/* ... (existing modals) */}

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
          // ...

          day={selectedDay}
          onClose={() => setSelectedDay(null)}
          onAddSession={openAddSessionModal}
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
