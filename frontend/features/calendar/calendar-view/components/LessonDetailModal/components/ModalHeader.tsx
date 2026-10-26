import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SessionRecord } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';
import { LESSON_STATUS_LABELS } from '@/lib/types/lesson-status';
import { cn } from '@/lib/utils';
import { BookOpen, CheckCircle2, Globe, Monitor, X } from 'lucide-react';
import { getStatusColors } from '../../../utils/statusColors';

interface ModalHeaderProps {
    session: SessionRecord;
    currentStatus?: LessonStatus;
    onClose: () => void;
}

export function ModalHeader({ session, currentStatus, onClose }: ModalHeaderProps) {
    const status = currentStatus || (session.status as LessonStatus);
    const isCancelled = status === 'CANCELLED_BY_STUDENT' || status === 'CANCELLED_BY_TUTOR';
    const isPaid = !isCancelled && (session.paid || status === 'PAID');
    const isCompleted = status === 'COMPLETED' || isPaid;
    const statusColors = getStatusColors(status);

    return (
        <div className="relative px-4 py-3.5 sm:px-6 sm:py-4 shrink-0 bg-card border-b border-border/60 transition-colors">
            <div className="flex items-center justify-between gap-3">
                {/* Left: Icon + Title details */}
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    {/* Icon container with soft status tint */}
                    <div className={cn(
                        "w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border transition-colors",
                        isCompleted
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : isCancelled
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-primary/10 text-primary border-primary/20"
                    )}>
                        {isCompleted ? (
                            <CheckCircle2 size={20} className="sm:size-5" />
                        ) : (
                            <BookOpen size={20} className="sm:size-5" />
                        )}
                    </div>

                    {/* Title info */}
                    <div className="min-w-0">
                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
                                Chi tiết buổi học
                            </span>
                            <Badge variant="outline" className="h-5 px-1.5 py-0 text-[10px] font-semibold bg-muted/50 border-border/60 text-foreground/80">
                                #{session.sessionNumber ?? session.id}
                            </Badge>
                            <Badge variant="outline" className="h-5 px-1.5 py-0 text-[10px] font-semibold bg-muted/50 border-border/60 text-foreground/80">
                                {session.sessionDate}
                            </Badge>
                            {session.isOnline ? (
                                <Badge variant="outline" className="h-5 px-2 py-0 text-[10px] font-semibold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center gap-1">
                                    <Globe size={10} />
                                    <span>Online</span>
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="h-5 px-2 py-0 text-[10px] font-semibold bg-muted/30 text-muted-foreground border-border/50 flex items-center gap-1">
                                    <Monitor size={10} />
                                    <span>Offline</span>
                                </Badge>
                            )}
                        </div>

                        {/* Student Name */}
                        <h2 className="text-base sm:text-lg font-bold text-foreground leading-tight capitalize truncate">
                            {session.studentName}
                        </h2>
                    </div>
                </div>

                {/* Right: Status pill + Close button */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className={cn(
                        "hidden sm:inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold border select-none transition-colors",
                        statusColors.bg, statusColors.border, statusColors.text
                    )}>
                        {LESSON_STATUS_LABELS[status as keyof typeof LESSON_STATUS_LABELS] || status}
                    </span>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Đóng"
                        className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 h-8 w-8 sm:h-9 sm:w-9"
                    >
                        <X size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
