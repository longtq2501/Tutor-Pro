'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, PlayCircle, CheckCircle2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Lesson } from '@/lib/types';
import Image from 'next/image';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

export default function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <Card
      className="
        group cursor-pointer transition-all duration-300 
        hover:shadow-xl hover:scale-[1.02] 
        bg-card border-border
        hover:border-primary/50
        overflow-hidden
      "
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail Section */}
        <div className="relative w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0">
          {lesson.thumbnailUrl ? (
            <Image
              src={lesson.thumbnailUrl}
              alt={lesson.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 192px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="h-16 w-16 text-primary/30" />
            </div>
          )}
          
          {/* Video Badge */}
          {lesson.videoUrl && (
            <div className="absolute top-2 right-2 bg-background/80 dark:bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 border border-border">
              <PlayCircle className="h-3 w-3 text-primary" />
              <span className="text-xs text-foreground font-medium">Video</span>
            </div>
          )}

          {/* Completed Badge */}
          {lesson.isCompleted && (
            <div className="absolute bottom-2 right-2 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-white" />
              <span className="text-xs text-white font-medium">Đã hiểu</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="
                  text-xl text-foreground
                  group-hover:text-primary 
                  transition-colors line-clamp-2
                ">
                  {lesson.title}
                </CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                  {lesson.tutorName}
                </CardDescription>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(lesson.lessonDate), 'dd/MM/yyyy', { locale: vi })}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{lesson.viewCount} lượt xem</span>
              </div>

              {lesson.lastViewedAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Xem {format(new Date(lesson.lastViewedAt), 'dd/MM HH:mm', { locale: vi })}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {/* Summary */}
            {lesson.summary && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {lesson.summary}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {lesson.images.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                >
                  {lesson.images.length} ảnh bảng
                </Badge>
              )}
              {lesson.resources.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                >
                  {lesson.resources.length} tài liệu
                </Badge>
              )}
            </div>
          </CardContent>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-lg pointer-events-none transition-colors" />
    </Card>
  );
}