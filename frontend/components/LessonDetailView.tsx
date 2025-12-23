'use client';

import React, { useEffect, useState } from 'react';
import { lessonsApi } from '@/lib/api';
import type { Lesson } from '@/lib/types';
import { ArrowLeft, CheckCircle, Download, Eye, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface Props {
  lessonId: number;
}

export default function LessonDetailView({ lessonId }: Props) {
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const data = await lessonsApi.getById(lessonId);
      setLesson(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async () => {
    if (!lesson) return;
    try {
      setMarkingComplete(true);
      if (lesson.isCompleted) {
        await lessonsApi.markIncomplete(lessonId);
      } else {
        await lessonsApi.markCompleted(lessonId);
      }
      fetchLesson();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!lesson) {
    return <div className="text-center py-12">Không tìm thấy bài học</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold flex-1">{lesson.title}</h1>
        <button
          onClick={toggleComplete}
          disabled={markingComplete}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            lesson.isCompleted
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          <CheckCircle size={18} />
          {lesson.isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
        </button>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <User size={16} />
          {lesson.tutorName}
        </span>
        <span className="flex items-center gap-2">
          <Calendar size={16} />
          {new Date(lesson.lessonDate).toLocaleDateString('vi-VN')}
        </span>
        <span className="flex items-center gap-2">
          <Eye size={16} />
          {lesson.viewCount} lượt xem
        </span>
      </div>

      {/* Summary */}
      {lesson.summary && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm">{lesson.summary}</p>
        </div>
      )}

      {/* Video */}
      {lesson.videoUrl && (
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="aspect-video bg-black">
            <iframe
              src={lesson.videoUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}

      {/* Content */}
      {lesson.content && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Nội dung bài học</h2>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Images */}
      {lesson.images && lesson.images.length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Hình ảnh bài học</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.images.map((img, idx) => (
              <div key={idx} className="space-y-2">
                <img
                  src={img.imageUrl}
                  alt={img.caption || `Image ${idx + 1}`}
                  className="w-full rounded-lg border"
                />
                {img.caption && (
                  <p className="text-sm text-muted-foreground text-center">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Tài liệu tham khảo</h2>
          <div className="space-y-3">
            {lesson.resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors group"
              >
                <div>
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {resource.title}
                  </div>
                  {resource.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {resource.description}
                    </div>
                  )}
                  {resource.formattedFileSize && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {resource.formattedFileSize}
                    </div>
                  )}
                </div>
                <Download size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Completion Status */}
      {lesson.isCompleted && lesson.completedAt && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-100">
            <CheckCircle size={20} />
            <span className="font-medium">
              Bạn đã hoàn thành bài học này vào {new Date(lesson.completedAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}