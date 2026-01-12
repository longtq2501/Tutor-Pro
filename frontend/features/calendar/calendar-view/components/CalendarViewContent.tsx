"use client";

import { CalendarGrid } from './CalendarGrid';
import { CalendarSkeleton } from './CalendarSkeleton';
import { DayView } from './DayView';
import { ListView } from './ListView';
import { WeekView } from './WeekView';
import type { CalendarViewType } from './ViewSwitcher';
import type { SessionRecord } from '@/lib/types/finance';
import type { CalendarDay } from '../types';

interface CalendarViewContentProps {
    currentView: CalendarViewType;
    isInitialLoad: boolean;
    filteredCalendarDays: CalendarDay[];
    currentDayInfo: CalendarDay | null;
    filteredSessions: SessionRecord[];
    setSelectedDay: (day: CalendarDay | null) => void;
    openAddSessionModal: (dateStr: string) => void;
    handleSessionClick: (session: SessionRecord) => void;
    handleSessionEdit: (session: SessionRecord) => void;
    handleUpdateSession: (updated: SessionRecord) => void;
    handleContextMenu: (e: React.MouseEvent, session: SessionRecord) => void;
}

export function CalendarViewContent({
    currentView,
    isInitialLoad,
    filteredCalendarDays,
    currentDayInfo,
    filteredSessions,
    setSelectedDay,
    openAddSessionModal,
    handleSessionClick,
    handleSessionEdit,
    handleUpdateSession,
    handleContextMenu,
}: CalendarViewContentProps) {
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
}
