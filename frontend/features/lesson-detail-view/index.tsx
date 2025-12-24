// 📁 lesson-detail-view/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
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
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">Không tìm thấy bài học</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <LessonHeader
        lesson={lesson}
        markingComplete={markingComplete}
        onBack={() => router.back()}
        onToggleComplete={toggleComplete}
      />

      {lesson.summary && (
        <Card className="bg-blue-600/10 border-blue-600/30">
          <CardContent className="pt-6">
            <p className="text-blue-200">{lesson.summary}</p>
          </CardContent>
        </Card>
      )}

      {lesson.videoUrl && (
        <VideoPlayer videoUrl={lesson.videoUrl} thumbnailUrl={lesson.thumbnailUrl} />
      )}

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="bg-[#1A1A1A] border border-[#2A2A2A]">
          <TabsTrigger value="content" className="data-[state=active]:bg-blue-600">
            <BookOpen className="h-4 w-4 mr-2" />
            Nội Dung Bài Học
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-purple-600">
            <ImageIcon className="h-4 w-4 mr-2" />
            Hình Ảnh ({lesson.images.length})
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-green-600">
            <FileText className="h-4 w-4 mr-2" />
            Tài Liệu ({lesson.resources.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
            <LessonContentTab content={lesson.content} />
        </TabsContent>

        <TabsContent value="images">
          <ImagesTab images={lesson.images} />
        </TabsContent>

        <TabsContent value="resources">
          <ResourcesTab resources={lesson.resources} />
        </TabsContent>
      </Tabs>

      {lesson.isCompleted && lesson.completedAt && (
        <CompletionStatus completedAt={lesson.completedAt} />
      )}
    </div>
  );
}