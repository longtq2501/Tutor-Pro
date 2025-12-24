// 📁 lesson-timeline-view/components/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import type { LessonStats } from '@/lib/types';

interface StatsCardsProps {
  stats: LessonStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2A2A2A]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Tổng Bài Học
          </CardTitle>
          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalLessons}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2A2A2A]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Đã Hiểu
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.completedLessons}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2A2A2A]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Đang Học
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.inProgressLessons}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2A2A2A]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Tỷ Lệ Hoàn Thành
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.completionRate}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}