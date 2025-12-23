/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, MoreHorizontal, FileText, CheckCircle, XCircle, Calendar, User, ArrowLeft, UserPlus, Users } from 'lucide-react';
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
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from "sonner";
import CreateLessonForm from './CreateLessonForm';
import EditLessonForm from './EditLessonForm';
import LessonDetailView from './LessonDetailView';
import { adminLessonsApi } from '@/lib/api';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';

interface Lesson {
  assignedStudentCount: number;
  totalViewCount: number;
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

type ViewMode = 'list' | 'create' | 'edit' | 'preview';

export default function AdminLessonManagement() {

  // Thêm vào cùng các useState khác ở đầu Component
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [previewLessonId, setPreviewLessonId] = useState<number | null>(null);
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
      // Giả sử API trả về { data: Lesson[] } hoặc chỉ Lesson[]
      const response = await adminLessonsApi.getAll();
      
      // Nếu API trả về trực tiếp mảng, dùng data. Nếu trả về object, dùng response.data
      const data = Array.isArray(response) ? response : (response as any).data;
      
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Không thể tải danh sách bài giảng');
    } finally {
      setLoading(false);
    };
  }

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

  // Tìm đến hàm handlePreview hiện tại và sửa thành:
  const handlePreview = (lessonId: number) => {
    setPreviewLessonId(lessonId);
    // Không cần setViewMode('preview') vì chúng ta dùng Dialog bọc lên trên List
  };

  const handleEdit = (lessonId: number) => {
    setEditingLessonId(lessonId);
    setViewMode('edit');
  };

  // ✅ NEW: Handle preview
  const handleAssign = (id: number) => {
    setSelectedLessonId(id);
    setAssignDialogOpen(true);
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.tutorName.toLowerCase().includes(searchQuery.toLowerCase());

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
      <div className="min-h-screen space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Tạo Bài Giảng Mới</h2>
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Chỉnh Sửa Bài Giảng</h2>
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
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Quản Lý Bài Giảng</h2>
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
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Bài Giảng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Đã Xuất Bản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.published}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bản Nháp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.draft}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Đã Hoàn Thành</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề hoặc tên học sinh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                <TabsList className="bg-muted">
                  <TabsTrigger value="all">Tất Cả</TabsTrigger>
                  <TabsTrigger value="published">Đã Xuất Bản</TabsTrigger>
                  <TabsTrigger value="draft">Bản Nháp</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-card border-border">
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
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-foreground">Tiêu Đề</TableHead>
                      <TableHead className="text-foreground">Học Sinh</TableHead>
                      <TableHead className="text-foreground">Giáo Viên</TableHead>
                      <TableHead className="text-foreground">Ngày Dạy</TableHead>
                      <TableHead className="text-foreground">Trạng Thái</TableHead>
                      <TableHead className="text-foreground">Lượt Xem</TableHead>
                      <TableHead className="text-right text-foreground">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLessons.map((lesson) => (
                      <TableRow key={lesson.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          {lesson.title}
                        </div>
                      </TableCell>
                    
                      {/* ✅ THAY ĐỔI: Hiển thị số lượng học sinh thay vì lesson.studentName */}
                      <TableCell className="text-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className={lesson.assignedStudentCount > 0 ? "text-foreground" : "text-muted-foreground italic"}>
                            {lesson.assignedStudentCount > 0 
                              ? `${lesson.assignedStudentCount} học sinh` 
                              : "Chưa giao"}
                          </span>
                        </div>
                      </TableCell>
                    
                      <TableCell className="text-muted-foreground">{lesson.tutorName}</TableCell>
                    
                      <TableCell className="text-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {/* Thêm check date hợp lệ để tránh crash nếu lessonDate null */}
                          {lesson.lessonDate ? format(new Date(lesson.lessonDate), 'dd/MM/yyyy', { locale: vi }) : '---'}
                        </div>
                      </TableCell>
                    
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {lesson.isPublished ? (
                            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-green-500/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đã xuất bản
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted text-foreground">
                              <XCircle className="w-3 h-3 mr-1" />
                              Bản nháp
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    
                      {/* ✅ THAY ĐỔI: Hiển thị tổng lượt xem (totalViewCount) thay vì viewCount */}
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-foreground border-border cursor-help">
                                <Eye className="w-3 h-3 mr-1 opacity-70" />
                                {lesson.totalViewCount || 0}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tổng lượt xem từ tất cả học sinh</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => handlePreview(lesson.id)} className="text-foreground hover:bg-accent">
                              <Eye className="w-4 h-4 mr-2" />
                              Xem trước
                            </DropdownMenuItem>
                            
                            {/* ✅ NEW: Thêm nút Giao bài tập (Assign) nếu bạn có modal này */}
                            <DropdownMenuItem onClick={() => handleAssign(lesson.id)} className="text-blue-600 hover:bg-blue-50">
                              <UserPlus className="w-4 h-4 mr-2" />
                              Giao cho học sinh
                            </DropdownMenuItem>
                    
                            <DropdownMenuItem onClick={() => handleEdit(lesson.id)} className="text-foreground hover:bg-accent">
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa nội dung
                            </DropdownMenuItem>
                    
                            <DropdownMenuItem onClick={() => togglePublish(lesson.id)} className="text-foreground hover:bg-accent">
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
                            
                            <DropdownMenuSeparator className="bg-border" />
                            
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog({ open: true, lessonId: lesson.id })}
                              className="text-red-600 dark:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa vĩnh viễn
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
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Bạn có chắc chắn muốn xóa bài giảng này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80">Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* ✅ NEW: Preview Dialog */}
      <Dialog open={previewLessonId !== null} onOpenChange={(open) => !open && setPreviewLessonId(null)}>
        <DialogContent 
          className="max-w-[95vw] w-[95vw] h-[95vh] p-0 gap-0 bg-background border-border"
          aria-describedby="lesson-preview-description"
        >
          <VisuallyHidden>
            <DialogTitle>Xem trước bài giảng</DialogTitle>
          </VisuallyHidden>
          
          <VisuallyHidden id="lesson-preview-description">
            Xem trước nội dung bài giảng với layout đầy đủ
          </VisuallyHidden>

          {previewLessonId && (
            <div className="h-full overflow-hidden">
              <LessonDetailView 
                lessonId={previewLessonId} 
                onClose={() => setPreviewLessonId(null)}
                isAdminPreview={true}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Thêm đoạn này vào bên cạnh các Dialog/AlertDialog khác */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogTitle className="text-xl font-bold">Giao bài giảng cho học sinh</DialogTitle>
          <div className="py-6">
            {/* Ở đây bạn có thể render danh sách checkbox học sinh */}
            <p className="text-muted-foreground mb-4">Chọn học sinh để giao bài giảng này:</p>
            
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {/* Ví dụ mẫu, bạn nên fetch danh sách học sinh từ API và map ở đây */}
              <p className="text-sm italic text-muted-foreground">Tính năng chọn danh sách học sinh đang được cập nhật...</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Hủy</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={async () => {
                // Gọi API assign ở đây: 
                // await adminLessonsApi.assignToStudents(selectedLessonId, studentIds);
                toast.success("Đã giao bài giảng thành công");
                setAssignDialogOpen(false);
                fetchLessons();
              }}
            >
              Xác nhận giao bài
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}