// 📁 lesson-timeline-view/components/LessonList.tsx
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import LessonCard from '../../lesson-card';
import type { Lesson } from '@/lib/types';

interface LessonListProps {
  lessons: Lesson[];
  onLessonClick: (id: number) => void;
}

export function LessonList({ lessons, onLessonClick }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400 text-center">Chưa có bài học nào</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map(lesson => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          onClick={() => onLessonClick(lesson.id)}
        />
      ))}
    </div>
  );
}