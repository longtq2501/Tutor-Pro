import type { SessionRecord, SessionRecordUpdateRequest } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';
import { X, Trash2, Copy, Edit3, Save, RotateCcw, User, Calendar, Clock, BookOpen, Banknote, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LESSON_STATUS_LABELS } from '@/lib/types/lesson-status';
import { sessionsApi } from '@/lib/services';
import { getStatusColors } from '../utils/statusColors';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUI } from '@/contexts/UIContext';
import { createPortal } from 'react-dom';

interface LessonDetailModalProps {
    session: SessionRecord;
    onClose: () => void;
    onUpdate?: (updated: SessionRecord) => void;
    onDelete?: (id: number) => void;
    initialMode?: 'view' | 'edit';
}

/**
 * LessonDetailModal Component
 * 
 * Full-featured modal for viewing and editing session details.
 * Optimized for mobile with sticky header/footer and scrollable content.
 */
export function LessonDetailModal({ session, onClose, onUpdate, onDelete, initialMode = 'view' }: LessonDetailModalProps) {
    const [localSession, setLocalSession] = useState<SessionRecord>(session);
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
    const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    // Track changes
    useEffect(() => {
        const hasChanges =
            formData.startTime !== (localSession.startTime || '') ||
            formData.endTime !== (localSession.endTime || '') ||
            formData.subject !== (localSession.subject || '') ||
            formData.notes !== (localSession.notes || '') ||
            formData.status !== (localSession.status || 'SCHEDULED');
        setIsDirty(hasChanges);
    }, [formData, localSession]);

    // Sync form when entering edit mode or when localSession changes
    useEffect(() => {
        setFormData({
            startTime: localSession.startTime || '',
            endTime: localSession.endTime || '',
            subject: localSession.subject || '',
            notes: localSession.notes || '',
            status: (localSession.status || 'SCHEDULED') as LessonStatus,
        });
    }, [localSession]);

    // Sync localSession if parent prop changes significantly (e.g., ID change or manual update from outside)
    useEffect(() => {
        const currentVersion = session.version ?? 0;
        const localVersion = localSession.version ?? 0;

        if (session.id === localSession.id && currentVersion > localVersion) {
            setLocalSession(session);
        } else if (session.id !== localSession.id) {
            setLocalSession(session);
        }
    }, [session]);

    // Body scroll lock & Sidebar hiding (Problem 2)
    const { openDialog, closeDialog } = useUI();

    useEffect(() => {
        openDialog();
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        return () => {
            closeDialog();
            document.body.style.overflow = 'unset';
            // Only remove modal-open if no other modals are open
            setTimeout(() => {
                const otherModals = document.querySelectorAll('[role="dialog"]');
                if (otherModals.length === 0) {
                    document.body.classList.remove('modal-open');
                }
            }, 0);
        };
    }, []);

    const handleClose = () => {
        if (mode === 'edit' && isDirty) {
            setConfirmCloseOpen(true);
            return;
        }
        onClose();
    };

    // Derived calculations
    const calculateHours = (start: string, end: string) => {
        if (!start || !end) return session.hours;
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff <= 0) diff += 24 * 60; // Handle overnight
        return diff / 60;
    };

    const currentHours = calculateHours(formData.startTime, formData.endTime);
    const currentTotal = currentHours * session.pricePerHour;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (session.version === undefined) {
            toast.error('Lỗi: Không tìm thấy phiên bản dữ liệu.');
            return;
        }

        setLoading(true);
        try {
            const updatePayload: SessionRecordUpdateRequest = {
                ...formData,
                hoursPerSession: currentHours,
                version: localSession.version
            };

            const updated = await sessionsApi.update(localSession.id, updatePayload);
            toast.success('Đã cập nhật buổi học thành công!');
            setLocalSession(updated); // Sync local version immediately
            onUpdate?.(updated); // Notify parent
            setMode('view');
        } catch (error) {
            console.error('Failed to update:', error);
            toast.error(error instanceof Error ? error.message : 'Lỗi khi cập nhật buổi học');
        } finally {
            setLoading(false);
        }
    };

    const handleDuplicate = async () => {
        setLoading(true);
        try {
            const duplicated = await sessionsApi.duplicate(localSession.id);
            toast.success('Đã nhân bản buổi học sang tuần sau!');
            onUpdate?.(duplicated);
            onClose();
        } catch (err) {
            toast.error('Lỗi khi nhân bản buổi học');
        } finally {
            setLoading(false);
        }
    };

    const colors = getStatusColors(localSession.status as LessonStatus);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4 animate-in fade-in duration-150 ease-out">
            <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 ease-out">

                {/* Header - Sticky */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl", colors.bg, colors.text)}>
                            {mode === 'view' ? <BookOpen size={20} /> : <Edit3 size={20} />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{mode === 'view' ? 'Chi tiết buổi học' : 'Chỉnh sửa thông tin'}</h2>
                            <p className="text-xs text-muted-foreground">{localSession.studentName} • {localSession.sessionDate}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    {mode === 'view' ? (
                        <div className="space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {/* Top Left: Summary */}
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                            {localSession.studentName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-muted-foreground">Học sinh</div>
                                            <div className="text-base font-bold capitalize">{localSession.studentName}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/50">
                                            <Calendar className="text-blue-500 mb-2" size={18} />
                                            <div className="text-[10px] uppercase font-bold text-muted-foreground">Ngày dạy</div>
                                            <div className="text-sm font-semibold">{localSession.sessionDate}</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/50">
                                            <Clock className="text-purple-500 mb-2" size={18} />
                                            <div className="text-[10px] uppercase font-bold text-muted-foreground">Thời gian</div>
                                            <div className="text-sm font-semibold">{localSession.startTime} - {localSession.endTime}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Right: Status & Finance */}
                                <div className="space-y-4">
                                    <div className={cn("p-4 rounded-2xl border flex items-center justify-between", colors.bg, colors.border)}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", colors.dot)} />
                                            <span className={cn("text-sm font-bold uppercase tracking-wide", colors.text)}>
                                                {LESSON_STATUS_LABELS[localSession.status as keyof typeof LESSON_STATUS_LABELS] || localSession.status}
                                            </span>
                                        </div>
                                        <div className="text-xs font-medium opacity-70">Trạng thái</div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                                        <Banknote className="text-emerald-500 mb-2" size={18} />
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-[10px] uppercase font-bold text-muted-foreground">Thành tiền</div>
                                                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                    {localSession.totalAmount.toLocaleString()}đ
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] uppercase font-bold text-muted-foreground">{localSession.hours}h dạy</div>
                                                <div className="text-xs font-semibold">{localSession.pricePerHour.toLocaleString()}đ/h</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* bottom: Notes */}
                            <div className="p-5 rounded-2xl bg-muted/20 border border-border/50 flex gap-4">
                                <FileText className="text-muted-foreground shrink-0 mt-1" size={18} />
                                <div className="space-y-2 w-full">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Nội dung / Ghi chú</div>
                                    <div className="text-sm leading-relaxed text-foreground min-h-[60px]">
                                        {localSession.notes || <span className="text-muted-foreground italic">Không có ghi chú.</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form id="edit-session-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Giờ bắt đầu</label>
                                            <input
                                                type="time"
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                                className="w-full h-11 px-4 border border-border rounded-xl bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Giờ kết thúc</label>
                                            <input
                                                type="time"
                                                value={formData.endTime}
                                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                                className="w-full h-11 px-4 border border-border rounded-xl bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Môn học</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="VD: Toán 10..."
                                            className="w-full h-11 px-4 border border-border rounded-xl bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Status & Calc */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Trạng thái buổi dạy</label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(val) => setFormData({ ...formData, status: val as LessonStatus })}
                                        >
                                            <SelectTrigger className="w-full h-11 border-border bg-muted/30 focus:bg-background rounded-xl px-4 outline-none transition-all focus:ring-primary/20">
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border shadow-xl z-[100]">
                                                {Object.entries(LESSON_STATUS_LABELS).map(([val, label]) => (
                                                    <SelectItem
                                                        key={val}
                                                        value={val}
                                                        className="py-2.5 rounded-lg focus:bg-primary focus:text-primary-foreground"
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border/50 flex justify-between items-center h-[5.5rem] mt-auto">
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-muted-foreground">Tạm tính ({currentHours}h)</div>
                                            <div className="text-xl font-black text-primary">{currentTotal.toLocaleString()}đ</div>
                                        </div>
                                        <RotateCcw
                                            size={20}
                                            className={cn("text-muted-foreground transition-transform duration-500", isDirty && "rotate-180 text-primary")}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Ghi chú nội dung</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={4}
                                    placeholder="Nội dung bài học, bài tập về nhà..."
                                    className="w-full p-4 border border-border rounded-2xl bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                />
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer - Sticky */}
                <div className="p-4 md:p-6 border-t border-border bg-card/80 backdrop-blur-sm z-10">
                    {mode === 'view' ? (
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button
                                onClick={() => setConfirmDeleteOpen(true)}
                                className="w-full sm:w-auto p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={18} />
                                <span className="text-sm font-bold sm:hidden lg:inline">Xóa buổi học</span>
                            </button>

                            <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
                                <button
                                    onClick={handleDuplicate}
                                    disabled={loading}
                                    className="flex-1 sm:flex-none px-4 h-12 border border-primary/20 hover:bg-primary/5 text-primary rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                                >
                                    <Copy size={18} />
                                    <span>Nhân bản</span>
                                </button>
                                <button
                                    onClick={() => setMode('edit')}
                                    className="flex-[2] sm:flex-none px-8 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit3 size={18} />
                                    <span>Chỉnh sửa</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setMode('view')}
                                className="w-full sm:w-auto px-6 h-12 border border-border rounded-2xl font-bold text-sm hover:bg-muted transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                form="edit-session-form"
                                type="submit"
                                disabled={loading || !isDirty}
                                className="w-full sm:w-auto sm:ml-auto px-10 h-12 bg-primary text-primary-foreground rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <X className="animate-spin" size={18} /> : <Save size={18} />}
                                <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Dialogs */}
            <ConfirmDialog
                open={confirmCloseOpen}
                onOpenChange={setConfirmCloseOpen}
                onConfirm={onClose}
                title="Bỏ qua thay đổi?"
                description="Các thông tin bạn vừa sửa sẽ không được lưu. Bạn có chắc muốn thoát?"
                confirmText="Hủy sửa và thoát"
                variant="destructive"
            />

            <ConfirmDialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                onConfirm={() => {
                    if (localSession.id && onDelete) {
                        onDelete(localSession.id);
                        onClose();
                    }
                }}
                title="Xác nhận xóa?"
                description="Buổi học này sẽ bị xóa vĩnh viễn khỏi lịch dạy. Bạn không thể hoàn tác thao tác này."
                confirmText="Xóa vĩnh viễn"
                variant="destructive"
            />
        </div>,
        document.body
    );
}
