import type { SessionRecord } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { CheckCircle2, Globe, Clock } from 'lucide-react';
import { memo } from 'react';
import { getStatusColors, isCancelledStatus } from '../utils/statusColors';

interface DraggableSessionProps {
    session: SessionRecord;
    index: number;
    onSessionClick: (session: SessionRecord) => void;
    onContextMenu?: (e: React.MouseEvent, session: SessionRecord) => void;
}

export const DraggableSession = memo(({
    session,
    index,
    onSessionClick,
    onContextMenu
}: DraggableSessionProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `session-${session.id}-${session.version}`,
        data: session,
    });

    const colors = getStatusColors(session.status);
    const cancelled = isCancelledStatus(session.status);
    const isCompleted = session.status === 'COMPLETED' || session.status === 'PAID';

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isDragging ? 0.5 : 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={(e) => {
                // Prevent click during/after drag
                if (transform) return;
                e.stopPropagation();
                onSessionClick?.(session);
            }}
            onContextMenu={(e) => {
                if (onContextMenu) {
                    e.preventDefault();
                    e.stopPropagation();
                    onContextMenu(e, session);
                }
            }}
            className={cn(
                "group/session relative px-1.5 sm:px-2 py-1",
                "rounded-lg sm:rounded-xl",
                "transition-all duration-200",
                "hover:scale-[1.02] hover:shadow-md hover:z-20",
                "cursor-grab active:cursor-grabbing border-l-[3px]",
                colors.bg,
                colors.text,
                "border-slate-200/50 dark:border-white/10",
                session.isOnline && "ring-1 ring-blue-500/40 dark:ring-blue-400/40",
                isDragging && "opacity-50 grayscale-[0.5] border-dashed border-2",
                cancelled && "opacity-80"
            )}
        >
            {/* Left highlight strip */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl opacity-80", colors.dot)} />

            {/* P4: time FIRST, then name — tabular-nums, 11-12px, ≥4.5:1 contrast */}
            <div className="flex items-center gap-1 relative z-10 min-w-0">
                {/* Start time — leftmost, flex-shrink-0 so it never gets cut */}
                <span className={cn(
                    "tabular-nums text-[10px] sm:text-[11px] font-semibold flex-shrink-0 leading-none opacity-90",
                    cancelled && "opacity-60"
                )}>
                    {session.startTime}
                </span>

                {/* Online indicator */}
                {session.isOnline && (
                    <>
                        <Globe
                            className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Buổi học trực tuyến</span>
                    </>
                )}

                {/* Student name — truncates cleanly with ellipsis */}
                <span className={cn(
                    "truncate text-[10px] sm:text-[11px] font-medium min-w-0 leading-none",
                    cancelled && "line-through opacity-70"
                )}>
                    {session.studentName}
                </span>

                {/* Completed checkmark icon */}
                {isCompleted && !cancelled && (
                    <CheckCircle2
                        className="w-2.5 h-2.5 flex-shrink-0 ml-auto opacity-70"
                        aria-hidden="true"
                    />
                )}
            </div>
        </motion.div>
    );
});

DraggableSession.displayName = 'DraggableSession';
