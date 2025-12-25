'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Info, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLessonDetail } from './hooks/useLessonDetail';
import { LessonHeader } from './components/LessonHeader';
import { LessonContentTab } from './components/LessonContentTab';
import { CompletionStatus } from './components/CompletionStatus';
import { useState } from 'react';

interface LessonDetailViewProps {
  lessonId: number;
}

export default function LessonDetailView({ lessonId }: LessonDetailViewProps) {
  const router = useRouter();
  const { lesson, loading, markingComplete, toggleComplete } = useLessonDetail(lessonId);
  const [sidebarWidth, setSidebarWidth] = useState(45);
  const [isResizing, setIsResizing] = useState(false);

  // Loading Skeleton - Matches Responsive Layout
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col lg:flex-row h-full">
          {/* Skeleton Sidebar (100% on mobile, 45% on desktop) */}
          <div className="w-full lg:w-[45%] border-b lg:border-b-0 lg:border-r border-border bg-background">
            <div className="p-6 space-y-6">
              <div className="h-10 w-3/4 bg-muted/60 rounded-md animate-pulse" />
              <div className="aspect-video bg-muted/60 rounded-xl animate-pulse" />
              <div className="h-32 bg-muted/60 rounded-xl animate-pulse" />
              <div className="h-12 w-full bg-muted/60 rounded-md animate-pulse" />
            </div>
          </div>

          {/* Skeleton Content (Hidden on mobile initially or stacked? Let's stack) */}
          <div className="flex-1 bg-background p-6 space-y-4">
            <div className="h-8 w-48 bg-muted/60 rounded-md animate-pulse" />
            <div className="h-full bg-card rounded-xl border border-input shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="p-12 bg-muted/30 rounded-full mb-6">
          <BookOpen className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Không tìm thấy bài học</h2>
        <p className="text-muted-foreground mb-6">Bài học này có thể đã bị xóa hoặc không tồn tại.</p>
        <button onClick={() => router.back()} className="text-primary hover:underline">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ '--sidebar-width': `${sidebarWidth}%` } as React.CSSProperties}>
      <div
        className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden scroll-smooth"
        onMouseMove={(e) => {
          if (isResizing) {
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 20 && newWidth < 80) {
              setSidebarWidth(newWidth);
            }
          }
        }}
        onMouseUp={() => setIsResizing(false)}
        onMouseLeave={() => setIsResizing(false)}
      >

        {/* Left Column (Sidebar) */}
        <div
          className="w-full lg:w-[var(--sidebar-width)] h-auto lg:h-[calc(100vh)] lg:overflow-y-auto bg-background border-b lg:border-b-0 lg:border-r border-border shrink-0
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-muted-foreground/10
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20"
        >
          <div className="p-6 space-y-6">
            {/* Header in Sidebar */}
            <LessonHeader
              lesson={lesson}
              markingComplete={markingComplete}
              onBack={() => router.back()}
              onToggleComplete={toggleComplete}
            />

            {/* Video Player Section */}
            {lesson.videoUrl ? (
              <div className="group relative rounded-xl overflow-hidden bg-black shadow-lg ring-1 ring-white/10">
                <div className="aspect-video">
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
              </div>
            ) : (
              <div className="aspect-video bg-muted/30 rounded-xl flex items-center justify-center border-2 border-dashed border-muted">
                <div className="text-center text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Không có video cho bài học này</p>
                </div>
              </div>
            )}

            {/* Lesson Summary */}
            {lesson.summary && (
              <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Info className="h-4 w-4" />
                    <h3 className="text-sm uppercase tracking-wide">Tổng quan</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lesson.summary}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Completion Status */}
            {lesson.isCompleted && lesson.completedAt && (
              <div className="transform hover:scale-[1.02] transition-transform duration-300">
                <CompletionStatus completedAt={lesson.completedAt} />
              </div>
            )}
          </div>
        </div>

        {/* Resizer Handle (Desktop Only) */}
        <div
          className="hidden lg:flex w-1 bg-border hover:bg-primary cursor-col-resize items-center justify-center transition-colors z-50 hover:w-1.5 -ml-[2px]"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        >
          <div className="h-8 w-1 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Right Column (Reference Content) */}
        <div
          className="flex-1 h-auto lg:h-[calc(100vh)] lg:overflow-y-auto bg-muted/40 dark:bg-background
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-muted-foreground/10
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20"
        >
          <div className="p-6 pb-8 min-h-0 lg:min-h-full flex flex-col relative">
            <div className="sticky top-0 z-20 -mx-6 px-6 py-4 bg-muted/40 dark:bg-background/95 backdrop-blur-md mb-4 border-b border-border/10 lg:static lg:bg-transparent lg:p-0 lg:m-0 lg:border-none">
              <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
                <BookOpen className="h-5 w-5" />
                Nội Dung Bài Học
              </h2>
            </div>
            <LessonContentTab
              content={lesson.content || ''}
              className="w-full h-auto lg:flex-1 bg-card rounded-xl border border-input shadow-sm active:shadow-md transition-shadow"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
