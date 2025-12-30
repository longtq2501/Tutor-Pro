'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Trophy,
    PlayCircle,
    Eye,
    ChevronRight,
    Search,
    GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useAdminCourseById } from '../hooks/useAdminCourses';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminCoursePreviewModalProps {
    courseId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLessonPreview?: (lessonId: number) => void;
}

export function AdminCoursePreviewModal({
    courseId,
    open,
    onOpenChange,
    onLessonPreview
}: AdminCoursePreviewModalProps) {
    const { data: course, isLoading } = useAdminCourseById(courseId || 0);

    const getDifficultyLabel = (level?: string) => {
        switch (level) {
            case 'BEGINNER': return 'Cơ bản';
            case 'INTERMEDIATE': return 'Trung cấp';
            case 'ADVANCED': return 'Nâng cao';
            default: return level || 'Chưa xác định';
        }
    };

    const getDifficultyColor = (level?: string) => {
        switch (level) {
            case 'BEGINNER': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'INTERMEDIATE': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'ADVANCED': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-2 rounded-3xl shadow-2xl h-[90vh] flex flex-col">
                <DialogHeader className="sr-only">
                    <DialogTitle>Xem trước lộ trình</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse font-medium">Đang chuẩn bị bản xem trước...</p>
                    </div>
                ) : !course ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-2">
                            <GraduationCap className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold">Không tìm thấy thông tin</h3>
                        <p className="text-muted-foreground max-w-xs">Chứng tôi không thể tải dữ liệu cho lộ trình này. Vui lòng thử lại sau.</p>
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl px-8 h-11 font-bold">Quay lại</Button>
                    </div>
                ) : (
                    <>
                        {/* Header Section */}
                        <div className="relative shrink-0 overflow-hidden bg-slate-900 text-white p-8 lg:p-12">
                            {/* Decorative background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-primary/20 to-transparent" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                                <div className="space-y-4 max-w-2xl">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={cn("text-xs font-bold border-0 backdrop-blur-md px-3 py-1", getDifficultyColor(course.difficultyLevel))}>
                                            {getDifficultyLabel(course.difficultyLevel)}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/60 uppercase tracking-wider">
                                            <Eye className="w-3.5 h-3.5" />
                                            Chế độ xem trước
                                        </div>
                                    </div>

                                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                                        {course.title}
                                    </h2>

                                    <p className="text-white/70 text-base leading-relaxed line-clamp-2">
                                        {course.description || "Khóa học này chưa có mô tả chi tiết."}
                                    </p>

                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-xl">
                                                <BookOpen className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-white/50 uppercase font-bold leading-none">Bài giảng</p>
                                                <p className="text-sm font-bold">{course.lessons.length} bài</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-xl">
                                                <Clock className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-white/50 uppercase font-bold leading-none">Thời lượng</p>
                                                <p className="text-sm font-bold">{course.estimatedHours}h</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden lg:block">
                                    <div className="w-32 h-32 rounded-[40px] bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center rotate-12">
                                        <GraduationCap className="w-16 h-16 text-white/20" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 min-h-0 bg-muted/20">
                            <ScrollArea className="h-full px-6 py-8">
                                <div className="max-w-3xl mx-auto space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <Trophy className="h-5 w-5 text-yellow-500" />
                                            Cấu trúc lộ trình
                                        </h3>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Tổng cộng {course.lessons.length} bài học
                                        </span>
                                    </div>

                                    <div className="relative space-y-3">
                                        {/* Vertical line connecting lessons */}
                                        <div className="absolute left-6 top-6 bottom-6 w-px bg-border sm:block hidden" />

                                        {course.lessons.map((lesson, index) => (
                                            <div
                                                key={lesson.id}
                                                className="group relative flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                                onClick={() => onLessonPreview?.(lesson.lessonId)}
                                            >
                                                {/* Index Circle */}
                                                <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full items-center justify-center relative z-10 bg-background border-2 shadow-sm font-black text-sm text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                    {index + 1}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <h4 className="font-bold text-base group-hover:text-primary transition-colors truncate">
                                                            {lesson.title}
                                                        </h4>
                                                        {lesson.isRequired && (
                                                            <Badge variant="secondary" className="text-[10px] h-5 rounded-md uppercase font-bold">Bắt buộc</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-1 italic">
                                                        {lesson.summary || "Click để xem trước nội dung chi tiết bài giảng này."}
                                                    </p>
                                                </div>

                                                {/* Play Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-10 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary"
                                                >
                                                    <PlayCircle className="w-6 h-6" />
                                                </Button>

                                                <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                            </div>
                                        ))}

                                        {course.lessons.length === 0 && (
                                            <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-muted-foreground/20">
                                                <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground font-medium">Lộ trình này chưa có bài giảng nào.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="h-10" /> {/* Extra padding at bottom */}
                            </ScrollArea>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
