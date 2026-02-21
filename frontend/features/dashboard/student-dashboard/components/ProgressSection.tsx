// ============================================================================
// FILE: student-dashboard/components/ProgressSection.tsx
// ============================================================================
import { TrendingUp } from 'lucide-react';

interface ProgressSectionProps {
  // Session progress
  completedSessions: number;
  totalSessions: number;
  totalHours: number;

  // Lesson progress
  completedLessons?: number;
  totalLessons?: number;
  lessonProgressPercentage?: number;
}

export const ProgressSection = ({
  completedSessions,
  totalSessions,
  totalHours,
  completedLessons = 0,
  totalLessons = 0,
  lessonProgressPercentage = 0
}: ProgressSectionProps) => {
  const sessionCompletionRate = totalSessions > 0
    ? Math.round((completedSessions / totalSessions) * 100)
    : 0;

  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-card-foreground">Tiến Độ Học Tập</h2>
            <p className="text-sm text-muted-foreground">Thống kê chi tiết quá trình học của bạn</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Session Progress Track */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">Buổi Học Trực Tuyến</h3>
              <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full dark:bg-emerald-900/30 dark:text-emerald-400">
                Tháng này
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-2xl border border-border/40">
                <div className="text-2xl font-black text-foreground mb-1">
                  {completedSessions}/{totalSessions}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                  Buổi đã học
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-2xl border border-border/40">
                <div className="text-2xl font-black text-foreground mb-1">
                  {totalHours}h
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                  Tổng thời gian
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Tỷ lệ tham gia</span>
                <span>{sessionCompletionRate}%</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  style={{ width: `${sessionCompletionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lesson Progress Track */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">Bài Giảng Đã Giao</h3>
              <span className="text-xs font-black text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
                Tất cả bài
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-2xl border border-border/40">
                <div className="text-2xl font-black text-foreground mb-1">
                  {completedLessons}/{totalLessons}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                  Bài hoàn thành
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-2xl border border-border/40">
                <div className="text-2xl font-black text-foreground mb-1">
                  {totalLessons - completedLessons}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                  Bài đang học
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Tiến độ tổng quát</span>
                <span>{Math.round(lessonProgressPercentage)}%</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                  style={{ width: `${lessonProgressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
