'use client';

import React, { useEffect, useState } from 'react';
import { lessonsApi } from '@/lib/api';
import type { Lesson } from '@/lib/types';
import { Calendar, CheckCircle, Eye, PlayCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LessonTimelineView() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    inProgressLessons: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonsData, statsData] = await Promise.all([
        lessonsApi.getAll(),
        lessonsApi.getStats()
      ]);
      setLessons(lessonsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    if (filter === 'completed') return lesson.isCompleted;
    if (filter === 'pending') return !lesson.isCompleted;
    return true;
  });

  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    const month = new Date(lesson.lessonDate).toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long' 
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Tổng bài học</div>
          <div className="text-2xl font-bold">{stats.totalLessons}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Đã hoàn thành</div>
          <div className="text-2xl font-bold text-green-600">{stats.completedLessons}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Đang học</div>
          <div className="text-2xl font-bold text-blue-600">{stats.inProgressLessons}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Tỷ lệ hoàn thành</div>
          <div className="text-2xl font-bold text-primary">{stats.completionRate.toFixed(0)}%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b pb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Tất cả ({lessons.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending' 
              ? 'bg-primary text-white' 
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Chưa hoàn thành ({stats.inProgressLessons})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed' 
              ? 'bg-primary text-white' 
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Đã hoàn thành ({stats.completedLessons})
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedLessons).map(([month, monthLessons]) => (
          <div key={month}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar size={20} />
              {month}
            </h2>
            <div className="space-y-4">
              {monthLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => router.push(`/bai-tap/lessons/${lesson.id}`)}
                  className="bg-card border rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    {lesson.thumbnailUrl ? (
                      <img 
                        src={lesson.thumbnailUrl} 
                        alt={lesson.title}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center">
                        <FileText size={32} className="text-muted-foreground" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Giáo viên: {lesson.tutorName}
                          </p>
                          {lesson.summary && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {lesson.summary}
                            </p>
                          )}
                        </div>
                        
                        {lesson.isCompleted && (
                          <div className="flex-shrink-0">
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm font-medium">
                              <CheckCircle size={16} />
                              Hoàn thành
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Meta info */}
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {new Date(lesson.lessonDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={16} />
                          {lesson.viewCount} lượt xem
                        </span>
                        {lesson.videoUrl && (
                          <span className="flex items-center gap-1 text-primary">
                            <PlayCircle size={16} />
                            Có video
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Không có bài học nào
        </div>
      )}
    </div>
  );
}