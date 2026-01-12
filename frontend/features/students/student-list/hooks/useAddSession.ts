import { sessionsApi } from '@/lib/services/session';
import type { SessionRecordRequest } from '@/lib/types/finance';
import { toast } from 'sonner';

/**
 * Hook to manage session creation from student list.
 */
export function useAddSession(onSuccess: () => Promise<void>, closeAddSession: () => void) {
    const handleAddSessionSubmit = async (
        studentId: number,
        sessionsCount: number,
        hoursPerSession: number,
        sessionDate: string,
        month: string,
        subject?: string,
        startTime?: string,
        endTime?: string
    ): Promise<void> => {
        try {
            const requestData: SessionRecordRequest = {
                studentId,
                month,
                sessions: sessionsCount,
                sessionDate,
                hoursPerSession,
                subject,
                startTime,
                endTime,
                status: 'SCHEDULED'
            };

            await sessionsApi.create(requestData);
            closeAddSession();
            await onSuccess();
            toast.success('Đã thêm buổi học thành công!');
        } catch (error) {
            console.error('Error adding session:', error);
            toast.error('Không thể thêm buổi học!');
        }
    };

    return { handleAddSessionSubmit };
}
