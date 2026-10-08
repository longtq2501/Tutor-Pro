import {
    X, Plus, Calendar, Clock, BookOpen, Check, Circle,
    CheckSquare, Square, Loader2, Globe, MoreHorizontal
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { DAYS, MONTHS } from '../constants';
import { formatCurrency } from '../utils';
import type { CalendarDay } from '../types';
import type { SessionRecord } from '@/lib/types/finance';
import { LESSON_STATUS_LABELS, isTerminalStatus } from '@/lib/types/lesson-status';
import { getStatusColors } from '../utils/statusColors';
import { useUI } from '@/contexts/UIContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
    day: CalendarDay;
    onClose: () => void;
    onAddSession: (dateStr: string) => void;
    onDelete: (id: number) => void;
    onTogglePayment: (id: number, version?: number) => void;
    onToggleComplete: (id: number, version?: number) => void;
    onCancelByStudent?: (id: number, version?: number) => void;
    onSessionClick?: (session: SessionRecord) => void;
    loadingSessions?: Set<number>;
}

// Formatted date: "Thứ Năm, 8 tháng 10"
function formatDayHeader(date: Date): string {
    const dow = DAYS[date.getDay()]; // 'CN','Hai','Ba',...
    const fullDow = dow === 'CN' ? 'Chủ nhật'
        : dow === 'Hai' ? 'Thứ Hai'
            : dow === 'Ba' ? 'Thứ Ba'
                : dow === 'Tư' ? 'Thứ Tư'
                    : dow === 'Năm' ? 'Thứ Năm'
                        : dow === 'Sáu' ? 'Thứ Sáu'
                            : 'Thứ Bảy';
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${fullDow}, ${day} tháng ${month}`;
}

// Card overflow menu component
function CardMenu({
    session,
    onDelete,
    onCancelByStudent,
}: {
    session: SessionRecord;
    onDelete: (id: number) => void;
    onCancelByStudent?: (id: number, version?: number) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isCancelledByStudent = session.status === 'CANCELLED_BY_STUDENT';

    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    return (
        <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
            <Button
                variant="ghost"
                size="icon"
                aria-label="Tùy chọn thêm"
                onClick={() => setOpen(v => !v)}
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted/60 transition-colors"
            >
                <MoreHorizontal size={16} />
            </Button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-9 z-50 min-w-[180px] bg-popover border border-border/60 rounded-xl shadow-xl overflow-hidden"
                    >
                        {/* Toggle student cancelled */}
                        <button
                            className={cn(
                                "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                                isCancelledByStudent
                                    ? "text-foreground hover:bg-muted/50"
                                    : "text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            )}
                            onClick={() => {
                                onCancelByStudent?.(session.id, session.version);
                                setOpen(false);
                            }}
                        >
                            {isCancelledByStudent ? 'Khôi phục buổi' : 'Học sinh hủy buổi'}
                        </button>

                        <div className="h-px bg-border/60 mx-2" />

                        {/* Delete with undo-toast */}
                        <button
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            onClick={() => {
                                setOpen(false);
                                // Optimistic: show undo toast for ~6s before actually calling delete
                                let cancelled = false;
                                const toastId = toast('Đã xóa buổi học', {
                                    duration: 6000,
                                    action: {
                                        label: 'Hoàn tác',
                                        onClick: () => { cancelled = true; },
                                    },
                                });
                                setTimeout(() => {
                                    if (!cancelled) onDelete(session.id);
                                }, 6200);
                            }}
                        >
                            Xóa buổi học
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export const DayDetailModal = ({
    day,
    onClose,
    onAddSession,
    onDelete,
    onTogglePayment,
    onToggleComplete,
    onCancelByStudent,
    onSessionClick,
    loadingSessions = new Set()
}: Props) => {
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

    if (typeof document === 'undefined') return null;

    // C2: totals excluding cancelled sessions
    const nonCancelledSessions = day.sessions.filter(
        s => s.status !== 'CANCELLED_BY_STUDENT' && s.status !== 'CANCELLED_BY_TUTOR'
    );
    const totalRevenue = nonCancelledSessions.reduce((acc, s) => acc + s.totalAmount, 0);
    const paidRevenue = nonCancelledSessions.filter(s => s.paid).reduce((acc, s) => acc + s.totalAmount, 0);
    const remainingRevenue = totalRevenue - paidRevenue;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "20%", opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                // Only the modal itself keeps shadow-2xl (A1)
                className="relative bg-card rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-border/60"
            >
                {/* C1+C3: Header - flat color, no gradient, meaningful date */}
                <div className="relative p-6 sm:p-8 pb-12 sm:pb-16 bg-violet-600 dark:bg-violet-700">
                    <div className="relative flex items-center justify-between text-white">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            {/* Date box */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 border border-white/30 flex flex-col items-center justify-center shrink-0">
                                <span className="text-lg sm:text-xl font-bold leading-none">{day.date.getDate()}</span>
                                <span className="text-[8px] sm:text-[10px] font-medium opacity-80">
                                    {MONTHS[day.date.getMonth()].replace('Tháng ', 'Th')}
                                </span>
                            </div>

                            <div className="min-w-0">
                                {/* C1: Replace "8 / 10" with "Thứ Năm, 8 tháng 10" */}
                                <h3 className="text-white font-medium text-[12px] sm:text-sm truncate">
                                    Lịch dạy trong ngày
                                </h3>
                                <p className="text-white/90 font-semibold text-[13px] sm:text-base mt-0.5 truncate">
                                    {formatDayHeader(day.date)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            {/* C3: "+" → "+ Thêm buổi" labeled button */}
                            <Button
                                variant="ghost"
                                onClick={() => onAddSession(day.dateStr)}
                                className="rounded-xl h-9 px-3 text-white hover:bg-white/10 text-xs font-medium gap-1.5"
                            >
                                <Plus size={16} strokeWidth={2.5} />
                                <span className="hidden sm:inline">Thêm buổi</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                aria-label="Đóng"
                                className="rounded-full text-white hover:bg-white/10 h-9 w-9"
                            >
                                <X size={20} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="relative z-10 -mt-8 mx-4 sm:mx-6 bg-card rounded-[2rem] border border-border/60 shadow-xl flex flex-col overflow-hidden"
                    style={{ maxHeight: '65vh' }}>

                    {/* C2: Stats strip - Tổng / Đã thu / Còn lại */}
                    {day.sessions.length > 0 && (
                        <div className="flex items-center gap-4 px-4 sm:px-6 pt-4 pb-3 border-b border-border/40 shrink-0">
                            <div className="flex-1 text-center">
                                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Tổng</p>
                                <p className="text-[13px] font-bold tabular-nums">{formatCurrency(totalRevenue)}</p>
                            </div>
                            <div className="w-px h-8 bg-border/50" />
                            <div className="flex-1 text-center">
                                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Đã thu</p>
                                <p className="text-[13px] font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{formatCurrency(paidRevenue)}</p>
                            </div>
                            <div className="w-px h-8 bg-border/50" />
                            <div className="flex-1 text-center">
                                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Còn lại</p>
                                <p className="text-[13px] font-bold tabular-nums text-orange-600 dark:text-orange-400">{formatCurrency(remainingRevenue)}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 pr-2 sm:pr-3 space-y-3">
                        <AnimatePresence mode="popLayout">
                            {day.sessions.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="text-muted-foreground/30" size={40} />
                                    </div>
                                    <p className="text-muted-foreground font-medium italic">Hôm nay chưa có lịch học nào.</p>
                                    <Button
                                        variant="link"
                                        onClick={() => onAddSession(day.dateStr)}
                                        className="text-primary mt-2 flex items-center gap-1 mx-auto"
                                    >
                                        <Plus size={14} /> Thêm lịch ngay
                                    </Button>
                                </motion.div>
                            ) : (
                                day.sessions.map((session, index) => {
                                    const colors = getStatusColors(session.status);
                                    const isCancelled = session.status === 'CANCELLED_BY_STUDENT' || session.status === 'CANCELLED_BY_TUTOR';
                                    const isCancelledByStudent = session.status === 'CANCELLED_BY_STUDENT';
                                    const isLoading = loadingSessions.has(session.id);

                                    return (
                                        <motion.div
                                            key={session.id}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            onClick={() => onSessionClick?.(session)}
                                            className={cn(
                                                // B3: status strip 3-4px
                                                "group relative overflow-hidden flex gap-3 rounded-2xl border p-3 sm:p-4 cursor-pointer transition-colors duration-200",
                                                // Light: no card shadow, only border (A1)
                                                "bg-card hover:bg-muted/20 dark:hover:bg-muted/10",
                                                isCancelledByStudent
                                                    ? "border-amber-200/60 dark:border-amber-700/40 opacity-80"
                                                    : "border-border/50"
                                            )}
                                        >
                                            {/* B3: Thin status strip 3px */}
                                            <div className={cn("absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl", colors.dot)} />

                                            {/* B1: Time column - left-aligned, tabular */}
                                            <div className="flex flex-col items-start justify-center shrink-0 w-[44px] pl-2">
                                                <span className="text-[12px] font-semibold tabular-nums leading-none text-foreground">
                                                    {session.startTime}
                                                </span>
                                                <div className="w-px h-3 bg-border/50 mx-auto my-0.5" />
                                                <span className="text-[12px] font-medium tabular-nums leading-none text-muted-foreground">
                                                    {session.endTime}
                                                </span>
                                            </div>

                                            {/* Main content */}
                                            <div className="flex-1 min-w-0">
                                                {/* Name + subject row */}
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="min-w-0">
                                                        {/* A6: Student name title case, 15-17px, weight 500-600 */}
                                                        <h4 className="text-[14px] sm:text-[15px] font-semibold capitalize leading-tight truncate">
                                                            {session.studentName}
                                                        </h4>
                                                        {/* B7: no trailing dot after subject */}
                                                        <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground">
                                                            <BookOpen size={11} className="opacity-50 shrink-0" />
                                                            <span className="text-[11px] font-medium truncate">
                                                                {session.subject || 'Thông thường'}
                                                            </span>
                                                            {session.isOnline && (
                                                                <>
                                                                    <Globe size={11} className="text-blue-500 shrink-0" aria-hidden />
                                                                    <span className="sr-only">Trực tuyến</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Amount - right aligned */}
                                                    <div className="text-right shrink-0">
                                                        {isCancelledByStudent ? (
                                                            // B5: Buổi hủy: 0đ + "Không tính phí"
                                                            <div className="text-right">
                                                                <p className="text-[13px] font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                                                                    0 đ
                                                                </p>
                                                                <p className="text-[10px] text-amber-500 dark:text-amber-500 font-medium">
                                                                    Không tính phí
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {/* B2: no underline, tabular-nums */}
                                                                <p className={cn("text-[13px] sm:text-[14px] font-bold tabular-nums", colors.text)}>
                                                                    {formatCurrency(session.totalAmount)}
                                                                </p>
                                                                {/* B2: sub-line min 12px, 4.5:1 contrast */}
                                                                <p className="text-[11px] font-medium text-muted-foreground tabular-nums leading-snug">
                                                                    {session.hours}h × {formatCurrency(session.pricePerHour)}/h
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* B4: Action buttons row */}
                                                <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                                                    {/* Toggle completed */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        aria-pressed={session.completed}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onToggleComplete(session.id, session.version);
                                                        }}
                                                        disabled={isLoading || isCancelled || session.paid}
                                                        className={cn(
                                                            // B4: min h-36px, equal size
                                                            "h-9 flex-1 rounded-xl text-[11px] font-medium gap-1.5 transition-all duration-200",
                                                            session.completed
                                                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100"
                                                                : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                                                        )}
                                                    >
                                                        {isLoading ? (
                                                            <Loader2 size={13} className="animate-spin" />
                                                        ) : session.completed ? (
                                                            <Check size={13} strokeWidth={2.5} />
                                                        ) : (
                                                            <Circle size={13} className="opacity-50" />
                                                        )}
                                                        {session.completed ? 'Đã dạy' : 'Đánh dấu đã dạy'}
                                                    </Button>

                                                    {/* Toggle payment - B5: hidden for cancelled */}
                                                    {!isCancelledByStudent && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            aria-pressed={session.paid}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onTogglePayment(session.id, session.version);
                                                            }}
                                                            disabled={(!session.completed && !session.paid) || isLoading || isCancelled}
                                                            className={cn(
                                                                "h-9 flex-1 rounded-xl text-[11px] font-medium gap-1.5 transition-all duration-200",
                                                                session.paid
                                                                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-100"
                                                                    : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border",
                                                                !session.completed && !session.paid && "opacity-40 pointer-events-none"
                                                            )}
                                                        >
                                                            {isLoading ? (
                                                                <Loader2 size={13} className="animate-spin" />
                                                            ) : session.paid ? (
                                                                <CheckSquare size={13} strokeWidth={2.5} />
                                                            ) : (
                                                                <Square size={13} className="opacity-50" />
                                                            )}
                                                            {session.paid ? 'Đã thu' : 'Chưa thu'}
                                                        </Button>
                                                    )}

                                                    {/* B6: Delete moved to ⋯ menu */}
                                                    <CardMenu
                                                        session={session}
                                                        onDelete={onDelete}
                                                        onCancelByStudent={onCancelByStudent}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* C4: reduced bottom padding */}
                <div className="h-6" />
            </motion.div>
        </div>,
        document.body
    );
};
