/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { lessonsApi } from '@/lib/api';
import { Lesson } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar, User, ArrowLeft, CheckCircle2, XCircle,
  BookOpen, FileText, Image as ImageIcon, Video, Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// ✅ Removed ReactPlayer - using native video tag instead
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface LessonDetailViewProps {
  lessonId: number;
}

export default function LessonDetailView({ lessonId }: LessonDetailViewProps) {
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

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

  const handleToggleComplete = async () => {
    if (!lesson) return;

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
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 hover:bg-[#2A2A2A]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{lesson.tutorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(lesson.lessonDate), 'dd MMMM yyyy', { locale: vi })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{lesson.viewCount} lượt xem</span>
            </div>
          </div>
        </div>

        {/* Completion Toggle */}
        <Button
          onClick={handleToggleComplete}
          disabled={markingComplete}
          className={
            lesson.isCompleted
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }
        >
          {lesson.isCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Đã Hiểu Bài
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 mr-2" />
              Đánh Dấu Đã Hiểu
            </>
          )}
        </Button>
      </div>

      {/* Summary */}
      {lesson.summary && (
        <Card className="bg-blue-600/10 border-blue-600/30">
          <CardContent className="pt-6">
            <p className="text-blue-200">{lesson.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Video Player */}
      {lesson.videoUrl && (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Video className="h-5 w-5 text-blue-400" />
              Video Bài Giảng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video bg-black">
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
          </CardContent>
        </Card>
      )}

      {/* Tabs: Content, Images, Resources */}
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

        {/* Content Tab */}
        <TabsContent value="content">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardContent className="pt-6">
              <ScrollArea className="h-[600px] pr-4">
                <div className="prose prose-invert prose-blue max-w-none">
                  <ReactMarkdown>{lesson.content}</ReactMarkdown>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardContent className="pt-6">
              {lesson.images.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <p>Chưa có hình ảnh nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.images.map(image => (
                    <div key={image.id} className="space-y-2">
                      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                        <Image
                          src={image.imageUrl}
                          alt={image.caption || 'Lesson image'}
                          fill
                          className="object-contain"
                        />
                      </div>
                      {image.caption && (
                        <p className="text-sm text-gray-400 text-center">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardContent className="pt-6">
              {lesson.resources.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <p>Chưa có tài liệu nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lesson.resources.map(resource => (
                    <a
                      key={resource.id}
                      href={resource.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Card className="bg-[#0A0A0A] border-[#2A2A2A] hover:border-blue-500/50 transition-colors cursor-pointer">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className={`p-3 rounded-lg ${
                            resource.resourceType === 'PDF' ? 'bg-red-600/20' :
                            resource.resourceType === 'LINK' ? 'bg-blue-600/20' :
                            resource.resourceType === 'VIDEO' ? 'bg-purple-600/20' :
                            'bg-green-600/20'
                          }`}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white">{resource.title}</h4>
                            {resource.description && (
                              <p className="text-sm text-gray-400 line-clamp-1">{resource.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {resource.resourceType}
                              </Badge>
                              {resource.fileSize && (
                                <span className="text-xs text-gray-500">{resource.formattedFileSize}</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Completion Status Card */}
      {lesson.isCompleted && lesson.completedAt && (
        <Card className="bg-green-600/10 border-green-600/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-green-200 font-medium">Bạn đã hoàn thành bài học này!</p>
                <p className="text-sm text-green-300/70">
                  Hoàn thành lúc: {format(new Date(lesson.completedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}