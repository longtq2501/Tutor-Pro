// 📁 lesson-detail-view/index.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, ImageIcon, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLessonDetail } from './hooks/useLessonDetail';
import { LessonHeader } from './components/LessonHeader';
import { VideoPlayer } from './components/VideoPlayer';
import { LessonContentTab } from './components/LessonContentTab';
import { ImagesTab } from './components/ImagesTab';
import { ResourcesTab } from './components/ResourcesTab';
import { CompletionStatus } from './components/CompletionStatus';

interface LessonDetailViewProps {
  lessonId: number;
}

export default function LessonDetailView({ lessonId }: LessonDetailViewProps) {
  const router = useRouter();
  const { lesson, loading, markingComplete, toggleComplete } = useLessonDetail(lessonId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Không tìm thấy bài học</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header - chỉ hiển thị trên mobile */}
      <div className="lg:hidden mb-6">
        <LessonHeader
          lesson={lesson}
          markingComplete={markingComplete}
          onBack={() => router.back()}
          onToggleComplete={toggleComplete}
        />
      </div>

      {/* Main Layout - Split Screen */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
        {/* Left Column - Video & Info */}
        <div className="lg:w-2/5 xl:w-2/5">
          {/* Header cho Desktop */}
          <div className="hidden lg:block mb-6">
            <LessonHeader
              lesson={lesson}
              markingComplete={markingComplete}
              onBack={() => router.back()}
              onToggleComplete={toggleComplete}
            />
          </div>

          {/* Video Player */}
          {lesson.videoUrl && (
            <div className="mb-6">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={lesson.videoUrl}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-contain"
                  poster={lesson.thumbnailUrl}
                >
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Bài giảng về {lesson.title}
              </p>
            </div>
          )}

          {/* Content Section - Summary và Completion Status */}
          <div className="space-y-6">
            {/* Summary Card */}
            {lesson.summary && (
              <Card className="bg-blue-50 dark:bg-blue-600/10 border-blue-200 dark:border-blue-600/30">
                <CardContent className="p-4">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">{lesson.summary}</p>
                </CardContent>
              </Card>
            )}

            {/* Completion Status */}
            {lesson.isCompleted && lesson.completedAt && (
              <CompletionStatus completedAt={lesson.completedAt} />
            )}
          </div>
        </div>

        {/* Right Column - Content Tabs với layout tối ưu */}
        <div className="lg:w-3/5 xl:w-3/5 flex flex-col h-full">
          {/* Tabs Container - không có padding/margin thừa */}
          <Tabs defaultValue="content" className="w-full h-full flex flex-col">
            {/* Tab Header - sát trên cùng */}
            <TabsList className="
              w-full 
              bg-gray-100 dark:bg-[#1A1A1A] 
              border border-gray-200 dark:border-[#2A2A2A]
              p-1
              h-auto
              rounded-md
              mb-4
              flex-shrink-0
            ">
              <TabsTrigger 
                value="content" 
                className="
                  flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600
                  dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white
                  py-3 px-4
                  rounded-md
                "
              >
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Nội Dung</span>
              </TabsTrigger>
              <TabsTrigger 
                value="images" 
                className="
                  flex-1 data-[state=active]:bg-white data-[state=active]:text-purple-600
                  dark:data-[state=active]:bg-purple-600 dark:data-[state=active]:text-white
                  py-3 px-4
                  rounded-md
                "
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                <span>Hình Ảnh ({lesson.images.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="
                  flex-1 data-[state=active]:bg-white data-[state=active]:text-green-600
                  dark:data-[state=active]:bg-green-600 dark:data-[state=active]:text-white
                  py-3 px-4
                  rounded-md
                "
              >
                <FileText className="h-4 w-4 mr-2" />
                <span>Tài Liệu ({lesson.resources.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content - chiếm toàn bộ không gian còn lại */}
            <div className="flex-1 min-h-0"> {/* Quan trọng: min-h-0 cho flex child */}
              <TabsContent value="content" className="h-full mt-0 p-0 border-0">
                <Card className="h-full">
                  <CardContent className="h-full p-0">
                    <div className="h-full">
                      <LessonContentTab content={lesson.content || ''} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="h-full mt-0 p-0 border-0">
                <Card className="h-full">
                  <CardContent className="h-full p-6">
                    <div className="h-full overflow-y-auto">
                      <ImagesTab images={lesson.images} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="h-full mt-0 p-0 border-0">
                <Card className="h-full">
                  <CardContent className="h-full p-6">
                    <div className="h-full overflow-y-auto">
                      <ResourcesTab resources={lesson.resources} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}