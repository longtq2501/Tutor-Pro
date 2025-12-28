'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  BookMarked,
  MoreVertical,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Eye,
  EyeOff,
  Calendar,
  User,
  Tag,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  useAdminLessons,
  useDeleteAdminLesson,
  useTogglePublishLesson,
} from '../hooks/useAdminLessons';
import type { LessonDTO } from '../types';
import { CreateLessonDialog } from './CreateLessonDialog';
import { EditLessonDialog } from './EditLessonDialog';
import { CategoryManagerDialog } from './CategoryManagerDialog';

export function AdminLessonsTab() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonDTO | null>(null);

  const { data: lessons = [], isLoading } = useAdminLessons();
  const deleteMutation = useDeleteAdminLesson();
  const togglePublishMutation = useTogglePublishLesson();

  const handleEdit = (lesson: LessonDTO) => {
    setSelectedLesson(lesson);
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedLesson) {
      deleteMutation.mutate(selectedLesson.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedLesson(null);
        },
      });
    }
  };

  const handleDeleteClick = (lesson: LessonDTO) => {
    setSelectedLesson(lesson);
    setIsDeleteDialogOpen(true);
  };

  const handleTogglePublish = (lesson: LessonDTO) => {
    togglePublishMutation.mutate(lesson.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5" />
                Bài Giảng Đang Dạy
              </CardTitle>
              <CardDescription>
                Quản lý các bài giảng đã giao cho học sinh
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
                <Tag className="mr-2 h-4 w-4" />
                Quản lý danh mục
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo & giao bài mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <BookMarked className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Chưa có bài giảng nào
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Tạo bài giảng mới và giao trực tiếp cho học sinh
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Tạo bài đầu tiên
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Tiêu đề</TableHead>
                    <TableHead className="w-[150px]">Giáo viên</TableHead>
                    <TableHead className="w-[300px]">Tóm tắt</TableHead>
                    <TableHead className="w-[120px]">Ngày học</TableHead>
                    <TableHead className="w-[100px]">Trạng thái</TableHead>
                    <TableHead className="w-[120px]">Xuất bản</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="line-clamp-1">{lesson.title}</span>
                          <div className="flex flex-wrap items-center gap-2">
                            {lesson.assignedStudentCount !== undefined && (
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {lesson.assignedStudentCount} học sinh
                              </span>
                            )}
                            {lesson.category && (
                              <div className="flex items-center gap-1.5 overflow-hidden">
                                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: lesson.category.color || '#3b82f6' }} />
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground truncate">{lesson.category.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{lesson.tutorName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {lesson.summary || lesson.content.substring(0, 100) + '...'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(lesson.lessonDate), 'dd/MM/yyyy', {
                              locale: vi,
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={lesson.isPublished ? 'default' : 'secondary'}
                        >
                          {lesson.isPublished ? 'Đã xuất bản' : 'Nháp'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={lesson.isPublished}
                            onCheckedChange={() => handleTogglePublish(lesson)}
                            disabled={togglePublishMutation.isPending}
                          />
                          {lesson.isPublished ? (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(lesson)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(lesson)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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

      {/* Create Dialog */}
      <CreateLessonDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {/* Edit Dialog */}
      {selectedLesson && (
        <EditLessonDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          lesson={selectedLesson}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài giảng "
              <span className="font-semibold">{selectedLesson?.title}</span>"?
              Hành động này sẽ xóa bài giảng khỏi tất cả học sinh và không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CategoryManagerDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      />
    </>
  );
}