// 📁 lesson-card/index.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Lesson } from '@/lib/types';
import { LessonThumbnail } from './components/LessonThumbnail';
import { LessonMetadata } from './components/LessonMetadata';
import { LessonTags } from './components/LessonTags';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

export default function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2A2A2A] overflow-hidden"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row">
        <LessonThumbnail
          thumbnailUrl={lesson.thumbnailUrl}
          title={lesson.title}
          videoUrl={lesson.videoUrl}
          isCompleted={lesson.isCompleted}
        />

        <div className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {lesson.title}
                </CardTitle>
                {lesson.category && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: lesson.category.color || '#3b82f6' }}
                    />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
                      {lesson.category.name}
                    </span>
                  </div>
                )}
                <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
                  {lesson.tutorName}
                </CardDescription>
              </div>
            </div>

            <LessonMetadata
              lessonDate={lesson.lessonDate}
              viewCount={lesson.viewCount}
              lastViewedAt={lesson.lastViewedAt}
            />
          </CardHeader>

          <CardContent>
            {lesson.summary && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {lesson.summary}
              </p>
            )}

            <LessonTags
              imageCount={lesson.images.length}
              resourceCount={lesson.resources.length}
            />
          </CardContent>
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-lg pointer-events-none transition-colors" />
    </Card>
  );
}