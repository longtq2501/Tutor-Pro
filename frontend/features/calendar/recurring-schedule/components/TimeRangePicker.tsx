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
    <div className="bg-muted/30 p-3.5 rounded-xl border border-border space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary" />
          Khung giờ học
        </Label>
        {hoursPerSession > 0 && (
          <div className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{hoursPerSession} giờ</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium px-0.5">Bắt đầu</div>
          <Input
            type="time"
            value={startTime}
            onChange={e => onChange('startTime', e.target.value)}
            className="h-10 rounded-lg bg-background"
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium px-0.5">Kết thúc</div>
          <Input
            type="time"
            value={endTime}
            onChange={e => onChange('endTime', e.target.value)}
            className="h-10 rounded-lg bg-background"
          />
        </div>
      </div>
    </div>
  );
}