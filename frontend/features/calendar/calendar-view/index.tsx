import { useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

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
    exportToExcel,
    loadingSessions
  } = useCalendarView();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            onDayClick={(day) => {
              if (window.innerWidth < 768) {
                setSelectedDay(day);
              } else {
                openAddSessionModal(day.dateStr);
              }
            }}
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
      <div className={cn(
        "sticky top-0 z-40 transition-all duration-300 ease-in-out border-b shadow-sm",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/10 py-2 px-2 sm:px-4 mx-0 rounded-none shadow-md"
          : "bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4 pt-[16px] pb-4 border-border/10 rounded-[18px] mt-2 mx-1"
      )}>
        <div className={cn("transition-all duration-300", isScrolled ? "space-y-0" : "space-y-4")}>
          <CalendarHeader
            currentDate={currentDate}
            stats={stats}
            isGenerating={isGenerating}
            currentView={currentView}
            onChangeMonth={navigateMonth}
            onToday={goToToday}
            onAutoGenerate={handleAutoGenerate}
            onViewChange={setCurrentView}
            // Passing down a prop to tell header it's in a compact state if needed
            // But header already has its own listener.
            onExport={exportToExcel}
            onDeleteAll={handleInitiateDeleteAll}
          />

        </div>
      </div>

      <div className={cn("transition-all duration-300", isScrolled ? "pt-2" : "pt-0")}>
        {renderView()}
      </div>

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
