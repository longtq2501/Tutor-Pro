// ============================================================================
// 📁 recurring-schedule/components/DaySelector.tsx

import { Label } from '@/components/ui/label';
import { memo } from 'react';
import { DAYS_OF_WEEK } from "../utils/timeCalculation";
import { cn } from '@/lib/utils';

interface DaySelectorProps {
  selectedDays: number[];
  onToggle: (day: number) => void;
}

export const DaySelector = memo(({ selectedDays, onToggle }: DaySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">
        Chọn ngày trong tuần <span className="text-destructive">*</span>
      </Label>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAYS_OF_WEEK.map(day => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => onToggle(day.value)}
              className={cn(
                "h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors border",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              title={day.full}
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});
DaySelector.displayName = 'DaySelector';