import type { SessionRecord } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LESSON_STATUS_LABELS } from '@/lib/types/lesson-status';
import { sessionApi } from '../api/sessionApi';

interface LessonDetailModalProps {
    session: SessionRecord;
    onClose: () => void;
    onUpdate?: (updated: SessionRecord) => void;
}

/**
 * LessonDetailModal Component
 * 
 * Full-featured modal for viewing and editing session details.
 * Includes all fields, status updates, and optimistic locking.
 */
export function LessonDetailModal({ session, onClose, onUpdate }: LessonDetailModalProps) {
    const [formData, setFormData] = useState<{
        startTime: string;
        endTime: string;
        subject: string;
        notes: string;
        status: LessonStatus;
    }>({
        startTime: session.startTime || '',
        endTime: session.endTime || '',
        subject: session.subject || '',
        notes: session.notes || '',
        status: (session.status || 'SCHEDULED') as LessonStatus,
    });
    const [loading, setLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Track changes
    useEffect(() => {
        const hasChanges =
            formData.startTime !== (session.startTime || '') ||
            formData.endTime !== (session.endTime || '') ||
            formData.subject !== (session.subject || '') ||
            formData.notes !== (session.notes || '') ||
            formData.status !== (session.status || 'SCHEDULED');
        setIsDirty(hasChanges);
    }, [formData, session]);

    // Close on ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isDirty]);

    const handleClose = () => {
        if (isDirty && !confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn đóng?')) {
            return;
        }
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session.version) {
            alert('Version không hợp lệ');
            return;
        }

        setLoading(true);
        try {
            // Update status if changed
            if (formData.status !== (session.status || 'SCHEDULED')) {
                const updated = await sessionApi.updateStatus(
                    session.id,
                    formData.status as LessonStatus,
                    session.version
                );
                onUpdate?.(updated);
                onClose();
            }
            // TODO: Add endpoint for updating other fields
            // For now, just close
            onClose();
        } catch (error) {
            console.error('Failed to update:', error);
            alert(error instanceof Error ? error.message : 'Failed to update session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
                    <h2 className="text-lg font-semibold">Chi tiết buổi học</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-muted rounded-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Student Info (Read-only) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Học sinh</label>
                            <div className="text-base font-semibold">{session.studentName}</div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Ngày học</label>
                            <div className="text-base">{session.sessionDate}</div>
                        </div>
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Giờ bắt đầu</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Giờ kết thúc</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                            />
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="text-sm font-medium">Môn học</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="Ví dụ: Toán 10, Lý 11"
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-sm font-medium">Trạng thái</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as LessonStatus })}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        >
                            {Object.entries(LESSON_STATUS_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-sm font-medium">Ghi chú</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={4}
                            placeholder="Nội dung buổi học, bài tập về nhà..."
                            className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                        />
                    </div>

                    {/* Financial Info (Read-only) */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Số giờ</label>
                            <div className="text-base">{session.hours}h</div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Đơn giá</label>
                            <div className="text-base">{session.pricePerHour.toLocaleString()}đ/h</div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Tổng tiền</label>
                            <div className="text-base font-semibold text-primary">
                                {session.totalAmount.toLocaleString()}đ
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !isDirty}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
