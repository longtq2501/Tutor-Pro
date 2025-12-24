// 📁 parents-view/hooks/useParents.ts
import { useState, useEffect } from 'react';
import { parentsApi } from '@/lib/services';
import type { Parent } from '@/lib/types';

export function useParents() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParents();
  }, []);

  const loadParents = async () => {
    try {
      setLoading(true);
      const data = await parentsApi.getAll();
      setParents(data);
    } catch (error) {
      console.error('Error loading parents:', error);
      alert('Không thể tải danh sách phụ huynh!');
    } finally {
      setLoading(false);
    }
  };

  const search = async (keyword: string) => {
    if (!keyword.trim()) {
      loadParents();
      return;
    }

    try {
      const results = await parentsApi.search(keyword);
      setParents(results);
    } catch (error) {
      console.error('Error searching parents:', error);
    }
  };

  const deleteParent = async (id: number) => {
    if (!confirm('Xóa phụ huynh này? Lưu ý: Không thể xóa nếu còn học sinh liên kết.')) {
      return;
    }

    try {
      await parentsApi.delete(id);
      loadParents();
    } catch (error: any) {
      console.error('Error deleting parent:', error);
      alert(error.response?.data?.message || 'Không thể xóa phụ huynh!');
    }
  };

  return { parents, loading, loadParents, search, deleteParent };
}