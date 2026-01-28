// ============================================================================
// 📁 student-list/hooks/useStudents.ts
// ============================================================================
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '@/lib/services';
import { toast } from 'sonner';

export function useStudents() {
  const queryClient = useQueryClient();

  // 1. Fetch Students with Cache
  const {
    data: students,
    isLoading: loading,
    isError,
    refetch: loadStudents
  } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,
  });

  // 2. Delete Student
  const deleteStudent = async (id: number) => {
    if (!confirm('CẢNH BÁO: Xóa học sinh sẽ xóa toàn bộ lịch sử học và doanh thu liên quan. Bạn có chắc chắn?')) {
      return;
    }

    const promise = async () => {
      await studentsApi.delete(id);
      // Invalidate both students list and sessions as they might be related
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['students'] }),
        queryClient.invalidateQueries({ queryKey: ['sessions'] }) // Invalidate sessions too
      ]);
    };

    toast.promise(promise(), {
      loading: 'Đang xóa hồ sơ học sinh...',
      success: 'Đã xóa học sinh thành công',
      error: 'Không thể xóa học sinh. Vui lòng thử lại.'
    });
  };

  return {
    students: students?.content || [],
    loading,
    isError,
    refetch: loadStudents,
    deleteStudent
  };
}
