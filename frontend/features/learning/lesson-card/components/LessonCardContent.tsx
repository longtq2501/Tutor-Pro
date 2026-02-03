// 📁 lesson-card/components/LessonCardContent.tsx
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LessonMetadata } from './LessonMetadata';
import { LessonTags } from './LessonTags';
import type { Lesson } from '@/lib/types';

interface LessonCardContentProps {
    lesson: Lesson;
}

/**
 * Renders the text content and metadata part of the lesson card.
 * Handles missing images/resources safely for summary views.
 */
export function LessonCardContent({ lesson }: LessonCardContentProps) {
    return (
        <div className="flex-1 min-w-0">
            <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
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

                        <CardDescription className="mt-2 text-gray-600 dark:text-gray-400 font-medium">
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

            <CardContent className="px-4 sm:px-6">
                {lesson.summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                        {lesson.summary}
                    </p>
                )}

                <LessonTags
                    imageCount={lesson.images?.length || 0}
                    resourceCount={lesson.resources?.length || 0}
                />
            </CardContent>
        </div>
    );
}
