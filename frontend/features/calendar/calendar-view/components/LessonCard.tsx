import type { SessionRecord } from '@/lib/types/finance';
import { getStatusColors, formatCurrency } from '../utils/statusColors';

interface LessonCardProps {
    session: SessionRecord;
    compact?: boolean;
    onClick?: () => void;
    onContextMenu?: (e: React.MouseEvent, session: SessionRecord) => void;
    onUpdate?: (updated: SessionRecord) => void;
    onDelete?: (id: number) => void;
    onEdit?: (session: SessionRecord) => void;
}

/**
 * Enhanced LessonCard Component
 * 
 * Displays lesson information with enhanced details:
 * - Student name
 * - Time range (HH:mm-HH:mm)
 * - Subject
 * - Fee
 * - Quick actions on hover
 * - Right-click context menu
 * 
 * Format: • BẢO HÂN
 *           14:00-15:30 • Toán 10 • 300k
 */
export function LessonCard({ session, compact = false, onClick, onContextMenu, onUpdate, onDelete, onEdit }: LessonCardProps) {
    // Get colors based on new status or fallback to legacy
    const colors = session.status
        ? getStatusColors(session.status)
        : getStatusColors(session.completed ? (session.paid ? 'PAID' : 'COMPLETED') : 'SCHEDULED');

    // Build time display
    const timeDisplay = session.startTime && session.endTime
        ? `${session.startTime}-${session.endTime}`
        : null;

    // Build info line (time • subject • fee)
    const infoParts: string[] = [];
    if (timeDisplay) infoParts.push(timeDisplay);
    if (session.subject) infoParts.push(session.subject);
    infoParts.push(formatCurrency(session.totalAmount));

    const infoLine = infoParts.join(' • ');

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu?.(e, session);
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            onContextMenu={handleContextMenu}
            className={`
        text-xs px-1.5 py-0.5 rounded-md font-semibold border 
        flex flex-col gap-0.5 transition-all cursor-pointer relative group
        hover:shadow-sm hover:scale-[1.02]
        ${colors.bg} ${colors.border} ${colors.text}
      `}
        >
            {/* Student name with status dot */}
            <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                <span className="truncate font-bold">{session.studentName}</span>
            </div>

            {/* Info line: time • subject • fee */}
            {!compact && (
                <div className="text-[10px] opacity-90 truncate pl-3">
                    {infoLine}
                </div>
            )}

        </div>
    );
}
