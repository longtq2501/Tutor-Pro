
// ============================================================================
// FILE: lib/hooks/useOptimisticHomework.ts
// ============================================================================
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/hooks/useQueryKeys';
import { homeworkApi } from '@/lib/services'; // Assuming this exists or will be updated
import type { Homework, HomeworkRequest } from '@/lib/types';

export const useOptimisticHomework = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: HomeworkRequest) => homeworkApi.tutor.create(data),
        onMutate: async (newHomework) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.homeworks.byStudent(newHomework.studentId) });

            // Snapshot previous value
            const previousHomeworks = queryClient.getQueryData<Homework[]>(queryKeys.homeworks.byStudent(newHomework.studentId));

            // Optimistic update
            queryClient.setQueryData<Homework[]>(queryKeys.homeworks.byStudent(newHomework.studentId), (old = []) => {
                const optimisticHomework: Homework = {
                    id: Date.now(), // Temporary ID
                    ...newHomework,
                    status: 'ASSIGNED',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isOverdue: false,
                    priority: newHomework.priority || 'MEDIUM',
                    attachmentUrls: newHomework.attachmentUrls || [],
                    submissionUrls: [],
                    studentName: '', // Would need to fetch from students cache if needed
                };
                return [optimisticHomework, ...old];
            });

            return { previousHomeworks };
        },
        onError: (err, newHomework, context) => {
            // Rollback
            if (context?.previousHomeworks) {
                queryClient.setQueryData(queryKeys.homeworks.byStudent(newHomework.studentId), context.previousHomeworks);
            }
            toast.error('Giao bài tập thất bại');
        },
        onSuccess: (data, variables) => {
            // Replace optimistic data with real data or invalidate
            queryClient.invalidateQueries({ queryKey: queryKeys.homeworks.byStudent(variables.studentId) });
            toast.success('Đã giao bài tập!');
        },
    });
};
