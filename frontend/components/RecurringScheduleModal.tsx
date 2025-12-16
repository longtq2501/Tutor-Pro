'use client';

import { useState, useEffect } from 'react';
import { X, Save, Clock, Repeat, AlertCircle, Calendar } from 'lucide-react';
import { recurringSchedulesApi } from '../lib/api';
import type { RecurringSchedule, RecurringScheduleRequest } from '@/lib/types';

interface RecurringScheduleModalProps {
  studentId: number;
  studentName: string;
  existingSchedule?: RecurringSchedule | null;
  onClose: () => void;
  onSuccess: () => void;
}

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
    if (diff < 0) diff += 24; 
    return Math.round(diff * 10) / 10;
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newData = { ...formData, [field]: value };
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
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-8 py-6 rounded-t-3xl flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-violet-50 dark:bg-violet-900/30 p-2.5 rounded-xl text-violet-600 dark:text-violet-400">
                <Repeat size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {existingSchedule ? 'Sửa Lịch Cố Định' : 'Tạo Lịch Cố Định'}
                </h2>
                <p className="text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-md inline-block mt-1">
                   {studentName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 space-y-8 bg-slate-50/50 dark:bg-slate-900/30">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 p-4 rounded-xl flex items-center gap-3 text-sm text-rose-700 dark:text-rose-400 animate-pulse">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Days Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Chọn ngày trong tuần <span className="text-rose-500">*</span>
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
                      w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200
                      ${isSelected 
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-105' 
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'}
                    `}
                    title={day.full}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time & Duration */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-5">
             <div className="flex items-center gap-2 mb-2">
               <Clock size={18} className="text-indigo-500 dark:text-indigo-400" />
               <span className="font-bold text-slate-700 dark:text-slate-200">Khung giờ học</span>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Bắt đầu</label>
                 <input
                   type="time"
                   value={formData.startTime}
                   onChange={(e) => handleTimeChange('startTime', e.target.value)}
                   className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Kết thúc</label>
                 <input
                   type="time"
                   value={formData.endTime}
                   onChange={(e) => handleTimeChange('endTime', e.target.value)}
                   className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                 />
               </div>
             </div>
             
             <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">Tổng thời lượng:</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{formData.hoursPerSession}h</span>
             </div>
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                 <Calendar size={14} /> Áp dụng từ
              </label>
              <input
                type="month"
                value={formData.startMonth}
                onChange={(e) => setFormData({ ...formData, startMonth: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-400 dark:text-slate-500 flex items-center gap-2">
                 Đến (Tùy chọn)
              </label>
              <input
                type="month"
                value={formData.endMonth || ''}
                onChange={(e) => setFormData({ ...formData, endMonth: e.target.value || undefined })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Ghi chú</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400 dark:text-slate-500"
              placeholder="Ghi chú thêm về lịch..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div> : <Save size={18} />}
            {existingSchedule ? 'Cập Nhật' : 'Lưu Thiết Lập'}
          </button>
        </div>
      </div>
    </div>
  );
}