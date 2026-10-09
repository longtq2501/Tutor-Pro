import type { SessionRecord } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, Check, Clock, Wallet2, FileText } from 'lucide-react';
import { formatFullCurrency as formatCurrency } from '../utils';
import { InfoCard } from './InfoCard';

interface ViewModeContentProps {
    session: SessionRecord;
}

export function ViewModeContent({ session }: ViewModeContentProps) {
    // Business rule: ANY cancelled session (student or tutor) = 0đ, no fee
    const isCancelled = session.status === 'CANCELLED_BY_STUDENT' || session.status === 'CANCELLED_BY_TUTOR';

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Date + Time: uniform neutral bg via InfoCard */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <InfoCard
                    icon={<Calendar size={14} className="text-muted-foreground" />}
                    label="Ngày dạy"
                    value={session.sessionDate}
                />
                <InfoCard
                    icon={<Clock size={14} className="text-muted-foreground" />}
                    label="Thời gian"
                    value={`${session.startTime} – ${session.endTime}`}
                />
            </div>

            {/* Payment box: color only for status; no glow on round icon (A3) */}
            <div className={cn(
                "p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border flex items-center justify-between",
                // A2: neutral bg with status-only color exception
                isCancelled
                    ? "bg-amber-50/40 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/40"
                    : session.paid
                        ? "bg-white dark:bg-muted/10 border-emerald-200/50 dark:border-emerald-800"
                        : "bg-white dark:bg-card border-[#E5E7EB] dark:border-border/40"
            )}>
                <div>
                    {/* A4: label sentence case, 12px, neutral gray */}
                    <p className="text-[11px] sm:text-[12px] font-medium text-muted-foreground mb-0.5">Thanh toán</p>
                    {isCancelled ? (
                        <>
                            {/* Business rule: cancelled session = 0đ, no formula */}
                            <p className="text-[15px] sm:text-xl font-bold tracking-tight tabular-nums text-amber-600 dark:text-amber-400">
                                0 đ
                            </p>
                            <p className="text-[10px] sm:text-[11px] font-medium text-amber-500">Không tính phí</p>
                        </>
                    ) : (
                        <>
                            {/* A4: no uppercase tracking, tabular-nums (B2 spec) */}
                            <p className="text-[15px] sm:text-xl font-bold tracking-tight tabular-nums">
                                {formatCurrency(session.totalAmount)}
                            </p>
                            <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground tabular-nums">
                                {session.hours}h × {formatCurrency(session.pricePerHour)}/h
                            </p>
                        </>
                    )}
                </div>

                {/* A3: round icon – no glow/shadow, only for non-cancelled */}
                {!isCancelled && (
                    <div className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
                        // Removed shadow-lg shadow-*/30
                        session.paid ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                    )}>
                        {session.paid ? (
                            <>
                                <Check size={14} strokeWidth={3} className="sm:hidden" />
                                <Check size={18} strokeWidth={3} className="hidden sm:block" />
                            </>
                        ) : (
                            <>
                                <Wallet2 size={14} className="sm:hidden" />
                                <Wallet2 size={18} className="hidden sm:block" />
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Notes */}
            {session.notes && (
                <div className="p-3 sm:p-4 rounded-2xl bg-muted/20 border border-border/40">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5">
                        <FileText size={11} className="sm:hidden text-muted-foreground" />
                        <FileText size={14} className="hidden sm:block text-muted-foreground" />
                        {/* A4: sentence case label */}
                        <span className="text-[11px] sm:text-[12px] font-medium text-muted-foreground">Ghi chú</span>
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium leading-relaxed italic opacity-80 whitespace-pre-wrap">
                        &quot;{session.notes}&quot;
                    </p>
                </div>
            )}

            {/* Linked lessons/documents */}
            {(session.lessons?.length || 0) + (session.documents?.length || 0) > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                    {session.lessons && session.lessons.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-orange-600 px-1">
                                <BookOpen className="w-3 h-3" />
                                <span className="text-[10px] font-semibold">Bài giảng</span>
                            </div>
                            <div className="space-y-1">
                                {session.lessons.map(l => (
                                    <div key={l.id} className="text-[10px] font-medium px-2 py-1.5 rounded-lg bg-muted/30 border border-border/40 truncate">
                                        {l.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {session.documents && session.documents.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-blue-600 px-1">
                                <FileText className="w-3 h-3" />
                                <span className="text-[10px] font-semibold">Tài liệu</span>
                            </div>
                            <div className="space-y-1">
                                {session.documents.map(d => (
                                    <div key={d.id} className="text-[10px] font-medium px-2 py-1.5 rounded-lg bg-muted/30 border border-border/40 truncate">
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
