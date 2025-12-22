/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, MoreHorizontal, FileText, CheckCircle, XCircle, Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from "sonner";
import CreateLessonForm from './CreateLessonForm';
import EditLessonForm from './EditLessonForm';
import { adminLessonsApi } from '@/lib/api';

interface Lesson {
  id: number;
  title: string;
  studentName: string;
  tutorName: string;
  lessonDate: string;
  isPublished: boolean;
  isCompleted: boolean;
  viewCount: number;
  createdAt: string;
}

type ViewMode = 'list' | 'create' | 'edit';

export default function AdminLessonManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; lessonId: number | null }>({
    open: false,
    lessonId: null,
  });

  useEffect(() => {
    if (viewMode === 'list') {
      fetchLessons();
    }
  }, [viewMode]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await adminLessonsApi.getAll();
      setLessons(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Không thể tải danh sách bài giảng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.lessonId) return;

    try {
      await adminLessonsApi.delete(deleteDialog.lessonId);
      setLessons(lessons.filter((l) => l.id !== deleteDialog.lessonId));
      setDeleteDialog({ open: false, lessonId: null });
      toast.success('Đã xóa bài giảng thành công');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Không thể xóa bài giảng');
    }
  };

  const togglePublish = async (lessonId: number) => {
    try {
      const updated = await adminLessonsApi.togglePublish(lessonId);
      setLessons(
        lessons.map((l) => (l.id === lessonId ? { ...l, isPublished: updated.isPublished } : l))
      );
      toast.success(updated.isPublished ? 'Đã xuất bản bài giảng' : 'Đã hủy xuất bản');
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Không thể thay đổi trạng thái');
    }
  };

  const handleCreateSuccess = () => {
    setViewMode('list');
    fetchLessons();
  };

  const handleEditSuccess = () => {
    setViewMode('list');
    setEditingLessonId(null);
    fetchLessons();
  };

  const handleEdit = (lessonId: number) => {
    setEditingLessonId(lessonId);
    setViewMode('edit');
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.studentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'published' && lesson.isPublished) ||
      (filterStatus === 'draft' && !lesson.isPublished);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: lessons.length,
    published: lessons.filter((l) => l.isPublished).length,
    draft: lessons.filter((l) => !l.isPublished).length,
    completed: lessons.filter((l) => l.isCompleted).length,
  };

  // Show create form
  if (viewMode === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tạo Bài Giảng Mới</h2>
            <p className="text-muted-foreground mt-1">Tạo nội dung học tập cho học sinh</p>
          </div>
        </div>
        <CreateLessonForm onSuccess={handleCreateSuccess} onCancel={() => setViewMode('list')} />
      </div>
    );
  }

  // Show edit form
  if (viewMode === 'edit' && editingLessonId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Chỉnh Sửa Bài Giảng</h2>
            <p className="text-muted-foreground mt-1">Cập nhật nội dung bài giảng</p>
          </div>
        </div>
        <EditLessonForm
          lessonId={editingLessonId}
          onSuccess={handleEditSuccess}
          onCancel={() => setViewMode('list')}
        />
      </div>
    );
  }

  // Show list view (default)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản Lý Bài Giảng</h2>
          <p className="text-muted-foreground mt-1">Tạo và quản lý nội dung học tập cho học sinh</p>
        </div>
        <Button
          onClick={() => setViewMode('create')}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo Bài Giảng
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Bài Giảng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã Xuất Bản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.published}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bản Nháp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.draft}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã Hoàn Thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc tên học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
              <TabsList>
                <TabsTrigger value="all">Tất Cả</TabsTrigger>
                <TabsTrigger value="published">Đã Xuất Bản</TabsTrigger>
                <TabsTrigger value="draft">Bản Nháp</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có bài giảng nào</p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu Đề</TableHead>
                    <TableHead>Học Sinh</TableHead>
                    <TableHead>Giáo Viên</TableHead>
                    <TableHead>Ngày Dạy</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Lượt Xem</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          {lesson.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {lesson.studentName}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{lesson.tutorName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {format(new Date(lesson.lessonDate), 'dd/MM/yyyy', { locale: vi })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {lesson.isPublished ? (
                            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đã xuất bản
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="w-3 h-3 mr-1" />
                              Bản nháp
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lesson.viewCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(lesson.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => togglePublish(lesson.id)}>
                              {lesson.isPublished ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Hủy xuất bản
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Xuất bản
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog({ open: true, lessonId: lesson.id })}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, lessonId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài giảng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}