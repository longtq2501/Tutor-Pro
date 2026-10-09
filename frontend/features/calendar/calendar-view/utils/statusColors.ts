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
        bg: 'bg-slate-50 dark:bg-slate-800/80',
        border: 'border-slate-200 dark:border-slate-600',
        text: 'text-slate-600 dark:text-slate-100',
        dot: 'bg-slate-400',
        label: 'Đã hẹn',
    },
    CONFIRMED: {
        bg: 'bg-blue-50 dark:bg-blue-800/50',
        border: 'border-blue-200 dark:border-blue-600',
        text: 'text-blue-700 dark:text-blue-100',
        dot: 'bg-blue-500',
        label: 'Đã xác nhận',
    },
    COMPLETED: {
        // P4/P5: green for "Đã dạy" — was orange, must NOT clash with amber (Học sinh hủy)
        bg: 'bg-emerald-50 dark:bg-emerald-900/40',
        border: 'border-emerald-200 dark:border-emerald-700',
        text: 'text-emerald-700 dark:text-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Đã dạy',
    },
    PENDING_PAYMENT: {
        bg: 'bg-yellow-50 dark:bg-yellow-800/50',
        border: 'border-yellow-200 dark:border-yellow-600',
        text: 'text-yellow-700 dark:text-yellow-100',
        dot: 'bg-yellow-500',
        label: 'Chờ thanh toán',
    },
    PAID: {
        bg: 'bg-sky-50 dark:bg-sky-900/40',
        border: 'border-sky-200 dark:border-sky-700',
        text: 'text-sky-700 dark:text-sky-200',
        dot: 'bg-sky-500',
        label: 'Đã thanh toán',
    },
    CANCELLED_BY_STUDENT: {
        // amber/orange for student cancel — distinct from green (COMPLETED)
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-700',
        text: 'text-amber-700 dark:text-amber-200',
        dot: 'bg-amber-400',
        label: 'Học sinh hủy',
        strikethrough: true,
    },
    CANCELLED_BY_TUTOR: {
        // dark gray for tutor cancel
        bg: 'bg-gray-100 dark:bg-gray-700/60',
        border: 'border-gray-300 dark:border-gray-600',
        text: 'text-gray-600 dark:text-gray-300',
        dot: 'bg-gray-500',
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
