'use client';

import React, { useState, useEffect } from 'react';
import { homeworkApi } from '@/lib/api';
import { studentsApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BookOpen, Plus, Users, TrendingUp, AlertCircle, Award
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Student, Homework, HomeworkStats } from '@/lib/types';
import CreateHomeworkDialog from './CreateHomeworkDialog';
import TutorHomeworkDetailDialog from './TutorHomeworkDetailDialog';

export default function TutorHomeworkView() {
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [stats, setStats] = useState<HomeworkStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadHomeworks();
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      const data = await studentsApi.getAll();
      setStudents(data.filter(s => s.active));
      if (data.length > 0) {
        setSelectedStudent(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Không thể tải danh sách học sinh');
    }
  };

  const loadHomeworks = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    try {
      const api = isAdmin ? homeworkApi.admin : homeworkApi.tutor;
      
      const [homeworkData, statsData] = await Promise.all([
        api.getStudentHomeworks(selectedStudent),
        api.getStudentStats(selectedStudent),
      ]);

      setHomeworks(homeworkData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load homeworks:', error);
      toast.error('Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    loadHomeworks();
    toast.success('Tạo bài tập thành công!');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài tập này?')) return;

    try {
      const api = isAdmin ? homeworkApi.admin : homeworkApi.tutor;
      await api.delete(id);
      toast.success('Xóa bài tập thành công!');
      loadHomeworks();
    } catch (error) {
      console.error('Failed to delete homework:', error);
      toast.error('Không thể xóa bài tập');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      ASSIGNED: { variant: 'default', label: 'Đã giao' },
      IN_PROGRESS: { variant: 'secondary', label: 'Đang làm' },
      SUBMITTED: { variant: 'outline', label: 'Chờ chấm' },
      GRADED: { variant: 'default', label: 'Đã chấm' },
      OVERDUE: { variant: 'destructive', label: 'Quá hạn' },
    };
    const config = variants[status] || variants.ASSIGNED;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={selectedStudent?.toString()}
            onValueChange={(value) => setSelectedStudent(Number(value))}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Chọn học sinh" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo bài tập mới
        </Button>
      </div>

      {/* Stats */}
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
              <CardTitle className="text-sm font-medium">Chờ chấm</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.submittedCount}</div>
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

      {/* Homework List */}
      <div className="space-y-4">
        {homeworks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có bài tập nào</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo bài tập đầu tiên
              </Button>
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
                      <CardTitle className="text-lg">{homework.title}</CardTitle>
                      {getStatusBadge(homework.status)}
                      {homework.priority === 'HIGH' && (
                        <Badge variant="destructive">Ưu tiên cao</Badge>
                      )}
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
                  <span>Hạn: {new Date(homework.dueDate).toLocaleDateString('vi-VN')}</span>
                  
                  {homework.status === 'SUBMITTED' && (
                    <Badge variant="outline" className="text-yellow-600">
                      Cần chấm điểm
                    </Badge>
                  )}
                  
                  {homework.score !== undefined && (
                    <span className="text-green-600 font-medium">
                      Điểm: {homework.score}/100
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      {selectedStudent && (
        <CreateHomeworkDialog
          studentId={selectedStudent}
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {selectedHomework && (
        <TutorHomeworkDetailDialog
          homework={selectedHomework}
          open={!!selectedHomework}
          onClose={() => setSelectedHomework(null)}
          onUpdate={loadHomeworks}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}