'use client';

import type { MonthlyReportSessionFeedback } from '@/lib/types';
import { Calendar, MessageSquare } from 'lucide-react';

interface SessionFeedbackListProps {
  feedbacks: MonthlyReportSessionFeedback[];
}

export function SessionFeedbackList({ feedbacks }: SessionFeedbackListProps) {
  const count = feedbacks?.length || 0;

  return (
    <div className="bg-muted/20 dark:bg-muted/10 border border-border/80 dark:border-border/60 rounded-xl p-3.5 space-y-2.5 shadow-xs">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-primary/70" />
          <span>Nhận xét từng buổi học</span>
        </label>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          {count} buổi học
        </span>
      </div>

      <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1 custom-scrollbar">
        {count > 0 ? (
          feedbacks.map((feedback, index) => (
            <div
              key={`${feedback.sessionDate}-${index}`}
              className="rounded-lg border border-border/80 bg-background p-3 shadow-xs space-y-1.5 transition-all hover:border-primary/30"
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-primary/60" />
                <span className="text-xs font-bold text-foreground">
                  Buổi học: {feedback.sessionDate}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                {feedback.feedback || 'Không có nội dung nhận xét'}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-6 px-4 rounded-lg border border-dashed border-border/70 bg-background/50">
            <MessageSquare className="h-6 w-6 text-muted-foreground/60 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-muted-foreground">
              Chưa có nhận xét buổi học nào được ghi nhận trong tháng này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
