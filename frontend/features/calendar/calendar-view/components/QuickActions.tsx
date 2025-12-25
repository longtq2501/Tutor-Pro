import type { SessionRecord } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';
import { Check, DollarSign, FileText, X, Copy, Calendar } from 'lucide-react';
import { useState } from 'react';
import { sessionApi } from '../api/sessionApi';

interface QuickActionsProps {
    session: SessionRecord;
    onUpdate?: (updated: SessionRecord) => void;
}

/**
 * QuickActions Component
 * 
 * Hover-based quick actions for lesson cards:
 * - Mark as Taught (COMPLETED)
 * - Confirm Payment (PAID)
 * - Add Note
 * - Cancel
 * - Duplicate
 */
export function QuickActions({ session, onUpdate }: QuickActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleStatusUpdate = async (newStatus: LessonStatus) => {
        if (!session.version) return;

        setLoading(true);
        try {
            const updated = await sessionApi.updateStatus(session.id, newStatus, session.version);
            onUpdate?.(updated);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert(error instanceof Error ? error.message : 'Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const handleDuplicate = async () => {
        setLoading(true);
        try {
            const duplicated = await sessionApi.duplicate(session.id);
            onUpdate?.(duplicated);
        } catch (error) {
            console.error('Failed to duplicate:', error);
            alert('Failed to duplicate session');
        } finally {
            setLoading(false);
        }
    };

    const currentStatus = session.status || 'SCHEDULED';

    return (
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded-md shadow-lg p-1 flex gap-1 z-10">
            {/* Mark as Taught */}
            {(currentStatus === 'SCHEDULED' || currentStatus === 'CONFIRMED') && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate('COMPLETED');
                    }}
                    disabled={loading}
                    className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded text-green-600 dark:text-green-400 transition-colors"
                    title="Đánh dấu đã dạy"
                >
                    <Check size={14} />
                </button>
            )}

            {/* Confirm Payment */}
            {(currentStatus === 'COMPLETED' || currentStatus === 'PENDING_PAYMENT') && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate('PAID');
                    }}
                    disabled={loading}
                    className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded text-emerald-600 dark:text-emerald-400 transition-colors"
                    title="Xác nhận thanh toán"
                >
                    <DollarSign size={14} />
                </button>
            )}

            {/* Duplicate */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate();
                }}
                disabled={loading}
                className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition-colors"
                title="Nhân bản buổi học"
            >
                <Copy size={14} />
            </button>

            {/* Cancel */}
            {currentStatus !== 'PAID' && currentStatus !== 'CANCELLED_BY_TUTOR' && currentStatus !== 'CANCELLED_BY_STUDENT' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Bạn có chắc muốn hủy buổi học này?')) {
                            handleStatusUpdate('CANCELLED_BY_TUTOR');
                        }
                    }}
                    disabled={loading}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
                    title="Hủy buổi học"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
