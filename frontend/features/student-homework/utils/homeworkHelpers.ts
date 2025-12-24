// ============================================================================
// 📁 student-homework/utils/homeworkHelpers.ts
// ============================================================================
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDueDate = (date: string | Date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
};

export const getStatusConfig = (status: string) => {
  const configs: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    ASSIGNED: { variant: 'default', label: 'Đã giao' },
    IN_PROGRESS: { variant: 'secondary', label: 'Đang làm' },
    SUBMITTED: { variant: 'outline', label: 'Đã nộp' },
    GRADED: { variant: 'default', label: 'Đã chấm' },
    OVERDUE: { variant: 'destructive', label: 'Quá hạn' },
  };
  return configs[status] || configs.ASSIGNED;
};

export const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    HIGH: 'text-red-500',
    MEDIUM: 'text-yellow-500',
    LOW: 'text-green-500',
  };
  return colors[priority] || 'text-gray-500';
};