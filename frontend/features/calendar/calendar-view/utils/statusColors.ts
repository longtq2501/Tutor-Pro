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
}

/**
 * Color mapping for each lesson status
 * Matches the color scheme from implementation plan
 */
export const STATUS_COLORS: Record<LessonStatus, StatusColors> = {
    SCHEDULED: {
        bg: 'bg-slate-50 dark:bg-slate-800/60',
        border: 'border-slate-200 dark:border-slate-700',
        text: 'text-slate-600 dark:text-slate-200',
        dot: 'bg-slate-400',
        label: 'Đã hẹn',
    },
    CONFIRMED: {
        bg: 'bg-blue-50 dark:bg-blue-900/40',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-200',
        dot: 'bg-blue-500',
        label: 'Đã xác nhận',
    },
    COMPLETED: {
        bg: 'bg-orange-50 dark:bg-orange-900/40',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-200',
        dot: 'bg-orange-500',
        label: 'Đã dạy',
    },
    PENDING_PAYMENT: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/40',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-700 dark:text-yellow-200',
        dot: 'bg-yellow-500',
        label: 'Chờ xác nhận',
    },
    PAID: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/40',
        border: 'border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-700 dark:text-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Đã thanh toán',
    },
    CANCELLED_BY_STUDENT: {
        bg: 'bg-red-50 dark:bg-red-900/40',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-200',
        dot: 'bg-red-500',
        label: 'Học sinh hủy',
    },
    CANCELLED_BY_TUTOR: {
        bg: 'bg-gray-50 dark:bg-gray-800/40',
        border: 'border-gray-200 dark:border-gray-700',
        text: 'text-gray-700 dark:text-gray-200',
        dot: 'bg-gray-500',
        label: 'Tutor hủy',
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
