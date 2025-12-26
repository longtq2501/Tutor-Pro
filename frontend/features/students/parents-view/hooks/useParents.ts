// 📁 parents-view/hooks/useParents.ts
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { parentsApi } from '@/lib/services';
import { toast } from 'sonner';

export function useParents() {
  const [keyword, setKeyword] = useState('');
  const queryClient = useQueryClient();

  const { data: parents, isLoading: loading } = useQuery({
    queryKey: ['parents', keyword],
    queryFn: () => keyword ? parentsApi.search(keyword) : parentsApi.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,
  });

  const search = async (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  const loadParents = async () => {
    await queryClient.invalidateQueries({ queryKey: ['parents'] });
  };

  const deleteParent = async (id: number) => {
    if (!confirm('Xóa phụ huynh này? Lưu ý: Không thể xóa nếu còn học sinh liên kết.')) {
      return;
    }

    const promise = async () => {
      await parentsApi.delete(id);
      // Invalidate parents list
      await queryClient.invalidateQueries({ queryKey: ['parents'] });
    };

    toast.promise(promise(), {
      loading: 'Đang xóa hồ sơ phụ huynh...',
      success: 'Đã xóa phụ huynh thành công',
      error: (err) => err?.response?.data?.message || 'Không thể xóa phụ huynh!'
    });
  };

  return { parents: parents || [], loading, loadParents, search, deleteParent };
}