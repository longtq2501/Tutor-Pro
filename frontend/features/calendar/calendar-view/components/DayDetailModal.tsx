import {
    X, Plus, Calendar, Clock, BookOpen, Check, Circle,
    CheckSquare, Square, Loader2, Globe, MoreHorizontal,
    RotateCcw, Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { DAYS, MONTHS } from '../constants';
import { formatCurrency } from '../utils';
import type { CalendarDay } from '../types';
import type { SessionRecord } from '@/lib/types/finance';
import { getStatusColors } from '../utils/statusColors';
import { useUI } from '@/contexts/UIContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    const dow = DAYS[date.getDay()];
    const fullDow = dow === 'CN' ? 'Chủ nhật'
        : dow === 'Hai' ? 'Thứ Hai'
            : dow === 'Ba' ? 'Thứ Ba'
                : dow === 'Tư' ? 'Thứ Tư'
                    : dow === 'Năm' ? 'Thứ Năm'
                        : dow === 'Sáu' ? 'Thứ Sáu'
                            : 'Thứ Bảy';
    return `${fullDow}, ${date.getDate()} tháng ${date.getMonth() + 1}`;
}

/**
 * Status strip color for the left border of each card.
 * Uses solid colors that meet 3:1 contrast on white for non-text decorative elements.
 */
function getStripColor(status?: string, paid?: boolean): string {
    if (paid || status === 'PAID') return '#2563EB';       // blue-600 – paid
    if (status === 'COMPLETED') return '#16A34A';           // green-600 – taught
    if (status === 'CANCELLED_BY_STUDENT' || status === 'CANCELLED_BY_TUTOR') return '#D97706'; // amber-600
    if (status === 'CONFIRMED') return '#0284C7';           // sky-600
    return '#9CA3AF';                                       // gray-400 – scheduled/default
}

/**
 * Card context-menu using Radix DropdownMenu with Portal.
 * Renders outside the card DOM tree → no overflow:hidden clipping.
 * Auto-flips direction; closes on Esc / outside click (Radix built-in).
 */
