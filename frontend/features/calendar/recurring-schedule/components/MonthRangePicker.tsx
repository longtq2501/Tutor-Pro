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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="block text-sm font-semibold flex items-center gap-1.5 text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          <Calendar size={14} className="text-primary" /> Áp dụng từ
        </Label>
        <Input
          type="month"
          value={startMonth}
          onChange={e => onChange('startMonth', e.target.value)}
          className="h-11 rounded-xl border-2 border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-all bg-muted/30"
        />
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-semibold text-muted-foreground flex items-center gap-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Đến (Tùy chọn)
        </Label>
        <Input
          type="month"
          value={endMonth || ''}
          onChange={e => onChange('endMonth', e.target.value)}
          className="h-11 rounded-xl border-2 border-muted-foreground/20 focus:border-primary/50 hover:border-primary/30 transition-all bg-muted/30"
        />
      </div>
    </div>
  );
}
