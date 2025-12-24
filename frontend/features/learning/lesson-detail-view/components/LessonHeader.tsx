// 📁 lesson-detail-view/components/LessonHeader.tsx
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Lesson } from '@/lib/types';

interface LessonHeaderProps {
  lesson: Lesson;
  markingComplete: boolean;
  onBack: () => void;
  onToggleComplete: () => void;
}

export function LessonHeader({ lesson, markingComplete, onBack, onToggleComplete }: LessonHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
      <div className="flex-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="mb-4 hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {lesson.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1 md:gap-2">
            <User className="h-4 w-4" />
            <span>{lesson.tutorName}</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(lesson.lessonDate), 'dd MMMM yyyy', { locale: vi })}</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Eye className="h-4 w-4" />
            <span>{lesson.viewCount} lượt xem</span>
          </div>
        </div>
      </div>

      <Button
        onClick={onToggleComplete}
        disabled={markingComplete}
        className={`
          w-full lg:w-auto
          ${lesson.isCompleted 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        `}
      >
        {lesson.isCompleted ? (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Đã Hiểu Bài
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 mr-2" />
            Đánh Dấu Đã Hiểu
          </>
        )}
      </Button>
    </div>
  );
}