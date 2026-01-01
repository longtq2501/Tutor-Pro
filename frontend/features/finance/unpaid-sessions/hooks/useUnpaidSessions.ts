// 📁 unpaid-sessions/hooks/useUnpaidSessions.ts
import { sessionsApi } from '@/lib/services';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useUnpaidSessions() {
  const queryClient = useQueryClient();

  // 1. Fetch Unpaid Records
  const {
    data: records,
    isLoading: loading,
    refetch: loadUnpaidRecords
  } = useQuery({
    queryKey: ['unpaid-sessions'],
    queryFn: () => sessionsApi.getUnpaid(),
    select: (data) => data.filter(r => r.status === 'COMPLETED' || r.status === 'PENDING_PAYMENT'), // Only show taught/pending sessions
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const deleteRecord = async (id: number) => {
    if (!confirm('Xóa buổi học này?')) return;

    const promise = async () => {
      await sessionsApi.delete(id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['unpaid-sessions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      ]);
    };

    toast.promise(promise(), {
      loading: 'Đang xóa buổi học...',
      success: 'Đã xóa buổi học thành công',
      error: 'Không thể xóa buổi học. Vui lòng thử lại.'
    });
  };

  return { records: records || [], loading, loadUnpaidRecords, deleteRecord };
}