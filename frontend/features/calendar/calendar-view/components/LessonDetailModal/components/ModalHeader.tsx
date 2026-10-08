import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SessionRecord } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { BookOpen, X } from 'lucide-react';

import type { LessonStatus } from '@/lib/types/lesson-status';

interface ModalHeaderProps {
    session: SessionRecord;
    currentStatus?: LessonStatus;
    onClose: () => void;
}

export function ModalHeader({ session, currentStatus, onClose }: ModalHeaderProps) {
    const status = currentStatus || (session.status as LessonStatus);
    const isCancelled = status === 'CANCELLED_BY_STUDENT' || status === 'CANCELLED_BY_TUTOR';
    const isPaid = !isCancelled && (session.paid || status === 'PAID');

    // Flat solid colors instead of gradients (A3)
    const headerBg = isCancelled
        ? 'bg-amber-600 dark:bg-amber-700'
        : isPaid
            ? 'bg-emerald-600 dark:bg-emerald-700'
            : 'bg-blue-600 dark:bg-blue-700';

    return (
        <div className={cn(
            "relative p-2.5 sm:p-6 shrink-0 transition-colors duration-300",
            headerBg
        )}>
            {/* Removed white/10 glow blob – only modal itself keeps shadow */}

            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
                        <BookOpen size={14} className="sm:hidden" />
                        <BookOpen size={24} className="hidden sm:block" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                            {/* Label: sentence case, not all-caps, no letter-spacing */}
                            <h3 className="text-white/90 font-medium text-[11px] sm:text-[13px] whitespace-nowrap">Chi tiết buổi học</h3>
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 py-0 h-4 text-[8px] sm:text-[9px] font-medium">
                                #{session.sessionNumber ? session.sessionNumber : session.id}
                            </Badge>
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 py-0 h-4 text-[8px] sm:text-[9px] font-medium">
                                {session.sessionDate}
                            </Badge>
                            {session.isOnline && (
                                <Badge className="bg-blue-400 hover:bg-blue-500 text-white border-0 py-0 h-4 text-[8px] sm:text-[9px] font-medium">
                                    🌐 Dạy Online
                                </Badge>
                            )}
                        </div>
                        {/* Student name: Title Case, weight 600, ~17px */}
                        <h1 className="text-[14px] sm:text-xl font-semibold text-white leading-tight capitalize">
                            {session.studentName}
                        </h1>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Đóng"
                    className="rounded-full text-white hover:bg-white/20 h-6 w-6 sm:h-10 sm:w-10 shrink-0"
                >
                    <X size={14} className="sm:hidden" />
                    <X size={20} className="hidden sm:block" />
                </Button>
            </div>
        </div>
    );
}
