import type { SessionRecord, SessionRecordUpdateRequest } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LESSON_STATUS_LABELS } from '@/lib/types/lesson-status';
import { sessionsApi } from '@/lib/services';
import { getStatusColors } from '../utils/statusColors';

interface LessonDetailModalProps {
    session: SessionRecord;
    onClose: () => void;
    onUpdate?: (updated: SessionRecord) => void;
    initialMode?: 'view' | 'edit';
}

/**
 * LessonDetailModal Component
 * 
 * Full-featured modal for viewing and editing session details.
 * Includes all fields, status updates, and optimistic locking.
 */
export function LessonDetailModal({ session, onClose, onUpdate, initialMode = 'view' }: LessonDetailModalProps) {
    const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
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

    // Sync form when entering edit mode
    useEffect(() => {
        if (mode === 'edit') {
            setFormData({
                startTime: session.startTime || '',
                endTime: session.endTime || '',
                subject: session.subject || '',
                notes: session.notes || '',
                status: (session.status || 'SCHEDULED') as LessonStatus,
            });
        }
    }, [mode, session]);

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

    // Derived calculations for preview
    const calculateHours = (start: string, end: string) => {
        if (!start || !end) return session.hours;
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff < 0) diff += 24 * 60; // Over midnight
        return diff / 60;
    };

    const currentHours = calculateHours(formData.startTime, formData.endTime);
    const currentTotal = currentHours * session.pricePerHour;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (session.version === undefined || session.version === null) {
            alert('Lỗi: Phiên bản dữ liệu không hợp lệ (Missing Version). Hãy thử tải lại trang.');
            return;
        }

        setLoading(true);
        try {
            // Check if anything changed beyond status for full update
            // Actually, we can just use the update method for everything now as it handles status too
            const updatePayload: SessionRecordUpdateRequest = {
                ...formData,
                hoursPerSession: currentHours,
                version: session.version
            };

            const updated = await sessionsApi.update(session.id, updatePayload);
            onUpdate?.(updated);
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
                <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
                    <h2 className="text-lg font-semibold">
                        {mode === 'view' ? 'Chi tiết buổi học' : 'Chỉnh sửa buổi học'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-muted rounded-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {mode === 'view' ? (
                    <div className="p-5 space-y-6">
                        {/* Student Info */}
                        <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                                {session.studentName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground capitalize">{session.studentName}</h3>
                                <p className="text-sm text-muted-foreground">{session.sessionDate}</p>
                            </div>
                            <div className="ml-auto">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColors(formData.status).bg} ${getStatusColors(formData.status).text} border ${getStatusColors(formData.status).border}`}>
                                    {LESSON_STATUS_LABELS[formData.status]}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Môn học</label>
                                <div className="text-sm font-medium">{session.subject || 'Chưa cập nhật'}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Thời gian</label>
                                <div className="text-sm font-medium">
                                    {session.startTime && session.endTime
                                        ? `${session.startTime} - ${session.endTime}`
                                        : 'Chưa có khung giờ'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Số giờ</label>
                                <div className="text-sm font-medium">{session.hours}h</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Đơn giá</label>
                                <div className="text-sm font-medium">{session.pricePerHour.toLocaleString()}đ/h</div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Ghi chú nội dung</label>
                            <div className="text-sm p-3 bg-muted/30 rounded-lg min-h-[80px] text-foreground leading-relaxed">
                                {session.notes || (
                                    <span className="text-muted-foreground italic">Không có ghi chú cho buổi học này.</span>
                                )}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="pt-4 border-t border-border flex justify-between items-center">
                            <div className="text-xs font-bold text-muted-foreground tracking-tight uppercase">Tổng cộng thành tiền</div>
                            <div className="text-2xl font-black text-primary">{session.totalAmount.toLocaleString()}đ</div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 border border-border rounded-lg hover:bg-muted font-medium text-sm transition-colors"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={() => setMode('edit')}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-bold text-sm transition-all shadow-sm shadow-primary/20"
                            >
                                Chỉnh sửa thông tin
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        {/* Student Info (Read-only) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-border/50">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">Học sinh</label>
                                <div className="text-sm md:text-base font-bold text-foreground capitalize">{session.studentName}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-border/50">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">Ngày học</label>
                                <div className="text-sm md:text-base font-medium">{session.sessionDate}</div>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="text-xs font-semibold mb-1.5 block">Giờ bắt đầu</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold mb-1.5 block">Giờ kết thúc</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="text-xs font-semibold mb-1.5 block">Môn học</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="Toán 10, Lý 11..."
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="text-xs font-semibold mb-1.5 block">Trạng thái</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as LessonStatus })}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                            <label className="text-xs font-semibold mb-1.5 block">Ghi chú</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                                placeholder="Nội dung buổi học..."
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Financial Info (Read-only) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Số giờ</label>
                                <div className="text-sm font-semibold">{currentHours}h</div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Đơn giá</label>
                                <div className="text-sm font-semibold">{session.pricePerHour.toLocaleString()}đ</div>
                            </div>
                            <div className="flex flex-col col-span-2 sm:col-span-1 border-t sm:border-none pt-2 sm:pt-0 border-border/50">
                                <label className="text-[10px] uppercase font-bold text-primary">Tổng tiền</label>
                                <div className="text-base font-bold text-primary">
                                    {currentTotal.toLocaleString()}đ
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-border">
                            <button
                                type="button"
                                onClick={() => setMode('view')}
                                className="w-full sm:w-auto px-4 py-2 border border-border rounded-lg hover:bg-muted font-medium text-sm transition-colors order-2 sm:order-1"
                            >
                                Quay lại xem
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isDirty}
                                className="w-full sm:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-bold text-sm transition-all shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                            >
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
