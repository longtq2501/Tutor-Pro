// ============================================================================
// 📁 student-homework/components/HomeworkCard.tsx
// ============================================================================
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, Calendar, CheckCircle2, FileText } from 'lucide-react';
import type { Homework } from '@/lib/types';
import { formatDueDate, getStatusConfig, getPriorityColor } from '../utils/homeworkHelpers';

interface HomeworkCardProps {
  homework: Homework;
  onClick: () => void;
}

export function HomeworkCard({ homework, onClick }: HomeworkCardProps) {
  const statusConfig = getStatusConfig(homework.status);
  const priorityColor = getPriorityColor(homework.priority);

  const getPriorityIcon = () => {
    switch (homework.priority) {
      case 'HIGH': return <AlertCircle className={`h-4 w-4 ${priorityColor}`} />;
      case 'MEDIUM': return <Clock className={`h-4 w-4 ${priorityColor}`} />;
      case 'LOW': return <FileText className={`h-4 w-4 ${priorityColor}`} />;
      default: return null;
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getPriorityIcon()}
              <CardTitle className="text-lg">{homework.title}</CardTitle>
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>
            {homework.description && (
              <CardDescription className="line-clamp-2">
                {homework.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Hạn nộp: {formatDueDate(homework.dueDate)}</span>
          </div>

          {homework.daysUntilDue !== undefined && homework.daysUntilDue >= 0 && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Clock className="h-4 w-4" />
              <span>Còn {homework.daysUntilDue} ngày</span>
            </div>
          )}

          {homework.isOverdue && (
            <div className="flex items-center gap-1 text-red-600 font-medium">
              <AlertCircle className="h-4 w-4" />
              <span>Đã quá hạn</span>
            </div>
          )}

          {homework.score !== undefined && (
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>Điểm: {homework.score}/100</span>
            </div>
          )}
        </div>

        {homework.attachmentUrls.length > 0 && (
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{homework.attachmentUrls.length} tệp đính kèm</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}