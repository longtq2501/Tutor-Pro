// ============================================================================
// 📁 tutor-homework-detail/utils/statusHelpers.tsx
// ============================================================================
import { Badge } from '@/components/ui/badge';
import type { ReactElement } from 'react';

export const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    ASSIGNED: { variant: 'default', label: 'Đã giao' },
    IN_PROGRESS: { variant: 'secondary', label: 'Đang làm' },
    SUBMITTED: { variant: 'outline', label: 'Chờ chấm' },
    GRADED: { variant: 'default', label: 'Đã chấm' },
    OVERDUE: { variant: 'destructive', label: 'Quá hạn' },
  };
  const config = variants[status] || variants.ASSIGNED;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const getPriorityBadge = (priority: string) => {
  const label = priority === 'HIGH' ? 'Cao' : priority === 'MEDIUM' ? 'Trung bình' : 'Thấp';
  const variant = priority === 'HIGH' ? 'destructive' : 'secondary';
  return <Badge variant={variant}>{label}</Badge>;
};