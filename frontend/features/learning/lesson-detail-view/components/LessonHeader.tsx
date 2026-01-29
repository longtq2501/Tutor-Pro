import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, Eye, CheckCircle2, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Lesson } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LessonHeaderProps {
  lesson: Lesson;
  markingComplete: boolean;
  onBack: () => void;
  onToggleComplete: () => void;
  className?: string;
}

export function LessonHeader({ lesson, markingComplete, onBack, onToggleComplete, className }: LessonHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="group text-muted-foreground hover:text-foreground -ml-2 pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight text-left">
          {lesson.title}
        </h1>

        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary shrink-0" />
            <span className="font-medium text-foreground">{lesson.tutorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{format(new Date(lesson.lessonDate), 'EEEE, d MMMM, yyyy', { locale: vi })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 shrink-0" />
            <span>{lesson.viewCount} lượt xem</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={onToggleComplete}
            disabled={markingComplete}
            size="lg"
            className={cn(
              "w-full shadow-md transition-all duration-300",
              lesson.isCompleted
                ? "bg-green-600 hover:bg-green-700 hover:shadow-green-500/25"
                : "bg-primary hover:bg-primary/90 hover:shadow-primary/25"
            )}
          >
            {lesson.isCompleted ? (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Đã hoàn thành
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Đánh dấu đã học
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}