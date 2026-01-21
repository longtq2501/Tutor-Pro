import type { SessionRecord } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Globe } from 'lucide-react';
import { memo } from 'react';
import { getStatusColors } from '../utils/statusColors';

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
                "group/session relative px-2 py-1.5",
                "rounded-xl text-[10px] sm:text-[11px]",
                "font-bold truncate",
                "transition-all duration-300",
                "hover:scale-[1.03] hover:shadow-lg hover:z-20",
                "cursor-grab active:cursor-grabbing border-l-[3px] shadow-sm",
                "bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent",
                colors.bg,
                colors.text,
                "border-slate-200/50 dark:border-white/10",
                session.isOnline && "ring-2 ring-blue-500/50 dark:ring-blue-400/50 bg-blue-50/50 dark:bg-blue-900/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
                isDragging && "opacity-50 grayscale-[0.5] border-dashed border-2"
            )}
        >
            {/* Left highlight strip for dimension */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl opacity-80", colors.dot)} />

            <div className="flex items-center gap-1.5 relative z-10">
                <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm", colors.dot)} />
                {session.isOnline && (
                    <>
                        <Globe
                            className="w-3 h-3 text-blue-600 dark:text-blue-400 flex-shrink-0 animate-pulse-subtle"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Buổi học trực tuyến</span>
                    </>
                )}
                <span className="truncate">{session.studentName}</span>
                {session.paid ? (
                    <CheckCircle2 className="w-3 h-3 ml-auto flex-shrink-0 text-emerald-600 dark:text-emerald-400 drop-shadow-sm" />
                ) : (
                    <Clock className="w-3 h-3 ml-auto flex-shrink-0 opacity-40" />
                )}
            </div>
        </motion.div>
    );
});

DraggableSession.displayName = 'DraggableSession';
