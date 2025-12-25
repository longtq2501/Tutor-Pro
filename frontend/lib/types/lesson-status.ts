/**
 * Lesson status enum matching backend LessonStatus.java
 * 
 * Represents the lifecycle states of a lesson/session.
 */
export type LessonStatus =
    | 'SCHEDULED'              // Đã hẹn, chưa xác nhận
    | 'CONFIRMED'              // Đã xác nhận
    | 'COMPLETED'              // Đã dạy, chưa thanh toán
    | 'PAID'                   // Đã thanh toán (terminal)
    | 'PENDING_PAYMENT'        // Chờ xác nhận thanh toán
    | 'CANCELLED_BY_STUDENT'   // Học sinh hủy (terminal)
    | 'CANCELLED_BY_TUTOR';    // Tutor hủy (terminal)

/**
 * Status display names in Vietnamese
 */
export const LESSON_STATUS_LABELS: Record<LessonStatus, string> = {
    SCHEDULED: 'Đã hẹn',
    CONFIRMED: 'Đã xác nhận',
    COMPLETED: 'Đã dạy',
    PAID: 'Đã thanh toán',
    PENDING_PAYMENT: 'Chờ xác nhận thanh toán',
    CANCELLED_BY_STUDENT: 'Học sinh hủy',
    CANCELLED_BY_TUTOR: 'Tutor hủy',
};

/**
 * Check if status is terminal (no further transitions allowed)
 */
export function isTerminalStatus(status: LessonStatus): boolean {
    return status === 'PAID' ||
        status === 'CANCELLED_BY_STUDENT' ||
        status === 'CANCELLED_BY_TUTOR';
}

/**
 * Check if lesson has been completed/taught
 */
export function isCompletedStatus(status: LessonStatus): boolean {
    return status === 'COMPLETED' ||
        status === 'PENDING_PAYMENT' ||
        status === 'PAID';
}

/**
 * Check if lesson is cancelled
 */
export function isCancelledStatus(status: LessonStatus): boolean {
    return status === 'CANCELLED_BY_STUDENT' ||
        status === 'CANCELLED_BY_TUTOR';
}
