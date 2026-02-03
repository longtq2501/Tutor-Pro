import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { exerciseService } from '@/features/exercise-import/services/exerciseService';
import { queryKeys } from '@/lib/hooks/useQueryKeys';
import { ExerciseStatus, ExerciseListItemResponse } from '@/features/exercise-import/types/exercise.types';
import { PageResponse } from '@/lib/types';

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
export const useAssignedExercises = (page = 0, size = 10) => {
    return useQuery({
        queryKey: [...queryKeys.exercises.assigned(), { page, size }],
        queryFn: () => exerciseService.getAssigned(page, size),
        staleTime: 10 * 1000,
    });
};

/**
 * Hook for tutors to fetch student performance summaries
 */
export const useTutorStudentSummaries = (page = 0, size = 10) => {
    return useQuery({
        queryKey: [...queryKeys.exercises.all, 'student-summaries', { page, size }],
        queryFn: () => exerciseService.getTutorStudentSummaries(page, size),
        staleTime: 60 * 1000, // 1 minute
    });
};

/**
 * Hook for students to fetch their assigned exercises using infinite scroll (Cursor Pagination)
 */
export const useInfiniteAssignedExercises = (size = 12) => {
    return useInfiniteQuery<PageResponse<ExerciseListItemResponse>>({
        queryKey: [...queryKeys.exercises.assigned(), { size, infinite: true }],
        queryFn: ({ pageParam = 0 }) => exerciseService.getAssigned(pageParam as number, size),
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined;
            return lastPage.number + 1;
        },
        initialPageParam: 0,
        staleTime: 10 * 1000,
    });
};

