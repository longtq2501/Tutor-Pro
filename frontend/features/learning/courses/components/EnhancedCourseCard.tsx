'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    Layers,
    Clock,
    Users,
    MoreVertical,
    Edit3,
    Trash2,
    Play,
    Share2,
    Bookmark,
    ChevronRight,
    Sparkles,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CourseDTO } from '../types';

interface EnhancedCourseCardProps {
    course: CourseDTO;
    onEdit?: (course: CourseDTO) => void;
    onDelete?: (course: CourseDTO) => void;
    onAssign?: (course: CourseDTO) => void;
    onPreview?: (course: CourseDTO) => void;
    onClick?: (course: CourseDTO) => void;
}

export function EnhancedCourseCard({
    course,
    onEdit,
    onDelete,
    onAssign,
    onPreview,
    onClick,
}: EnhancedCourseCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const getDifficultyColor = (level?: string) => {
        switch (level) {
            case 'BEGINNER': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'INTERMEDIATE': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'ADVANCED': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    const getDifficultyLabel = (level?: string) => {
        switch (level) {
            case 'BEGINNER': return 'Cơ bản';
            case 'INTERMEDIATE': return 'Trung cấp';
            case 'ADVANCED': return 'Nâng cao';
            default: return 'Chưa xác định';
        }
    };

    // Mock gradient based on ID
    const gradients = [
        'from-indigo-600 via-blue-600 to-cyan-500',
        'from-purple-600 via-pink-600 to-rose-500',
        'from-emerald-600 via-teal-600 to-cyan-500',
        'from-amber-600 via-orange-600 to-rose-500',
    ];
    const gradient = gradients[course.id % gradients.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative flex flex-col h-full bg-card rounded-3xl border border-border/40 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
            onClick={() => onClick?.(course)}
        >
            {/* Visual Header / Cover */}
            <div className={cn(
                "relative h-48 overflow-hidden bg-gradient-to-br transition-all duration-700",
                gradient
            )}>
                {/* Abstract pattern / decorative elements */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,white_0%,transparent_50%)]" />
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <GraduationCap className="w-32 h-32 rotate-12" />
                </div>

                {/* Status & Badge overlay */}
                <div className="absolute top-4 left-4 flex gap-2 z-20">
                    <Badge className={cn("backdrop-blur-md border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1", getDifficultyColor(course.difficultyLevel))}>
                        {getDifficultyLabel(course.difficultyLevel)}
                    </Badge>
                    {!course.isPublished && (
                        <Badge variant="secondary" className="backdrop-blur-md bg-black/20 text-white border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                            Nháp
                        </Badge>
                    )}
                </div>

                {/* Favorite/Bookmark shortcut */}
                <div className="absolute top-4 right-4 z-20">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white border-0 shadow-none"
                        onClick={(e) => { e.stopPropagation(); /* Favorite logic */ }}
                    >
                        <Bookmark className="w-4 h-4" />
                    </Button>
                </div>

                {/* Center Play Icon on Hover */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-10 bg-black/10 backdrop-blur-[2px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-2xl">
                                <Play className="w-7 h-7 fill-current ml-1" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Course Progress Indicator (Decorative for now, could be real) */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                    <div className="h-full bg-white/60 w-1/3 rounded-r-full" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 flex flex-col flex-1 space-y-4">
                {/* Title & Author */}
                <div className="space-y-1.5">
                    <h3 className="text-xl font-extrabold leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {course.description || "Chưa có mô tả chi tiết cho lộ trình học tập này."}
                    </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted/30 border border-border/40">
                        <Layers className="w-4 h-4 text-primary" />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold">{course.lessonCount || 0}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-medium">bài giảng</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted/30 border border-border/40">
                        <Clock className="w-4 h-4 text-primary" />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold">{course.estimatedHours || 0}h</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-medium">dự kiến</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/40">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    U{i}
                                </div>
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            +8
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 relative z-20">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-background/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPreview?.(course);
                            }}
                            title="Xem bản học viên"
                        >
                            <Eye className="w-4.5 h-4.5" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 rounded-xl px-4 border-primary/20 hover:bg-primary/5 hover:text-primary font-bold text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAssign?.(course);
                            }}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Giao khóa
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-10 h-10 rounded-xl hover:bg-muted"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl border-2">
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit?.(course);
                                    }}
                                    className="rounded-xl py-2.5 font-medium"
                                >
                                    <Edit3 className="w-4 h-4 mr-3 text-blue-500" />
                                    Chỉnh sửa lộ trình
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-2" />
                                <DropdownMenuItem
                                    className="rounded-xl py-2.5 font-medium text-destructive focus:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete?.(course);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-3" />
                                    Xóa khóa học
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Premium Decorative Badge */}
            <div className="absolute -right-8 -top-8 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
        </motion.div>
    );
}
