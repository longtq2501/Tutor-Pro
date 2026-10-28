'use client';

import { useMemo } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { LessonLibraryTab } from './LessonLibraryTab';
import { CourseManagementTab } from '../../courses/components/CourseManagementTab';
import { useLessonLibrary } from '../hooks/useLessonLibrary';
import { useAdminCourses } from '../../courses/hooks/useAdminCourses';
import { DashboardHeader } from '@/contexts/UIContext';
import { LessonHeaderTabs } from './LessonHeaderTabs';

/**
 * Admin Lesson Manager - Main component for ADMIN/TUTOR
 * Quản lý bài giảng cho giáo viên
 */
export function AdminLessonManager() {
  const { data: lessonsData } = useLessonLibrary();
  const libraryLessonsCount = useMemo(() => {
    if (!lessonsData) return 0;
    if (Array.isArray(lessonsData)) return lessonsData.length;
    return lessonsData.totalElements ?? lessonsData.content?.length ?? 0;
  }, [lessonsData]);

  const { data: courses = [] } = useAdminCourses();

  return (
    <div className="flex flex-col h-full min-h-0">
      <Tabs defaultValue="library" className="flex flex-col flex-1 min-h-0">
        <DashboardHeader
          title="Quản Lý Bài Giảng"
          subtitle="Nền tảng quản lý kho học liệu và xây dựng lộ trình học tập chuyên nghiệp cho giáo viên."
          actions={
            <LessonHeaderTabs libraryCount={libraryLessonsCount} coursesCount={courses.length} />
          }
        />

        <div data-tour="lessons-content" className="flex-1 min-h-0 relative overflow-hidden">
          <TabsContent value="library" className="h-full mt-0 focus-visible:outline-none focus-visible:ring-0 overflow-y-auto">
            <div className="pt-3 pb-6 px-1">
              <LessonLibraryTab />
            </div>
          </TabsContent>

          <TabsContent value="courses" className="h-full mt-0 focus-visible:outline-none focus-visible:ring-0 overflow-y-auto">
            <div className="pt-3 pb-6 px-1">
              <CourseManagementTab />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default AdminLessonManager;
