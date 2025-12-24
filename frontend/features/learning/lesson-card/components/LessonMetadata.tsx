// 📁 lesson-card/components/LessonMetadata.tsx
import { Calendar, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface LessonMetadataProps {
  lessonDate: string;
  viewCount: number;
  lastViewedAt?: string;
}

export function LessonMetadata({ lessonDate, viewCount, lastViewedAt }: LessonMetadataProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600 dark:text-gray-500">
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span>{format(new Date(lessonDate), 'dd/MM/yyyy', { locale: vi })}</span>
      </div>
      
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>{viewCount} lượt xem</span>
      </div>

      {lastViewedAt && (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Xem {format(new Date(lastViewedAt), 'dd/MM HH:mm', { locale: vi })}</span>
        </div>
      )}
    </div>
  );
}