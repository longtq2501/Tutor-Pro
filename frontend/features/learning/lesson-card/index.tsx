'use client';
import { Card } from '@/components/ui/card';
import type { Lesson } from '@/lib/types';
import { LessonThumbnail } from './components/LessonThumbnail';
import { LessonCardContent } from './components/LessonCardContent';

interface LessonCardProps {
  /** The lesson object to display */
  lesson: Lesson;
  /** Function to call when the card is clicked */
  onClick: () => void;
}

/**
 * A reusable card component for displaying lesson information.
 * Supports both full lesson objects and lightweight summary objects.
 * Optimized for mobile and desktop views.
 */
export default function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.01] bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2A2A2A] overflow-hidden relative"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row">
        <LessonThumbnail
          thumbnailUrl={lesson.thumbnailUrl}
          title={lesson.title}
          videoUrl={lesson.videoUrl}
          isCompleted={lesson.isCompleted}
        />

        <LessonCardContent lesson={lesson} />
      </div>

      {/* Interactive hover border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-lg pointer-events-none transition-colors" />
    </Card>
  );
}
