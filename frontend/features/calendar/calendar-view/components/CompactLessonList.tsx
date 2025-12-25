import type { SessionRecord } from '@/lib/types/finance';
import { LessonCard } from './LessonCard';
import { useState } from 'react';
import { LessonListPopover } from './LessonListPopover';
import { STATUS_COLORS } from '../utils/statusColors';

interface CompactLessonListProps {
    sessions: SessionRecord[];
    onSessionClick?: (session: SessionRecord) => void;
    onSessionEdit?: (session: SessionRecord) => void;
    onUpdate?: (updated: SessionRecord) => void;
    onContextMenu?: (e: React.MouseEvent, session: SessionRecord) => void;
}

/**
 * CompactLessonList Component
 * 
 * Displays up to 2 sessions, with "+ X nữa..." for additional sessions.
 * On mobile, displays color-coded dots to save space.
 * Clicking "+ X nữa..." or the date cell opens a popover or modal.
 */
export function CompactLessonList({ sessions, onSessionClick, onSessionEdit, onUpdate, onContextMenu }: CompactLessonListProps) {
    const [showPopover, setShowPopover] = useState(false);

    const MAX_VISIBLE_CARDS = 2;
    const MAX_VISIBLE_DOTS = 3;

    const visibleSessions = sessions.slice(0, MAX_VISIBLE_CARDS);
    const dotsSessions = sessions.slice(0, MAX_VISIBLE_DOTS);

    const remainingCards = sessions.length - MAX_VISIBLE_CARDS;
    const remainingDots = sessions.length - MAX_VISIBLE_DOTS;

    return (
        <div className="space-y-0.5 relative">
            {/* --- DESKTOP VIEW: CARDS --- */}
            <div className="hidden md:block space-y-0.5">
                {visibleSessions.map((session) => (
                    <LessonCard
                        key={session.id}
                        session={session}
                        compact
                        onClick={() => onSessionClick?.(session)}
                        onUpdate={onUpdate}
                        onEdit={onSessionEdit}
                        onContextMenu={onContextMenu}
                    />
                ))}

                {remainingCards > 0 && (
                    <div
                        onClick={(e) => { e.stopPropagation(); setShowPopover(true); }}
                        className="text-[10px] text-primary font-medium pl-1 hover:underline pt-0.5 cursor-pointer"
                    >
                        + {remainingCards} nữa...
                    </div>
                )}
            </div>

            {/* --- MOBILE VIEW: DOTS --- */}
            <div className="flex md:hidden items-center gap-1 mt-1 px-1 flex-wrap">
                {dotsSessions.map((session) => {
                    const colors = STATUS_COLORS[session.status || 'SCHEDULED'];
                    return (
                        <span
                            key={session.id}
                            className={`w-1.5 h-1.5 rounded-full ${colors.dot} ring-1 ring-white dark:ring-slate-900 shadow-sm`}
                            title={colors.label}
                        />
                    );
                })}
                {remainingDots > 0 && (
                    <span className="text-[9px] text-muted-foreground font-bold leading-none">
                        +{remainingDots}
                    </span>
                )}
            </div>

            {/* Popover with full list (shared) */}
            {showPopover && (
                <LessonListPopover
                    sessions={sessions}
                    onClose={() => setShowPopover(false)}
                    onSessionClick={(session) => {
                        setShowPopover(false);
                        onSessionClick?.(session);
                    }}
                />
            )}
        </div>
    );
}
