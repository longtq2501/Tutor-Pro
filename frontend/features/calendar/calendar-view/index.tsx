"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useRef, useState } from 'react';
import type { SessionRecord } from '@/lib/types/finance';
import { getStatusColors } from './utils/statusColors';
import { CalendarActions as CalendarHeader } from './components/CalendarHeader';
import { useCalendarView } from './useCalendarView';
import { CalendarModals } from './components/CalendarModals';
import { CalendarViewContent } from './components/CalendarViewContent';
import { DashboardHeader } from '@/contexts/UIContext';
import { MONTHS } from './constants';
import { MonthlyFeeReport } from './components/MonthlyFeeReport';
import { buildMonthlyFeeReport, type ReportScope } from './utils/monthlyFeeReport';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

export default function CalendarView() {
  const view = useCalendarView();
  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);
  const [reportData, setReportData] = useState<ReturnType<typeof buildMonthlyFeeReport> | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleReport = async (scope: ReportScope) => {
    setReportLoading(true);
    try {
      const report = buildMonthlyFeeReport(view.sessions, view.currentDate, scope);
      setReportData(report);
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (!reportRef.current) throw new Error('Report element is unavailable');
      const dataUrl = await toPng(reportRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#ffffff' });
      const anchor = document.createElement('a');
      anchor.href = dataUrl;
      anchor.download = `bao-cao-hoc-phi-${scope === 'trung_tam' ? 'trung-tam' : scope === 'day_rieng' ? 'day-rieng' : 'tat-ca'}-thang-${String(view.currentDate.getMonth() + 1).padStart(2, '0')}-${view.currentDate.getFullYear()}.png`;
      anchor.click();
      toast.success('Xuất báo cáo thành công');
    } catch (error) {
      console.error(error);
      toast.error('Xuất báo cáo thất bại, vui lòng thử lại');
    } finally {
      setReportLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveSession(event.active.data.current as SessionRecord);
  };

  const handleDragEndInternal = (event: DragEndEvent) => {
    setActiveSession(null);
    view.handleDragEnd(event);
  };

  return (
    <div className="bg-transparent">
      <DashboardHeader
        title={`${MONTHS[view.currentDate.getMonth()]}, ${view.currentDate.getFullYear()}`}
        subtitle="Lịch trình dạy học"
        actions={
          <CalendarHeader
            currentDate={view.currentDate}
            currentView={view.currentView}
            onNavigate={view.navigateMonth}
            onToday={view.goToToday}
            onViewChange={view.setCurrentView}
            onAddSession={() => view.openAddSessionModal(view.selectedDateStr || new Date().toISOString().split('T')[0])}
            onGenerateInvoice={view.exportToExcel}
            onAutoGenerate={view.handleAutoGenerate}
            isGenerating={view.isGenerating}
            sessions={view.filteredSessions}
            stats={view.stats}
            onFilterChange={view.setStatusFilter}
            currentFilter={view.statusFilter}
            searchQuery={view.searchQuery}
            onSearchChange={view.setSearchQuery}
            currentSource={view.sourceFilter}
            onSourceChange={view.setSourceFilter}
            onDeleteMonth={() => view.setDeleteConfirmationOpen(true)}
            isFetching={view.isFetching}
            onReport={handleReport}
            reportLoading={reportLoading}
          />
        }
      />

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEndInternal}>
        <main data-tour="calendar-board" className="transition-all duration-300">
          <CalendarViewContent
            currentView={view.currentView}
            isInitialLoad={view.isInitialLoad}
            filteredCalendarDays={view.filteredCalendarDays}
            currentDayInfo={view.currentDayInfo}
            filteredSessions={view.filteredSessions}
            setSelectedDay={view.setSelectedDay}
            openAddSessionModal={view.openAddSessionModal}
            handleSessionClick={view.handleSessionClick}
            handleSessionEdit={view.handleSessionEdit}
            handleUpdateSession={view.handleUpdateSession}
            handleContextMenu={view.handleContextMenu}
          />
        </main>

        <DragOverlay dropAnimation={null}>
          {activeSession && (
            <div className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-2xl cursor-grabbing scale-105 transition-transform border-l-[3px] z-[9999] flex items-center gap-2 ${getStatusColors(activeSession.status || 'SCHEDULED').bg} ${getStatusColors(activeSession.status || 'SCHEDULED').text} border-slate-200/50 dark:border-white/10`}>
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm ${getStatusColors(activeSession.status || 'SCHEDULED').dot}`} />
              {activeSession.studentName}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <div className="fixed -left-[10000px] top-0 pointer-events-none" aria-hidden="true">
        {reportData && <MonthlyFeeReport ref={reportRef} report={reportData} />}
      </div>

      <CalendarModals
        currentDate={view.currentDate}
        selectedDay={view.selectedDay}
        setSelectedDay={view.setSelectedDay}
        selectedSession={view.selectedSession}
        setSelectedSession={view.setSelectedSession}
        showAddSessionModal={view.showAddSessionModal}
        selectedDateStr={view.selectedDateStr}
        modalMode={view.modalMode}
        contextMenu={view.contextMenu}
        setContextMenu={view.setContextMenu}
        deleteConfirmationOpen={view.deleteConfirmationOpen}
        setDeleteConfirmationOpen={view.setDeleteConfirmationOpen}
        loadingSessions={view.loadingSessions}
        students={view.students}
        handleDeleteSession={view.handleDeleteSession}
        handleTogglePayment={view.handleTogglePayment}
        handleToggleComplete={view.handleToggleComplete}
        handleUpdateSession={view.handleUpdateSession}
        handleConfirmDeleteAll={view.handleConfirmDeleteAll}
        handleAddSessionSubmit={view.handleAddSessionSubmit}
        closeAddSessionModal={view.closeAddSessionModal}
        openAddSessionModal={view.openAddSessionModal}
        handleSessionEdit={view.handleSessionEdit}
      />
    </div>
  );
}
