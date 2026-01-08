import type { SessionRecord } from '@/lib/types';

export type FinanceViewMode = 'MONTHLY' | 'DEBT';

export interface FinanceGroupedRecord {
  studentId: number;
  studentName: string;
  pricePerHour: number;
  sessions: SessionRecord[];
  totalSessions: number;
  totalHours: number;
  totalAmount: number;
  allPaid: boolean;
  // Specific to Debt view (tracking months involved)
  months?: Set<string>;
}

export interface FinanceState {
  viewMode: FinanceViewMode;
  selectedDate: Date;
  selectedStudentIds: number[];
  searchTerm: string;
}

export interface FinanceContextType extends FinanceState {
  displayLimit: number;
  setViewMode: (mode: FinanceViewMode) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedStudentIds: (ids: number[]) => void;
  setSearchTerm: (term: string) => void;
  toggleStudentSelection: (studentId: number) => void;
  toggleSelectAll: (studentIds: number[]) => void;
  clearSelection: () => void;
  loadMore: () => void;
  resetPagination: () => void;
}
