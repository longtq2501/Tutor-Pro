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
      />

      <StatusLegend />

      {renderView()}

      {selectedDay && (
        <DayDetailModal
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
