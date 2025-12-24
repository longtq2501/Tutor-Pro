// ============================================================================
// FILE: student-dashboard/components/ScheduleSection.tsx
// ============================================================================
import { Calendar } from 'lucide-react';
import type { RecurringSchedule } from '@/lib/types';

export const ScheduleSection = ({ schedule }: { schedule: RecurringSchedule }) => (
  <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
    <div className="p-6 border-b border-border">
      <h3 className="font-bold text-foreground flex items-center gap-2">
        <Calendar className="text-primary" size={18} />
        Lịch Học Cố Định
      </h3>
    </div>
    <div className="p-6">
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Các ngày trong tuần
          </p>
          <p className="font-bold text-foreground">
            {schedule.daysOfWeekDisplay}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Thời gian
          </p>
          <p className="font-bold text-foreground">
            {schedule.timeRange}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Số giờ mỗi buổi
          </p>
          <p className="font-bold text-foreground">
            {schedule.hoursPerSession} giờ
          </p>
        </div>
        {schedule.notes && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Ghi chú
            </p>
            <p className="text-sm text-foreground">
              {schedule.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);