import type { SessionRecord, SessionRecordUpdateRequest } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';
import {
    X, Trash2, Copy, Pencil, Save, BookOpen,
    Calendar, Clock, DollarSign, FileText,
    CheckCircle2, Check, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LESSON_STATUS_LABELS } from '@/lib/types/lesson-status';
import { sessionsApi } from '@/lib/services';
import { getStatusColors } from '../utils/statusColors';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUI } from '@/contexts/UIContext';
import { createPortal } from 'react-dom';

interface LessonDetailModalProps {
    session: SessionRecord;
    onClose: () => void;
    onUpdate?: (updated: SessionRecord) => void;
    onDelete?: (id: number) => void;
    initialMode?: 'view' | 'edit';
}

const InfoCard = ({ icon, label, value, variant }: {
    icon: React.ReactNode,
    label: string,
    value: string,
    variant: 'blue' | 'purple' | 'green'
}) => {
    const variants = {
        blue: "bg-blue-50/50 dark:bg-blue-600/10 border-blue-100 dark:border-blue-500/20",
        purple: "bg-purple-50/50 dark:bg-purple-600/10 border-purple-100 dark:border-purple-500/20",
        green: "bg-emerald-50/50 dark:bg-emerald-600/10 border-emerald-100 dark:border-emerald-500/20"
    };

    return (
        <div className={cn("p-4 rounded-2xl border transition-all hover:shadow-md", variants[variant])}>
            <div className="flex items-center gap-2 mb-2">
                <span className="opacity-70">{icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
            </div>
            <div className="text-sm font-bold truncate">{value}</div>
        </div>
    );
};

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
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    useEffect(() => {
        const hasChanges =
            formData.startTime !== (localSession.startTime || '') ||
            formData.endTime !== (localSession.endTime || '') ||
            formData.subject !== (localSession.subject || '') ||
            formData.notes !== (localSession.notes || '') ||
            formData.status !== (localSession.status || 'SCHEDULED');
        setIsDirty(hasChanges);
    }, [formData, localSession]);

    useEffect(() => {
        setFormData({
            startTime: localSession.startTime || '',
            endTime: localSession.endTime || '',
            subject: localSession.subject || '',
            notes: localSession.notes || '',
            status: (localSession.status || 'SCHEDULED') as LessonStatus,
        });
    }, [localSession]);

    useEffect(() => {
        setLocalSession(session);
    }, [session]);

    const { openDialog, closeDialog } = useUI();

    useEffect(() => {
        openDialog();
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            closeDialog();
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const calculateHours = (start: string, end: string) => {
        if (!start || !end) return session.hours;
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff <= 0) diff += 24 * 60;
        return diff / 60;
    };

    const currentHours = calculateHours(formData.startTime, formData.endTime);
    const currentTotal = currentHours * session.pricePerHour;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setLoading(true);
        try {
            const updatePayload: SessionRecordUpdateRequest = {
                ...formData,
                hoursPerSession: currentHours,
                version: localSession.version
            };
            const updated = await sessionsApi.update(localSession.id, updatePayload);
            toast.success('Đã cập nhật buổi học thành công!');
            setLocalSession(updated);
            onUpdate?.(updated);
            setMode('view');
        } catch (error) {
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

    const statusColors = getStatusColors(localSession.status as LessonStatus);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative bg-card rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-border/60"
            >
                {/* Header with Gradient */}
                <div className={cn(
                    "relative p-6 sm:p-8 pb-12 sm:pb-16 transition-all duration-500",
                    localSession.paid ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-blue-500 to-indigo-600",
                    localSession.status === 'CANCELLED_BY_STUDENT' || localSession.status === 'CANCELLED_BY_TUTOR'
                        ? "from-slate-500 to-slate-700" : ""
                )}>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase tracking-widest text-sm">Chi tiết buổi học</h3>
                                <p className="text-white/70 text-xs font-bold mt-1">
                                    #{localSession.id} • {localSession.sessionDate}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full text-white hover:bg-white/10 h-10 w-10"
                        >
                            <X size={24} />
                        </Button>
                    </div>
                </div>

                {/* Student Card (overlapping) */}
                <div className="relative z-10 -mt-8 mx-4 sm:mx-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-3xl bg-card border border-border/60 shadow-2xl relative overflow-hidden"
                    >
                        {/* Dimensional Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/[0.02] pointer-events-none" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-background">
                                {localSession.studentName?.charAt(0).toUpperCase()}
                            </div>
                            <div className={cn("absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-background shadow-sm", statusColors.dot)} />
                        </div>

                        <div className="flex-1 relative z-10">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Học sinh</div>
                            <h4 className="text-xl font-black capitalize tracking-tight">{localSession.studentName}</h4>
                        </div>

                        <Badge className={cn("relative z-10 rounded-full px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-0 shadow-sm", statusColors.bg, statusColors.text)}>
                            {LESSON_STATUS_LABELS[localSession.status as keyof typeof LESSON_STATUS_LABELS] || localSession.status}
                        </Badge>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="p-5 sm:p-8 space-y-6 sm:space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                    {mode === 'view' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Time & Date Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <InfoCard
                                    icon={<Calendar size={18} className="text-blue-500" />}
                                    label="Ngày dạy"
                                    value={localSession.sessionDate}
                                    variant="blue"
                                />
                                <InfoCard
                                    icon={<Clock size={18} className="text-purple-500" />}
                                    label="Thời gian"
                                    value={`${localSession.startTime} - ${localSession.endTime}`}
                                    variant="purple"
                                />
                            </div>

                            {/* Payment Card */}
                            <div className={cn(
                                "p-6 rounded-[2rem] border-2 flex items-center justify-between group transition-all duration-500 hover:scale-[1.02]",
                                localSession.paid
                                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800"
                                    : "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-800"
                            )}>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Thanh toán</p>
                                    <p className="text-3xl font-black tracking-tighter">
                                        {formatCurrency(localSession.totalAmount)}
                                    </p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-1 flex items-center gap-1">
                                        <Clock size={10} />
                                        {localSession.hours}h × {formatCurrency(localSession.pricePerHour)}/h
                                    </p>
                                </div>

                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 duration-500",
                                    localSession.paid ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                                )}>
                                    {localSession.paid ? <Check size={32} strokeWidth={3} /> : <DollarSign size={32} />}
                                </div>
                            </div>

                            {/* Notes Section */}
                            {localSession.notes && (
                                <div className="p-5 rounded-3xl bg-muted/30 border border-border/40">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText size={16} className="text-muted-foreground" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nội dung / Ghi chú</span>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed italic opacity-80 whitespace-pre-wrap">
                                        "{localSession.notes}"
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form id="premium-edit-form" onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Giờ bắt đầu</label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full h-14 px-5 rounded-2xl bg-muted/40 border-border/60 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Giờ kết thúc</label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full h-14 px-5 rounded-2xl bg-muted/40 border-border/60 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Môn học</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="Toán 12, Lý 11..."
                                    className="w-full h-14 px-5 rounded-2xl bg-muted/40 border-border/60 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Trạng thái</label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val as LessonStatus })}
                                >
                                    <SelectTrigger className="h-14 px-5 rounded-2xl bg-muted/40 border-border/60 focus:bg-background font-bold transition-all">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border/60 shadow-2xl">
                                        {Object.entries(LESSON_STATUS_LABELS).map(([val, label]) => (
                                            <SelectItem key={val} value={val} className="py-3 rounded-xl focus:bg-primary/10 focus:text-primary">
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Ghi chú</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    placeholder="Ghi chú bài học..."
                                    className="w-full p-5 rounded-2xl bg-muted/40 border-border/60 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none resize-none no-scrollbar"
                                />
                            </div>
                        </form>
                    )}
                </div>

                {/* Actions Footer */}
                <div className="p-5 sm:p-8 bg-muted/10 border-t border-border/60">
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
                        {mode === 'view' ? (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => setConfirmDeleteOpen(true)}
                                    className="h-14 flex-1 rounded-2xl text-red-500 hover:bg-red-500/10 font-black uppercase tracking-widest text-[11px]"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Xóa
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleDuplicate}
                                    disabled={loading}
                                    className="h-14 flex-1 rounded-2xl border-border/60 font-black uppercase tracking-widest text-[11px]"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Nhân bản
                                </Button>
                                <Button
                                    onClick={() => setMode('edit')}
                                    className="h-14 flex-1 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Sửa
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => setMode('view')}
                                    className="h-14 flex-1 rounded-2xl font-black uppercase tracking-widest text-[11px]"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    form="premium-edit-form"
                                    type="submit"
                                    disabled={loading || !isDirty}
                                    className="h-14 flex-[2] rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-500/20"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            {confirmDeleteOpen && (
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
                    confirmText="Xác nhận xóa"
                    variant="destructive"
                />
            )}
        </div>,
        document.body
    );
}

const Loader2 = ({ className }: { className?: string }) => (
    <svg className={cn("animate-spin", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);
};
