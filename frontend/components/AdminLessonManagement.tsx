/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { adminLessonsApi } from '@/lib/api';
import { AdminLesson } from '@/lib/types';  // ✅ Use AdminLesson (not Lesson)
import CreateLessonForm from './CreateLessonForm';
import EditLessonForm from './EditLessonForm';
import LessonDetailView from './LessonDetailView';

export default function AdminLessonManagement() {
  // ✅ FIXED: Use AdminLesson[] type
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<AdminLesson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'library' | 'assigned'>('all');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [previewLessonId, setPreviewLessonId] = useState<number | null>(null);

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [lessons, searchQuery, filterStatus]);

  /**
   * ✅ FIXED: Properly fetch AdminLesson[] from backend
   */
  const loadLessons = async () => {
    try {
      setLoading(true);
      console.log('📚 Loading lessons...');
      
      const data = await adminLessonsApi.getAll();
      console.log('✅ Received lessons:', data);
      
      // ✅ Validate data structure
      if (!Array.isArray(data)) {
        console.error('❌ Invalid response: expected array, got:', typeof data);
        toast.error('Dữ liệu không hợp lệ từ server');
        return;
      }
      
      setLessons(data);
      console.log('✅ Loaded', data.length, 'lessons');
    } catch (error: any) {
      console.error('❌ Error loading lessons:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Không thể tải danh sách bài giảng';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ FIXED: Filter using AdminLesson fields
   */
  const filterLessons = () => {
    let filtered = lessons;

    // Filter by status
    if (filterStatus === 'library') {
      filtered = filtered.filter((l) => l.isLibrary === true);
    } else if (filterStatus === 'assigned') {
      filtered = filtered.filter((l) => l.isLibrary === false);
    }

    // ✅ FIXED: Search by title only (no studentName)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((l) =>
        l.title.toLowerCase().includes(query) ||
        l.tutorName.toLowerCase().includes(query)
      );
    }

    setFilteredLessons(filtered);
  };

  const handleEdit = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setShowEditModal(true);
  };

  const handlePreview = (lessonId: number) => {
    setPreviewLessonId(lessonId);
    setShowPreviewModal(true);
  };

  const handleDelete = async (lessonId: number) => {
    if (!confirm('Xóa bài giảng này? Hành động không thể hoàn tác.')) return;

    try {
      await adminLessonsApi.delete(lessonId);
      toast.success('Đã xóa bài giảng');
      loadLessons();
    } catch (error: any) {
      console.error('❌ Error deleting lesson:', error);
      toast.error('Không thể xóa bài giảng');
    }
  };

  const handleTogglePublish = async (lessonId: number) => {
    try {
      await adminLessonsApi.togglePublish(lessonId);
      toast.success('Đã cập nhật trạng thái xuất bản');
      loadLessons();
    } catch (error: any) {
      console.error('❌ Error toggling publish:', error);
      toast.error('Không thể thay đổi trạng thái xuất bản');
    }
  };

  const stats = {
    total: lessons.length,
    library: lessons.filter((l) => l.isLibrary).length,
    assigned: lessons.filter((l) => !l.isLibrary).length,
    published: lessons.filter((l) => l.isPublished).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Quản Lý Bài Giảng</h2>
            <p className="text-muted-foreground mt-1">
              Tạo và quản lý nội dung học tập cho học sinh
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Tạo Bài Giảng
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng Bài Giảng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trong Kho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.library}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Đã Giao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.assigned}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Đã Xuất Bản
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.published}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm bài giảng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'library', 'assigned'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                  >
                    {status === 'all' && 'Tất Cả'}
                    {status === 'library' && 'Trong Kho'}
                    {status === 'assigned' && 'Đã Giao'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lesson List */}
        {filteredLessons.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'Không tìm thấy bài giảng' : 'Chưa có bài giảng nào'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground truncate">
                          {lesson.title}
                        </h3>
                        {lesson.isLibrary ? (
                          <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            Trong Kho
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">
                            Đã Giao ({lesson.assignedStudentCount})
                          </Badge>
                        )}
                        {lesson.isPublished && (
                          <Badge variant="outline">Đã Xuất Bản</Badge>
                        )}
                      </div>

                      {lesson.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {lesson.summary}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>{lesson.tutorName}</span>
                        <span>•</span>
                        <span>
                          {format(new Date(lesson.lessonDate), 'dd/MM/yyyy', { locale: vi })}
                        </span>
                        {!lesson.isLibrary && (
                          <>
                            <span>•</span>
                            <span>{lesson.totalViewCount} lượt xem</span>
                            <span>•</span>
                            <span>{lesson.completionRate.toFixed(0)}% hoàn thành</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem onClick={() => handlePreview(lesson.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem Trước
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(lesson.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePublish(lesson.id)}>
                          {lesson.isPublished ? 'Gỡ Xuất Bản' : 'Xuất Bản'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(lesson.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background">
              <VisuallyHidden>
                <DialogTitle>Tạo Bài Giảng Mới</DialogTitle>
              </VisuallyHidden>
              <CreateLessonForm
                onSuccess={() => {
                  setShowCreateModal(false);
                  loadLessons();
                }}
                onCancel={() => setShowCreateModal(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {showEditModal && selectedLessonId && (
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background">
              <VisuallyHidden>
                <DialogTitle>Chỉnh Sửa Bài Giảng</DialogTitle>
              </VisuallyHidden>
              <EditLessonForm
                lessonId={selectedLessonId}
                onSuccess={() => {
                  setShowEditModal(false);
                  setSelectedLessonId(null);
                  loadLessons();
                }}
                onCancel={() => {
                  setShowEditModal(false);
                  setSelectedLessonId(null);
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {showPreviewModal && previewLessonId && (
          <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
            <DialogContent className="max-w-[95vw] h-[95vh] bg-background">
              <VisuallyHidden>
                <DialogTitle>Xem Trước Bài Giảng</DialogTitle>
              </VisuallyHidden>
              <LessonDetailView
                lessonId={previewLessonId}
                isAdminPreview={true}
                onClose={() => {
                  setShowPreviewModal(false);
                  setPreviewLessonId(null);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}