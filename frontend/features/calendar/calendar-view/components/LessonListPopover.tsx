import type { SessionRecord } from '@/lib/types/finance';
import { LessonCard } from './LessonCard';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface LessonListPopoverProps {
    sessions: SessionRecord[];
    onClose: () => void;
    onSessionClick?: (session: SessionRecord) => void;
}

/**
 * LessonListPopover Component
 * 
 * Popover that displays the full list of sessions for a day.
 * Appears when clicking "+ X nữa..." in CompactLessonList.
 */
export function LessonListPopover({ sessions, onClose, onSessionClick }: LessonListPopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Close on ESC key
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div
                ref={popoverRef}
                className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">
                        Tất cả buổi học ({sessions.length})
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-md transition-colors"
                        aria-label="Đóng"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Session list */}
                <div className="space-y-2">
                    {sessions.map((session) => (
                        <LessonCard
                            key={session.id}
                            session={session}
                            onClick={() => onSessionClick?.(session)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
