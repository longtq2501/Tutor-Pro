import type { SessionRecord } from '@/lib/types/finance';
import type { LessonStatus } from '@/lib/types/lesson-status';

export interface LessonDetailModalProps {
    session: SessionRecord;
    onClose: () => void;
    onUpdate?: (updated: SessionRecord) => void;
    onDelete?: (id: number) => void;
    initialMode?: 'view' | 'edit';
}

export interface LessonDetailFormData {
    startTime: string;
    endTime: string;
    subject: string;
    notes: string;
    status: LessonStatus;
}
