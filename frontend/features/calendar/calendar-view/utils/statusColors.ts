import type { LessonStatus } from '@/lib/types/lesson-status';

/**
 * Status color configuration for calendar UI
 * Provides consistent color coding across the application
 */
export interface StatusColors {
    bg: string;
    border: string;
    text: string;
    dot: string;
    label: string;
    /** Whether student name should have line-through (cancelled sessions) */
    strikethrough?: boolean;
}

/**
 * Color mapping for each lesson status
 * P4: COMPLETED → green (not orange); cancelled sessions get strikethrough
 * P5: "Đã dạy" must NOT share color with "Học sinh hủy"
 */
export const STATUS_COLORS: Record<LessonStatus, StatusColors> = {
    SCHEDULED: {
        bg: 'bg-slate-100 dark:bg-slate-800',
        border: 'border-slate-300/80 dark:border-slate-700',
        text: 'text-slate-700 dark:text-slate-200',
        dot: 'bg-slate-400',
        label: 'Đã hẹn',
    },
    CONFIRMED: {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
        dot: 'bg-blue-500',
        label: 'Đã xác nhận',
    },
    COMPLETED: {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-700 dark:text-emerald-300',
        dot: 'bg-emerald-500',
        label: 'Đã dạy',
    },
    PENDING_PAYMENT: {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-700 dark:text-amber-300',
        dot: 'bg-amber-500',
        label: 'Chờ thanh toán',
    },
    PAID: {
        bg: 'bg-sky-50 dark:bg-sky-950/40',
        border: 'border-sky-200 dark:border-sky-800',
        text: 'text-sky-700 dark:text-sky-300',
        dot: 'bg-sky-500',
        label: 'Đã thanh toán',
    },
    CANCELLED_BY_STUDENT: {
        bg: 'bg-orange-50 dark:bg-orange-950/40',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-300',
        dot: 'bg-orange-500',
        label: 'Học sinh hủy',
        strikethrough: true,
    },
    CANCELLED_BY_TUTOR: {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        border: 'border-rose-200 dark:border-rose-800',
        text: 'text-rose-700 dark:text-rose-300',
        dot: 'bg-rose-500',
        label: 'Tutor hủy',
        strikethrough: true,
    },
};

/**
 * Get color configuration for a given status
 * Falls back to SCHEDULED colors if status is undefined
 */
export function getStatusColors(status?: LessonStatus): StatusColors {
    if (!status) {
        return STATUS_COLORS.SCHEDULED;
    }
    return STATUS_COLORS[status] || STATUS_COLORS.SCHEDULED;
}

/**
 * Returns true if the session is a cancelled status
 */
export function isCancelledStatus(status?: LessonStatus): boolean {
    return status === 'CANCELLED_BY_STUDENT' || status === 'CANCELLED_BY_TUTOR';
}

/**
 * Get legacy colors based on old paid/completed flags
 * Used for backward compatibility during migration
 *
 * @deprecated Use getStatusColors with LessonStatus instead
 */
export function getLegacyColors(completed: boolean, paid: boolean): StatusColors {
    if (paid) {
        return STATUS_COLORS.PAID;
    }
    if (completed) {
        return STATUS_COLORS.COMPLETED;
    }
    return STATUS_COLORS.SCHEDULED;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}tr`;
    }
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}k`;
    }
    return `${amount}đ`;
}
