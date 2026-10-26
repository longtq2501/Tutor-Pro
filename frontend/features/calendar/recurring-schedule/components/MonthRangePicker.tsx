import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface MonthRangePickerProps {
  startMonth: string;
  endMonth?: string;
  onChange: (field: 'startMonth' | 'endMonth', value: string) => void;
}

export function MonthRangePicker({ startMonth, endMonth, onChange }: MonthRangePickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium flex items-center gap-1.5 text-foreground">
          <Calendar size={14} className="text-primary" /> Áp dụng từ <span className="text-destructive">*</span>
        </Label>
        <Input
          type="month"
          value={startMonth}
          onChange={e => onChange('startMonth', e.target.value)}
          className="h-10 rounded-lg"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          Đến (Tùy chọn)
        </Label>
        <Input
          type="month"
          value={endMonth || ''}
          onChange={e => onChange('endMonth', e.target.value)}
          className="h-10 rounded-lg"
        />
      </div>
    </div>
  );
}
