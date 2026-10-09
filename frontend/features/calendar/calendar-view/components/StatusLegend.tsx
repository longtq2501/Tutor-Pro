'use client';

import { useState } from 'react';
import { Info, CheckCircle2, Clock, BadgeDollarSign } from 'lucide-react';
import { STATUS_COLORS } from '../utils/statusColors';
import type { LessonStatus } from '@/lib/types/lesson-status';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

/**
 * MiniPill — tiny replica of the actual calendar pill, used in legend.
 * Shows the real colors + strikethrough (cancelled) + icon (completed/paid).
 */
function MiniPill({ status }: { status: LessonStatus }) {
    const colors = STATUS_COLORS[status];
    const isCompleted = status === 'COMPLETED';
    const isPaid = status === 'PAID';
    const isCancelled = status === 'CANCELLED_BY_STUDENT' || status === 'CANCELLED_BY_TUTOR';

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-md border-l-[3px] text-[11px] font-medium min-w-[110px]",
            colors.bg,
            colors.text,
            "border-slate-200/50 dark:border-white/10"
        )}>
            <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", colors.dot)} />
            <span className={cn("truncate leading-tight", isCancelled && "line-through opacity-70")}>
                {colors.label}
            </span>
            {isCompleted && <CheckCircle2 className="w-3 h-3 flex-shrink-0 ml-auto opacity-70" />}
            {isPaid && <BadgeDollarSign className="w-3 h-3 flex-shrink-0 ml-auto opacity-70" />}
        </div>
    );
}

/** Payment icon legend row */
function PaymentLegendRow({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2.5">
            <span className="text-muted-foreground flex-shrink-0">{icon}</span>
            <span className="text-[11px] font-medium text-foreground">{label}</span>
        </div>
    );
}

const SESSION_STATUSES: LessonStatus[] = [
    'SCHEDULED',
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED_BY_STUDENT',
    'CANCELLED_BY_TUTOR',
];

const PAYMENT_STATUSES: LessonStatus[] = [
    'PENDING_PAYMENT',
    'PAID',
];

/**
 * StatusLegend Component — P5 redesign
 *
 * - Two groups: "Trạng thái buổi học" and "Thanh toán"
 * - Each row uses a mini pill (not a dot) matching the real calendar pill
 * - Button labeled "Chú thích" (not just icon) with aria-expanded
 * - Closes on Esc / click outside (handled by Popover)
 */
export function StatusLegend({ className }: { className?: string }) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    aria-expanded={open}
                    aria-haspopup="dialog"
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-border/40 bg-muted/30 hover:bg-muted/50 transition-all text-[11px] font-medium text-muted-foreground hover:text-foreground active:scale-95 shadow-sm",
                        className
                    )}
                >
                    <Info className="w-3.5 h-3.5" />
                    <span>Chú thích</span>
                </button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="end"
                className="w-72 p-4 rounded-xl border-border/60 shadow-2xl dark:bg-zinc-900 border backdrop-blur-md"
                onEscapeKeyDown={() => setOpen(false)}
                onInteractOutside={() => setOpen(false)}
            >
                <div className="space-y-4">
                    {/* Group 1: Trạng thái buổi học */}
                    <div className="space-y-2">
                        <p className="text-[12px] font-semibold text-muted-foreground">
                            Trạng thái buổi học
                        </p>
                        <div className="flex flex-col gap-1.5">
                            {SESSION_STATUSES.map((status) => (
                                <MiniPill key={status} status={status} />
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-border/40" />

                    {/* Group 2: Thanh toán */}
                    <div className="space-y-2">
                        <p className="text-[12px] font-semibold text-muted-foreground">
                            Thanh toán
                        </p>
                        <div className="flex flex-col gap-1.5">
                            {PAYMENT_STATUSES.map((status) => (
                                <MiniPill key={status} status={status} />
                            ))}
                            <PaymentLegendRow
                                icon={<Clock className="w-3.5 h-3.5" />}
                                label="Biểu tượng đồng hồ = chờ xác nhận"
                            />
                            <PaymentLegendRow
                                icon={<BadgeDollarSign className="w-3.5 h-3.5 text-sky-500" />}
                                label="Biểu tượng ₫ = đã thanh toán"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
