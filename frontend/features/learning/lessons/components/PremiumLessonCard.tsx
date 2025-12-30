'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video,
    Play,
    MoreVertical,
    Pencil,
    Copy,
    Trash2,
    User,
    Calendar,
    Eye,
    CheckCircle2,
    Clock,
    Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { LessonLibraryDTO } from '../types';

interface PremiumLessonCardProps {
    lesson: LessonLibraryDTO;
    onEdit?: (lesson: LessonLibraryDTO) => void;
    onDelete?: (lesson: LessonLibraryDTO) => void;
    onAssign?: (lesson: LessonLibraryDTO) => void;
    onPreview?: (lessonId: number) => void;
}

export function PremiumLessonCard({
    lesson,
    onEdit,
    onDelete,
    onAssign,
    onPreview
}: PremiumLessonCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ y: -6 }}
            className={cn(
                "group relative overflow-hidden flex flex-col h-full",
                "rounded-2xl border bg-card cursor-pointer",
                "transition-all duration-500",
                "hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40"
            )}
            onClick={() => onPreview?.(lesson.id)}
        >
            {/* Thumbnail Area */}
            <div className="relative aspect-video bg-muted overflow-hidden shrink-0">
                {lesson.thumbnailUrl ? (
                    <img
                        src={lesson.thumbnailUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f3f4f6/a1a1aa?text=No+Image';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/80 to-muted transition-transform duration-700 group-hover:scale-105">
                        <Video className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                )}

                {/* Play Overlay */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl"
                            >
                                <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category Badge */}
                {lesson.category && (
                    <div className="absolute top-3 left-3 z-20">
                        <Badge
                            className="backdrop-blur-md border-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                            style={{
                                backgroundColor: `${lesson.category.color}dd` || '#3b82f6dd',
                                color: 'white'
                            }}
                        >
                            {lesson.category.name}
                        </Badge>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-20">
                    {lesson.isPublished ? (
                        <Badge className="backdrop-blur-md bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 px-2 py-0.5">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Public
                        </Badge>
                    ) : (
                        <Badge className="backdrop-blur-md bg-amber-500/90 hover:bg-amber-500 text-white border-0 px-2 py-0.5">
                            <Clock className="w-3 h-3 mr-1" />
                            Draft
                        </Badge>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1 space-y-4">
                {/* Title */}
                <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {lesson.title}
                </h3>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[13px] text-muted-foreground">
                    <div className="flex items-center gap-2 truncate">
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{lesson.tutorName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{lesson.lessonDate ? format(new Date(lesson.lessonDate), 'dd/MM/yyyy') : 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        <span>{lesson.assignedStudentCount || 0} đã giao</span>
                    </div>

                    <div className="flex items-center gap-2 text-primary font-medium">
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        <span>Xem chi tiết</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary font-semibold text-xs"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAssign?.(lesson);
                        }}
                    >
                        <Users className="w-3.5 h-3.5 mr-2" />
                        Giao bài
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl">
                            <DropdownMenuItem
                                onClick={(e) => { e.stopPropagation(); onEdit?.(lesson); }}
                                className="rounded-lg py-2 cursor-pointer"
                            >
                                <Pencil className="w-4 h-4 mr-2.5 text-blue-500" />
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => { e.stopPropagation(); /* handleDuplicate? */ }}
                                className="rounded-lg py-2 cursor-pointer"
                            >
                                <Copy className="w-4 h-4 mr-2.5 text-indigo-500" />
                                Nhân bản
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1.5" />
                            <DropdownMenuItem
                                onClick={(e) => { e.stopPropagation(); onDelete?.(lesson); }}
                                className="rounded-lg py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                            >
                                <Trash2 className="w-4 h-4 mr-2.5" />
                                Xóa bài giảng
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </motion.div>
    );
}
