// ============================================================================
// FILE: add-session-modal/components/FormField.tsx
// ============================================================================
import { Calendar, Clock } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';

const inputClass = "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-500/10 dark:focus:ring-slate-500/20 outline-none transition-all font-medium text-slate-800 dark:text-white";

export const DateField = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
      <Calendar size={16} className="text-foreground" />
      Ngày dạy
    </label>
    <DatePicker
      value={value ? new Date(value) : undefined}
      onChange={(date) => {
        if (date) {
          onChange(format(date, 'yyyy-MM-dd'));
        }
      }}
      placeholder="Chọn ngày dạy"
      className="w-full"
    />
  </div>
);

export const NumberField = ({ label, value, onChange, icon, min, step }: any) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
      {icon && icon} {label}
    </label>
    <input
      type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || min)}
      min={min} step={step}
      className={`${inputClass} font-bold text-center text-lg`}
      required
    />
  </div>
);