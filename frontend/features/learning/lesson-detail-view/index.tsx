'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookOpen, Info, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLessonDetail } from './hooks/useLessonDetail';
import { LessonHeader } from './components/LessonHeader';
import { LessonContentTab } from './components/LessonContentTab';
import { CompletionStatus } from './components/CompletionStatus';
import { useState, useEffect, useRef, useCallback } from 'react';

interface LessonDetailViewProps {
  lessonId: number;
  onClose?: () => void; // Optional callback to close modal
  isPreview?: boolean;
}

export default function LessonDetailView({ lessonId, onClose, isPreview = false }: LessonDetailViewProps) {
  const router = useRouter();
  const { lesson, loading, markingComplete, toggleComplete } = useLessonDetail(lessonId, isPreview);
  const [sidebarWidth, setSidebarWidth] = useState(45);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      window.requestAnimationFrame(() => {
        const container = containerRef.current?.getBoundingClientRect();
        if (container) {
          const newWidth = ((e.clientX - container.left) / container.width) * 100;
          if (newWidth > 20 && newWidth < 80) {
            setSidebarWidth(newWidth);
          }
        }
      });
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      // Ensure cursor stays consistent across the entire window
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resize, stopResizing]);

  // Handle back navigation - use onClose if provided, otherwise router.back()
  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col lg:flex-row h-full">
          <div className="w-full lg:w-[45%] border-b lg:border-b-0 lg:border-r border-border bg-background">
            <div className="p-6 space-y-6">
              <div className="h-10 w-3/4 bg-muted/60 rounded-md animate-pulse" />
              <div className="aspect-video bg-muted/60 rounded-xl animate-pulse" />
              <div className="h-32 bg-muted/60 rounded-xl animate-pulse" />
              <div className="h-12 w-full bg-muted/60 rounded-md animate-pulse" />
            </div>
          </div>
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
      <div className="w-full h-full flex flex-col items-center justify-center p-6">
        <div className="p-12 bg-muted/30 rounded-full mb-6">
          <BookOpen className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Không tìm thấy bài học</h2>
        <p className="text-muted-foreground mb-6">Bài học này có thể đã bị xóa hoặc không tồn tại.</p>
        <button onClick={handleBack} className="text-primary hover:underline">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-full lg:h-full flex flex-col lg:flex-row lg:overflow-hidden rounded-2xl shadow-2xl border border-border/20 bg-background"
      style={{ '--sidebar-width': `${sidebarWidth}%` } as React.CSSProperties}
    >
      <div
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row min-h-full lg:h-full lg:overflow-hidden relative"
      >

        {/* Left Column (Sidebar) - Stacks on mobile, side-by-side on desktop */}
        <div
          className="w-full lg:w-[var(--sidebar-width)] bg-background border-b lg:border-b-0 lg:border-r border-border
          lg:overflow-y-auto lg:flex-shrink-0
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-muted-foreground/10
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20"
          style={{ pointerEvents: isResizing ? 'none' : 'auto' }}
        >
          <div className="p-6 space-y-6">
            <LessonHeader
              lesson={lesson}
              markingComplete={markingComplete}
              onBack={handleBack}
              onToggleComplete={toggleComplete}
            />

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

            {lesson.isCompleted && lesson.completedAt && (
              <div className="transform hover:scale-[1.02] transition-transform duration-300">
                <CompletionStatus completedAt={lesson.completedAt} />
              </div>
            )}
          </div>
        </div>

        {/* Resizer Handle (Desktop Only) */}
        <div
          className={cn(
            "hidden lg:flex w-1.5 bg-border hover:bg-primary cursor-col-resize items-center justify-center transition-colors z-[100] -ml-[3px] select-none",
            isResizing && "bg-primary w-2 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
          )}
          onMouseDown={startResizing}
        >
          <div className="h-8 w-1 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Right Column (Reference Content) - FIXED STRUCTURE */}
        <div
          className="w-full lg:flex-1 flex flex-col bg-muted/40 dark:bg-background lg:overflow-hidden min-h-0 min-w-0"
          style={{ pointerEvents: isResizing ? 'none' : 'auto' }}
        >
          {/* Header - Fixed */}
          <div className="p-6 pb-4 flex-shrink-0 border-b border-border/10">
            <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
              <BookOpen className="h-5 w-5" />
              Nội Dung Bài Học
            </h2>
          </div>

          {/* Content - Scrollable on desktop, flows on mobile */}
          <div className="flex-1 lg:overflow-y-auto overflow-x-hidden px-6 pb-6 min-h-0">
            <div className="py-4">
              <LessonContentTab
                content={lesson.content || ''}
                className="w-full"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}