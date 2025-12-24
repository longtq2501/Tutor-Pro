// 📁 monthly-view/hooks/useMonthlyRecords.ts
import { useState, useEffect } from 'react';
import { sessionsApi, recurringSchedulesApi } from '@/lib/services';
import type { SessionRecord } from '@/lib/types';

export function useMonthlyRecords(selectedMonth: string) {
  const [records, setRecords] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [selectedMonth]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await sessionsApi.getByMonth(selectedMonth);
      setRecords(response || []);
    } catch (error) {
      console.error('Error loading records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePayment = async (id: number) => {
    try {
      await sessionsApi.togglePayment(id);
      await loadRecords();
    } catch (error) {
      console.error('Error toggling payment:', error);
    }
  };

  const deleteRecord = async (id: number) => {
    if (!confirm('Xóa buổi học này?')) return;
    try {
      await sessionsApi.delete(id);
      await loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return { records, loading, loadRecords, togglePayment, deleteRecord };
}