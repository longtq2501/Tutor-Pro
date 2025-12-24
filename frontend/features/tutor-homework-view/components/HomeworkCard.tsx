// ============================================================================
// 📁 tutor-homework-view/components/HomeworkCard.tsx
// ============================================================================
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Homework } from '@/lib/types';
import { getStatusConfig } from '../utils/statusHelpers';

interface HomeworkCardProps {
  homework: Homework;
  onClick: () => void;
}

export function HomeworkCard({ homework, onClick }: HomeworkCardProps) {
  const statusConfig = getStatusConfig(homework.status);

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{homework.title}</CardTitle>
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
              {homework.priority === 'HIGH' && (
                <Badge variant="destructive">Ưu tiên cao</Badge>
              )}
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
          <span>Hạn: {new Date(homework.dueDate).toLocaleDateString('vi-VN')}</span>
          
          {homework.status === 'SUBMITTED' && (
            <Badge variant="outline" className="text-yellow-600">
              Cần chấm điểm
            </Badge>
          )}
          
          {homework.score !== undefined && (
            <span className="text-green-600 font-medium">
              Điểm: {homework.score}/100
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}