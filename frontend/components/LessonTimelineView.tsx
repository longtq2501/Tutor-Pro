/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { lessonsApi } from '@/lib/api';
import { Lesson, LessonStats } from '@/lib/types';
import LessonCard from './LessonCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, CheckCircle2, Clock, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LessonTimelineViewProps {
  onLessonSelect?: (lessonId: number) => void; // ✅ Optional callback for inline navigation
}

export default function LessonTimelineView({ onLessonSelect }: LessonTimelineViewProps) {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [stats, setStats] = useState<LessonStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [selectedYear, selectedMonth, lessons]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lessonsData, statsData] = await Promise.all([
        lessonsApi.getAll(),
        lessonsApi.getStats(),
      ]);
      setLessons(lessonsData);
      setStats(statsData);
    } catch (error: any) {
      console.error('Failed to load lessons:', error);
      toast.error('Không thể tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  const filterLessons = () => {
    let filtered = [...lessons];

    if (selectedYear !== 'all') {
      filtered = filtered.filter(lesson => {
        const year = new Date(lesson.lessonDate).getFullYear().toString();
        return year === selectedYear;
      });
    }

    if (selectedMonth !== 'all') {
      filtered = filtered.filter(lesson => {
        const month = (new Date(lesson.lessonDate).getMonth() + 1).toString();
        return month === selectedMonth;
      });
    }

    setFilteredLessons(filtered);
  };

  const handleLessonClick = (lessonId: number) => {
    if (onLessonSelect) {
      // Use callback for inline navigation
      onLessonSelect(lessonId);
    } else {
      // Fallback to route navigation (if you add separate pages later)
      router.push(`/bai-tap/lessons/${lessonId}`);
    }
  };

  // Get unique years and months from lessons
  const availableYears = Array.from(new Set(lessons.map(l => 
    new Date(l.lessonDate).getFullYear()
  ))).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📚 Kho Bài Giảng</h1>
          <p className="text-gray-400 mt-2">Xem lại và ôn tập các buổi học đã qua</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Tổng Bài Học</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalLessons}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Đã Hiểu</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completedLessons}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Đang Học</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.inProgressLessons}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Tỷ Lệ Hoàn Thành</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completionRate}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="h-5 w-5" />
            Bộ Lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32 bg-[#0A0A0A] border-[#2A2A2A]">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                  <SelectItem value="all">Tất cả năm</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-32 bg-[#0A0A0A] border-[#2A2A2A]">
                <SelectValue placeholder="Tháng" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                <SelectItem value="all">Tất cả tháng</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                  <SelectItem key={month} value={month.toString()}>Tháng {month}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedYear !== 'all' || selectedMonth !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedYear('all');
                  setSelectedMonth('all');
                }}
                className="bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]"
              >
                Xóa bộ lọc
              </Button>
            )}

            <div className="ml-auto text-sm text-gray-400">
              Hiển thị {filteredLessons.length} / {lessons.length} bài học
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Timeline */}
      {filteredLessons.length === 0 ? (
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400 text-center">Chưa có bài học nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLessons.map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => handleLessonClick(lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}