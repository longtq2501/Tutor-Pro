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
import {
  BookOpen,
  MoreVertical,
  Plus,
  Trash2,
  Users,
  UserPlus,
  Loader2,
  User,
  UserMinus,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  useLessonLibrary,
  useCreateLibraryLesson,
  useDeleteLibraryLesson,
} from '../hooks/useLessonLibrary';
import type { LessonLibraryDTO } from '../types';
import { LessonForm } from './LessonForm';
import { AssignStudentsDialog } from './AssignStudentsDialog';
import { UnassignStudentsDialog } from './UnassignStudentsDialog';

export function LessonLibraryTab() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonLibraryDTO | null>(
    null
  );

  const { data: lessons = [], isLoading } = useLessonLibrary();
  const createMutation = useCreateLibraryLesson();
  const deleteMutation = useDeleteLibraryLesson();

  const handleCreate = (data: any) => {
    createMutation.mutate(
      {
        tutorName: data.tutorName,
        title: data.title,
        summary: data.summary,
        content: data.content,
        lessonDate: data.lessonDate,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        images: data.images || [],
        resources: data.resources || [],
        isPublished: data.isPublished,
      },
      {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      }
    );
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

  const handleAssignClick = (lesson: LessonLibraryDTO) => {
    setSelectedLesson(lesson);
    setIsAssignDialogOpen(true);
  };

  const handleUnassignClick = (lesson: LessonLibraryDTO) => {
    setSelectedLesson(lesson);
    setIsUnassignDialogOpen(true);
  };

  const handleDeleteClick = (lesson: LessonLibraryDTO) => {
    setSelectedLesson(lesson);
    setIsDeleteDialogOpen(true);
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
                <BookOpen className="h-5 w-5" />
                Kho Học Liệu
              </CardTitle>
              <CardDescription>
                Quản lý các bài giảng mẫu để giao cho học sinh
              </CardDescription>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm bài mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Chưa có bài giảng nào
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Bắt đầu bằng cách thêm bài giảng mẫu vào kho
              </p>
              <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Thêm bài đầu tiên
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
                    <TableHead className="w-[120px]">Học sinh đã giao</TableHead>
                    <TableHead className="w-[150px]">Ngày tạo</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        <span className="line-clamp-1">{lesson.title}</span>
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
                        <Badge variant="secondary" className="gap-1">
                          <Users className="h-3 w-3" />
                          {lesson.assignedStudentCount || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {format(new Date(lesson.createdAt), 'dd/MM/yyyy', {
                            locale: vi,
                          })}
                        </span>
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
                            <DropdownMenuItem
                              onClick={() => handleAssignClick(lesson)}
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Giao cho học sinh
                            </DropdownMenuItem>
                            {lesson.assignedStudentCount && lesson.assignedStudentCount > 0 && (
                              <DropdownMenuItem
                                onClick={() => handleUnassignClick(lesson)}
                                className="text-orange-600"
                              >
                                <UserMinus className="mr-2 h-4 w-4" />
                                Thu hồi bài giảng
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
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

      {/* Form Dialog */}
      <LessonForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode="library"
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Assign Students Dialog */}
      {selectedLesson && (
        <AssignStudentsDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          lesson={selectedLesson}
        />
      )}

      {/* Unassign Students Dialog */}
      {selectedLesson && (
        <UnassignStudentsDialog
          open={isUnassignDialogOpen}
          onOpenChange={setIsUnassignDialogOpen}
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
              <span className="font-semibold">{selectedLesson?.title}</span>"
              khỏi kho? Hành động này không thể hoàn tác.
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
    </>
  );
}