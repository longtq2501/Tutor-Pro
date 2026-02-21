'use client';

import React from 'react';
import { useStudentCourseDetail } from '../hooks/useStudentCourses';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    PlayCircle,
    Lock,
    BookOpen,
    Trophy,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CourseDetailViewProps {
    courseId: number;
    onBack: () => void;
    onLessonSelect: (lessonId: number) => void;
}

export default function CourseDetailView({ courseId, onBack, onLessonSelect }: CourseDetailViewProps) {
    const { data: course, isLoading } = useStudentCourseDetail(courseId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Đang tải nội dung khóa học...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Không tìm thấy thông tin khóa học.</p>
                <Button variant="link" onClick={onBack}>Quay lại</Button>
            </div>
        );
    }

    const getDifficultyLabel = (level: string) => {
        switch (level) {
            case 'BEGINNER': return 'Cơ bản';
            case 'INTERMEDIATE': return 'Trung cấp';
            case 'ADVANCED': return 'Nâng cao';
            default: return level;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-white p-8 lg:p-12 shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 dark:from-primary/20 to-transparent pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 dark:bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                <Button
                    variant="ghost"
                    className="mb-6 -ml-4 hover:bg-white/10 text-white/80 hover:text-white"
                    onClick={onBack}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại danh sách
                </Button>

                <div className="grid lg:grid-cols-3 gap-8 relative z-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-wrap gap-2 text-xs font-semibold tracking-wider uppercase">
                            <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                                {getDifficultyLabel(course.difficultyLevel)}
                            </Badge>
                            <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                                {course.tutorName}
                            </Badge>
                        </div>

                        <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
                            {course.title}
                        </h1>

                        <p className="text-white/80 dark:text-white/70 text-lg leading-relaxed max-w-2xl">
                            {course.description || "Khóa học này chưa có mô tả chi tiết."}
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/60 uppercase font-bold">Bài giảng</p>
                                    <p className="font-bold">{course.lessons.length} bài</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/60 uppercase font-bold">Thời lượng</p>
                                    <p className="font-bold">{course.estimatedHours} giờ</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Calendar className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/60 uppercase font-bold">Bắt đầu</p>
                                    <p className="font-bold">{new Date(course.assignedDate).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center lg:items-end">
                        <div className="relative h-40 w-40 flex items-center justify-center">
                            {/* SVG Circular Progress */}
                            <svg className="h-full w-full -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-white/20"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * course.progressPercentage) / 100}
                                    strokeLinecap="round"
                                    className="text-white transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black">{course.progressPercentage}%</span>
                                <span className="text-[10px] uppercase font-bold text-white/60 tracking-widest">Tiến độ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lessons Timeline */}
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between mb-6 px-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        Lộ trình bài giảng
                    </h2>
                    <span className="text-sm font-medium text-muted-foreground">
                        {course.lessons.filter(l => l.isCompleted).length} / {course.lessons.length} Hoàn thành
                    </span>
                </div>

                <div className="relative space-y-4">
                    {/* Vertical line connecting lessons */}
                    <div className="absolute left-10 top-8 bottom-8 w-px bg-border hidden sm:block" />

                    {course.lessons.map((lesson, index) => {
                        const isCompleted = lesson.isCompleted;
                        // Sequential unlocking: First lesson is always unlocked, 
                        // subsequent lessons require previous lesson to have canUnlockNext=true
                        const isUnlocked = index === 0 || (course.lessons[index - 1].canUnlockNext ?? false) || (course.lessons[index - 1].isCompleted ?? false);
                        const isCurrent = !isCompleted && isUnlocked;
                        const isLocked = !isCompleted && !isUnlocked;

                        return (
                            <div
                                key={lesson.id}
                                className={cn(
                                    "relative flex sm:flex-row flex-col items-start gap-4 p-4 rounded-2xl border transition-all duration-300 group/item",
                                    isCompleted ? "bg-primary/5 border-primary/20 opacity-80" :
                                        isCurrent ? "bg-card border-primary shadow-lg scale-[1.02] z-10" :
                                            "bg-muted/30 border-transparent text-muted-foreground",
                                    isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:shadow-md"
                                )}
                                onClick={() => !isLocked && onLessonSelect(lesson.lessonId)}
                            >
                                {/* Index Circle */}
                                <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full items-center justify-center relative z-20 bg-background border-2 shadow-sm font-bold">
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    ) : isLocked ? (
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <span className={cn(isCurrent ? "text-primary" : "text-muted-foreground")}>
                                            {index + 1}
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h3 className={cn("text-lg font-bold leading-none", isCurrent && "text-primary")}>
                                            {lesson.title}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {lesson.isRequired && !isCompleted && (
                                                <Badge variant="secondary" className="text-[10px] uppercase tracking-tighter">Bắt buộc</Badge>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm line-clamp-2 leading-relaxed">
                                        {lesson.summary || "Nội dung bài học chuẩn bị kỹ lưỡng bởi gia sư."}
                                    </p>

                                    {/* Video Progress indicator for current/unlocked lessons */}
                                    {!isCompleted && !isLocked && (lesson.videoProgress ?? 0) > 0 && (
                                        <div className="space-y-1.5 pt-1">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-primary/70">
                                                <span>Tiến độ xem video</span>
                                                <span>{lesson.videoProgress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-1000"
                                                    style={{ width: `${lesson.videoProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-1">
                                        {isCompleted && (
                                            <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Hoàn thành {lesson.completedAt && new Date(lesson.completedAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        )}
                                        {!isCompleted && !isLocked && (
                                            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                                <PlayCircle className="h-3.5 w-3.5" />
                                                {(lesson.videoProgress ?? 0) >= 70 ? 'Sẵn sàng sang bài tiếp' : 'Đang học'}
                                            </span>
                                        )}
                                        {isLocked && (
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <Lock className="h-3.5 w-3.5" />
                                                Cần hoàn thành bài học trước (70% video)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="shrink-0 self-center">
                                    <Button
                                        variant={isCurrent ? "default" : "outline"}
                                        size="sm"
                                        disabled={isLocked}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onLessonSelect(lesson.lessonId);
                                        }}
                                        className={cn(
                                            "rounded-full px-6",
                                            isCompleted && "bg-green-500 hover:bg-green-600 border-none text-white",
                                            isLocked && "grayscale opacity-50"
                                        )}
                                    >
                                        {isCompleted ? "Xem lại" : isCurrent ? "Học ngay" : "Chưa mở"}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
