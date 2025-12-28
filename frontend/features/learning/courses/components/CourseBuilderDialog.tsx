'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
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
    }, []);

    const filteredLessons = useMemo(() =>
        libraryLessons.filter((lesson) =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [libraryLessons, searchQuery]
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-[700px] md:max-w-[750px] h-[95vh] sm:h-auto sm:max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0 rounded-2xl sm:rounded-lg">
                <DialogHeader className="px-4 py-4 sm:p-6 sm:pb-4 shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                        <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                        <span className="truncate">
                            {mode === 'create' ? 'Tạo lộ trình học tập' : 'Chỉnh sửa lộ trình'}
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        {step === 'info'
                            ? 'Xác định các thông tin cơ bản cho khóa học của bạn.'
                            : 'Chọn các bài giảng từ thư viện để đưa vào lộ trình.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden min-h-0">
                        <div className="flex-1 overflow-y-auto px-4 py-3 sm:p-6 sm:pt-4 min-h-0">
                            {isLoadingDetail ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : step === 'info' ? (
                                <div className="space-y-3 sm:space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Tiêu đề khóa học</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ví dụ: Luyện thi IELTS Speaking cấp tốc"
                                                        className="h-9 sm:h-10 text-sm"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Mô tả ngắn gọn</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Mô tả mục tiêu và nội dung chính của khóa học..."
                                                        className="min-h-[80px] sm:min-h-[100px] resize-none text-sm"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <FormField
                                            control={form.control}
                                            name="difficultyLevel"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs sm:text-sm">Độ khó</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-9 sm:h-10 text-sm">
                                                                <SelectValue placeholder="Chọn độ khó" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="BEGINNER" className="text-sm">Cơ bản (Beginner)</SelectItem>
                                                            <SelectItem value="INTERMEDIATE" className="text-sm">Trung cấp (Intermediate)</SelectItem>
                                                            <SelectItem value="ADVANCED" className="text-sm">Nâng cao (Advanced)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="estimatedHours"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs sm:text-sm">Thời lượng dự kiến (giờ)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            className="h-9 sm:h-10 text-sm"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm kiếm bài giảng..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-8 sm:pl-9 h-9 sm:h-10 text-sm"
                                        />
                                    </div>

                                    <div className="bg-muted/50 rounded-xl sm:rounded-lg p-2.5 sm:p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                                            <span className="text-xs sm:text-sm font-medium">
                                                Đã chọn <span className="text-primary font-bold">{selectedLessonIds.length}</span> bài giảng
                                            </span>
                                        </div>
                                    </div>

                                    <ScrollArea className="h-[250px] sm:h-[300px] border rounded-xl sm:rounded-md p-1.5 sm:p-2">
                                        {isLoadingLibrary ? (
                                            <div className="flex items-center justify-center h-full">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : filteredLessons.length === 0 ? (
                                            <div className="text-center py-8 text-xs sm:text-sm text-muted-foreground">
                                                Không tìm thấy bài giảng nào
                                            </div>
                                        ) : (
                                            <div className="space-y-1.5 sm:space-y-2">
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

                        <DialogFooter className="px-4 py-3 sm:p-6 sm:pt-3 bg-muted/20 border-t shrink-0">
                            <div className="flex w-full justify-between items-center gap-3">
                                <div className="flex gap-1.5 sm:gap-2">
                                    <div className={cn("w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full", step === 'info' ? "bg-primary" : "bg-primary/30")} />
                                    <div className={cn("w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full", step === 'lessons' ? "bg-primary" : "bg-primary/30")} />
                                </div>

                                <div className="flex gap-2 sm:gap-3">
                                    {step === 'lessons' && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep('info')}
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                            className="h-8 sm:h-9 text-xs sm:text-sm px-3"
                                        >
                                            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden xs:inline">Quay lại</span>
                                            <span className="xs:hidden">Lại</span>
                                        </Button>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        className="h-8 sm:h-9 text-xs sm:text-sm px-3"
                                    >
                                        {createMutation.isPending || updateMutation.isPending ? (
                                            <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                        ) : step === 'info' ? (
                                            <>
                                                <span className="hidden xs:inline">Tiếp theo</span>
                                                <span className="xs:hidden">Tiếp</span>
                                                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            </>
                                        ) : (
                                            <>
                                                <span className="hidden sm:inline">Hoàn tất & Lưu</span>
                                                <span className="sm:hidden">Lưu</span>
                                            </>
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
                "w-full flex items-center space-x-2.5 sm:space-x-3 p-2.5 sm:p-3 rounded-xl sm:rounded-lg border transition-all cursor-pointer hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary/20 active:scale-[0.98]",
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
            <div className="flex items-center space-x-2.5 sm:space-x-3 w-full">
                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                    <Checkbox checked={isSelected} className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs sm:text-sm font-medium leading-none mb-0.5 sm:mb-1 truncate">
                        {lesson.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                        {lesson.summary || 'Không có tóm tắt'}
                    </p>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />}
            </div>
        </div>
    );
});

LessonItem.displayName = 'LessonItem';