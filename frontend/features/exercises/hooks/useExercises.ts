import { useQuery } from '@tanstack/react-query';
import { exerciseService } from '@/features/exercise-import/services/exerciseService';
import { queryKeys } from '@/lib/hooks/useQueryKeys';
import { ExerciseStatus } from '@/features/exercise-import/types/exercise.types';

/**
 * Hook for teachers/admins to fetch all exercises
 */
export const useExercises = (classId?: string, status?: ExerciseStatus) => {
    return useQuery({
        queryKey: [...queryKeys.exercises.all, { classId, status }],
        queryFn: () => exerciseService.getAll(classId, status),
        staleTime: 10 * 1000, // 10 seconds
    });
};

/**
 * Hook for students to fetch their assigned exercises
 */
export const useAssignedExercises = () => {
    return useQuery({
        queryKey: queryKeys.exercises.assigned(),
        queryFn: () => exerciseService.getAssigned(),
        staleTime: 10 * 1000, // 10 seconds
    });
};
