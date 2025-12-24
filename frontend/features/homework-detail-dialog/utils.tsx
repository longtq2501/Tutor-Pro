// 📁 homework-detail-dialog/utils.ts
import { Badge } from '@/components/ui/badge';

export function getStatusBadge(status: string) {
  const config: Record<string, { variant: any; label: string }> = {
    ASSIGNED: { variant: 'default', label: 'Đã giao' },
    IN_PROGRESS: { variant: 'secondary', label: 'Đang làm' },
    SUBMITTED: { variant: 'outline', label: 'Đã nộp' },
    GRADED: { variant: 'default', label: 'Đã chấm' },
    OVERDUE: { variant: 'destructive', label: 'Quá hạn' },
  };
  const { variant, label } = config[status] || config.ASSIGNED;
  return <Badge variant={variant}>{label}</Badge>;
}