
'use client';

import { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, Repeat, AlertCircle } from 'lucide-react';
import { recurringSchedulesApi } from '@/lib/api';
import type { RecurringSchedule, RecurringScheduleRequest } from '@/lib/types';

interface RecurringScheduleModalProps {
  studentId: number;
  studentName: string;
  existingSchedule?: RecurringSchedule | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'T2', full: 'Thứ 2' },
  { value: 2, label: 'T3', full: 'Thứ 3' },
  { value: 3, label: 'T4', full: 'Thứ 4' },
  { value: 4, label: 'T5', full: 'Thứ 5' },
  { value: 5, label: 'T6', full: 'Thứ 6' },
  { value: 6, label: 'T7', full: 'Thứ 7' },
  { value: 0, label: 'CN', full: 'Chủ Nhật' }, // Changed 7 to 0 if your backend uses 0 for Sunday, adjust if needed. Assuming 0-6 or 1-7 based on your backend. Let's stick to your previous 1-7 for consistency if that's what backend expects.
];

// Correcting to 1-7 based on previous code context (1=Mon, 7=Sun)
const DAYS_OF_WEEK_ADJUSTED = [
  { value: 1, label: 'T2', full: 'Thứ 2' },
  { value: 2, label: 'T3', full: 'Thứ 3' },
  { value: 3, label: 'T4', full: 'Thứ 4' },
  { value: 4, label: 'T5', full: 'Thứ 5' },
  { value: 5, label: 'T6', full: 'Thứ 6' },
  { value: 6, label: 'T7', full: 'Thứ 7' },
  { value: 7, label: 'CN', full: 'Chủ Nhật' },
];

export default function RecurringScheduleModal({
  studentId,
  studentName,
  existingSchedule,
  onClose,
  onSuccess,
}: RecurringScheduleModalProps) {
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
  }, [existingSchedule, studentId]);

  const toggleDay = (day: number) => {
    setError(null);
    if (formData.daysOfWeek.includes(day)) {
      setFormData({
        ...formData,
        daysOfWeek: formData.daysOfWeek.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        daysOfWeek: [...formData.daysOfWeek, day].sort((a, b) => a - b),
      });
    }
  };

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startDate = new Date(0, 0, 0, startH, startM);
    const endDate = new Date(0, 0, 0, endH, endM);
    let diff = (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60;
    if (diff < 0) diff += 24; // Handle midnight crossing if needed
    return Math.round(diff * 10) / 10;
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newData = { ...formData, [field]: value };
    // Auto-calculate duration
    if (newData.startTime && newData.endTime) {
      const duration = calculateHours(newData.startTime, newData.endTime);
      if (duration > 0) {
        newData.hoursPerSession = duration;
      }
    }
    setFormData(newData);
  };

  const handleSubmit = async () => {
    setError(null);
    if (formData.daysOfWeek.length === 0) {
      setError('Vui lòng chọn ít nhất một ngày trong tuần.');
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setError('Vui lòng nhập đầy đủ giờ học.');
      return;
    }

    if (formData.hoursPerSession <= 0) {
      setError('Thời lượng buổi học không hợp lệ.');
      return;
    }

    try {
      setLoading(true);
      if (existingSchedule) {
        // Assuming update accepts ID + data
        await recurringSchedulesApi.update(existingSchedule.id, formData);
      } else {
        await recurringSchedulesApi.create(formData);
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError('Có lỗi xảy ra khi lưu lịch. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-4 rounded-t-2xl flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Repeat size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  {existingSchedule ? 'Sửa Lịch Cố Định' : 'Tạo Lịch Cố Định'}
                </h2>
                <p className="text-blue-100 text-xs mt-0.5 font-medium">{studentName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r flex items-center gap-2 text-sm text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Days Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Chọn ngày trong tuần <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-between gap-2">
              {DAYS_OF_WEEK_ADJUSTED.map((day) => {
                const isSelected = formData.daysOfWeek.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                      ${isSelected 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                    `}
                    title={day.full}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 text-center">
               {formData.daysOfWeek.length > 0 
                 ? `Đã chọn: ${formData.daysOfWeek.map(d => DAYS_OF_WEEK_ADJUSTED.find(dw => dw.value === d)?.full).join(', ')}`
                 : 'Chưa chọn ngày nào'}
            </p>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Time & Duration */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Giờ bắt đầu</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Giờ kết thúc</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-indigo-900">Thời lượng (giờ)</label>
              <span className="text-xs text-indigo-600 bg-white px-2 py-0.5 rounded-full font-bold">
                Tự động tính
              </span>
            </div>
            <input
              type="number"
              value={formData.hoursPerSession}
              onChange={(e) => setFormData({ ...formData, hoursPerSession: parseFloat(e.target.value) || 0 })}
              step="0.5"
              className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-indigo-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Áp dụng từ</label>
              <input
                type="month"
                value={formData.startMonth}
                onChange={(e) => setFormData({ ...formData, startMonth: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Đến (Tùy chọn)</label>
              <input
                type="month"
                value={formData.endMonth || ''}
                onChange={(e) => setFormData({ ...formData, endMonth: e.target.value || undefined })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Ghi chú</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Ví dụ: Học sinh hay đi muộn 15p..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-gray-50 border-t border-gray-200 flex-shrink-0 flex gap-3 rounded-b-2xl">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save size={18} />}
            {existingSchedule ? 'Cập Nhật Lịch' : 'Lưu Thiết Lập'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
