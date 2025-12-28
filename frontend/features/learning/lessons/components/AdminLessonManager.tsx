'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, BookMarked, GraduationCap } from 'lucide-react';
import { LessonLibraryTab } from './LessonLibraryTab';
import { AdminLessonsTab } from './AdminLessonsTab';
import { CourseManagementTab } from '../../courses/components/CourseManagementTab';

/**
 * Admin Lesson Manager - Main component for ADMIN/TUTOR
 * Quản lý bài giảng cho giáo viên
 * 
 * ⚠️ LƯU Ý: Component này khác với LessonViewWrapper dành cho STUDENT
 * - AdminLessonManager: ADMIN/TUTOR quản lý bài giảng (tạo, sửa, xóa, giao bài)
 * - LessonViewWrapper: STUDENT xem bài giảng (timeline, detail modal)
 */
export function AdminLessonManager() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Bài Giảng</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý kho học liệu và bài giảng đang dạy
        </p>
      </div>

      <Tabs defaultValue="teaching" className="w-full">
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="teaching" className="gap-2">
            <BookMarked className="h-4 w-4" />
            Bài giảng đang dạy
          </TabsTrigger>
          <TabsTrigger value="library" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Kho học liệu
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Khóa học
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teaching" className="mt-6">
          <AdminLessonsTab />
        </TabsContent>

        <TabsContent value="library" className="mt-6">
          <LessonLibraryTab />
        </TabsContent>
        <TabsContent value="courses" className="mt-6">
          <CourseManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Default export để dễ import
export default AdminLessonManager;