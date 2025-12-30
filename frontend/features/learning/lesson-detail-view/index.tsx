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
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [contentTheme, setContentTheme] = useState<'light' | 'dark'>('light');
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
      <div className="w-full h-full flex flex-col bg-background">
        <div className="h-16 border-b border-border/40 flex items-center px-6 gap-4">
          <div className="h-8 w-8 bg-muted animate-pulse rounded-lg" />
          <div className="h-6 w-48 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="w-full lg:w-[45%] border-b lg:border-b-0 lg:border-r border-border/40 p-6 space-y-6">
            <div className="aspect-video bg-muted/60 rounded-2xl animate-pulse" />
            <div className="space-y-3">
              <div className="h-8 w-3/4 bg-muted/60 rounded-lg animate-pulse" />
              <div className="h-4 w-1/2 bg-muted/60 rounded-md animate-pulse" />
            </div>
            <div className="h-32 bg-muted/60 rounded-2xl animate-pulse" />
          </div>
          <div className="flex-1 p-8 space-y-6 bg-muted/5">
            <div className="h-10 w-64 bg-muted/60 rounded-xl animate-pulse" />
            <div className="h-full bg-card rounded-2xl border animate-pulse" />
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
      className="w-full h-full flex flex-col lg:flex-row lg:overflow-hidden bg-background"
      style={{ '--sidebar-width': `${sidebarWidth}%` } as React.CSSProperties}
    >
      <div
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row h-full lg:overflow-hidden relative"
      >

        {/* Left Column (Main/Player Context) */}
        <div
          className="w-full lg:w-[var(--sidebar-width)] bg-background lg:overflow-y-auto lg:flex-shrink-0 scrollbar-premium"
          style={{ pointerEvents: isResizing ? 'none' : 'auto' }}
        >
          <div className="p-0">
            {/* Sticky Header inside left column */}
            <div className="bg-background border-b border-border/40 px-6 py-4">
              <LessonHeader
                lesson={lesson}
                markingComplete={markingComplete}
                onBack={handleBack}
                onToggleComplete={toggleComplete}
              />
            </div>

            <div className="flex-1 p-6 space-y-8">
              {/* Video Player Section */}
              {lesson.videoUrl ? (
                <div className="group relative rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
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
                <div className="aspect-video bg-muted/20 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-primary/20 group hover:border-primary/40 transition-colors">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-primary/40" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground">Không có video cho bài học này</p>
                  </div>
                </div>
              )}

              {/* Overview Card */}
              {lesson.summary && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-foreground font-bold text-lg">
                    <Info className="h-5 w-5 text-primary" />
                    <h3>Tổng quan bài học</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 text-sm md:text-base text-muted-foreground leading-relaxed shadow-inner">
                    {lesson.summary}
                  </div>
                </div>
              )}

              {lesson.isCompleted && lesson.completedAt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CompletionStatus completedAt={lesson.completedAt} />
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Resizer Handle */}
        <div
          className={cn(
            "hidden lg:flex w-1.5 bg-border/40 hover:bg-primary/40 cursor-col-resize items-center justify-center transition-all z-[100] -ml-[3px] group relative",
            isResizing && "bg-primary w-2 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
          )}
          onMouseDown={startResizing}
        >
          <div className="h-10 w-1 bg-muted-foreground/30 rounded-full group-hover:bg-primary transition-colors" />

          {/* Tooltip hint on hover */}
          <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 bg-popover text-popover-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            Kéo để đổi kích thước
          </div>
        </div>

        {/* Right Column (Reference Content) */}
        <div
          className={cn(
            "w-full lg:flex-1 flex flex-col lg:overflow-hidden transition-colors duration-500",
            contentTheme === 'light' ? "bg-white" : "bg-[#0A0A0A] dark:bg-[#050505]"
          )}
          style={{ pointerEvents: isResizing ? 'none' : 'auto' }}
        >
          {/* Tabs/Actions Header for content */}
          <div className={cn(
            "flex-shrink-0 px-4 pt-4 sm:px-8 sm:pt-8 pb-4 flex items-center justify-between border-b backdrop-blur-md lg:sticky lg:top-0 z-10",
            contentTheme === 'light' ? "bg-white/80 border-slate-200" : "bg-[#0A0A0A]/80 border-white/5"
          )}>
            <h2 className={cn(
              "text-xl font-bold flex items-center gap-3",
              contentTheme === 'light' ? "text-slate-900" : "text-white"
            )}>
              <BookOpen className="h-6 w-6 text-primary" />
              <span>Nội dung chi tiết</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setContentTheme(prev => prev === 'light' ? 'dark' : 'light')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                  contentTheme === 'light'
                    ? "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                )}
              >
                {contentTheme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Chế độ tối</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    <span>Chế độ sáng</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content Area - Truly Scrollable and Premium */}
          <div className="flex-1 lg:overflow-y-auto scrollbar-premium px-4 sm:px-8 pb-12">
            <div className="max-w-4xl mx-auto py-8">
              <LessonContentTab
                content={lesson.content || ''}
                className={cn(
                  "border-0 shadow-none bg-transparent",
                  contentTheme === 'dark' && "dark"
                )}
                forceTheme={contentTheme}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Add custom scrollbar styles to the file scope or a global CSS */}
      <style jsx global>{`
        .scrollbar-premium::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-premium::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-premium::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 20px;
        }
        .dark .scrollbar-premium::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
        .scrollbar-premium:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
        }
        .dark .scrollbar-premium:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}