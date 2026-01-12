"use client";

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
import { AnimatePresence } from 'framer-motion';
import AddSessionModal from '@/features/calendar/add-session-modal';
import { DayDetailModal } from './DayDetailModal';
import { LessonDetailModal } from './LessonDetailModal';
import { ContextMenu } from './ContextMenu';
import { getMonthStr } from '../utils';
import type { SessionRecord } from '@/lib/types/finance';
import type { Student } from '@/lib/types';
import type { CalendarDay } from '../types';

interface CalendarModalsProps {
    currentDate: Date;
    selectedDay: CalendarDay | null;
    setSelectedDay: (day: CalendarDay | null) => void;
    selectedSession: SessionRecord | null;
    setSelectedSession: (session: SessionRecord | null) => void;
    showAddSessionModal: boolean;
    selectedDateStr: string;
    modalMode: 'view' | 'edit';
    contextMenu: { x: number; y: number; session: SessionRecord } | null;
    setContextMenu: (menu: { x: number; y: number; session: SessionRecord } | null) => void;
    deleteConfirmationOpen: boolean;
    setDeleteConfirmationOpen: (open: boolean) => void;
    loadingSessions: Set<number>;
    students: Student[];
    handleDeleteSession: (id: number) => void;
    handleTogglePayment: (id: number, version?: number) => void;
    handleToggleComplete: (id: number, version?: number) => void;
    handleUpdateSession: (updated: SessionRecord) => void;
    handleConfirmDeleteAll: () => void;
    handleAddSessionSubmit: (studentId: number, count: number, hours: number, date: string, month: string, subject?: string, start?: string, end?: string) => Promise<void>;
    closeAddSessionModal: () => void;
    openAddSessionModal: (dateStr: string) => void;
    handleSessionEdit: (session: SessionRecord) => void;
}

export function CalendarModals({
    currentDate,
    selectedDay,
    setSelectedDay,
    selectedSession,
    setSelectedSession,
    showAddSessionModal,
    selectedDateStr,
    modalMode,
    contextMenu,
    setContextMenu,
    deleteConfirmationOpen,
    setDeleteConfirmationOpen,
    loadingSessions,
    students,
    handleDeleteSession,
    handleTogglePayment,
    handleToggleComplete,
    handleUpdateSession,
    handleConfirmDeleteAll,
    handleAddSessionSubmit,
    closeAddSessionModal,
    openAddSessionModal,
    handleSessionEdit,
}: CalendarModalsProps) {
    return (
        <>
            <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa tất cả buổi học tháng {getMonthStr(currentDate)}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa vĩnh viễn tất cả các buổi học trong tháng này và không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDeleteAll}>
                            Xóa tất cả
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AnimatePresence>
                {selectedDay && (
                    <DayDetailModal
                        key="day-detail-modal"
                        day={selectedDay}
                        onClose={() => setSelectedDay(null)}
                        onAddSession={() => selectedDay && openAddSessionModal(selectedDay.dateStr)}
                        onDelete={handleDeleteSession}
                        onTogglePayment={handleTogglePayment}
                        onToggleComplete={handleToggleComplete}
                        onSessionClick={setSelectedSession}
                        loadingSessions={loadingSessions}
                    />
                )}
                {selectedSession && (
                    <LessonDetailModal
                        key="lesson-detail-modal"
                        session={selectedSession}
                        onClose={() => setSelectedSession(null)}
                        onUpdate={handleUpdateSession}
                        onDelete={handleDeleteSession}
                        initialMode={modalMode}
                    />
                )}
                {showAddSessionModal && (
                    <AddSessionModal
                        key="add-session-modal"
                        onClose={closeAddSessionModal}
                        students={students}
                        initialStudentId={null}
                        onSubmit={handleAddSessionSubmit}
                        initialDate={selectedDateStr}
                    />
                )}
            </AnimatePresence>

            {contextMenu && (
                <ContextMenu
                    session={contextMenu.session}
                    position={{ x: contextMenu.x, y: contextMenu.y }}
                    onClose={() => setContextMenu(null)}
                    onEdit={handleSessionEdit}
                    onUpdate={handleUpdateSession}
                />
            )}
        </>
    );
}
