'use client';

import { use } from 'react';
import LessonDetailView from '@/features/learning/lesson-detail-view';

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ preview?: string }>;
}

/**
 * Full-screen Lesson Page
 * Provides a professional learning environment for students.
 */
export default function LessonPage({ params, searchParams }: PageProps) {
    const resolvedParams = use(params);
    const resolvedSearchParams = use(searchParams);
    const lessonId = parseInt(resolvedParams.id);
    const isPreview = resolvedSearchParams.preview === 'true';

    if (isNaN(lessonId)) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">ID bài học không hợp lệ</h1>
                    <p className="text-muted-foreground">Vui lòng quay lại danh sách và thử lại.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="w-full h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950">
            <LessonDetailView lessonId={lessonId} isPreview={isPreview} />
        </main>
    );
}
