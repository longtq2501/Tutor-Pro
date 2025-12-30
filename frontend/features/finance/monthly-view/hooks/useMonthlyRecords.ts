// 📁 monthly-view/hooks/useMonthlyRecords.ts
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { sessionsApi } from '@/lib/services';
import type { SessionRecord } from '@/lib/types';
import { toast } from 'sonner';

export function useMonthlyRecords(selectedMonth: string) {
  const queryClient = useQueryClient();

  // 1. Fetch Records
  const {
    data: records,
    isLoading: loading,
    refetch: loadRecords
  } = useQuery({
    queryKey: ['sessions', selectedMonth],
    queryFn: () => sessionsApi.getByMonth(selectedMonth),
    staleTime: 5 * 60 * 1000, // 5 minutes (matches Calendar view)
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData, // Keep showing previous month data while fetching new month
  });

  const togglePayment = async (id: number) => {
    const promise = async () => {
      await sessionsApi.togglePayment(id);
      await queryClient.invalidateQueries({ queryKey: ['sessions', selectedMonth] });
    };

    toast.promise(promise(), {
      loading: 'Đang cập nhật thanh toán...',
      success: 'Đã cập nhật trạng thái thanh toán',
      error: 'Lỗi khi cập nhật thanh toán'
    });
  };

  const deleteRecord = async (id: number) => {
    if (!confirm('Xóa buổi học này?')) return;

    const promise = async () => {
      await sessionsApi.delete(id);
      await queryClient.invalidateQueries({ queryKey: ['sessions', selectedMonth] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }); // Invalidate dashboard stats
    };

    toast.promise(promise(), {
      loading: 'Đang xóa buổi học...',
      success: 'Đã xóa buổi học thành công',
      error: 'Lỗi khi xóa buổi học'
    });
  };

  return {
    records: records || [],
    loading,
    loadRecords,
    togglePayment,
    deleteRecord
  };
}