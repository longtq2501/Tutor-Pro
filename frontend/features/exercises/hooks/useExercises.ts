import { useQuery } from '@tanstack/react-query';
import { exerciseService } from '@/features/exercise-import/services/exerciseService';
import { queryKeys } from '@/lib/hooks/useQueryKeys';
import { ExerciseStatus } from '@/features/exercise-import/types/exercise.types';

/**
 * Hook for teachers/admins to fetch all exercises with pagination
 */
export const useExercises = (classId?: string, status?: ExerciseStatus, search?: string, page = 0, size = 10) => {
    return useQuery({
        queryKey: [...queryKeys.exercises.all, { classId, status, search, page, size }],
        queryFn: () => exerciseService.getAll(classId, status, search, page, size),
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
        staleTime: 10 * 1000,
    });
};

/**
 * Hook for tutors to fetch student performance summaries
 */
export const useTutorStudentSummaries = () => {
    return useQuery({
        queryKey: [...queryKeys.exercises.all, 'student-summaries'],
        queryFn: () => exerciseService.getTutorStudentSummaries(),
        staleTime: 60 * 1000, // 1 minute
    });
};

