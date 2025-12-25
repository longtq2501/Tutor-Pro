import type { SessionRecord } from '@/lib/types/finance';
import { LessonCard } from './LessonCard';
import { useState } from 'react';
import { LessonListPopover } from './LessonListPopover';

interface CompactLessonListProps {
    sessions: SessionRecord[];
    onSessionClick?: (session: SessionRecord) => void;
    onContextMenu?: (e: React.MouseEvent, session: SessionRecord) => void;
}

/**
 * CompactLessonList Component
 * 
 * Displays up to 2 sessions, with "+ X nữa..." for additional sessions.
 * Clicking "+ X nữa..." opens a popover with the full list.
 */
export function CompactLessonList({ sessions, onSessionClick, onContextMenu }: CompactLessonListProps) {
    const [showPopover, setShowPopover] = useState(false);

    const MAX_VISIBLE = 2;
    const visibleSessions = sessions.slice(0, MAX_VISIBLE);
    const remainingCount = sessions.length - MAX_VISIBLE;

    return (
        <div className="space-y-0.5 relative">
            {/* Show first 2 sessions */}
            {visibleSessions.map((session) => (
                <LessonCard
                    key={session.id}
                    session={session}
                    compact
                    onClick={() => onSessionClick?.(session)}
                    onContextMenu={onContextMenu}
                />
            ))}

            {/* Show "+ X nữa..." if more than 2 */}
            {remainingCount > 0 && (
                <>
                    <div
                        onClick={() => setShowPopover(true)}
                        className="text-xs text-primary font-medium pl-1 hover:underline pt-0.5 cursor-pointer"
                    >
                        + {remainingCount} nữa...
                    </div>

                    {/* Popover with full list */}
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
                </>
            )}
        </div>
    );
}
