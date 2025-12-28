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
import { CategoryDashboard } from './CategoryDashboard';
import { LessonDetailModal } from '../../lesson-view-wrapper/components/LessonDetailModal';
import { Users } from 'lucide-react';

export function AdminLessonsTab() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const { data: lessons = [], isLoading } = useAdminLessons();

  // Calculate counts for dashboard
  const lessonCounts = lessons.reduce((acc, lesson) => {
    // Total count (using -1 as key for "All")
    acc[-1] = (acc[-1] || 0) + 1;

    // Category count
    if (lesson.category?.id) {
      acc[lesson.category.id] = (acc[lesson.category.id] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  const handlePreview = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setIsPreviewOpen(true);
  };

  const filteredLessons = selectedCategoryId
    ? lessons.filter(l => l.category?.id === selectedCategoryId)
    : lessons;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryDashboard
        onSelectCategory={setSelectedCategoryId}
        lessonCounts={lessonCounts}
      />

      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {selectedCategoryId === null ? 'Tất cả bài giảng' : 'Danh sách bài giảng'}
          <Badge variant="secondary" className="ml-2">
            {filteredLessons.length}
          </Badge>
        </h2>
        {selectedCategoryId !== null && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategoryId(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            Xem tất cả
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <BookMarked className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                Không tìm thấy bài giảng
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Không có bài giảng nào trong danh mục này
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Tiêu đề</TableHead>
                    <TableHead className="w-[150px] hidden md:table-cell">Giáo viên</TableHead>
                    <TableHead className="w-[120px] hidden md:table-cell">Ngày học</TableHead>
                    <TableHead className="w-[100px] hidden md:table-cell">Trạng thái</TableHead>
                    <TableHead className="w-[120px] hidden md:table-cell">Xuất bản</TableHead>
                    <TableHead className="w-[70px] text-right">Xem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handlePreview(lesson.id)}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="line-clamp-1 text-base font-semibold">{lesson.title}</span>
                          <div className="flex flex-wrap items-center gap-2">
                            {lesson.category && (
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase font-bold px-1.5 py-0 h-5 border-0"
                                style={{
                                  backgroundColor: `${lesson.category.color}15`,
                                  color: lesson.category.color
                                }}
                              >
                                {lesson.category.name}
                              </Badge>
                            )}
                            {/* Mobile Only: Date */}
                            <span className="md:hidden text-xs text-muted-foreground">
                              {format(new Date(lesson.lessonDate), 'dd/MM/yyyy')}
                            </span>
                            {lesson.assignedStudentCount !== undefined && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {lesson.assignedStudentCount} <span className="hidden sm:inline">học sinh</span>
                              </span>
                            )}
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
                            {format(new Date(lesson.lessonDate), 'dd/MM/yyyy', {
                              locale: vi,
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={lesson.isPublished ? 'default' : 'secondary'}
                        >
                          {lesson.isPublished ? 'Đã xuất bản' : 'Nháp'}
                        </Badge>
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
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(lesson.id);
                        }}>
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <LessonDetailModal
        lessonId={selectedLessonId}
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        isPreview={true}
      />
    </div>
  );
}
