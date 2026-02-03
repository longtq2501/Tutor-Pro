// 📁 lesson-view-wrapper/index.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Layers } from 'lucide-react';
import { useState } from 'react';
import CourseDetailView from '../courses/components/CourseDetailView';
import MyCoursesView from '../courses/components/MyCoursesView';
import LessonTimelineView from '../lesson-timeline-view';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { DashboardHeader } from '@/contexts/UIContext';

/**
 * Wrapper component that manages both Timeline and Detail views
 * For student view, now redirects to dedicated full-screen page
 */
export default function LessonViewWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('courses');

  // Handle lesson navigation
  const navigateToLesson = useCallback((lessonId: number, courseId?: number) => {
    const url = courseId
      ? `/learning/lessons/${lessonId}?courseId=${courseId}`
      : `/learning/lessons/${lessonId}`;
    router.push(url);
  }, [router]);

  // Logic to handle lessonId from URL (e.g., from Dashboard sessions list)
  useEffect(() => {
    const lessonIdParam = searchParams.get('lessonId');
    if (lessonIdParam) {
      const lessonId = parseInt(lessonIdParam);
      if (!isNaN(lessonId)) {
        navigateToLesson(lessonId);
      }
    }
  }, [searchParams, navigateToLesson]);

  if (selectedCourseId) {
    return (
      <div className="space-y-6">
        <CourseDetailView
          courseId={selectedCourseId}
          onBack={() => setSelectedCourseId(null)}
          onLessonSelect={(lessonId) => navigateToLesson(lessonId, selectedCourseId)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Bài Giảng"
        subtitle="Khám phá các khóa học và bài giảng dành riêng cho lộ trình của bạn"
      />
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
          <LessonTimelineView onLessonSelect={navigateToLesson} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
