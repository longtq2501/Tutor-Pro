import type { SessionRecord } from '@/lib/types/finance';
import type { CalendarViewType } from './components/ViewSwitcher';
import type { CalendarDay } from './types';

/**
 * Phản hồi từ useCalendarView hook
 * Chứa toàn bộ State và Actions cho CalendarView
 */
export interface UseCalendarViewReturn {
    // === State ===
    currentDate: Date;
    currentView: CalendarViewType;
    isGenerating: boolean;
    selectedDay: CalendarDay | null;
    selectedSession: SessionRecord | null;
    showAddSessionModal: boolean;
    selectedDateStr: string;
    modalMode: 'view' | 'edit';
    contextMenu: { x: number; y: number; session: SessionRecord } | null;
    deleteConfirmationOpen: boolean;
    loadingSessions: Set<number>;
    isScrolled: boolean;
    loading: boolean;
    isInitialLoad: boolean;
    
    // === Data Filtered (Logic moved from UI) ===
    statusFilter: string | 'ALL';
    filteredSessions: SessionRecord[];
    filteredCalendarDays: CalendarDay[];
    stats: any; // Ideally this would be typed specifically
    currentDayInfo: CalendarDay | null;
    students: any[];

    // === Actions ===
    setCurrentView: (view: CalendarViewType) => void;
    setSelectedDay: (day: CalendarDay | null) => void;
    setSelectedSession: (session: SessionRecord | null) => void;
    setContextMenu: (menu: { x: number; y: number; session: SessionRecord } | null) => void;
    setStatusFilter: (filter: string | 'ALL') => void;
    setDeleteConfirmationOpen: (open: boolean) => void;
    
    // === Handlers ===
    navigateMonth: (dir: number) => void;
    goToToday: () => void;
    handleAutoGenerate: () => Promise<void>;
    handleUpdateSession: (updated: SessionRecord) => void;
    handleDeleteSession: (id: number) => Promise<void>;
    handleSessionClick: (session: SessionRecord) => void;
    handleSessionEdit: (session: SessionRecord) => void;
    handleTogglePayment: (sessionId: number, version?: number) => Promise<void>;
    handleToggleComplete: (sessionId: number, version?: number) => Promise<void>;
    handleAddSessionSubmit: (studentId: number, count: number, hours: number, date: string, month: string, subject?: string, start?: string, end?: string) => Promise<void>;
    openAddSessionModal: (dateStr: string) => void;
    closeAddSessionModal: () => void;
    handleConfirmDeleteAll: () => Promise<void>;
    exportToExcel: () => Promise<void>;
}
