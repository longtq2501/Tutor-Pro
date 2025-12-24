// ============================================================================
// 📁 recurring-schedule/hooks/useRecurringScheduleForm.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { recurringSchedulesApi } from '@/lib/services';
import type { RecurringSchedule, RecurringScheduleRequest } from '@/lib/types';
import { calculateHours } from '../utils/timeCalculation';

export function useRecurringScheduleForm(
  studentId: number,
  existingSchedule?: RecurringSchedule | null,
  onSuccess?: () => void
) {
  const [formData, setFormData] = useState<RecurringScheduleRequest>({
    studentId,
    daysOfWeek: [],
    startTime: '18:00',
    endTime: '20:00',
    hoursPerSession: 2.0,
    startMonth: new Date().toISOString().slice(0, 7),
    endMonth: undefined,
    active: true,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingSchedule) {
      setFormData({
        studentId: existingSchedule.studentId,
        daysOfWeek: existingSchedule.daysOfWeek,
        startTime: existingSchedule.startTime,
        endTime: existingSchedule.endTime,
        hoursPerSession: existingSchedule.hoursPerSession,
        startMonth: existingSchedule.startMonth,
        endMonth: existingSchedule.endMonth,
        active: existingSchedule.active,
        notes: existingSchedule.notes || '',
      });
    }
  }, [existingSchedule]);

  const toggleDay = (day: number) => {
    setError(null);
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day].sort((a, b) => a - b),
    }));
  };

  const updateTime = (field: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (updated.startTime && updated.endTime) {
        updated.hoursPerSession = calculateHours(updated.startTime, updated.endTime);
      }
      return updated;
    });
  };

  const updateField = (field: keyof RecurringScheduleRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    if (formData.daysOfWeek.length === 0) {
      setError('Vui lòng chọn ít nhất một ngày trong tuần.');
      return false;
    }
    if (!formData.startTime || !formData.endTime) {
      setError('Vui lòng nhập đầy đủ giờ học.');
      return false;
    }
    if (formData.hoursPerSession <= 0) {
      setError('Thời lượng buổi học không hợp lệ.');
      return false;
    }
    return true;
  };

  const submit = async (): Promise<boolean> => {
    setError(null);
    if (!validate()) return false;

    try {
      setLoading(true);
      if (existingSchedule) {
        await recurringSchedulesApi.update(existingSchedule.id, formData);
      } else {
        await recurringSchedulesApi.create(formData);
      }
      onSuccess?.();
      return true;
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError('Có lỗi xảy ra khi lưu lịch. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, error, toggleDay, updateTime, updateField, submit };
}