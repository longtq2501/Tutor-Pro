import type { SessionRecord } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, Check, ChevronRight, Clock, FileText, Globe, Monitor, Sparkles, Wallet2 } from 'lucide-react';
import { formatFullCurrency as formatCurrency } from '../utils';
import { InfoCard } from './InfoCard';

interface ViewModeContentProps {
    session: SessionRecord;
    canConvert?: boolean;
    onConvertToOnline?: () => void;
    onRevertToOffline?: () => void;
    isConverting?: boolean;
    onOpenFeedback?: () => void;
    isTaughtOrPaid?: boolean;
}

export function ViewModeContent({
    session,
    canConvert,
    onConvertToOnline,
    onRevertToOffline,
    isConverting,
    onOpenFeedback,
    isTaughtOrPaid,
}: ViewModeContentProps) {
    const isCancelled = session.status === 'CANCELLED_BY_STUDENT' || session.status === 'CANCELLED_BY_TUTOR';

    return (
        <div className="space-y-3">
            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-2.5">
                <InfoCard
                    icon={<Calendar size={14} />}
                    label="Ngày dạy"
                    value={session.sessionDate}
                />
                <InfoCard
                    icon={<Clock size={14} />}
                    label="Thời gian"
                    value={`${session.startTime} – ${session.endTime}`}
                />
            </div>

            {/* Online/Offline mode switcher - only for active (non-completed) sessions */}
            {canConvert && (
                <div className={cn(
                    "rounded-xl border p-3 flex items-center justify-between gap-3 transition-colors",
                    session.isOnline
                        ? "border-sky-200 dark:border-sky-800/60 bg-sky-50/50 dark:bg-sky-950/20"
                        : "border-border/50 bg-card shadow-2xs"
                )}>
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            session.isOnline
                                ? "bg-sky-500 text-white"
                                : "bg-muted text-muted-foreground"
                        )}>
                            {session.isOnline ? <Globe size={16} /> : <Monitor size={16} />}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-medium text-muted-foreground">Hình thức học</p>
                            <p className={cn(
                                "text-xs font-semibold truncate",
                                session.isOnline ? "text-sky-600 dark:text-sky-400" : "text-foreground"
                            )}>
                                {session.isOnline ? "Dạy Online" : "Dạy Offline"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={session.isOnline ? onRevertToOffline : onConvertToOnline}
                        disabled={isConverting}
                        className={cn(
                            "text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all shrink-0 border",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            session.isOnline
                                ? "border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                : "border-sky-200 dark:border-sky-800/60 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                        )}
                    >
                        {isConverting
                            ? "Đang xử lý..."
                            : session.isOnline
                                ? "Chuyển Offline"
                                : "Chuyển Online"
                        }
                    </button>
                </div>
            )}

            {/* Payment box */}
            <div className={cn(
                "p-3.5 rounded-xl border flex items-center justify-between gap-3 shadow-2xs transition-colors",
                isCancelled
                    ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/40"
                    : session.paid
                        ? "bg-card border-emerald-500/30 dark:border-emerald-500/20"
                        : "bg-card border-border/50"
            )}>
                <div className="min-w-0">
                    <p className="text-[11px] font-medium text-muted-foreground mb-0.5">Thanh toán</p>
                    {isCancelled ? (
                        <>
                            <p className="text-lg font-bold tracking-tight tabular-nums text-amber-600 dark:text-amber-400">
                                0 đ
                            </p>
                            <p className="text-[11px] font-medium text-amber-500">Không tính phí (đã hủy)</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-bold tracking-tight tabular-nums text-foreground">
                                {formatCurrency(session.totalAmount)}
                            </p>
                            <p className="text-[11px] font-medium text-muted-foreground tabular-nums">
                                {session.hours}h × {formatCurrency(session.pricePerHour)}/h
                            </p>
                        </>
                    )}
                </div>

                {!isCancelled && (
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-md",
                            session.paid
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-muted text-muted-foreground"
                        )}>
                            {session.paid ? "Đã thu" : "Chưa thu"}
                        </span>
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            session.paid ? "bg-emerald-500 text-white shadow-xs" : "bg-muted text-muted-foreground"
                        )}>
                            {session.paid ? (
                                <Check size={15} strokeWidth={2.5} />
                            ) : (
                                <Wallet2 size={15} />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Notes */}
            {session.notes && (
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <FileText size={13} className="text-muted-foreground shrink-0" />
                        <span className="text-[11px] font-medium text-muted-foreground">Ghi chú</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed italic text-foreground/80 whitespace-pre-wrap">
                        &quot;{session.notes}&quot;
                    </p>
                </div>
            )}

            {/* Mobile Feedback Action Card - Only shown on mobile for completed/paid sessions */}
            {isTaughtOrPaid && onOpenFeedback && (
                <div className="lg:hidden pt-0.5">
                    <button
                        type="button"
                        onClick={onOpenFeedback}
                        className="w-full p-3.5 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary/10 active:scale-[0.99] transition-all flex items-center justify-between text-left shadow-2xs group"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                                <Sparkles size={17} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-foreground">Phiếu đánh giá buổi học</p>
                                <p className="text-[11px] text-muted-foreground truncate">
                                    Xem và cập nhật nhận xét cho học sinh
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 text-primary font-bold text-xs pl-2">
                            <span>Mở phiếu</span>
                            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>
                </div>
            )}

            {/* Linked lessons/documents */}
            {((session.lessons?.length ?? 0) + (session.documents?.length ?? 0)) > 0 && (
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/40">
                    {session.lessons && session.lessons.length > 0 && (
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-primary px-0.5">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-semibold">Bài giảng</span>
                            </div>
                            <div className="space-y-1">
                                {session.lessons.map(l => (
                                    <div key={l.id} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-card border border-border/50 truncate shadow-2xs">
                                        {l.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {session.documents && session.documents.length > 0 && (
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-blue-600 px-0.5">
                                <FileText className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-semibold">Tài liệu</span>
                            </div>
                            <div className="space-y-1">
                                {session.documents.map(d => (
                                    <div key={d.id} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-card border border-border/50 truncate shadow-2xs">
                                        {d.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
