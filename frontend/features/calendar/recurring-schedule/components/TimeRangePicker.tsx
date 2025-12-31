// ============================================================================
// 📁 recurring-schedule/components/TimeRangePicker.tsx
// ============================================================================
import { Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TimeRangePickerProps {
  startTime: string;
  endTime: string;
  hoursPerSession: number;
  onChange: (field: 'startTime' | 'endTime', value: string) => void;
}

export function TimeRangePicker({ startTime, endTime, hoursPerSession, onChange }: TimeRangePickerProps) {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 p-5 rounded-2xl border border-primary/10 space-y-5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary" />
          Khung giờ học
        </Label>
        {hoursPerSession > 0 && (
          <div className="px-2.5 py-1 bg-primary/15 border border-primary/30 rounded-full text-xs font-bold text-primary flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{hoursPerSession} giờ</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide px-1">Bắt đầu</div>
          <Input
            type="time"
            value={startTime}
            onChange={e => onChange('startTime', e.target.value)}
            className="h-14 px-4 rounded-xl border-2 border-border/40 focus:border-primary hover:border-primary/50 transition-all font-bold text-lg bg-background shadow-sm hover:shadow-md"
          />
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide px-1">Kết thúc</div>
          <Input
            type="time"
            value={endTime}
            onChange={e => onChange('endTime', e.target.value)}
            className="h-14 px-4 rounded-xl border-2 border-border/40 focus:border-primary hover:border-primary/50 transition-all font-bold text-lg bg-background shadow-sm hover:shadow-md"
          />
        </div>
      </div>
    </div>
  );
}