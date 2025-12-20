'use client';

import React, { useState, useEffect } from 'react';
import { homeworkApi} from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Clock, AlertCircle, CheckCircle2, 
  TrendingUp, FileText, Calendar, Award
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Homework, HomeworkStats } from '@/lib/types';
import HomeworkDetailDialog from './HomeworkDetailDialog';

export default function StudentHomeworkView() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [stats, setStats] = useState<HomeworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load stats
      const statsData = await homeworkApi.student.getStats();
      setStats(statsData);

      // Load homeworks based on selected tab
      let homeworkData: Homework[];
      switch (selectedTab) {
        case 'upcoming':
          homeworkData = await homeworkApi.student.getUpcoming(7);
          break;
        case 'overdue':
          homeworkData = await homeworkApi.student.getOverdue();
          break;
        case 'completed':
          const submitted = await homeworkApi.student.getByStatus('SUBMITTED');
          const graded = await homeworkApi.student.getByStatus('GRADED');
          homeworkData = [...submitted, ...graded];
          break;
        default:
          homeworkData = await homeworkApi.student.getAll();
      }

      setHomeworks(homeworkData);
    } catch (error) {
      console.error('Failed to load homeworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      ASSIGNED: { variant: 'default', label: 'Đã giao' },
      IN_PROGRESS: { variant: 'secondary', label: 'Đang làm' },
      SUBMITTED: { variant: 'outline', label: 'Đã nộp' },
      GRADED: { variant: 'default', label: 'Đã chấm' },
      OVERDUE: { variant: 'destructive', label: 'Quá hạn' },
    };
    const config = variants[status] || variants.ASSIGNED;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'MEDIUM': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'LOW': return <FileText className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng bài tập</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHomeworks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sắp đến hạn</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.upcomingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdueCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.averageScore > 0 ? stats.averageScore.toFixed(1) : '-'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({stats?.totalHomeworks || 0})</TabsTrigger>
          <TabsTrigger value="upcoming">Sắp đến hạn ({stats?.upcomingCount || 0})</TabsTrigger>
          <TabsTrigger value="overdue">Quá hạn ({stats?.overdueCount || 0})</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành ({stats?.gradedCount || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {homeworks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Không có bài tập nào</p>
              </CardContent>
            </Card>
          ) : (
            homeworks.map((homework) => (
              <Card
                key={homework.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedHomework(homework)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getPriorityIcon(homework.priority)}
                        <CardTitle className="text-lg">{homework.title}</CardTitle>
                        {getStatusBadge(homework.status)}
                      </div>
                      {homework.description && (
                        <CardDescription className="line-clamp-2">
                          {homework.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Hạn nộp: {format(new Date(homework.dueDate), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                    </div>

                    {homework.daysUntilDue !== undefined && homework.daysUntilDue >= 0 && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Clock className="h-4 w-4" />
                        <span>Còn {homework.daysUntilDue} ngày</span>
                      </div>
                    )}

                    {homework.isOverdue && (
                      <div className="flex items-center gap-1 text-red-600 font-medium">
                        <AlertCircle className="h-4 w-4" />
                        <span>Đã quá hạn</span>
                      </div>
                    )}

                    {homework.score !== undefined && (
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Điểm: {homework.score}/100</span>
                      </div>
                    )}
                  </div>

                  {homework.attachmentUrls.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{homework.attachmentUrls.length} tệp đính kèm</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      {selectedHomework && (
        <HomeworkDetailDialog
          homework={selectedHomework}
          open={!!selectedHomework}
          onClose={() => setSelectedHomework(null)}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}