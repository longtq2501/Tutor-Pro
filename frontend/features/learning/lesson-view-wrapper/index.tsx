// 📁 lesson-view-wrapper/index.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Layers } from 'lucide-react';
import { useState } from 'react';
import CourseDetailView from '../courses/components/CourseDetailView';
import MyCoursesView from '../courses/components/MyCoursesView';
import LessonTimelineView from '../lesson-timeline-view';
import { LessonDetailModal } from './components/LessonDetailModal';
import { useLessonModal } from './hooks/useLessonModal';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

/**
 * Wrapper component that manages both Timeline and Detail views
 * For inline navigation without separate routes
 */
export default function LessonViewWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedLessonId, isOpen, open, close } = useLessonModal();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('courses');

  // Logic to handle lessonId from URL (e.g., from Dashboard sessions list)
  useEffect(() => {
    const lessonIdParam = searchParams.get('lessonId');
    if (lessonIdParam) {
      const lessonId = parseInt(lessonIdParam);
      if (!isNaN(lessonId)) {
        open(lessonId);
      }
    }
  }, [searchParams, open]);

  const handleClose = useCallback(() => {
    close();
    // Clear lessonId from URL
    const params = new URLSearchParams(searchParams.toString());
    if (params.has('lessonId')) {
      params.delete('lessonId');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [close, searchParams, router, pathname]);

  if (selectedCourseId) {
    return (
      <div className="space-y-6">
        <CourseDetailView
          courseId={selectedCourseId}
          onBack={() => setSelectedCourseId(null)}
          onLessonSelect={open}
        />

        {selectedLessonId && (
          <LessonDetailModal
            lessonId={selectedLessonId}
            open={isOpen}
            onClose={handleClose}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Lộ trình học tập
            </TabsTrigger>
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Bài giảng lẻ
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="courses" className="mt-0 border-none p-0 outline-none">
          <MyCoursesView onCourseSelect={setSelectedCourseId} />
        </TabsContent>

        <TabsContent value="individual" className="mt-0 border-none p-0 outline-none">
          <LessonTimelineView onLessonSelect={open} />
        </TabsContent>
      </Tabs>

      {selectedLessonId && (
        <LessonDetailModal
          lessonId={selectedLessonId}
          open={isOpen}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
