import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUI } from '@/contexts/UIContext';
import { sessionsApi } from '@/lib/services';
import type { SessionRecord, SessionRecordUpdateRequest } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';
import { LESSON_STATUS_LABELS, isCompletedStatus } from '@/lib/types/lesson-status';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    Check,
    Clock,
    Copy,
    DollarSign, FileText,
    Pencil, Save,
    Trash2,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { SmartFeedbackForm } from "../../../feedback/components/SmartFeedbackForm";
import { getStatusColors } from '../utils/statusColors';

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

    const isTaughtOrPaid = isCompletedStatus(localSession.status as LessonStatus);

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
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className={cn(
                    "relative bg-card rounded-[2rem] shadow-2xl w-full border border-border/60 flex flex-col overflow-hidden",
                    isTaughtOrPaid
                        ? "max-w-6xl lg:h-[90vh] max-h-[85vh] lg:max-h-none overflow-y-auto lg:overflow-hidden"
                        : "max-w-lg"
                )}
            >
                {/* Header with Gradient */}
                <div className={cn(
                    "relative p-6 transition-all duration-500 shrink-0 sticky top-0 z-50",
                    localSession.paid ? "bg-gradient-to-r from-emerald-600 to-teal-600" : "bg-gradient-to-r from-blue-600 to-indigo-600",
                    localSession.status === 'CANCELLED_BY_STUDENT' || localSession.status === 'CANCELLED_BY_TUTOR'
                        ? "from-slate-600 to-slate-700" : ""
                )}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase tracking-widest text-xs">Chi tiết buổi học</h3>
                                <p className="text-white/80 text-[11px] font-bold mt-0.5">
                                    #{localSession.id} • {localSession.sessionDate}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full text-white hover:bg-white/20 h-8 w-8"
                        >
                            <X size={18} />
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={cn(
                    "flex-1 w-full",
                    isTaughtOrPaid ? "flex flex-col lg:grid lg:grid-cols-12 lg:overflow-hidden" : "overflow-hidden"
                )}>

                    {/* LEFT COLUMN: Session Info */}
                    <div className={cn(
                        "flex flex-col bg-background",
                        isTaughtOrPaid ? "lg:h-full lg:col-span-4 border-r border-border/60 lg:overflow-hidden" : "w-full overflow-hidden h-full"
                    )}>
                        <div className="p-6 flex-1 lg:overflow-y-auto no-scrollbar space-y-6">

                            {/* Student Card */}
                            <div className="relative">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/60 shadow-sm relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-black text-lg shadow-md">
                                            {localSession.studentName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background shadow-sm", statusColors.dot)} />
                                    </div>
                                    <div className="flex-1 relative z-10">
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Học sinh</div>
                                        <h4 className="text-base font-black capitalize tracking-tight leading-none">{localSession.studentName}</h4>
                                    </div>
                                    <Badge className={cn("relative z-10 rounded-lg px-2.5 py-1 font-black uppercase text-[9px] tracking-widest border-0 shadow-sm", statusColors.bg, statusColors.text)}>
                                        {LESSON_STATUS_LABELS[localSession.status as keyof typeof LESSON_STATUS_LABELS] || localSession.status}
                                    </Badge>
                                </div>
                            </div>

                            {mode === 'view' ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {/* Time & Date Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <InfoCard
                                            icon={<Calendar size={14} className="text-blue-500" />}
                                            label="Ngày dạy"
                                            value={localSession.sessionDate}
                                            variant="blue"
                                        />
                                        <InfoCard
                                            icon={<Clock size={14} className="text-purple-500" />}
                                            label="Thời gian"
                                            value={`${localSession.startTime} - ${localSession.endTime}`}
                                            variant="purple"
                                        />
                                    </div>

                                    {/* Payment Card */}
                                    <div className={cn(
                                        "p-4 rounded-2xl border flex items-center justify-between group transition-all duration-300",
                                        localSession.paid
                                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800"
                                            : "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-800"
                                    )}>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">Thanh toán</p>
                                            <p className="text-xl font-black tracking-tighter">
                                                {formatCurrency(localSession.totalAmount)}
                                            </p>
                                            <p className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                                                {localSession.hours}h × {formatCurrency(localSession.pricePerHour)}/h
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 duration-500",
                                            localSession.paid ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                                        )}>
                                            {localSession.paid ? <Check size={18} strokeWidth={3} /> : <DollarSign size={18} />}
                                        </div>
                                    </div>

                                    {/* Notes Section */}
                                    {localSession.notes && (
                                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText size={14} className="text-muted-foreground" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ghi chú</span>
                                            </div>
                                            <p className="text-xs font-medium leading-relaxed italic opacity-80 whitespace-pre-wrap">
                                                "{localSession.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <form id="premium-edit-form" onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bắt đầu</label>
                                            <input
                                                type="time"
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                                className="w-full h-10 px-3 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-xs font-bold outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kết thúc</label>
                                            <input
                                                type="time"
                                                value={formData.endTime}
                                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                                className="w-full h-10 px-3 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-xs font-bold outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Môn học</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="Môn học..."
                                            className="w-full h-10 px-3 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-xs font-bold outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Trạng thái</label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(val) => setFormData({ ...formData, status: val as LessonStatus })}
                                        >
                                            <SelectTrigger className="h-10 px-3 rounded-xl bg-muted/40 border-border/60 focus:bg-background text-xs font-bold shadow-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/60 shadow-xl">
                                                {Object.entries(LESSON_STATUS_LABELS).map(([val, label]) => (
                                                    <SelectItem key={val} value={val} className="text-xs font-medium">
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ghi chú</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            rows={3}
                                            className="w-full p-3 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:ring-2 focus:ring-primary/10 text-xs font-medium outline-none resize-none no-scrollbar"
                                        />
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Actions Footer - Left Side */}
                        <div className="p-4 bg-muted/10 border-t border-border/60 shrink-0">
                            <div className="flex gap-2">
                                {mode === 'view' ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setConfirmDeleteOpen(true)}
                                            className="h-10 w-10 p-0 rounded-xl text-red-500 hover:bg-red-500/10 shrink-0"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleDuplicate}
                                            disabled={loading}
                                            className="h-10 flex-1 rounded-xl border-border/60 font-black uppercase tracking-widest text-[10px]"
                                        >
                                            <Copy className="w-3.5 h-3.5 mr-1.5" />
                                            Nhân bản
                                        </Button>
                                        <Button
                                            onClick={() => setMode('edit')}
                                            className="h-10 flex-1 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                                        >
                                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                            Sửa
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setMode('view')}
                                            className="h-10 flex-1 rounded-xl font-black uppercase tracking-widest text-[10px]"
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            form="premium-edit-form"
                                            type="submit"
                                            disabled={loading || !isDirty}
                                            className="h-10 flex-[2] rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20"
                                        >
                                            {loading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                                            Lưu
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Feedback Form (Only if Taught/Paid) */}
                    {isTaughtOrPaid && (
                        <div className="lg:col-span-8 bg-muted/5 lg:h-full lg:overflow-hidden flex flex-col">
                            <div className="flex-1 lg:overflow-hidden flex flex-col">
                                <SmartFeedbackForm
                                    sessionRecordId={localSession.id}
                                    studentId={localSession.studentId}
                                    studentName={localSession.studentName}
                                />
                            </div>
                        </div>
                    )}
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
