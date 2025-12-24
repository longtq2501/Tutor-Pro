// ============================================================================
// 📁 recurring-schedule/components/TimeRangePicker.tsx
// ============================================================================
import { Clock } from 'lucide-react';

interface TimeRangePickerProps {
  startTime: string;
  endTime: string;
  hoursPerSession: number;
  onChange: (field: 'startTime' | 'endTime', value: string) => void;
}

export function TimeRangePicker({ startTime, endTime, hoursPerSession, onChange }: TimeRangePickerProps) {
  return (
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
            value={startTime}
            onChange={e => onChange('startTime', e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Kết thúc</label>
          <input
            type="time"
            value={endTime}
            onChange={e => onChange('endTime', e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-700">
        <span className="text-sm text-slate-500 dark:text-slate-400">Tổng thời lượng:</span>
        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{hoursPerSession}h</span>
      </div>
    </div>
  );
}