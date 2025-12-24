// ============================================================================
// 📁 tutor-homework-view/utils/statusHelpers.ts
// ============================================================================
export const getStatusConfig = (status: string) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    ASSIGNED: { variant: 'default', label: 'Đã giao' },
    IN_PROGRESS: { variant: 'secondary', label: 'Đang làm' },
    SUBMITTED: { variant: 'outline', label: 'Chờ chấm' },
    GRADED: { variant: 'default', label: 'Đã chấm' },
    OVERDUE: { variant: 'destructive', label: 'Quá hạn' },
  };
  return variants[status] || variants.ASSIGNED;
};