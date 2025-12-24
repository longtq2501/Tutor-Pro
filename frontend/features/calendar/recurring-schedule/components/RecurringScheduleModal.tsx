// ============================================================================
// 📁 recurring-schedule/components/RecurringScheduleModal.tsx
// ============================================================================
import { X, Save, Repeat, AlertCircle } from 'lucide-react';
import type { RecurringSchedule } from '@/lib/types';
import { useRecurringScheduleForm } from '../hooks/useRecurringScheduleForm';
import { DaySelector } from './DaySelector';
import { MonthRangePicker } from './MonthRangePicker';
import { TimeRangePicker } from './TimeRangePicker';

interface RecurringScheduleModalProps {
  studentId: number;
  studentName: string;
  existingSchedule?: RecurringSchedule | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function RecurringScheduleModal({
  studentId,
  studentName,
  existingSchedule,
  onClose,
  onSuccess,
}: RecurringScheduleModalProps) {
  const { formData, loading, error, toggleDay, updateTime, updateField, submit } = 
    useRecurringScheduleForm(studentId, existingSchedule, onSuccess);

  const handleSubmit = async () => {
    await submit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
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
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-all">
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

          <DaySelector selectedDays={formData.daysOfWeek} onToggle={toggleDay} />
          
          <TimeRangePicker 
            startTime={formData.startTime}
            endTime={formData.endTime}
            hoursPerSession={formData.hoursPerSession}
            onChange={updateTime}
          />

          <MonthRangePicker 
            startMonth={formData.startMonth}
            endMonth={formData.endMonth}
            onChange={updateField}
          />

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Ghi chú</label>
            <textarea
              value={formData.notes}
              onChange={e => updateField('notes', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400 dark:text-slate-500"
              placeholder="Ghi chú thêm về lịch..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 flex gap-4">
          <button onClick={onClose} disabled={loading} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50">
            Hủy
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div> : <Save size={18} />}
            {existingSchedule ? 'Cập Nhật' : 'Lưu Thiết Lập'}
          </button>
        </div>
      </div>
    </div>
  );
}