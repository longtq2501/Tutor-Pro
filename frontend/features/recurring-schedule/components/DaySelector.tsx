// ============================================================================
// 📁 recurring-schedule/components/DaySelector.tsx

import { DAYS_OF_WEEK } from "../utils/timeCalculation";

// ============================================================================
interface DaySelectorProps {
  selectedDays: number[];
  onToggle: (day: number) => void;
}

export function DaySelector({ selectedDays, onToggle }: DaySelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
        Chọn ngày trong tuần <span className="text-rose-500">*</span>
      </label>
      <div className="flex justify-between gap-2">
        {DAYS_OF_WEEK.map(day => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => onToggle(day.value)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                isSelected 
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-105' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500'
              }`}
              title={day.full}
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}