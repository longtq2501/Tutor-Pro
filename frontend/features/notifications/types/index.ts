/**
 * Supported notification categories for UI styling and icon mapping.
 */
export enum NotificationType {
    /** Student submitted an exam */
    EXAM_SUBMITTED = 'EXAM_SUBMITTED',
    /** Tutor graded an exam */
    EXAM_GRADED = 'EXAM_GRADED',
    /** Tutor assigned a new exercise */
    EXAM_ASSIGNED = 'EXAM_ASSIGNED',
    /** Recurring schedule established */
    SCHEDULE_CREATED = 'SCHEDULE_CREATED',
    /** Recurring schedule modified */
    SCHEDULE_UPDATED = 'SCHEDULE_UPDATED',
    /** Lesson session created */
    SESSION_CREATED = 'SESSION_CREATED',
    /** Lesson session date/time changed */
    SESSION_RESCHEDULED = 'SESSION_RESCHEDULED',
    /** Exercise details updated */
    EXAM_UPDATED = 'EXAM_UPDATED',
    /** System-level alerts */
    SYSTEM = 'SYSTEM',
    /** General alerts */
    GENERAL = 'GENERAL',
}

/**
 * Representation of a notification record from the backend.
 */
export interface Notification {
    /** Primary identifier */
    id: number;
    /** Short summary of the alert */
    title: string;
    /** Full message body content */
    content: string;
    /** Whether the user has marked this as read */
    isRead: boolean;
    /** Categorization for UI display */
    type: NotificationType;
    /** ISO timestamp of creation */
    createdAt: string;
    /** ISO timestamp of last modification */
    updatedAt: string;
}
