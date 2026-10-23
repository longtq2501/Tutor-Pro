import type { SessionRecord } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { memo, useRef, useState, useEffect } from 'react';
import type { CalendarDay } from '../types';
import { CalendarCell } from './CalendarCell';

interface Props {
  days: CalendarDay[];
  onDayClick: (day: CalendarDay) => void;
  onAddSession: (dateStr: string) => void;
  onSessionClick?: (session: SessionRecord) => void;
  onSessionEdit?: (session: SessionRecord) => void;
  onUpdate?: (updated: SessionRecord) => void;
  onDelete?: (id: number) => void;
  onContextMenu?: (e: React.MouseEvent, session: SessionRecord) => void;
}

export const CalendarGrid = memo(({
  days,
  onDayClick,
  onAddSession,
  onSessionClick,
  onSessionEdit,
  onContextMenu
}: Props) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridDim, setGridDim] = useState({ width: 0, height: 0 });

  // Compute number of weeks for the current month view (4, 5, or 6 weeks)
  const weeks = Math.max(1, Math.round(days.length / 7));

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setGridDim({
          width: Math.round(width),
          height: Math.round(height),
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const headerH = 34;
  const availableH = Math.max(0, gridDim.height - headerH);
  const cellHeight = weeks > 0 ? (availableH / weeks) : 0;
  const cellWidth = gridDim.width > 0 ? (gridDim.width / 7) : 0;

  // Very low screen mode (e.g. landscape mobile < 420px height):
  // Min cell height 40px, allow internal scroll ONLY when total min height exceeds space
  const isVeryLowScreen = gridDim.height > 0 && availableH < weeks * 40;

  // Weekday labels: < 560px switches to compact "CN T2 T3 ...", >= 560px shows "CN Thứ 2 ..."
  const isNarrowWidth = gridDim.width > 0 && gridDim.width < 560;
  const weekdayLabels = isNarrowWidth
    ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    : ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  return (
    <div
      ref={gridRef}
      className="bg-card rounded-2xl shadow-xl border border-border/40 overflow-hidden flex-1 flex flex-col min-h-0 h-full w-full @container [container-type:size]"
    >
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30 dark:bg-zinc-900/50 shrink-0 h-[34px]">
        {weekdayLabels.map((day, index) => (
          <div
            key={day}
            className={cn(
              "flex items-center justify-center text-center font-bold tracking-tight select-none",
              "text-[clamp(11px,1.2cqi,14px)]",
              index === 0 ? "text-rose-500 dark:text-rose-400" : "text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Cells: grid-template-rows divides available height equally across all weeks */}
      <div
        className={cn(
          "grid grid-cols-7 flex-1 bg-background min-h-0",
          isVeryLowScreen ? "overflow-y-auto" : "overflow-hidden"
        )}
        style={{
          gridTemplateRows: isVeryLowScreen
            ? `repeat(${weeks}, minmax(40px, 1fr))`
            : `repeat(${weeks}, minmax(0, 1fr))`
        }}
      >
        {days.map((day, idx) => (
          <CalendarCell
            key={idx}
            day={day}
            isToday={day.isToday}
            isCurrentMonth={day.isCurrentMonth}
            sessions={day.sessions}
            onDayClick={onDayClick}
            onSessionClick={(session) => onSessionClick?.(session)}
            onAddSession={onAddSession}
            onContextMenu={onContextMenu}
            cellHeight={cellHeight}
            cellWidth={cellWidth}
          />
        ))}
      </div>
    </div>
  );
});
CalendarGrid.displayName = 'CalendarGrid';