function CardMenu({
    session,
    onDelete,
    onCancelByStudent,
}: {
    session: SessionRecord;
    onDelete: (id: number) => void;
    onCancelByStudent?: (id: number, version?: number) => void;
}) {
    const isCancelledByStudent = session.status === 'CANCELLED_BY_STUDENT';

    const handleDelete = () => {
        let cancelled = false;
        toast('Đã xóa buổi học', {
            duration: 6000,
            action: {
                label: 'Hoàn tác',
                onClick: () => { cancelled = true; },
            },
        });
        setTimeout(() => {
            if (!cancelled) onDelete(session.id);
        }, 6200);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Thêm tùy chọn"
                    aria-haspopup="menu"
                    className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted/60 transition-colors shrink-0"
                >
                    <MoreHorizontal size={16} />
                </Button>
            </DropdownMenuTrigger>

            {/* Portal renders outside card → never clipped */}
            <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={4}
                collisionPadding={12}
                className="z-[200] min-w-[190px]"
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuItem
                    className={cn(
                        "cursor-pointer text-sm font-medium gap-2",
                        isCancelledByStudent
                            ? "text-foreground"
                            : "text-amber-700 dark:text-amber-400 focus:bg-amber-50 dark:focus:bg-amber-900/20 focus:text-amber-800 dark:focus:text-amber-300"
                    )}
                    onSelect={() => onCancelByStudent?.(session.id, session.version)}
                >
                    <RotateCcw size={14} />
                    {isCancelledByStudent ? 'Khôi phục buổi' : 'Học sinh hủy buổi'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer text-sm font-medium gap-2 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700"
                    onSelect={handleDelete}
                >
                    <Trash2 size={14} />
                    Xóa buổi này
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
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

    // Totals excluding cancelled sessions (C2)
    const nonCancelledSessions = day.sessions.filter(
        s => s.status !== 'CANCELLED_BY_STUDENT' && s.status !== 'CANCELLED_BY_TUTOR'
    );
    const totalRevenue = nonCancelledSessions.reduce((acc, s) => acc + s.totalAmount, 0);
    const paidRevenue = nonCancelledSessions.filter(s => s.paid).reduce((acc, s) => acc + s.totalAmount, 0);
    const remainingRevenue = totalRevenue - paidRevenue;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop – light: 40% black; dark: background/80 blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 dark:bg-background/80 dark:backdrop-blur-md"
            />

            {/* Modal – has its own shadow (A2) */}
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "20%", opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative bg-card rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-border/60"
            >
                {/* Header – violet, flat color */}
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
                                <h3 className="text-white font-medium text-[12px] sm:text-sm truncate">
                                    Lịch dạy trong ngày
                                </h3>
                                <p className="text-white/90 font-semibold text-[13px] sm:text-base mt-0.5 truncate">
                                    {formatDayHeader(day.date)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
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

                {/* Content card – overlaps header, light gray body */}
                <div
                    className="relative z-10 -mt-8 mx-4 sm:mx-6 rounded-[2rem] border border-border/60 shadow-xl flex flex-col overflow-hidden
                               bg-[#F4F4F6] dark:bg-card"
                    style={{ maxHeight: '65vh' }}
                >
                    {/* Stats strip – white card, no shadow (A1) */}
                    {day.sessions.length > 0 && (
                        <div className="flex items-center gap-4 px-4 sm:px-6 pt-4 pb-3 border-b border-[#E5E7EB] dark:border-border/40 shrink-0
                                        bg-white dark:bg-card rounded-t-[2rem]">
                            <div className="flex-1 text-center">
                                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Tổng</p>
                                {/* No underline, tabular-nums, color #111827 */}
                                <p className="text-[13px] font-semibold tabular-nums text-[#111827] dark:text-foreground">
                                    {formatCurrency(totalRevenue)}
                                </p>
                            </div>
                            <div className="w-px h-8 bg-[#E5E7EB] dark:bg-border/50" />
                            <div className="flex-1 text-center">
                                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Đã thu</p>
                                <p className="text-[13px] font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(paidRevenue)}
                                </p>
                            </div>
                            <div className="w-px h-8 bg-[#E5E7EB] dark:bg-border/50" />
                            <div className="flex-1 text-center">
                                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Còn lại</p>
                                {/* #C2410C = orange-700 for remaining */}
                                <p className="text-[13px] font-semibold tabular-nums text-[#C2410C] dark:text-orange-400">
                                    {formatCurrency(remainingRevenue)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Session list */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
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
                                    const isCancelled = session.status === 'CANCELLED_BY_STUDENT' || session.status === 'CANCELLED_BY_TUTOR';
                                    const isCancelledByStudent = session.status === 'CANCELLED_BY_STUDENT';
                                    const isLoading = loadingSessions.has(session.id);
                                    const stripColor = getStripColor(session.status, session.paid);

                                    return (
                                        <motion.div
                                            key={session.id}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            onClick={() => onSessionClick?.(session)}
                                            // No overflow:hidden – strip uses inline style
                                            className={cn(
                                                "group relative flex gap-3 rounded-2xl border p-3 sm:p-4 cursor-pointer transition-colors duration-200",
                                                // Light: white card, border #E5E7EB, no shadow (A1)
                                                "bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted/10",
                                                isCancelledByStudent
                                                    ? "border-amber-200/80 dark:border-amber-700/40 opacity-80"
                                                    : "border-[#E5E7EB] dark:border-border/50"
                                            )}
                                        >
                                            {/* Status strip – inline style, rounded-l, NOT inside overflow:hidden */}
                                            <div
                                                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                                                style={{ backgroundColor: stripColor }}
                                            />

                                            {/* Time column – no divider line between start/end (req #6) */}
                                            <div className="flex flex-col items-center justify-center shrink-0 w-[44px] pl-2">
                                                <span className="text-[12px] font-semibold tabular-nums leading-none text-[#111827] dark:text-foreground">
                                                    {session.startTime}
                                                </span>
                                                {/* Removed the divider line between times */}
                                                <span className="text-[12px] font-medium tabular-nums leading-none text-[#6B7280] dark:text-muted-foreground mt-1">
                                                    {session.endTime}
                                                </span>
                                            </div>

                                            {/* Main content */}
                                            <div className="flex-1 min-w-0">
                                                {/* Name + amount row */}
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="min-w-0">
                                                        <h4 className="text-[14px] sm:text-[15px] font-semibold capitalize leading-tight truncate text-[#111827] dark:text-foreground">
                                                            {session.studentName}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 mt-0.5 text-[#6B7280] dark:text-muted-foreground">
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

                                                    {/* Amount – no underline, #111827, weight 600, tabular-nums */}
                                                    <div className="text-right shrink-0">
                                                        {isCancelledByStudent ? (
                                                            <div>
                                                                <p className="text-[13px] font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                                                                    0 đ
                                                                </p>
                                                                <p className="text-[10px] text-amber-500 font-medium">
                                                                    Không tính phí
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {/* #111827 for price text, weight 600 */}
                                                                <p className="text-[13px] sm:text-[14px] font-semibold tabular-nums text-[#111827] dark:text-foreground">
                                                                    {formatCurrency(session.totalAmount)}
                                                                </p>
                                                                <p className="text-[11px] font-medium text-[#6B7280] dark:text-muted-foreground tabular-nums leading-snug">
                                                                    {session.hours}h × {formatCurrency(session.pricePerHour)}/h
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6] dark:border-border/30">
                                                    {/* Toggle completed
                                                        ON:  bg #DCFCE7  border #86EFAC  text #166534
                                                        OFF: bg white    border #D1D5DB  text #4B5563
                                                    */}
                                                    <button
                                                        type="button"
                                                        role="checkbox"
                                                        aria-checked={session.completed}
                                                        aria-label={session.completed ? 'Đã dạy – bấm để huỷ đánh dấu' : 'Đánh dấu đã dạy'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onToggleComplete(session.id, session.version);
                                                        }}
                                                        disabled={isLoading || isCancelled || session.paid}
                                                        className={cn(
                                                            "h-9 flex-1 rounded-xl text-[11px] font-medium gap-1.5 inline-flex items-center justify-center border transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                            session.completed
                                                                ? "dark:bg-green-900/20 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/30"
                                                                : "bg-white dark:bg-transparent border-[#D1D5DB] dark:border-border/50 text-[#4B5563] dark:text-muted-foreground hover:border-[#9CA3AF] dark:hover:border-border",
                                                            (isLoading || isCancelled || session.paid) && "opacity-40 pointer-events-none"
                                                        )}
                                                        style={session.completed ? {
                                                            backgroundColor: '#DCFCE7',
                                                            borderColor: '#86EFAC',
                                                            color: '#166534',
                                                        } : undefined}
                                                    >
                                                        {isLoading ? (
                                                            <Loader2 size={13} className="animate-spin" />
                                                        ) : session.completed ? (
                                                            <Check size={13} strokeWidth={2.5} />
                                                        ) : (
                                                            <Circle size={13} className="opacity-50" />
                                                        )}
                                                        {session.completed ? 'Đã dạy' : 'Đánh dấu đã dạy'}
                                                    </button>

                                                    {/* Toggle payment – hidden for cancelled sessions
                                                        ON:  bg #DBEAFE  border #93C5FD  text #1D4ED8
                                                        OFF: bg white    border #D1D5DB  text #4B5563
                                                    */}
                                                    {!isCancelledByStudent && (
                                                        <button
                                                            type="button"
                                                            role="checkbox"
                                                            aria-checked={session.paid}
                                                            aria-label={session.paid ? 'Đã thu tiền' : 'Chưa thu tiền'}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onTogglePayment(session.id, session.version);
                                                            }}
                                                            disabled={(!session.completed && !session.paid) || isLoading || isCancelled}
                                                            className={cn(
                                                                "h-9 flex-1 rounded-xl text-[11px] font-medium gap-1.5 inline-flex items-center justify-center border transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                                session.paid
                                                                    ? "dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                                    : "bg-white dark:bg-transparent border-[#D1D5DB] dark:border-border/50 text-[#4B5563] dark:text-muted-foreground hover:border-[#9CA3AF] dark:hover:border-border",
                                                                (!session.completed && !session.paid) && "opacity-40 pointer-events-none"
                                                            )}
                                                            style={session.paid ? {
                                                                backgroundColor: '#DBEAFE',
                                                                borderColor: '#93C5FD',
                                                                color: '#1D4ED8',
                                                            } : undefined}
                                                        >
                                                            {isLoading ? (
                                                                <Loader2 size={13} className="animate-spin" />
                                                            ) : session.paid ? (
                                                                <CheckSquare size={13} strokeWidth={2.5} />
                                                            ) : (
                                                                <Square size={13} className="opacity-50" />
                                                            )}
                                                            {session.paid ? 'Đã thu' : 'Chưa thu'}
                                                        </button>
                                                    )}

                                                    {/* ⋯ Menu – portal-rendered via Radix DropdownMenu */}
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

                {/* Bottom spacing (C4) */}
                <div className="h-6" />
            </motion.div>
        </div>,
        document.body
    );
};
