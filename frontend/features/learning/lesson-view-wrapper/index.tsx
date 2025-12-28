// 📁 lesson-view-wrapper/index.tsx
'use client';

import { useState } from 'react';
import LessonTimelineView from '../lesson-timeline-view';
import { useLessonModal } from './hooks/useLessonModal';
import { LessonDetailModal } from './components/LessonDetailModal';
import MyCoursesView from '../courses/components/MyCoursesView';
import CourseDetailView from '../courses/components/CourseDetailView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Layers } from 'lucide-react';

/**
 * Wrapper component that manages both Timeline and Detail views
 * For inline navigation without separate routes
 */
export default function LessonViewWrapper() {
  const { selectedLessonId, isOpen, open, close } = useLessonModal();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('courses');

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
            onClose={close}
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
          onClose={close}
        />
      )}
    </div>
  );
}