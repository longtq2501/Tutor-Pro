'use client';

import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Loader2,
    GraduationCap,
    Layers,
    ArrowRight,
    ArrowLeft,
    Check,
    Search,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useLessonLibrary } from '../../lessons/hooks/useLessonLibrary';
import { useCreateCourse, useUpdateCourse, useAdminCourseById } from '../hooks/useAdminCourses';
import type { CourseDTO, CourseDetailDTO, CourseRequest } from '../types';
import React from 'react';

const courseSchema = z.object({
    title: z.string().min(1, 'Tiêu đề không được để trống').max(200),
    description: z.string().max(1000),
    difficultyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    estimatedHours: z.number().min(0).max(1000),
    isPublished: z.boolean(),
    lessonIds: z.array(z.number()),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseBuilderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course?: CourseDetailDTO | CourseDTO | null;
    mode: 'create' | 'edit';
}

export function CourseBuilderDialog({
    open,
    onOpenChange,
    course,
    mode,
}: CourseBuilderDialogProps) {
    const [step, setStep] = useState<'info' | 'lessons'>('info');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: libraryLessons = [], isLoading: isLoadingLibrary } = useLessonLibrary();
    const { data: courseDetail, isLoading: isLoadingDetail } = useAdminCourseById(
        mode === 'edit' && course ? course.id : 0
    );
    const createMutation = useCreateCourse();
    const updateMutation = useUpdateCourse();

    // Tính toán defaultValues dựa trên course hoặc courseDetail
    const defaultValues = useMemo(() => {
        const targetCourse = courseDetail || course;

        if (targetCourse) {
            const lessonIds = 'lessons' in targetCourse
                ? targetCourse.lessons.map((l: any) => l.lessonId)
                : [];

            return {
                title: targetCourse.title,
                description: targetCourse.description || '',
                difficultyLevel: targetCourse.difficultyLevel,
                estimatedHours: targetCourse.estimatedHours || 0,
                isPublished: targetCourse.isPublished,
                lessonIds: lessonIds,
            };
        }

        return {
            title: '',
            description: '',
            difficultyLevel: 'BEGINNER' as const,
            estimatedHours: 0,
            isPublished: false,
            lessonIds: [],
        };
    }, [course, courseDetail]);

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues,
    });

    const { watch, reset } = form;
    const selectedLessonIds = watch('lessonIds') || [];

    // Reset form khi dialog mở hoặc courseDetail thay đổi
    useEffect(() => {
        if (open) {
            reset(defaultValues);
            if (mode === 'create') {
                setStep('info');
            }
            setSearchQuery('');
        }
    }, [open, defaultValues, reset, mode]);

    const onSubmit: SubmitHandler<CourseFormValues> = (values) => {
        if (step === 'info') {
            setStep('lessons');
            return;
        }

        const payload: CourseRequest = values;

        if (mode === 'create') {
            createMutation.mutate(payload, {
                onSuccess: () => onOpenChange(false),
            });
        } else if (course && mode === 'edit') {
            updateMutation.mutate(
                { id: course.id, data: payload },
                { onSuccess: () => onOpenChange(false) }
            );
        }
    };

    const toggleLesson = useCallback((lessonId: number) => {
        const currentIds = form.getValues('lessonIds') || [];
        const newIds = currentIds.includes(lessonId)
            ? currentIds.filter((id) => id !== lessonId)
            : [...currentIds, lessonId];

        form.setValue('lessonIds', newIds, { shouldValidate: true, shouldDirty: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // form methods are stable

    const filteredLessons = useMemo(() =>
        libraryLessons.filter((lesson) =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [libraryLessons, searchQuery]
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        {mode === 'create' ? 'Tạo lộ trình học tập' : 'Chỉnh sửa lộ trình'}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'info'
                            ? 'Xác định các thông tin cơ bản cho khóa học của bạn.'
                            : 'Chọn các bài giảng từ thư viện để đưa vào lộ trình.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 pt-4">
                            {isLoadingDetail ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : step === 'info' ? (
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tiêu đề khóa học</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ví dụ: Luyện thi IELTS Speaking cấp tốc" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mô tả ngắn gọn</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Mô tả mục tiêu và nội dung chính của khóa học..."
                                                        className="min-h-[100px] resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="difficultyLevel"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Độ khó</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn độ khó" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="BEGINNER">Cơ bản (Beginner)</SelectItem>
                                                            <SelectItem value="INTERMEDIATE">Trung cấp (Intermediate)</SelectItem>
                                                            <SelectItem value="ADVANCED">Nâng cao (Advanced)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="estimatedHours"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Thời lượng dự kiến (giờ)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm kiếm bài giảng trong thư viện..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>

                                    <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Layers className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">
                                                Đã chọn <span className="text-primary font-bold">{selectedLessonIds.length}</span> bài giảng
                                            </span>
                                        </div>
                                    </div>

                                    <ScrollArea className="h-[300px] border rounded-md p-2">
                                        {isLoadingLibrary ? (
                                            <div className="flex items-center justify-center h-full">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : filteredLessons.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                Không tìm thấy bài giảng nào
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {filteredLessons.map((lesson) => (
                                                    <LessonItem
                                                        key={lesson.id}
                                                        lesson={lesson}
                                                        isSelected={selectedLessonIds.includes(lesson.id)}
                                                        onToggle={toggleLesson}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="p-6 pt-2 bg-muted/20 border-t">
                            <div className="flex w-full justify-between items-center">
                                <div className="flex gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", step === 'info' ? "bg-primary" : "bg-primary/30")} />
                                    <div className={cn("w-2 h-2 rounded-full", step === 'lessons' ? "bg-primary" : "bg-primary/30")} />
                                </div>

                                <div className="flex gap-3">
                                    {step === 'lessons' && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep('info')}
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Quay lại
                                        </Button>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                    >
                                        {createMutation.isPending || updateMutation.isPending ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : step === 'info' ? (
                                            <>
                                                Tiếp theo
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        ) : (
                                            'Hoàn tất & Lưu'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

interface LessonItemProps {
    lesson: any;
    isSelected: boolean;
    onToggle: (id: number) => void;
}

const LessonItem = memo(({ lesson, isSelected, onToggle }: LessonItemProps) => {
    return (
        <div
            role="button"
            tabIndex={0}
            className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary/20",
                isSelected && "bg-primary/5 border-primary/30"
            )}
            onClick={() => onToggle(lesson.id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggle(lesson.id);
                }
            }}
        >
            <div className="flex items-center space-x-3 w-full">
                <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isSelected} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium leading-none mb-1">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                        {lesson.summary || 'Không có tóm tắt'}
                    </p>
                </div>
                {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
            </div>
        </div>
    );
});

LessonItem.displayName = 'LessonItem';