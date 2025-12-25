import type { Student } from '@/lib/types';

export interface AddSessionModalProps {
  onClose: () => void;
  onSubmit: (studentId: number, sessions: number, hoursPerSession: number, sessionDate: string, month: string, subject?: string, startTime?: string, endTime?: string) => void;
  initialDate?: string;
  students: Student[];
  initialStudentId?: number | null;
}