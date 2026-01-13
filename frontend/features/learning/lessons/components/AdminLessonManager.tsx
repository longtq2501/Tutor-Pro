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
    // Responsive Layout: 
    // - Desktop (lg): Fixed height (screen - header), no window scroll
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:overflow-hidden">

      {/* Header: Padding reduced for compact desktop view */}
      <div className="flex-none p-4 lg:px-6 lg:py-3 space-y-2 lg:space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60">
            Quản Lý Bài Giảng
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed line-clamp-1 lg:line-clamp-none">
            Nền tảng quản lý kho học liệu và xây dựng lộ trình học tập chuyên nghiệp cho giáo viên.
          </p>
        </motion.div>
      </div>

      <Tabs defaultValue="library" className="flex flex-col flex-1 min-h-0">
        <div className="flex-none px-4 sm:px-6 lg:px-8 border-b border-border/40">
          <TabsList className="h-auto p-0 bg-transparent gap-6 lg:gap-8 overflow-x-auto no-scrollbar justify-start w-full">
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

        <div className="flex-1 lg:overflow-hidden relative">
          <TabsContent value="library" className="h-full mt-0 focus-visible:outline-none focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full lg:overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6"
            >
              <LessonLibraryTab />
            </motion.div>
          </TabsContent>

          <TabsContent value="courses" className="h-full mt-0 focus-visible:outline-none focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full lg:overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6"
            >
              <CourseManagementTab />
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Default export để dễ import
export default AdminLessonManager;