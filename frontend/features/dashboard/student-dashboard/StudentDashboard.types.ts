import type { DashboardStats } from './types/dashboard.types';

export interface UseStudentDashboardReturn {
  loading: boolean;
  stats: DashboardStats;
  sessions: any[];
  documents: any[];
  schedule: any;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  user: any;
}
