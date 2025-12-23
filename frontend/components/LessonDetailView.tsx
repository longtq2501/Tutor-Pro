/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { lessonsApi } from '@/lib/api';
import { Lesson } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar, User, X, CheckCircle2, XCircle,
  BookOpen, FileText, Image as ImageIcon, Eye, Maximize2, Minimize2
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface LessonDetailViewProps {
  lessonId: number;
  onClose?: () => void;
  isAdminPreview?: boolean; // ✅ NEW: For admin preview mode
}

export default function LessonDetailView({ lessonId, onClose, isAdminPreview = false }: LessonDetailViewProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    setLoading(true);
    try {
      const data = await lessonsApi.getById(lessonId);
      setLesson(data);
    } catch (error: any) {
      console.error('Failed to load lesson:', error);
      toast.error('Không thể tải bài học');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number, decimals = 1) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleToggleComplete = async () => {
    if (!lesson || isAdminPreview) return; // ✅ Disable for admin preview

    setMarkingComplete(true);
    try {
      const updatedLesson = lesson.isCompleted
        ? await lessonsApi.markIncomplete(lessonId)
        : await lessonsApi.markCompleted(lessonId);

      setLesson(updatedLesson);
      toast.success(
        updatedLesson.isCompleted 
          ? '✅ Đã đánh dấu hoàn thành!' 
          : '❌ Đã bỏ đánh dấu hoàn thành'
      );
    } catch (error: any) {
      console.error('Failed to toggle completion:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <BookOpen className="h-12 w-12 mb-4" />
        <p>Không tìm thấy bài học</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* ✅ HEADER - Compact & Fixed */}
      <div className="flex-none px-4 md:px-6 py-3 md:py-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3 md:gap-4">
          {/* Title & Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground line-clamp-2">
                {lesson.title}
              </h1>
              {/* ✅ Admin Preview Badge */}
              {isAdminPreview && (
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{lesson.tutorName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{format(new Date(lesson.lessonDate), 'dd/MM/yyyy', { locale: vi })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{lesson.viewCount} lượt xem</span>
              </div>
            </div>

            {/* Summary - Compact */}
            {lesson.summary && (
              <div className="mt-2 bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 line-clamp-2">{lesson.summary}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            {!isAdminPreview && (
              <Button
                onClick={handleToggleComplete}
                disabled={markingComplete}
                size="sm"
                variant={lesson.isCompleted ? "default" : "outline"}
                className={lesson.isCompleted ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              >
                {lesson.isCompleted ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 md:mr-1.5" />
                    <span className="hidden sm:inline">Đã Hiểu</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 md:mr-1.5" />
                    <span className="hidden sm:inline">Đánh Dấu</span>
                  </>
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden lg:flex"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ✅ MAIN CONTENT - Side by Side Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row">
          
          {/* ========== LEFT SIDE: Video & Images (60%) ========== */}
          <div className="w-full lg:w-[60%] h-1/2 lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-border bg-background">
            <div className="p-3 md:p-4 space-y-3 md:space-y-4">
              
              {/* Video Player */}
              {lesson.videoUrl && (
                <div className="lg:sticky lg:top-0 z-10 bg-background pb-2">
                  <Card className="bg-card border-border overflow-hidden shadow-sm">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-black">
                        <video
                          src={lesson.videoUrl}
                          controls
                          preload="metadata" // Thêm dòng này
                          controlsList="nodownload"
                          className="w-full h-full object-contain"
                          poster={lesson.thumbnailUrl}
                        >
                          Trình duyệt của bạn không hỗ trợ phát video.
                        </video>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Images Grid */}
              {lesson.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2 md:mb-3 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Hình Ảnh ({lesson.images.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {lesson.images.map(image => (
                      <Card key={image.id} className="bg-card border-border overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative aspect-video bg-muted">
                            <Image
                              src={image.imageUrl}
                              alt={image.caption || 'Lesson image'}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          {image.caption && (
                            <div className="p-2 bg-muted/30 border-t border-border">
                              <p className="text-xs text-muted-foreground text-center">{image.caption}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Completion Status */}
              {!isAdminPreview && lesson.isCompleted && lesson.completedAt && (
                <Card className="bg-green-500/5 dark:bg-green-500/10 border-green-500/20 dark:border-green-500/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground">Đã hoàn thành bài học!</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(lesson.completedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* ========== RIGHT SIDE: Content & Resources (40%) ========== */}
          <div className="w-full lg:w-[40%] h-1/2 lg:h-full overflow-hidden bg-background">
            <Tabs defaultValue="content" className="h-full flex flex-col">
              
              {/* Tab Headers */}
              <div className="flex-none px-3 md:px-4 pt-3 md:pt-4 pb-2 border-b border-border bg-background">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                  <TabsTrigger 
                    value="content" 
                    className="
                      text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                      data-[state=inactive]:text-foreground/70 hover:text-foreground
                    "
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                    Lý Thuyết
                  </TabsTrigger>
                  <TabsTrigger 
                    value="resources"
                    className="
                      text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                      data-[state=inactive]:text-foreground/70 hover:text-foreground
                    "
                  >
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Tài Liệu ({lesson.resources.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* ✅ Content Tab - FIXED for Light/Dark Mode */}
              <TabsContent value="content" className="flex-1 overflow-hidden mt-0 px-3 md:px-4 pb-3 md:pb-4 data-[state=inactive]:hidden">
                <ScrollArea className="h-full pr-2 md:pr-3">
                  <article className="
                    prose prose-sm md:prose-base max-w-none
                    
                    /* ✅ Core theme colors */
                    prose-headings:text-foreground prose-headings:font-semibold prose-headings:scroll-mt-20
                    prose-p:text-foreground/90 prose-p:leading-relaxed
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-em:text-foreground/80 prose-em:italic
                    
                    /* ✅ Links */
                    prose-a:text-primary prose-a:font-medium prose-a:no-underline 
                    hover:prose-a:underline hover:prose-a:text-primary/80
                    
                    /* ✅ Code blocks */
                    prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 
                    prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-muted/50 prose-pre:text-foreground prose-pre:border prose-pre:border-border 
                    prose-pre:shadow-sm prose-pre:overflow-x-auto
                    
                    /* ✅ Blockquotes */
                    prose-blockquote:border-l-4 prose-blockquote:border-l-primary 
                    prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4
                    prose-blockquote:text-foreground/80 prose-blockquote:italic prose-blockquote:not-italic
                    prose-blockquote:my-4
                    
                    /* ✅ Lists */
                    prose-ul:text-foreground/90 prose-ul:list-disc prose-ul:pl-6
                    prose-ol:text-foreground/90 prose-ol:list-decimal prose-ol:pl-6
                    prose-li:text-foreground/90 prose-li:my-1
                    prose-li:marker:text-primary prose-li:marker:font-medium
                    
                    /* ✅ Horizontal rules */
                    prose-hr:border-border prose-hr:my-6
                    
                    /* ✅ Tables */
                    prose-table:text-foreground/90 prose-table:border-collapse prose-table:w-full
                    prose-thead:border-b-2 prose-thead:border-border
                    prose-th:text-foreground prose-th:font-semibold prose-th:text-left prose-th:p-2
                    prose-td:text-foreground/90 prose-td:border-t prose-td:border-border prose-td:p-2
                    prose-tr:border-b prose-tr:border-border
                    
                    /* ✅ Images in markdown */
                    prose-img:rounded-lg prose-img:shadow-md prose-img:my-4
                    
                    /* ✅ Dark mode variant */
                    dark:prose-invert
                  ">
                    <ReactMarkdown>
                      {lesson.content || '# Chưa có nội dung\n\nBài học này chưa có nội dung lý thuyết.'}
                    </ReactMarkdown>
                  </article>
                </ScrollArea>
              </TabsContent>

              {/* ✅ Resources Tab - Scrollable */}
              <TabsContent value="resources" className="flex-1 overflow-hidden mt-0 px-3 md:px-4 pb-3 md:pb-4 data-[state=inactive]:hidden">
                <ScrollArea className="h-full pr-2 md:pr-3">
                  {lesson.resources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                      <FileText className="h-10 w-10 mb-3 opacity-50" />
                      <p className="text-sm">Chưa có tài liệu nào</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {lesson.resources.map(resource => (
                        <a
                          key={resource.id}
                          href={resource.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <Card className="
                            bg-card border-border 
                            hover:border-primary/50 hover:shadow-sm 
                            dark:hover:bg-card/80
                            transition-all duration-200
                          ">
                            <CardContent className="flex items-start gap-3 p-3">
                              <div className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                                // Sử dụng toUpperCase() để chắc chắn khớp với Enum Backend
                                resource.resourceType?.toUpperCase() === 'PDF' ? 
                                  'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 group-hover:bg-red-500/20' :
                                resource.resourceType?.toUpperCase() === 'LINK' ? 
                                  'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 group-hover:bg-blue-500/20' :
                                resource.resourceType?.toUpperCase() === 'VIDEO' ? 
                                  'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 group-hover:bg-purple-500/20' :
                                  'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 group-hover:bg-green-500/20'
                              }`}>
                                <FileText className="h-4 w-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                  {resource.title}
                                </h4>
                                {/* ... description ... */}
                                <div className="flex items-center gap-2 mt-1.5">
                                  <Badge variant="secondary" className="text-[10px] font-normal uppercase">
                                    {resource.resourceType}
                                  </Badge>
                                  {/* Ưu tiên dùng formattedFileSize từ API, nếu không có thì tự tính từ fileSize */}
                                  {(resource.formattedFileSize || resource.fileSize) && (
                                    <span className="text-xs text-muted-foreground">
                                      {resource.formattedFileSize ? (
                                          <span>{resource.formattedFileSize}</span>
                                        ) : resource.fileSize ? (
                                          <span>{formatBytes(resource.fileSize)}</span>
                                        ) : null}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

        </div>
      </div>
    </div>
  );
}