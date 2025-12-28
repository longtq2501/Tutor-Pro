'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookOpen,
  Calendar,
  MoreVertical,
  Plus,
  Tag,
  User,
  Trash2,
  Users,
  Loader2,
  Edit,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  useLessonLibrary,
  useCreateLibraryLesson,
  useAssignLibraryLesson,
  useUnassignLibraryLesson,
  useDeleteLibraryLesson,
  useUpdateLibraryLesson,
} from '../hooks/useLessonLibrary';
import { useLessonCategories } from '../hooks/useLessonCategories';
import { LessonForm } from './LessonForm';
import { LessonDTO, LessonFormData, LessonLibraryDTO } from '../types';
import { AssignStudentsDialog } from './AssignStudentsDialog';
import { EditLessonDialog } from './EditLessonDialog';
import { CategoryManagerDialog } from './CategoryManagerDialog';

const ITEMS_PER_PAGE = 10;

export function LessonLibraryTab() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState<LessonLibraryDTO | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: lessons = [], isLoading } = useLessonLibrary();
  const { categories } = useLessonCategories();

  const createMutation = useCreateLibraryLesson();
  const updateMutation = useUpdateLibraryLesson();
  const assignMutation = useAssignLibraryLesson();
  const unassignMutation = useUnassignLibraryLesson();
  const deleteMutation = useDeleteLibraryLesson();

  // Filter Logic
  const filteredLessons = lessons.filter(lesson => {
    if (selectedCategoryFilter === 'all') return true;
    if (selectedCategoryFilter === 'none') return !lesson.category;
    return String(lesson.category?.id) === selectedCategoryFilter;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredLessons.length / ITEMS_PER_PAGE);
  const paginatedLessons = filteredLessons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreate = (data: LessonFormData) => {
    createMutation.mutate(
      {
        ...data,
      },
      {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      }
    );
  };

  const handleEditSubmit = (data: LessonFormData) => {
    if (!selectedLesson) return;

    updateMutation.mutate(
      {
        id: selectedLesson.id,
        data: {
          ...data,
          // Ensure these fields are compatible with UpdateLessonRequest
          tutorName: data.tutorName,
          title: data.title,
          content: data.content,
          lessonDate: data.lessonDate || new Date().toISOString().split('T')[0],
          isPublished: data.isPublished || false,
          categoryId: data.categoryId,
        },
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedLesson(null);
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

  const handleDeleteClick = (lesson: LessonLibraryDTO) => {
    setSelectedLesson(lesson);
    setIsDeleteDialogOpen(true);
  };

  const handleEditClick = (lesson: LessonLibraryDTO) => {
    setSelectedLesson(lesson);
    setIsEditDialogOpen(true);
  };

  const handleAssign = (lessonId: number, studentIds: number[]) => {
    if (!selectedLesson) return;

    // Check if unassigning logic is needed or just assign
    // For simplicity, we just use assign here as the main action
    assignMutation.mutate(
      {
        lessonId,
        data: { studentIds },
      },
      {
        onSuccess: () => {
          setIsAssignDialogOpen(false);
          setSelectedLesson(null);
        },
      }
    );
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Kho Học Liệu
              </CardTitle>
              <CardDescription>
                Quản lý các bài giảng mẫu để giao cho học sinh
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
              <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)} className="flex-1 sm:flex-none">
                <Tag className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Quản lý danh mục</span>
                <span className="sm:hidden">Danh mục</span>
              </Button>
              <Button onClick={() => setIsFormOpen(true)} className="flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                Thêm bài mới
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="w-full sm:w-[200px]">
              <Select
                value={selectedCategoryFilter}
                onValueChange={(val) => {
                  setSelectedCategoryFilter(val);
                  setCurrentPage(1); // Reset page on filter change
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Lọc theo danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  <SelectItem value="none">Không có danh mục</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#3b82f6' }} />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Chưa có bài giảng nào
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Thêm bài giảng mẫu vào kho để tái sử dụng
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Tiêu đề</TableHead>
                      <TableHead className="w-[150px] hidden md:table-cell">Giáo viên</TableHead>
                      <TableHead className="w-[120px] hidden md:table-cell">Ngày tạo</TableHead>
                      <TableHead className="w-[100px] hidden md:table-cell">Trạng thái</TableHead>
                      <TableHead className="w-[100px] hidden md:table-cell">Đã giao</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            <span className="line-clamp-1 text-base font-semibold">{lesson.title}</span>
                            <div className="flex flex-wrap items-center gap-2">
                              {lesson.category && (
                                <Badge
                                  variant="outline"
                                  className="w-fit text-[10px] uppercase font-bold px-1.5 py-0 h-5 border-0"
                                  style={{
                                    backgroundColor: `${lesson.category.color}15`,
                                    color: lesson.category.color
                                  }}
                                >
                                  {lesson.category.name}
                                </Badge>
                              )}
                              {/* Mobile Only: Date & Status */}
                              <span className="md:hidden text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {lesson.lessonDate ? format(new Date(lesson.lessonDate), 'dd/MM/yyyy') : '-'}
                              </span>
                              <span className={cn("md:hidden text-xs font-medium flex items-center gap-1", lesson.isPublished ? "text-green-600" : "text-muted-foreground")}>
                                {lesson.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                {lesson.isPublished ? 'Public' : 'Private'}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{lesson.tutorName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {lesson.lessonDate ? format(new Date(lesson.lessonDate), 'dd/MM/yyyy', { locale: vi }) : '-'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {lesson.isPublished ? (
                            <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                              <Eye className="h-4 w-4" />
                              Public
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                              <EyeOff className="h-4 w-4" />
                              Private
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {(lesson.assignedStudentCount || 0) > 0 ? (
                            <Badge variant="secondary" className="flex w-fit items-center gap-1">
                              <Users className="h-3 w-3" />
                              {lesson.assignedStudentCount}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
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
                              <DropdownMenuItem onClick={() => handleAssignClick(lesson)}>
                                <Users className="mr-2 h-4 w-4" />
                                Giao cho học sinh
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(lesson)}>
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Tiếp
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <LessonForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode="library"
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit Dialog */}
      {selectedLesson && (
        <EditLessonDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          lesson={selectedLesson}
          onSubmit={handleEditSubmit}
          isLoading={updateMutation.isPending}
        />
      )}

      {/* Assign Dialog */}
      {selectedLesson && (
        <AssignStudentsDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          lesson={selectedLesson}
        />
      )}

      {/* Category Manager */}
      <CategoryManagerDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      />

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
              Hành động này sẽ xóa bài giảng khỏi kho và không thể hoàn tác.
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