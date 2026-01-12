'use client';

import { useMemo } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, BookMarked, GraduationCap, Library } from 'lucide-react';
import { LessonLibraryTab } from './LessonLibraryTab';
import { CourseManagementTab } from '../../courses/components/CourseManagementTab';
import { motion } from 'framer-motion';
import { useLessonLibrary } from '../hooks/useLessonLibrary';
import { useAdminCourses } from '../../courses/hooks/useAdminCourses';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Motion animate */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60">
          Quản Lý Bài Giảng
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Nền tảng quản lý kho học liệu và xây dựng lộ trình học tập chuyên nghiệp cho giáo viên.
        </p>
      </motion.div>

      <Tabs defaultValue="library" className="w-full">
        <div className="border-b border-border/40 pb-px mb-8">
          <TabsList className="h-auto p-0 bg-transparent gap-8 overflow-x-auto no-scrollbar justify-start w-full">


            <TabsTrigger
              value="library"
              className="relative h-11 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <div className="flex items-center gap-2.5">
                <Library className="h-5 w-5" />
                <span>Kho học liệu</span>
                <Badge variant="secondary" className="ml-0.5 rounded-full px-2 py-0.5 text-xs font-medium">
                  {libraryLessonsCount}
                </Badge>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="courses"
              className="relative h-11 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-5 w-5" />
                <span>Khóa học</span>
                <Badge variant="secondary" className="ml-0.5 rounded-full px-2 py-0.5 text-xs font-medium">
                  {courses.length}
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >


          <TabsContent value="library" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <LessonLibraryTab />
          </TabsContent>

          <TabsContent value="courses" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <CourseManagementTab />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}

// Default export để dễ import
export default AdminLessonManager;