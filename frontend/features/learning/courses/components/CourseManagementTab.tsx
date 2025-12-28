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
    GraduationCap,
    MoreVertical,
    Plus,
    Trash2,
    Edit,
    Loader2,
    Users,
    Layers,
    Clock,
} from 'lucide-react';
import { useAdminCourses, useDeleteCourse } from '../hooks/useAdminCourses';
import type { CourseDTO } from '../types';
import { CourseBuilderDialog } from './CourseBuilderDialog';
import { AssignCourseDialog } from './AssignCourseDialog';

export function CourseManagementTab() {
    const [isCourseBuilderOpen, setIsCourseBuilderOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null);

    const { data: courses = [], isLoading } = useAdminCourses();
    const deleteMutation = useDeleteCourse();

    const handleCreate = () => {
        setDialogMode('create');
        setSelectedCourse(null);
        setIsCourseBuilderOpen(true);
    };

    const handleEdit = (course: CourseDTO) => {
        setDialogMode('edit');
        setSelectedCourse(course);
        setIsCourseBuilderOpen(true);
    };

    const handleAssign = (course: CourseDTO) => {
        setSelectedCourse(course);
        setIsAssignDialogOpen(true);
    };

    const handleDelete = () => {
        if (selectedCourse) {
            deleteMutation.mutate(selectedCourse.id, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedCourse(null);
                },
            });
        }
    };

    const handleDeleteClick = (course: CourseDTO) => {
        setSelectedCourse(course);
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
                                <GraduationCap className="h-5 w-5" />
                                Quản Lý Khóa Học
                            </CardTitle>
                            <CardDescription>
                                Tạo và quản lý các lộ trình học tập có cấu trúc
                            </CardDescription>
                        </div>
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo khóa học mới
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">
                                Chưa có khóa học nào
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Bắt đầu gom các bài giảng lẻ thành một lộ trình học tập hoàn chỉnh
                            </p>
                            <Button onClick={handleCreate} className="mt-4">
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo khóa học đầu tiên
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Tên khóa học</TableHead>
                                        <TableHead>Độ khó</TableHead>
                                        <TableHead>Số bài học</TableHead>
                                        <TableHead>Thời lượng dự kiến</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courses.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium line-clamp-1">{course.title}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-1">
                                                        {course.description || 'Chưa có mô tả'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {course.difficultyLevel === 'BEGINNER' ? 'Cơ bản' :
                                                        course.difficultyLevel === 'INTERMEDIATE' ? 'Trung cấp' : 'Nâng cao'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Layers className="h-4 w-4 text-muted-foreground" />
                                                    {course.lessonCount} bài
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    {course.estimatedHours || 0} giờ
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                                                    {course.isPublished ? 'Công khai' : 'Nháp'}
                                                </Badge>
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
                                                        <DropdownMenuItem onClick={() => handleEdit(course)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleAssign(course)}>
                                                            <Users className="mr-2 h-4 w-4" />
                                                            Giao khóa học
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleDeleteClick(course)}
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

            {/* Course Builder Dialog */}
            <CourseBuilderDialog
                open={isCourseBuilderOpen}
                onOpenChange={setIsCourseBuilderOpen}
                course={selectedCourse}
                mode={dialogMode}
            />

            {/* Assign Dialog */}
            {selectedCourse && (
                <AssignCourseDialog
                    open={isAssignDialogOpen}
                    onOpenChange={setIsAssignDialogOpen}
                    course={selectedCourse}
                />
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa khóa học</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa khóa học "
                            <span className="font-semibold text-foreground">{selectedCourse?.title}</span>"?
                            Hành động này sẽ không xóa các bài giảng bên trong, nhưng lộ trình và danh sách học sinh tham gia sẽ bị xóa.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Xác nhận xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
