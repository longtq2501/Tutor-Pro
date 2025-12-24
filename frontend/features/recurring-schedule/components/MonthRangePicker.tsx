// ============================================================================
// 📁 recurring-schedule/components/MonthRangePicker.tsx
// ============================================================================
import { Calendar } from 'lucide-react';

interface MonthRangePickerProps {
  startMonth: string;
  endMonth?: string;
  onChange: (field: 'startMonth' | 'endMonth', value: string) => void;
}

export function MonthRangePicker({ startMonth, endMonth, onChange }: MonthRangePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Calendar size={14} /> Áp dụng từ
        </label>
        <input
          type="month"
          value={startMonth}
          onChange={e => onChange('startMonth', e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-400 dark:text-slate-500 flex items-center gap-2">
          Đến (Tùy chọn)
        </label>
        <input
          type="month"
          value={endMonth || ''}
          onChange={e => onChange('endMonth', e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none transition-all"
        />
      </div>
    </div>
  );
}
