// ============================================================================
// 📁 unpaid-sessions/hooks/useUnpaidSessions.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { sessionsApi } from '@/lib/services';
import type { SessionRecord } from '@/lib/types';

export function useUnpaidSessions() {
  const [records, setRecords] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnpaidRecords();
  }, []);

  const loadUnpaidRecords = async () => {
    try {
      setLoading(true);
      const response = await sessionsApi.getUnpaid();
      // Only show taught sessions (completed = true)
      const completedSessions = response.filter(r => r.completed);
      setRecords(completedSessions);
    } catch (error) {
      console.error('Error loading unpaid records:', error);
      alert('Không thể tải danh sách buổi học chưa thanh toán!');
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: number) => {
    if (!confirm('Xóa buổi học này?')) return;
    try {
      await sessionsApi.delete(id);
      loadUnpaidRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Không thể xóa buổi học!');
    }
  };

  return { records, loading, loadUnpaidRecords, deleteRecord };
}