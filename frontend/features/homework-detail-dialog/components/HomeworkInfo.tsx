// 📁 homework-detail-dialog/components/HomeworkInfo.tsx
import { Calendar, Clock, AlertCircle, Award } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Homework } from '@/lib/types';

interface HomeworkInfoProps {
  homework: Homework;
}

export function HomeworkInfo({ homework }: HomeworkInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Hạn nộp:</span>
        <span className="font-medium">
          {format(new Date(homework.dueDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
        </span>
      </div>

      {homework.daysUntilDue !== undefined && homework.daysUntilDue >= 0 && (
        <div className="flex items-center gap-2 text-yellow-600">
          <Clock className="h-4 w-4" />
          <span>Còn {homework.daysUntilDue} ngày</span>
        </div>
      )}

      {homework.isOverdue && (
        <div className="flex items-center gap-2 text-red-600 font-medium">
          <AlertCircle className="h-4 w-4" />
          <span>Đã quá hạn</span>
        </div>
      )}

      {homework.score !== undefined && (
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Điểm:</span>
          <span className="font-bold text-green-600">{homework.score}/100</span>
        </div>
      )}
    </div>
  );
}