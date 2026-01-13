'use client';

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
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Copy,
    Eye,
    MoreVertical,
    Pencil,
    Play,
    Trash2,
    User,
    Users,
    Video
} from 'lucide-react';
import { memo, useState } from 'react';
import { LessonLibraryDTO } from '../types';

interface PremiumLessonCardProps {
    lesson: LessonLibraryDTO;
    onEdit?: (lesson: LessonLibraryDTO) => void;
    onDelete?: (lesson: LessonLibraryDTO) => void;
    onAssign?: (lesson: LessonLibraryDTO) => void;
    onPreview?: (lessonId: number) => void;
}

export const PremiumLessonCard = memo(({
    lesson,
    onEdit,
    onDelete,
    onAssign,
    onPreview
}: PremiumLessonCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ y: -2 }} // Minimal lift
            className={cn(
                "group relative overflow-hidden flex flex-col h-full",
                "rounded-lg border bg-card cursor-pointer", // Standard radius
                "transition-all duration-300",
                "hover:shadow-lg hover:border-primary/40",
                "will-change-transform contain-layout"
            )}
            onClick={() => onPreview?.(lesson.id)}
        >
            {/* Thumbnail Area - Ultra Compact [2.2/1] */}
            <div className="relative aspect-[2.2/1] bg-muted overflow-hidden shrink-0">
                {lesson.thumbnailUrl ? (
                    <img
                        src={lesson.thumbnailUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/80 to-muted">
                        <Video className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                )}

                {/* Play Overlay - Minimal */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/20 flex items-center justify-center z-10"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
                                <Play className="w-3 h-3 text-primary fill-primary ml-0.5" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category Badge - Tiny */}
                {lesson.category && (
                    <div className="absolute top-1.5 left-1.5 z-20">
                        <Badge
                            className="backdrop-blur-md border-0 px-1.5 py-0 text-[8px] font-bold uppercase tracking-wider h-4"
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

            {/* Content Section - Compact */}
            <div className="p-2.5 flex flex-col flex-1 space-y-1.5">
                {/* Title */}
                <h3 className="font-bold text-[13px] leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {lesson.title}
                </h3>

                {/* Metadata Grid - Compact */}
                <div className="grid grid-cols-2 gap-y-1 gap-x-1.5 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1 truncate">
                        <User className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{lesson.tutorName}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 shrink-0" />
                        <span>{lesson.lessonDate ? format(new Date(lesson.lessonDate), 'dd/MM/yyyy') : 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Users className="w-2.5 h-2.5 shrink-0" />
                        <span>{lesson.assignedStudentCount || 0} đã giao</span>
                    </div>
                </div>

                <div className="mt-auto pt-2 border-t flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 rounded-md hover:bg-primary/5 hover:text-primary font-medium text-[10px] -ml-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAssign?.(lesson);
                        }}
                    >
                        <Users className="w-3 h-3 mr-1" />
                        Giao bài
                    </Button>

                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-muted">
                        <MoreVertical className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
});
