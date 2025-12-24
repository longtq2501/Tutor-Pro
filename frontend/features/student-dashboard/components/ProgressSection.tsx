// ============================================================================
// FILE: student-dashboard/components/ProgressSection.tsx
// ============================================================================
import { TrendingUp } from 'lucide-react';

interface ProgressSectionProps {
  completedSessions: number;
  totalHours: number;
  totalSessions: number;
}

export const ProgressSection = ({ 
  completedSessions, 
  totalHours, 
  totalSessions 
}: ProgressSectionProps) => {
  const completionRate = totalSessions > 0 
    ? Math.round((completedSessions / totalSessions) * 100)
    : 0;

  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
          <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-card-foreground">Tiến Độ Học Tập</h2>
          <p className="text-sm text-muted-foreground">Thống kê các buổi học đã hoàn thành</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <div className="text-3xl font-bold text-primary mb-2">
              {completedSessions}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Buổi đã hoàn thành
            </div>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <div className="text-3xl font-bold text-primary mb-2">
              {totalHours}h
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Tổng số giờ học
            </div>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <div className="text-3xl font-bold text-primary mb-2">
              {completionRate}%
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Tỷ lệ hoàn thành
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};