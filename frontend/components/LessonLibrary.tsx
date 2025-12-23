'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Users,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { lessonLibraryApi } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';
import AssignLessonModal from './AssignLessonModal';
import CreateLessonForm from './CreateLessonForm';
import EditLessonForm from './EditLessonForm';
import LessonDetailView from './LessonDetailView';

interface LibraryLesson {
  id: number;
  title: string;
  summary?: string;
  tutorName: string;
  lessonDate: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  isLibrary: boolean;
  assignedStudentCount: number;
  totalViewCount: number;
  completionRate: number;
  createdAt: string;
}

export default function LessonLibrary() {
  const [lessons, setLessons] = useState<LibraryLesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<LibraryLesson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'library' | 'assigned'>('all');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LibraryLesson | null>(null);

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [lessons, searchQuery, filterStatus]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonLibraryApi.getAll();
      setLessons(data);
    } catch (error) {
      console.error('Error loading lessons:', error);
      toast.error('Không thể tải danh sách bài giảng');
    } finally {
      setLoading(false);
    }
  };

  const filterLessons = () => {
    let filtered = lessons;

    // Filter by status
    if (filterStatus === 'library') {
      filtered = filtered.filter((l) => l.isLibrary);
    } else if (filterStatus === 'assigned') {
      filtered = filtered.filter((l) => !l.isLibrary);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLessons(filtered);
  };

  const handleAssign = (lesson: LibraryLesson) => {
    setSelectedLesson(lesson);
    setShowAssignModal(true);
  };

  const handleEdit = (lesson: LibraryLesson) => {
    setSelectedLesson(lesson);
    setShowEditModal(true);
  };

  const handlePreview = (lesson: LibraryLesson) => {
    setSelectedLesson(lesson);
    setShowPreviewModal(true);
  };

  const handleDelete = async (lessonId: number) => {
    if (!confirm('Xóa bài giảng này? Hành động không thể hoàn tác.')) return;

    try {
      await lessonLibraryApi.delete(lessonId);
      toast.success('Đã xóa bài giảng');
      loadLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Không thể xóa bài giảng');
    }
  };

  const stats = {
    total: lessons.length,
    library: lessons.filter((l) => l.isLibrary).length,
    assigned: lessons.filter((l) => !l.isLibrary).length,
    totalStudents: lessons.reduce((sum, l) => sum + l.assignedStudentCount, 0),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Kho Bài Giảng
          </h2>
          <p className="text-muted-foreground mt-1">
            Quản lý và phân phối bài giảng cho học sinh
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary/90"
        >
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
              Học Sinh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.totalStudents}
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

      {/* Lesson Grid */}
      {filteredLessons.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'Không tìm thấy bài giảng' : 'Chưa có bài giảng nào'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card
              key={lesson.id}
              className="bg-card border-border hover:shadow-lg transition-shadow group"
            >
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  {lesson.thumbnailUrl ? (
                    <Image
                      src={lesson.thumbnailUrl}
                      alt={lesson.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {lesson.isLibrary ? (
                      <Badge variant="secondary" className="bg-blue-500/90 text-white">
                        Trong Kho
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500/90 text-white">
                        Đã Giao ({lesson.assignedStudentCount})
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h3>
                    {lesson.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {lesson.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{lesson.tutorName}</span>
                    <span>•</span>
                    <span>{format(new Date(lesson.lessonDate), 'dd/MM/yyyy', { locale: vi })}</span>
                  </div>

                  {/* Stats */}
                  {!lesson.isLibrary && (
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {lesson.totalViewCount} lượt xem
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {lesson.completionRate.toFixed(0)}% hoàn thành
                      </Badge>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleAssign(lesson)}
                    >
                      <Users className="h-3.5 w-3.5 mr-1.5" />
                      Giao Bài
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem onClick={() => handlePreview(lesson)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem Trước
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(lesson)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh Sửa
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-4 z-50 overflow-y-auto">
            <div className="max-w-5xl mx-auto bg-background border border-border rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Tạo Bài Giảng Mới</h2>
              <CreateLessonForm
                onSuccess={() => {
                  setShowCreateModal(false);
                  loadLessons();
                }}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showAssignModal && selectedLesson && (
        <AssignLessonModal
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
          currentlyAssignedStudentIds={[]} // Will be fetched from API
          onClose={() => {
            setShowAssignModal(false);
            setSelectedLesson(null);
          }}
          onSuccess={() => {
            setShowAssignModal(false);
            setSelectedLesson(null);
            loadLessons();
          }}
        />
      )}
    </div>
  );
}